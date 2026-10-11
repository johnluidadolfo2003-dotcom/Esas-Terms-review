/**
 * Web Speech API Service for AI Question Reader & Auto-Tutor
 */

export type AiVoiceMode = 'off' | 'ai_reads_you_answer' | 'ai_reads_and_answers';

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/[_*#`~]/g, '') // remove markdown symbols
    .replace(/\s+/g, ' ')
    .trim();
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
 * Speak a single phrase with callbacks and custom speech rate
 */
export function speakPhrase(
  phrase: string,
  rate: number = 1.0,
  onEnd?: () => void,
  onError?: () => void
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
  utterance.rate = rate;
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = () => {
      onEnd();
    };
  }

  if (onError) {
    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      onError();
    };
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}
