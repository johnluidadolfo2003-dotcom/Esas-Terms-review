/**
 * Web Speech API Service for AI Question Reader & Auto-Tutor
 * Engineered for an authentic, unmistakably deep male podcast-host voice with natural conversational cadence.
 */

export type AiVoiceMode = 'off' | 'ai_reads_you_answer' | 'ai_reads_and_answers';
export type VoiceDepth = 'deep' | 'ultra_deep';

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Known male voice identifiers across Chrome (Desktop & Android), Edge, Safari, iOS, macOS, Windows, Linux
const PREFERRED_DEEP_MALE_VOICE_NAMES = [
  // Microsoft Neural Natural Male Voices (Rich broadcast/podcast quality)
  'Microsoft Guy Online (Natural)',
  'Microsoft Ryan Online (Natural)',
  'Microsoft Christopher Online (Natural)',
  'Microsoft Andrew Online (Natural)',
  'Microsoft Brian Online (Natural)',
  'Microsoft Davis Online (Natural)',
  'Microsoft Steffan Online (Natural)',
  'Microsoft Jason Online (Natural)',
  'Microsoft Tony Online (Natural)',
  // Google TTS Natural Male Voices (Chrome Desktop & Android)
  'Google UK English Male',
  'Google US English',
  'en-us-x-sfg#male',
  'en-us-x-iol#male',
  'en-us-x-tpd#male',
  'en-gb-x-rjs#male',
  // Apple / macOS / iOS deep male voices
  'Arthur',
  'Daniel',
  'Oliver',
  'Alex',
  'Fred',
  'Aaron',
  'Ralph',
  'Tom',
  // Windows desktop local male voices
  'Microsoft David Desktop',
  'Microsoft Mark',
  'Microsoft George',
  'Microsoft David',
  'David',
  'Guy',
  'Ryan',
  'Christopher',
  'Brian',
  'Mark',
];

const FEMALE_VOICE_KEYWORDS = [
  'female',
  'woman',
  'girl',
  'zira',
  'samantha',
  'victoria',
  'karen',
  'hazel',
  'moira',
  'fiona',
  'tessa',
  'veena',
  'susan',
  'helen',
  'eva',
  'catherine',
  'jenny',
  'aria',
  'stephanie',
  'libby',
  'sonia',
  'natasha',
  'siri',
  'kate',
  'serena',
  'allison',
  'ava',
  'susan',
  'shelby',
];

let cachedVoices: SpeechSynthesisVoice[] = [];
let cachedDeepMaleVoice: SpeechSynthesisVoice | null = null;
let currentVoiceDepth: VoiceDepth = 'deep';

export function setVoiceDepth(depth: VoiceDepth): void {
  currentVoiceDepth = depth;
}

export function getVoiceDepth(): VoiceDepth {
  return currentVoiceDepth;
}

function loadVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return [];
  const liveVoices = window.speechSynthesis.getVoices();
  if (liveVoices && liveVoices.length > 0) {
    cachedVoices = liveVoices;
    return liveVoices;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
    cachedDeepMaleVoice = selectBestDeepMaleVoice(cachedVoices);
  };
}

/**
 * Finds the highest quality deep, natural male English voice available on the device
 */
export function selectBestDeepMaleVoice(voicesList?: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const voices = voicesList && voicesList.length > 0 ? voicesList : loadVoices();
  if (!voices || voices.length === 0) return null;

  const englishVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
  const candidatePool = englishVoices.length > 0 ? englishVoices : voices;

  // STRICT ANTI-FEMALE FILTER: Remove any voice known to be female
  const maleOrNeutralPool = candidatePool.filter((v) => {
    const nameLower = v.name.toLowerCase();
    return !FEMALE_VOICE_KEYWORDS.some((kw) => nameLower.includes(kw));
  });

  const poolToSearch = maleOrNeutralPool.length > 0 ? maleOrNeutralPool : candidatePool;

  // 1. Match known high-fidelity deep male voices by prioritized name
  for (const preferredName of PREFERRED_DEEP_MALE_VOICE_NAMES) {
    const match = poolToSearch.find(
      (v) => v.name.toLowerCase().includes(preferredName.toLowerCase())
    );
    if (match) return match;
  }

  // 2. Look for voices tagged explicitly with "male" and not "female"
  const maleTaggedVoice = poolToSearch.find((v) => {
    const nameLower = v.name.toLowerCase();
    return nameLower.includes('male') && !nameLower.includes('female');
  });
  if (maleTaggedVoice) return maleTaggedVoice;

  // 3. Fallback to any non-female voice
  if (maleOrNeutralPool.length > 0) {
    return maleOrNeutralPool[0];
  }

  return candidatePool[0] || null;
}

export function getDeepMaleVoice(): SpeechSynthesisVoice | null {
  // Always check if new voices arrived
  if (!cachedDeepMaleVoice || cachedVoices.length === 0) {
    cachedDeepMaleVoice = selectBestDeepMaleVoice();
  }
  return cachedDeepMaleVoice;
}

/**
 * Formats raw quiz text into natural, spoken English with conversational micro-pauses
 * and expanded engineering abbreviations suitable for a podcast host.
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return '';

  let spoken = text
    .replace(/[_*#`~]/g, '') // remove markdown symbols
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
    .replace(/\bP\s*(\d+)/g, '$1 pesos')
    .replace(/\bcos\s*phi\b/gi, 'cosine of fee')
    .replace(/\bsin\s*phi\b/gi, 'sine of fee')
    .replace(/\bcos\s*q\b/gi, 'cosine of theta')
    .replace(/\bsin\s*q\b/gi, 'sine of theta')
    .replace(/\bu\s*mg\b/gi, 'mew times m times g')
    .replace(/\bf_k\b/gi, 'friction force')
    // Conversational smoothing for options
    .replace(/\bOption\s*([A-D]):?\s*/gi, 'Option $1... ')
    // Remove standalone bracket artifacts
    .replace(/[\[\]{}()]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return spoken;
}

/**
 * Stop any ongoing speech synthesis immediately
 */
export function stopSpeech(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speak a phrase with a truly deep, warm male podcast host voice.
 * - Enforces low pitch (0.70 for deep baritone, 0.58 for ultra-deep bass)
 * - Assigns top natural male English voice
 * - Natural unhurried conversational cadence
 */
export function speakPhrase(
  phrase: string,
  rate: number = 1.0,
  onEnd?: () => void,
  onError?: () => void,
  depthOverride?: VoiceDepth
): SpeechSynthesisUtterance | null {
  if (!isSpeechSupported()) {
    if (onError) onError();
    return null;
  }

  stopSpeech();

  const clean = cleanTextForSpeech(phrase);
  if (!clean) {
    if (onEnd) onEnd();
    return null;
  }

  const utterance = new SpeechSynthesisUtterance(clean);

  // DEEP MALE PITCH CALIBRATION:
  // Standard speech pitch is 1.0.
  // 0.70 drops the formant into a rich, deep, masculine baritone podcast host.
  // 0.58 drops into a heavy, deep radio bass.
  const depth = depthOverride || currentVoiceDepth;
  utterance.pitch = depth === 'ultra_deep' ? 0.58 : 0.70;

  // Unrushed, natural podcast host cadence (0.92x of user's chosen speed)
  utterance.rate = Math.max(0.70, Math.min(1.3, rate * 0.92));

  // Natural volume
  utterance.volume = 1.0;

  // Dynamically ensure latest available deep male voice
  const deepMaleVoice = getDeepMaleVoice();
  if (deepMaleVoice) {
    utterance.voice = deepMaleVoice;
    utterance.lang = deepMaleVoice.lang || 'en-US';
  } else {
    utterance.lang = 'en-US';
  }

  if (onEnd) {
    utterance.onend = () => {
      onEnd();
    };
  }

  if (onError) {
    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis error:', e);
      }
      onError();
    };
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Test play sample to immediately demonstrate the deep male podcast voice
 */
export function testDeepMaleVoice(depth: VoiceDepth = currentVoiceDepth): void {
  const sample = "Welcome to the reviewer. This is your deep male podcast host voice. Clear, confident, and ready for your board exam questions.";
  speakPhrase(sample, 1.0, undefined, undefined, depth);
}
