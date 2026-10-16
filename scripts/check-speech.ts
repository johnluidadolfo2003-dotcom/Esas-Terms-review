import assert from 'node:assert/strict';
import { test, beforeEach } from 'node:test';
import {
  selectBestUSMaleVoice, getReaderVoice, setPreferredVoiceURI, speakPhrase,
  stopSpeech, cleanTextForSpeech, subscribeVoices,
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
test('US locale is mandatory; native neural male is preferred over local male', () => {
  const neural = voice('Microsoft Andrew Online (Natural)');
  assert.equal(selectBestUSMaleVoice([voice('Google UK English Male', 'en-GB'), voice('Microsoft David'), neural]), neural);
  assert.equal(selectBestUSMaleVoice([voice('Google UK English Male', 'en-GB')]), null);
});
test('generic Google US, female names, and unfamiliar voices are never assumed male', () => {
  assert.equal(selectBestUSMaleVoice([voice('Google US English'), voice('Samantha'), voice('female'), voice('Unknown')]), null);
});
test('explicit voice choice works without storage and never silently changes speakers', () => {
  voices = [voice('Custom voice', 'en-US', 'chosen')];
  setPreferredVoiceURI('chosen');
  assert.equal(getReaderVoice()?.voiceURI, 'chosen');
  voices = [voice('Microsoft David')];
  assert.equal(getReaderVoice(), null);
});
test('native pitch and the user speed are preserved; repeated completion fires once', async () => {
  voices = [voice('Alex')]; let ended = 0;
  const u = speakPhrase('Hello.', 1.5, () => ended++)!;
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
test('late voice loading starts once; cancellation removes a pending reader', async () => {
  speakPhrase('Canceled pending read'); stopSpeech();
  voices = [voice('Alex')]; events.dispatchEvent(new Event('voiceschanged')); await flush();
  assert.equal(spoken.length, 0);
  voices = []; speakPhrase('Fresh read');
  voices = [voice('Alex')]; events.dispatchEvent(new Event('voiceschanged')); await flush();
  assert.equal(spoken.length, 1); stopSpeech();
});
test('unavailable male voice reports an error instead of speaking a different accent or speaker', async () => {
  voices = [voice('Samantha')]; let errors = 0;
  speakPhrase('Hello', 1, undefined, () => errors++); await flush();
  assert.equal(spoken.length, 0); assert.equal(errors, 1);
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
