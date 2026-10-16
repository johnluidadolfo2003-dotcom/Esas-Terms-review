import assert from 'node:assert/strict';
import { test, beforeEach, afterEach } from 'node:test';
import {
  selectBestUSMaleVoice, getReaderVoice, setPreferredVoiceURI, speakPhrase,
  stopSpeech, cleanTextForSpeech, subscribeVoices, getReaderVoiceNotice, getSpeechErrorMessage,
} from '../src/services/speechService';
const voice = (name: string, lang = 'en-US', uri = name) => ({ name, lang, voiceURI: uri, default: false, localService: true }) as SpeechSynthesisVoice;
let voices: SpeechSynthesisVoice[];
let spoken: SpeechSynthesisUtterance[];
let events: EventTarget;
const flush = () => new Promise<void>(resolve => queueMicrotask(resolve));
beforeEach(() => {
  voices = []; spoken = []; events = new EventTarget();
  (globalThis as any).window = {
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    speechSynthesis: {
      getVoices: () => voices, cancel: () => {}, speak: (u: SpeechSynthesisUtterance) => spoken.push(u),
      addEventListener: (...args: any[]) => (events.addEventListener as any)(...args),
      removeEventListener: (...args: any[]) => (events.removeEventListener as any)(...args),
    },
  };
  (globalThis as any).SpeechSynthesisUtterance = class { constructor(public text: string) {} };
  setPreferredVoiceURI('');
});
afterEach(() => stopSpeech());
test('US locale is mandatory; native neural male is preferred over local male', () => {
  const neural = voice('Microsoft Andrew Online (Natural)');
  assert.equal(selectBestUSMaleVoice([voice('Google UK English Male', 'en-GB'), voice('Microsoft David'), neural]), neural);
  assert.equal(selectBestUSMaleVoice([voice('Google UK English Male', 'en-GB')]), null);
});
test('generic Google US, female names, and unfamiliar voices are never assumed male', () => {
  assert.equal(selectBestUSMaleVoice([voice('Google US English'), voice('Samantha'), voice('female'), voice('Unknown')]), null);
});
test('missing saved voices use a reported fallback rather than silence', () => {
  voices = [voice('Custom voice', 'en-US', 'chosen')];
  setPreferredVoiceURI('chosen');
  assert.equal(getReaderVoice()?.voiceURI, 'chosen');
  voices = [voice('Microsoft David')];
  assert.equal(getReaderVoice()?.name, 'Microsoft David');
  assert.match(getReaderVoiceNotice(), /Saved voice unavailable/);
});
test('speaking starts synchronously at native pitch and speed; completion fires once', async () => {
  voices = [voice('Alex')]; let ended = 0;
  const u = speakPhrase('Hello.', 1.5, () => ended++)!;
  assert.equal(spoken.length, 1, 'speak must happen inside the tap handler, without a promise or timer');
  await flush();
  assert.equal(u.pitch, 1); assert.equal(u.rate, 1.5); assert.equal(u.lang, 'en-US');
  assert.equal(spoken[0].voice, voices[0]);
  u.onend?.({} as any); u.onend?.({} as any);
  assert.equal(ended, 1);
});
test('cancellation blocks stale callbacks from selecting an answer or advancing', async () => {
  voices = [voice('Alex')]; let ended = 0;
  const u = speakPhrase('Old item', 1, () => ended++)!;
  await flush(); stopSpeech(); u.onend?.({} as any); u.onerror?.({} as any);
  assert.equal(ended, 0);
});
test('empty voice list speaks with en-US default immediately; late voices do not duplicate it', () => {
  let ended = 0;
  const u = speakPhrase('Default read', 1, () => ended++)!;
  assert.equal(spoken.length, 1);
  assert.equal(u.lang, 'en-US'); assert.equal(u.voice, undefined);
  stopSpeech();
  voices = [voice('Alex')]; events.dispatchEvent(new Event('voiceschanged'));
  u.onend?.({} as any);
  assert.equal(spoken.length, 1); assert.equal(ended, 0);
  speakPhrase('Fresh read'); assert.equal(spoken[1].voice, voices[0]);
});
test('missing male voice uses an explicitly reported US fallback without claiming male', () => {
  voices = [voice('Google US English')]; let errors = 0;
  speakPhrase('Hello', 1, undefined, () => errors++);
  assert.equal(spoken.length, 1); assert.equal(errors, 0);
  assert.match(getReaderVoiceNotice(), /male voice not confirmed/);
});
test('paused engine resumes before speaking', () => {
  const engine = window.speechSynthesis;
  let resumed = false;
  Object.assign(engine, { paused: true, resume: () => { resumed = true; } });
  speakPhrase('Resume');
  assert.ok(resumed); assert.equal(spoken.length, 1);
});
test('browser error reason is preserved and does not advance', () => {
  let ended = 0; let reason = '';
  const u = speakPhrase('Blocked', 1, () => ended++, error => { reason = error || ''; })!;
  u.onerror?.({ error: 'not-allowed' } as any); u.onend?.({} as any);
  assert.equal(reason, 'not-allowed'); assert.equal(ended, 0);
  assert.match(getSpeechErrorMessage(reason), /Tap Play/);
});
test('start watchdog stops a silently dropped request and late completion cannot advance', context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  let reason = ''; let ended = 0;
  const u = speakPhrase('Never started', 1, () => ended++, error => { reason = error || ''; })!;
  context.mock.timers.tick(6000);
  assert.equal(reason, 'start-timeout');
  u.onend?.({} as any); assert.equal(ended, 0);
  context.mock.timers.reset();
});
test('successful start clears the startup watchdog', context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  let errors = 0;
  const u = speakPhrase('Started', 1, undefined, () => errors++)!;
  u.onstart?.({} as any); context.mock.timers.tick(6000);
  assert.equal(errors, 0);
  context.mock.timers.reset();
});
test('voice subscriptions are independent and removable', () => {
  let a = 0, b = 0;
  const unsubscribe = subscribeVoices(() => a++);
  const other = subscribeVoices(() => b++);
  events.dispatchEvent(new Event('voiceschanged')); unsubscribe();
  events.dispatchEvent(new Event('voiceschanged')); other();
  assert.equal(a, 1); assert.equal(b, 2);
});
test('speech cleanup does not change a principal P2 to pesos or q to theta', () => {
  assert.match(cleanTextForSpeech('P2, cos q, f_k, ₱500'), /P2, cos q, friction force, 500 pesos/);
  assert.match(cleanTextForSpeech('Option A: RA 7920'), /Option A\. Republic Act 7920/);
});
