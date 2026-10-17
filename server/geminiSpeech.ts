import 'dotenv/config';
import express from 'express';
import { createHash } from 'node:crypto';
import { resolveGeminiApiKey } from './geminiService';

export const NARRATOR = 'Puck';
export const TTS_MODEL = 'gemini-3.8-flash-lite-tts';
export const SPEECH_STYLE = 'Clear American English pronunciation, warm conversational delivery, calm and easy to understand, with natural sentence pauses at a moderate pace.';
const MAX_TEXT = 1800;
const MAX_AUDIO = 8 * 1024 * 1024;
class SpeechFailure extends Error {
  constructor(public status: number, public code: string) { super(code); }
}
export function buildSpeechRequest(text: string, rate = 1) {
  return {
    model: TTS_MODEL, store: false,
    input: [{ type: 'user_input', content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style: `${SPEECH_STYLE} Delivery pace: ${rate} times a normal conversational reading pace.` }] }] }],
    response_format: { type: 'audio', mime_type: 'audio/wav' },
    generation_config: { speech_config: [{ voice: NARRATOR }] },
  };
}
export function extractWav(result: any): Buffer {
  const audio = (result?.steps || []).filter((step: any) => step.type === 'model_output')
    .flatMap((step: any) => step.content || []).filter((part: any) => part.type === 'audio').at(-1);
  if (typeof audio?.data !== 'string' || audio.data.length > MAX_AUDIO * 1.4) throw new SpeechFailure(502, 'invalid-audio');
  const wav = Buffer.from(audio.data, 'base64');
  if (wav.length <= 44 || wav.length > MAX_AUDIO || wav.toString('ascii', 0, 4) !== 'RIFF' || wav.toString('ascii', 8, 12) !== 'WAVE') {
    throw new SpeechFailure(502, 'invalid-audio');
  }
  return wav;
}
export function createGeminiSpeechRouter(options: { apiKey?: string; fetchImpl?: typeof fetch } = {}) {
  const router = express.Router();
  const rawKey = options.apiKey ?? resolveGeminiApiKey();
  const apiKey = typeof rawKey === 'string' ? rawKey.trim().replace(/^["']|["']$/g, '') : '';
  const configured = Boolean(apiKey && !/MY_GEMINI_API_KEY|PLACEHOLDER/i.test(apiKey));
  const request = options.fetchImpl ?? fetch;
  const cache = new Map<string, { wav: Buffer; expires: number }>();
  const pending = new Map<string, Promise<Buffer>>();
  const limits = new Map<string, { count: number; until: number }>();
  let cacheBytes = 0;
  router.get('/api/speech/config', (_req, res) => {
    res.set('Cache-Control', 'no-store').json({ provider: 'Gemini', voice: NARRATOR, configured });
  });
  router.post('/api/speech', express.json({ limit: '16kb' }), async (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (!configured) { res.status(503).json({ error: 'speech-not-configured' }); return; }
    const text = req.body?.text;
    const rate = req.body?.rate ?? 1;
    if (typeof text !== 'string' || !text.trim() || text.length > MAX_TEXT || typeof rate !== 'number' || !Number.isFinite(rate) || rate < .5 || rate > 2) {
      res.status(400).json({ error: 'invalid-speech-text' }); return;
    }
    const origin = req.get('origin');
    if (origin) {
      try {
        const originHost = new URL(origin).host.toLowerCase().replace(/:\d+$/, '');
        const hostHeader = (req.get('x-forwarded-host') || req.get('host') || '').toLowerCase().replace(/:\d+$/, '');
        if (hostHeader && originHost !== hostHeader) throw new Error();
      } catch {
        res.status(403).json({ error: 'origin-not-allowed' });
        return;
      }
    }
    const now = Date.now();
    const ip = req.ip || 'unknown';
    for (const [key, value] of limits) if (value.until <= now) limits.delete(key);
    const limit = limits.get(ip) || { count: 0, until: now + 60_000 };
    // Allow up to 240 requests/min per IP to prevent blocking during flashcard review
    if (limit.count >= 240 || (!limits.has(ip) && limits.size >= 10000)) {
      res.set('Retry-After', '30').status(429).json({ error: 'speech-rate-limit' }); return;
    }
    limit.count++; limits.set(ip, limit);
    const key = createHash('sha256').update(JSON.stringify([text, rate])).digest('hex');
    for (const [id, entry] of cache) if (entry.expires <= now) { cacheBytes -= entry.wav.length; cache.delete(id); }
    try {
      let wav = cache.get(key)?.wav;
      if (!wav) {
        let job = pending.get(key);
        if (!job) {
          // Allow up to 8 concurrent generation jobs
          if (pending.size >= 8) { res.set('Retry-After', '2').status(429).json({ error: 'speech-busy' }); return; }
          job = (async () => {
            const response = await request('https://generativelanguage.googleapis.com/v1beta/interactions', {
              method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
              body: JSON.stringify(buildSpeechRequest(text, rate)), signal: AbortSignal.timeout(45_000),
            });
            if (!response.ok) {
              const isQuota = response.status === 429;
              const isAuth = [401, 403].includes(response.status);
              throw new SpeechFailure(
                isQuota ? 429 : 502,
                isQuota ? 'speech-quota' : isAuth ? 'speech-key-rejected' : 'speech-provider-error'
              );
            }
            const buffer = extractWav(await response.json());
            while (cacheBytes + buffer.length > 16 * 1024 * 1024 && cache.size) {
              const first = cache.keys().next().value!; cacheBytes -= cache.get(first)!.wav.length; cache.delete(first);
            }
            cache.set(key, { wav: buffer, expires: Date.now() + 30 * 60_000 }); cacheBytes += buffer.length;
            return buffer;
          })().finally(() => pending.delete(key));
          pending.set(key, job);
        }
        wav = await job;
      }
      if (!res.destroyed) res.type('audio/wav').send(wav);
    } catch (error) {
      const failure = error instanceof SpeechFailure ? error : new SpeechFailure(502, 'speech-provider-error');
      if (!res.destroyed) res.status(failure.status).json({ error: failure.code });
    }
  });
  return router;
}
