import { FlashcardQuestion } from './questionParser';

export const STORAGE_KEY_CUSTOM_QUESTIONS = 'drive_flashcards_custom_questions_v2';
export const STORAGE_KEY_BACKUP = 'drive_flashcards_custom_questions_backup';
export const STORAGE_KEY_LEGACY = 'drive_flashcards_custom_questions';

/**
 * Loads custom questions saved by the user from localStorage.
 * Checks versioned key, legacy key, and backup key.
 */
export function loadSavedCustomQuestions(): FlashcardQuestion[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEY_CUSTOM_QUESTIONS);
    if (!raw) {
      raw = localStorage.getItem(STORAGE_KEY_LEGACY);
    }
    if (!raw) {
      raw = localStorage.getItem(STORAGE_KEY_BACKUP);
    }

    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Sanitize and validate loaded questions
    return parsed.filter((q): q is FlashcardQuestion => {
      return (
        typeof q === 'object' &&
        q !== null &&
        typeof q.id === 'string' &&
        typeof q.question === 'string' &&
        Array.isArray(q.choices) &&
        q.choices.length >= 2 &&
        typeof q.correctChoiceId === 'string'
      );
    });
  } catch (err) {
    console.warn('Failed to load custom questions from localStorage:', err);
    return [];
  }
}

/**
 * Saves custom questions permanently to localStorage with multiple redundant keys.
 */
export function saveCustomQuestions(questions: FlashcardQuestion[]): boolean {
  try {
    const serialized = JSON.stringify(questions);
    localStorage.setItem(STORAGE_KEY_CUSTOM_QUESTIONS, serialized);
    localStorage.setItem(STORAGE_KEY_BACKUP, serialized);
    // Keep legacy key populated for backward compatibility
    localStorage.setItem(STORAGE_KEY_LEGACY, serialized);

    // Notify other components or tabs
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('flashcards_custom_questions_updated', {
          detail: { count: questions.length },
        })
      );
    }
    return true;
  } catch (err) {
    console.error('Failed to save custom questions to localStorage:', err);
    return false;
  }
}

/**
 * Deletes a single custom question by ID.
 */
export function deleteCustomQuestion(questionId: string, currentQuestions: FlashcardQuestion[]): FlashcardQuestion[] {
  const updated = currentQuestions.filter((q) => q.id !== questionId);
  saveCustomQuestions(updated);
  return updated;
}

/**
 * Clears all custom questions.
 */
export function clearAllCustomQuestions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CUSTOM_QUESTIONS);
    localStorage.removeItem(STORAGE_KEY_BACKUP);
    localStorage.removeItem(STORAGE_KEY_LEGACY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('flashcards_custom_questions_updated', {
          detail: { count: 0 },
        })
      );
    }
  } catch (err) {
    console.error('Failed to clear custom questions:', err);
  }
}

/**
 * Exports custom questions as a downloadable JSON backup.
 */
export function exportCustomQuestionsJson(questions: FlashcardQuestion[]): void {
  const blob = new Blob([JSON.stringify(questions, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `flashcards_custom_questions_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parses and imports custom questions from a JSON backup file.
 */
export async function importCustomQuestionsJson(file: File): Promise<FlashcardQuestion[]> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid format: expected a JSON array of questions');
  }

  const valid = parsed.filter((q): q is FlashcardQuestion => {
    return (
      typeof q === 'object' &&
      q !== null &&
      typeof q.question === 'string' &&
      Array.isArray(q.choices) &&
      q.choices.length >= 2 &&
      typeof q.correctChoiceId === 'string'
    );
  });

  return valid;
}

/**
 * Formats custom questions as valid TypeScript objects that can be directly
 * pasted into `src/data/driveQuestions.ts`.
 */
export function formatQuestionsAsTypeScriptCode(questions: FlashcardQuestion[]): string {
  if (questions.length === 0) return '';
  return questions
    .map((q) => {
      const choicesStr = q.choices
        .map((c) => `      { id: ${JSON.stringify(c.id)}, text: ${JSON.stringify(c.text)} },`)
        .join('\n');

      return `  {
    id: ${JSON.stringify(q.id)},
    subject: ${JSON.stringify(q.subject)},
    sourceFileName: ${JSON.stringify(q.sourceFileName || 'Drive/Manually_Added_Questions.docx')},
    question: ${JSON.stringify(q.question)},
    choices: [
${choicesStr}
    ],
    correctChoiceId: ${JSON.stringify(q.correctChoiceId)},
    explanation: ${JSON.stringify(q.explanation || '')},
  },`;
    })
    .join('\n');
}

/**
 * Generates the complete source code for `src/data/driveQuestions.ts`
 */
export function generateFullDriveQuestionsTsFile(questions: FlashcardQuestion[]): string {
  const content = formatQuestionsAsTypeScriptCode(questions);
  return `import { FlashcardQuestion } from '../services/questionParser';

export const DRIVE_COPIED_QUESTIONS: FlashcardQuestion[] = [
${content}
];
`;
}

/**
 * Directly downloads `driveQuestions.ts` with all questions for easy git commit/push to Render
 */
export function downloadDriveQuestionsTs(questions: FlashcardQuestion[]): void {
  const fileContent = generateFullDriveQuestionsTsFile(questions);
  const blob = new Blob([fileContent], { type: 'text/typescript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'driveQuestions.ts';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Saves all questions directly to the project's `src/data/driveQuestions.ts` via the dev server API
 */
export async function saveQuestionsToProjectApi(
  questions: FlashcardQuestion[]
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const res = await fetch('/api/save-drive-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questions }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        error: data.error || `Server responded with status ${res.status}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      count: data.count || questions.length,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network request failed';
    return {
      success: false,
      error: message,
    };
  }
}
