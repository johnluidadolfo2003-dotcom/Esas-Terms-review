/** Device speech uses the voice's native timbre, never pitch-shifted to simulate gender. */
export type AiVoiceMode = 'off' | 'ai_reads_you_answer' | 'ai_reads_and_answers';
const VOICE_KEY = 'esas-reader-us-voice-v1';
let sessionVoiceURI: string | undefined;
// Recognized provider voice names. Web Speech exposes no standard gender field.
const MALE_NAMES = /\b(guy|christopher|andrew|brian|davis|steffan|jason|tony|eric|roger|david|mark|alex|aaron|tom|evan|nathan)\b/i;
const EXPLICIT_MALE = /(?:^|[^a-z])male(?:$|[^a-z])/i;
const QUALITY = /natural|neural|premium|enhanced/i;
export const isSpeechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;
export const isUSVoice = (v: SpeechSynthesisVoice) => v.lang.replace(/_/g, '-').toLowerCase() === 'en-us';
export const isRecognizedMaleVoice = (v: SpeechSynthesisVoice) =>
  !/female/i.test(v.name) && (MALE_NAMES.test(v.name) || EXPLICIT_MALE.test(v.name + ' ' + v.voiceURI));
export function getUSVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return [];
  return window.speechSynthesis.getVoices().filter(isUSVoice).sort((a, b) =>
    Number(isRecognizedMaleVoice(b)) - Number(isRecognizedMaleVoice(a)) ||
    Number(QUALITY.test(b.name)) - Number(QUALITY.test(a.name)) || a.name.localeCompare(b.name));
}
export function getPreferredVoiceURI(): string {
  if (sessionVoiceURI !== undefined) return sessionVoiceURI;
  try { return window.localStorage.getItem(VOICE_KEY) || ''; } catch { return ''; }
}
export function setPreferredVoiceURI(uri: string): void {
  stopSpeech();
  sessionVoiceURI = uri;
  try { if (uri) window.localStorage.setItem(VOICE_KEY, uri); else window.localStorage.removeItem(VOICE_KEY); } catch {}
}
export function selectBestUSMaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  return voices.filter(v => isUSVoice(v) && isRecognizedMaleVoice(v)).sort((a, b) =>
    Number(QUALITY.test(b.name)) - Number(QUALITY.test(a.name)) || a.name.localeCompare(b.name))[0] || null;
}
export function getReaderVoice(): SpeechSynthesisVoice | null {
  const voices = getUSVoices();
  const saved = getPreferredVoiceURI();
  return voices.find(v => v.voiceURI === saved) || selectBestUSMaleVoice(voices) ||
    voices.find(v => v.default) || voices[0] || null;
}
export function getReaderVoiceNotice(): string {
  if (!isSpeechSupported()) return 'This browser does not support reading aloud. Open the app in Safari or Chrome.';
  const voice = getReaderVoice();
  if (!voice) return 'Using the browser’s English voice while the voice list is unavailable. A US male voice cannot be confirmed.';
  const missing = getPreferredVoiceURI() && voice.voiceURI !== getPreferredVoiceURI();
  return `${missing ? 'Saved voice unavailable; using ' : 'Using '}${voice.name}. ${
    isRecognizedMaleVoice(voice) ? 'US English male, natural pitch.' : 'US English fallback; male voice not confirmed. Choose a voice and preview it.'}`;
}
export function getSpeechErrorMessage(error?: string): string {
  switch (error) {
    case 'not-allowed': return 'Audio was blocked. Tap Play or Test Voice to enable it; check that this site is not muted.';
    case 'audio-busy': case 'audio-hardware': return 'Audio output is unavailable. Check media volume, Bluetooth output, or another app using audio, then tap Play.';
    case 'network': return 'The speech voice could not connect. Check your connection or choose an installed offline voice.';
    case 'voice-unavailable': case 'language-unavailable': return 'This voice cannot play here. Choose Automatic or another voice, then tap Test Voice.';
    case 'unsupported': return 'Reading aloud is not supported here. Open the app in Safari or Chrome.';
    case 'synthesis-unavailable': return 'No speech engine is available. Check your device’s text-to-speech settings, then try again.';
    case 'start-timeout': return 'Speech did not start. Tap Play to retry; check media volume and site audio settings.';
    default: return 'Voice playback stopped. Tap Play to retry, or choose another voice and tap Test Voice.';
  }
}
export function subscribeVoices(listener: () => void): () => void {
  if (!isSpeechSupported()) return () => {};
  window.speechSynthesis.addEventListener('voiceschanged', listener);
  return () => window.speechSynthesis.removeEventListener('voiceschanged', listener);
}
let generation = 0;
let startTimer: ReturnType<typeof setTimeout> | null = null;
// Hold a strong reference until completion (some engines otherwise stop long utterances).
let activeUtterance: SpeechSynthesisUtterance | null = null;
export function stopSpeech(): void {
  generation++;
  if (startTimer) clearTimeout(startTimer);
  startTimer = null;
  activeUtterance = null;
  if (isSpeechSupported()) window.speechSynthesis.cancel();
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


export function speakPhrase(
  phrase: string, rate = 1, onEnd?: () => void, onError?: (error?: string) => void
): SpeechSynthesisUtterance | null {
  stopSpeech();
  if (!isSpeechSupported()) { onError?.('unsupported'); return null; }
  const text = cleanTextForSpeech(phrase);
  if (!text) { onEnd?.(); return null; }
  const token = generation;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1;
  utterance.rate = Number.isFinite(rate) ? Math.max(.5, Math.min(2, rate)) : 1;
  utterance.volume = 1;
  utterance.lang = 'en-US';
  const voice = getReaderVoice();
  // An empty/late list is normal on mobile. Let the engine resolve en-US instead
  // of waiting asynchronously and losing the tap's activation context.
  if (voice) utterance.voice = voice;
  let settled = false;
  let started = false;
  const finish = (callback?: () => void) => {
    if (settled || token !== generation) return;
    settled = true;
    if (startTimer) clearTimeout(startTimer);
    startTimer = null;
    activeUtterance = null;
    callback?.();
  };
  utterance.onstart = () => {
    if (token !== generation) return;
    started = true;
    if (startTimer) clearTimeout(startTimer);
    startTimer = null;
  };
  utterance.onend = () => finish(onEnd);
  utterance.onerror = event => finish(() => onError?.(event.error));
  activeUtterance = utterance;
  startTimer = setTimeout(() => {
    if (!started && token === generation && !window.speechSynthesis.speaking) {
      // Invalidate this utterance before cancel; late events must not advance.
      stopSpeech();
      onError?.('start-timeout');
    }
  }, 6000);
  try {
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    // Keep this synchronous: Play/Test Voice must reach speak in the tap handler.
    window.speechSynthesis.speak(utterance);
  } catch { finish(() => onError?.('synthesis-failed')); }
  return utterance;
}
export function previewReaderVoice(onEnd?: () => void, onError?: (error?: string) => void): void {
  speakPhrase('Welcome. Let’s review one question at a time. Listen carefully, then choose the best answer.', 1, onEnd, onError);
}
