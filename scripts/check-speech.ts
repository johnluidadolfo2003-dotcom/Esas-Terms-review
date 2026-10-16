import assert from 'node:assert/strict';
import { test, beforeEach, afterEach } from 'node:test';
import { setImmediate as tick } from 'node:timers/promises';
import express from 'express';
import { createGeminiSpeechRouter, buildSpeechRequest, extractWav, NARRATOR } from '../server/geminiSpeech';
import {
  speakPhrase, stopSpeech, previewReaderVoice, splitSpeechText, cleanTextForSpeech,
  getSpeechConfiguration, getReaderState, getSpeechErrorMessage,
} from '../src/services/speechService';

function wav() {
  const b = Buffer.alloc(52);
  b.write('RIFF'); b.writeUInt32LE(44, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(24000, 24); b.writeUInt32LE(48000, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(8, 40); return b;
}
function providerPayload() { return { steps: [{ type: 'model_output', content: [{ type: 'audio', mime_type: 'audio/wav', data: wav().toString('base64') }] }] }; }
const nativeFetch = globalThis.fetch;
async function withRouter(options: Parameters<typeof createGeminiSpeechRouter>[0], run: (base: string) => Promise<void>) {
  const app = express(); app.use(createGeminiSpeechRouter(options));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${(server.address() as any).port}`;
  try { await run(base); } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
}
async function post(base: string, body: unknown, headers: Record<string, string> = {}) {
  return nativeFetch(base + '/api/speech', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
}
test('Gemini request uses one fixed voice, literal transcript, metadata style and WAV', () => {
  const request = buildSpeechRequest('Read this exact question.', 1.25);
  assert.equal(request.generation_config.speech_config[0].voice, NARRATOR);
  assert.equal(request.input[0].content[0].text, 'Read this exact question.');
  assert.match(request.input[0].content[0].annotations[0].style, /American English/);
  assert.match(request.input[0].content[0].annotations[0].style, /1.25/);
  assert.equal(request.response_format.mime_type, 'audio/wav'); assert.equal(request.store, false);
});
test('only model audio is accepted; malformed or missing WAV is rejected', () => {
  assert.deepEqual(extractWav(providerPayload()), wav());
  assert.throws(() => extractWav({ steps: [] }));
  assert.throws(() => extractWav({ steps: [{ type: 'user_input', content: providerPayload().steps[0].content }] }));
  assert.throws(() => extractWav({ steps: [{ type: 'model_output', content: [{ type: 'audio', data: 'bWVhbiBub3QgYXVkaW8=' }] }] }));
});
test('missing key gives explicit configuration error without calling Google or exposing a key', async () => {
  await withRouter({ apiKey: '', fetchImpl: (() => { throw Error('must not call'); }) as any }, async base => {
    assert.equal((await (await nativeFetch(base + '/api/speech/config')).json()).configured, false);
    const result = await post(base, { text: 'Hello' });
    assert.equal(result.status, 503); assert.equal((await result.json()).error, 'speech-not-configured');
  });
});
test('server returns WAV, caches repeats, varies pace and keeps the key server-side', async () => {
  let calls = 0;
  const fetchImpl = (async (url: string, init: RequestInit) => {
    calls++; assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/interactions');
    assert.equal((init.headers as any)['x-goog-api-key'], 'test-key');
    assert.equal(JSON.parse(init.body as string).generation_config.speech_config[0].voice, 'Puck');
    return Response.json(providerPayload());
  }) as typeof fetch;
  await withRouter({ apiKey: 'test-key', fetchImpl }, async base => {
    const config = await (await nativeFetch(base + '/api/speech/config')).text(); assert.ok(!config.includes('test-key'));
    for (const rate of [1, 1, 1.25]) {
      const response = await post(base, { text: 'Hello.', rate }); assert.equal(response.status, 200);
      assert.match(response.headers.get('content-type')!, /audio\/wav/);
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), wav());
    }
    assert.equal(calls, 2);
  });
});
test('invalid text/rate and cross-origin requests are rejected before generation', async () => {
  await withRouter({ apiKey: 'test-key', fetchImpl: (() => { throw Error('must not call'); }) as any }, async base => {
    for (const body of [{ text: '' }, { text: 'x'.repeat(1801) }, { text: 'hi', rate: 9 }, { text: 'hi', rate: 'fast' }]) {
      assert.equal((await post(base, body)).status, 400);
    }
    assert.equal((await post(base, { text: 'Hi' }, { origin: 'https://unrelated.example' })).status, 403);
  });
});
test('provider quota errors are actionable and provider/private messages are not echoed', async () => {
  await withRouter({ apiKey: 'test-key', fetchImpl: (async () => Response.json({ private: 'do not expose' }, { status: 429 })) as typeof fetch }, async base => {
    const response = await post(base, { text: 'Hello' });
    assert.equal(response.status, 429); assert.deepEqual(await response.json(), { error: 'speech-quota' });
  });
});

let nodes: any[] = []; let resumes = 0; let lastContext: any;
class FakeAudioContext {
  state = 'suspended'; destination = {};
  constructor() { lastContext = this; }
  resume() { resumes++; this.state = 'running'; return Promise.resolve(); }
  decodeAudioData(_data: ArrayBuffer) { return Promise.resolve({ duration: .01 }); }
  createBufferSource() {
    const node = { buffer: null, onended: null as any, stopped: false, playbackRate: { value: 1 },
      connect() {}, disconnect() {}, start() { nodes.push(this); }, stop() { this.stopped = true; this.onended?.(); } };
    return node;
  }
}
beforeEach(() => {
  nodes = []; resumes = 0;
  (globalThis as any).window = { AudioContext: FakeAudioContext };
  globalThis.fetch = (async () => new Response(wav(), { headers: { 'Content-Type': 'audio/wav' } })) as any;
});
afterEach(() => { stopSpeech(); if (lastContext) lastContext.state = 'closed'; globalThis.fetch = nativeFetch; });
async function flush() { await tick(); await tick(); }
test('Play unlocks audio immediately, fetches Gemini and plays at native pitch', async () => {
  let body: any; let ended = 0;
  globalThis.fetch = (async (_url: string, init?: RequestInit) => { body = JSON.parse(init!.body as string); return new Response(wav(), { headers: { 'Content-Type': 'audio/wav' } }); }) as any;
  speakPhrase('Unique natural reading.', 1.25, () => ended++);
  assert.equal(resumes, 1, 'audio resume must be called in the tap stack');
  await flush(); assert.equal(body.rate, 1.25); assert.equal(nodes.length, 1);
  assert.equal(nodes[0].playbackRate.value, 1); assert.equal(getReaderState(), 'playing');
  nodes[0].onended(); await flush(); assert.equal(ended, 1);
});
test('stopping during download cannot start stale audio or advance', async () => {
  let complete!: (value: Response) => void; let ended = 0;
  globalThis.fetch = (() => new Promise<Response>(resolve => { complete = resolve; })) as any;
  speakPhrase('Cancel the slow download.', 1, () => ended++); await flush(); stopSpeech();
  complete(new Response(wav(), { headers: { 'Content-Type': 'audio/wav' } })); await flush();
  assert.equal(nodes.length, 0); assert.equal(ended, 0);
});
test('stopping active audio blocks completion callbacks', async () => {
  let ended = 0; speakPhrase('Stop this active reading.', 1, () => ended++); await flush();
  const node = nodes[0]; stopSpeech(); node.onended?.(); await flush();
  assert.equal(node.stopped, true); assert.equal(ended, 0);
});
test('long text splits without lost words and completes only after every chunk', async () => {
  const text = 'Long question with clear wording. '.repeat(75).trim();
  const chunks = splitSpeechText(text); assert.ok(chunks.length > 1);
  assert.ok(chunks.every(x => x.length <= 1600)); assert.equal(chunks.join(' '), text);
  let ended = 0; speakPhrase(text, 1, () => ended++); await flush();
  nodes[0].onended(); await flush(); assert.equal(ended, 0);
  nodes[1].onended(); await flush(); assert.equal(ended, 1);
});
test('configuration failures pause with a clear setup error; no old speech fallback', async () => {
  globalThis.fetch = (async () => Response.json({ error: 'speech-not-configured' }, { status: 503 })) as any;
  let error = ''; speakPhrase('No key configured.', 1, undefined, value => { error = value || ''; }); await flush();
  assert.equal(error, 'speech-not-configured'); assert.equal(nodes.length, 0); assert.match(getSpeechErrorMessage(error), /GEMINI_API_KEY/);
});
test('preview uses the same Gemini endpoint and provider config is readable', async () => {
  let calls = 0;
  globalThis.fetch = (async (url: string) => {
    calls++;
    return url.endsWith('/config') ? Response.json({ configured: true, provider: 'Gemini', voice: 'Puck' }) : new Response(wav(), { headers: { 'Content-Type': 'audio/wav' } });
  }) as any;
  assert.equal((await getSpeechConfiguration()).voice, 'Puck'); previewReaderVoice(); await flush();
  assert.equal(calls, 2); assert.equal(nodes.length, 1);
});
test('text cleanup retains meaningful symbols/variables rather than inventing them', () => {
  assert.match(cleanTextForSpeech('P2, cos q, f_k, ₱500'), /P2, cos q, friction force, 500 pesos/);
});
