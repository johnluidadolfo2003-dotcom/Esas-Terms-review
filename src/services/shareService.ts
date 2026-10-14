import { SubjectCategory, FlashcardQuestion } from './questionParser';

export const SHARED_PUBLIC_URL =
  'https://ais-pre-relbnodaefb3jvetyyx4ce-141032669349.asia-southeast1.run.app';

export const DEV_APP_URL =
  'https://ais-dev-relbnodaefb3jvetyyx4ce-141032669349.asia-southeast1.run.app';

export const STORAGE_KEY_RENDER_URL = 'drive_flashcards_render_custom_url';

/**
 * Returns saved Render URL from browser storage or detects it from window.location.
 */
export function getSavedRenderUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY_RENDER_URL);
    if (saved && saved.trim().startsWith('http')) {
      return saved.trim();
    }
    if (window.location.hostname.endsWith('onrender.com')) {
      return window.location.origin;
    }
  }
  return '';
}

/**
 * Saves the user's Render domain for quick link sharing.
 */
export function saveRenderUrl(url: string): void {
  if (typeof window !== 'undefined') {
    const clean = url.trim().replace(/\/+$/, '');
    if (clean) {
      localStorage.setItem(STORAGE_KEY_RENDER_URL, clean);
    } else {
      localStorage.removeItem(STORAGE_KEY_RENDER_URL);
    }
  }
}

/**
 * Returns the base URL suitable for sharing with others.
 * Priority:
 * 1. If currently hosted on Render or custom domain -> use window.location.origin
 * 2. If user saved a Render URL -> use saved Render URL
 * 3. Default to public shared URL
 */
export function getBaseShareUrl(usePublicUrl: boolean = true, customBaseUrl?: string): string {
  if (customBaseUrl && customBaseUrl.trim()) {
    let clean = customBaseUrl.trim().replace(/\/+$/, '');
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    return clean;
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const hostname = window.location.hostname;
    // If the app is currently running on Render or a deployed custom domain
    if (hostname.endsWith('onrender.com') || (hostname !== 'localhost' && !hostname.includes('.run.app'))) {
      return origin;
    }
  }

  if (usePublicUrl) {
    return SHARED_PUBLIC_URL;
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin && origin !== 'null' && !origin.includes('localhost')) {
      return origin;
    }
  }

  return DEV_APP_URL;
}

export interface ShareOptions {
  subject?: SubjectCategory | 'All';
  mode?: 'all' | 'missed' | 'flagged';
  customQuestions?: FlashcardQuestion[];
  includeCustomQuestions?: boolean;
  usePublicUrl?: boolean;
  customBaseUrl?: string;
}

/**
 * Encodes a question list into a safe base64 URL fragment.
 */
function encodeQuestionsToHash(questions: FlashcardQuestion[]): string {
  try {
    // Keep essential question fields to keep URL size optimal
    const lightweight = questions.map((q) => ({
      id: q.id,
      subject: q.subject,
      question: q.question,
      choices: q.choices,
      correctChoiceId: q.correctChoiceId,
      explanation: q.explanation,
      sourceFileName: q.sourceFileName || 'Shared Question Pack',
    }));

    const jsonStr = JSON.stringify(lightweight);
    // Safe unicode base64 encoding
    const b64 = btoa(
      encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
    return `pack=${b64}`;
  } catch (err) {
    console.warn('Could not encode custom questions into URL hash:', err);
    return '';
  }
}

/**
 * Decodes questions from a base64 URL fragment.
 */
export function decodeQuestionsFromHash(hashString: string): FlashcardQuestion[] {
  try {
    const cleanHash = hashString.replace(/^#/, '');
    const params = new URLSearchParams(cleanHash);
    const pack = params.get('pack');
    if (!pack) return [];

    const jsonStr = decodeURIComponent(
      Array.prototype.map
        .call(atob(pack), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((q): q is FlashcardQuestion => {
      return (
        typeof q === 'object' &&
        q !== null &&
        typeof q.question === 'string' &&
        Array.isArray(q.choices) &&
        q.choices.length >= 2 &&
        typeof q.correctChoiceId === 'string'
      );
    });
  } catch (err) {
    console.warn('Failed to decode shared questions from URL hash:', err);
    return [];
  }
}

/**
 * Generates a full shareable URL with parameters and optional question pack.
 */
export function generateShareableUrl(options: ShareOptions = {}): string {
  const baseUrl = getBaseShareUrl(options.usePublicUrl ?? true, options.customBaseUrl);
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    url = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
  }

  if (options.subject && options.subject !== 'All') {
    url.searchParams.set('subject', options.subject);
  }

  if (options.mode && options.mode !== 'all') {
    url.searchParams.set('mode', options.mode);
  }

  if (
    options.includeCustomQuestions &&
    options.customQuestions &&
    options.customQuestions.length > 0
  ) {
    const hashPayload = encodeQuestionsToHash(options.customQuestions);
    if (hashPayload) {
      url.hash = hashPayload;
    }
  }

  return url.toString();
}

/**
 * Parses shared parameters from the current window location.
 */
export function parseCurrentLocationParams(): {
  subject?: SubjectCategory;
  mode?: 'all' | 'missed' | 'flagged';
  sharedQuestions: FlashcardQuestion[];
} {
  if (typeof window === 'undefined') {
    return { sharedQuestions: [] };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const subjectParam = urlParams.get('subject');
  const modeParam = urlParams.get('mode');

  const validSubjects: SubjectCategory[] = [
    'ESAS',
    'MATH',
    'EE',
    'Economics',
    'Mechanics 1',
    'Mechanics 2',
    'EE Laws',
    'Project Management',
    'Communication',
    'General Engineering',
  ];

  let subject: SubjectCategory | undefined = undefined;
  if (subjectParam && validSubjects.includes(subjectParam as SubjectCategory)) {
    subject = subjectParam as SubjectCategory;
  }

  let mode: ('all' | 'missed' | 'flagged') | undefined = undefined;
  if (modeParam === 'missed' || modeParam === 'flagged' || modeParam === 'all') {
    mode = modeParam;
  }

  const sharedQuestions = decodeQuestionsFromHash(window.location.hash);

  return {
    subject,
    mode,
    sharedQuestions,
  };
}

/**
 * Copies text safely to clipboard with fallback.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Copy to clipboard failed:', err);
    return false;
  }
}

/**
 * Checks if native device sharing is available.
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Triggers native system share dialog (e.g. mobile share sheet).
 */
export async function shareViaNavigator(data: {
  title: string;
  text: string;
  url: string;
}): Promise<boolean> {
  if (!isWebShareSupported()) return false;
  try {
    await navigator.share(data);
    return true;
  } catch (err) {
    // User cancelled or share dismissed
    if ((err as Error)?.name !== 'AbortError') {
      console.warn('Native share failed:', err);
    }
    return false;
  }
}
