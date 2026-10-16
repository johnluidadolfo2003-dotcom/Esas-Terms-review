/** One Gemini-generated narrator; no device speech voices or synthetic bass. */
export type AiVoiceMode = 'off' | 'ai_reads_you_answer' | 'ai_reads_and_answers';
export type ReaderState = 'idle' | 'loading' | 'playing' | 'error';
let state: ReaderState = 'idle';
const listeners = new Set<(state: ReaderState) => void>();
export const getReaderState = () => state;
export function subscribeReaderState(listener: (state: ReaderState) => void) {
  listeners.add(listener); return () => { listeners.delete(listener); };
}
function updateState(next: ReaderState) { state = next; listeners.forEach(listener => listener(next)); }
export async function getSpeechConfiguration(): Promise<{ configured: boolean; provider: string; voice: string }> {
  const response = await fetch('/api/speech/config');
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('speech-server-unavailable');
  return response.json();
}
export function getSpeechErrorMessage(error?: string): string {
  switch (error) {
    case 'speech-not-configured': return 'Gemini voice needs the server’s GEMINI_API_KEY. Add it in Render Environment, then redeploy.';
    case 'speech-key-rejected': return 'The server’s Gemini key was rejected. Check its API permissions in Render.';
    case 'speech-quota': case 'speech-rate-limit': return 'Gemini speech quota or request limit reached. Wait before retrying, or check the API project quota.';
    case 'speech-busy': return 'Gemini is preparing another reading. Wait a moment, then tap Play.';
    case 'audio-blocked': return 'Tap Play or Test Voice to enable audio. Check media volume and Bluetooth output.';
    case 'unsupported': return 'Audio playback is unavailable in this browser. Open the app in Safari or Chrome.';
    case 'speech-timeout': return 'Preparing Gemini audio took too long. Check your connection and tap Play to retry.';
    case 'invalid-audio': return 'Gemini did not return playable audio. Tap Play to retry.';
    default: return 'Gemini audio could not play. Check your connection and server setup, then tap Play.';
  }
}
let generation = 0;
let controller: AbortController | null = null;
let context: AudioContext | null = null;
let source: AudioBufferSourceNode | null = null;
const cache = new Map<string, { bytes: ArrayBuffer; expires: number }>();
let cacheBytes = 0;
export function stopSpeech(): void {
  generation++; controller?.abort(); controller = null;
  if (source) { source.onended = null; try { source.stop(); } catch {} source.disconnect(); source = null; }
  updateState('idle');
}
function audioContext(): AudioContext {
  const Constructor = window.AudioContext || (window as any).webkitAudioContext;
  if (!Constructor) throw new Error('unsupported');
  if (!context || context.state === 'closed') context = new Constructor();
  return context!;
}
function abortable<T>(promise: Promise<T>, signal: AbortSignal, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const finish = (callback: () => void) => { clearTimeout(timer); signal.removeEventListener('abort', abort); callback(); };
    const abort = () => finish(() => reject(new Error('canceled')));
    const timer = setTimeout(() => finish(() => reject(new Error('speech-timeout'))), ms);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) { abort(); return; }
    promise.then(value => finish(() => resolve(value)), error => finish(() => reject(error)));
  });
}
export function splitSpeechText(text: string): string[] {
  const chunks: string[] = [];
  let rest = text.trim();
  while (rest.length > 1600) {
    const prefix = rest.slice(0, 1600);
    const sentence = Math.max(prefix.lastIndexOf('. '), prefix.lastIndexOf('? '), prefix.lastIndexOf('! '));
    const cut = sentence > 800 ? sentence + 1 : prefix.lastIndexOf(' ') > 0 ? prefix.lastIndexOf(' ') : 1600;
    chunks.push(rest.slice(0, cut).trim()); rest = rest.slice(cut).trim();
  }
  if (rest) chunks.push(rest);
  return chunks;
}
async function requestClip(text: string, rate: number, signal: AbortSignal): Promise<ArrayBuffer> {
  const key = JSON.stringify([text, rate]); const now = Date.now();
  for (const [id, entry] of cache) if (entry.expires <= now) { cacheBytes -= entry.bytes.byteLength; cache.delete(id); }
  const existing = cache.get(key); if (existing) return existing.bytes.slice(0);
  const request = new AbortController();
  const cancel = () => request.abort();
  signal.addEventListener('abort', cancel, { once: true });
  const timeout = setTimeout(cancel, 50_000);
  try {
    const response = await fetch('/api/speech', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, rate }), signal: request.signal });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({})); throw new Error(payload.error || 'speech-server-unavailable');
    }
    if (!response.headers.get('content-type')?.startsWith('audio/wav')) throw new Error('invalid-audio');
    const bytes = await response.arrayBuffer();
    if (signal.aborted) throw new Error('canceled');
    if (bytes.byteLength < 44 || bytes.byteLength > 8 * 1024 * 1024) throw new Error('invalid-audio');
    while (cacheBytes + bytes.byteLength > 12 * 1024 * 1024 && cache.size) {
      const first = cache.keys().next().value!; cacheBytes -= cache.get(first)!.bytes.byteLength; cache.delete(first);
    }
    cache.set(key, { bytes: bytes.slice(0), expires: now + 15 * 60_000 }); cacheBytes += bytes.byteLength;
    return bytes;
  } finally { clearTimeout(timeout); signal.removeEventListener('abort', cancel); }
}

export function cleanTextForSpeech(text: string): string {
  if (!text) return '';

  let spoken = text
    .replace(/[*#`~]/g, '') // remove markdown symbols
    .replace(/[\r\n]+/g, ', ') // replace linebreaks with conversational pauses
    .replace(/\s+/g, ' ')
    .trim();

  // Natural engineering & legal expansions for smooth audio pronunciation
  spoken = spoken
    .replace(/\bRA\s*7920\b/gi, 'Republic Act 7920')
    .replace(/\bR\.A\.\s*7920\b/gi, 'Republic Act 7920')
    .replace(/\bEE\s*Laws\b/gi, 'Electrical Engineering Laws')
    .replace(/\bEE\b/g, 'Double E')
    .replace(/\bEPIRA\b/gi, 'Epira')
    .replace(/\bERC\b/gi, 'E-R-C')
    .replace(/\bDOE\b/gi, 'Department of Energy')
    .replace(/\bPEC\b/gi, 'Philippine Electrical Code')
    .replace(/\bw\/\s*o\b/gi, 'without')
    .replace(/\bw\/\b/gi, 'with')
    .replace(/\b(\d+)\s*kW\b/gi, '$1 kilowatts')
    .replace(/\b(\d+)\s*MW\b/gi, '$1 megawatts')
    .replace(/\b(\d+)\s*kV\b/gi, '$1 kilovolts')
    .replace(/\b(\d+)\s*Hz\b/gi, '$1 hertz')
    .replace(/\b(\d+)\s*kHz\b/gi, '$1 kilohertz')
    .replace(/\b(\d+)\s*MHz\b/gi, '$1 megahertz')
    .replace(/\b(\d+)\s*rpm\b/gi, '$1 R-P-M')
    .replace(/\b(\d+)\s*HP\b/gi, '$1 horsepower')
    .replace(/\b(\d+)\s*hp\b/gi, '$1 horsepower')
    .replace(/\b(\d+)\s*sq\.?\s*m\b/gi, '$1 square meters')
    .replace(/\b(\d+)\s*m\^2\b/gi, '$1 square meters')
    .replace(/\b(\d+)\s*ft\^2\b/gi, '$1 square feet')
    .replace(/\bPhp\s*(\d+)/gi, '$1 pesos')
    .replace(/\bPHP\s*(\d+)/gi, '$1 pesos')
    .replace(/₱\s*(\d+)/g, '$1 pesos')
    .replace(/\bcos\s*phi\b/gi, 'cosine of fee')
    .replace(/\bsin\s*phi\b/gi, 'sine of fee')
    .replace(/\bu\s*mg\b/gi, 'mew times m times g')
    .replace(/\bf_k\b/gi, 'friction force')
    // Conversational smoothing for options
    .replace(/\bOption\s*([A-D]):?\s*/gi, 'Option $1. ')
    .replace(/_/g, ' ')
    // Remove standalone bracket artifacts
    .replace(/[\[\]{}()]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return spoken;
}



export function speakPhrase(phrase: string, rate = 1, onEnd?: () => void, onError?: (error?: string) => void): void {
  stopSpeech();
  const text = cleanTextForSpeech(phrase);
  if (!text) { onEnd?.(); return; }
  if (text.length > 12000) { onError?.('invalid-speech-text'); return; }
  const token = generation;
  const current = new AbortController(); controller = current;
  updateState('loading');
  let engine: AudioContext;
  let resume: Promise<void>;
  try {
    engine = audioContext();
    // Invoked before the first await, so Play/Test Voice can unlock mobile audio.
    resume = engine.state === 'suspended' ? engine.resume() : Promise.resolve();
  } catch (error) { updateState('error'); onError?.(error instanceof Error ? error.message : 'unsupported'); return; }
  void (async () => {
    try {
      await abortable(resume, current.signal, 10_000).catch(() => { throw new Error('audio-blocked'); });
      if (token !== generation) return;
      for (const chunk of splitSpeechText(text)) {
        updateState('loading');
        const bytes = await requestClip(chunk, Number.isFinite(rate) ? Math.max(.5, Math.min(2, rate)) : 1, current.signal);
        if (token !== generation) return;
        const buffer = await abortable(engine.decodeAudioData(bytes), current.signal, 10_000);
        if (token !== generation) return;
        const node = engine.createBufferSource(); node.buffer = buffer;
        node.connect(engine.destination); source = node;
        const ended = new Promise<void>(resolve => { node.onended = () => resolve(); });
        updateState('playing'); node.start();
        await abortable(ended, current.signal, buffer.duration * 1000 + 10_000);
        node.disconnect(); if (source === node) source = null;
        if (token !== generation) return;
      }
      controller = null; updateState('idle'); onEnd?.();
    } catch (error) {
      if (token !== generation || current.signal.aborted) return;
      stopSpeech(); updateState('error');
      onError?.(error instanceof Error ? error.message : 'speech-provider-error');
    }
  })();
}
export function previewReaderVoice(onEnd?: () => void, onError?: (error?: string) => void): void {
  speakPhrase('Welcome. Let’s review one question at a time. Listen carefully, then choose the best answer.', 1, onEnd, onError);
}
