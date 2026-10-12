import { FlashcardQuestion, SubjectCategory } from './questionParser';

export interface SubjectQuota {
  subject: SubjectCategory;
  count: number;
}

export const QUIZ_SUBJECT_QUOTAS: SubjectQuota[] = [
  { subject: 'Economics', count: 10 },
  { subject: 'Mechanics 1', count: 5 },
  { subject: 'Mechanics 2', count: 5 },
  { subject: 'EE Laws', count: 20 },
  { subject: 'Project Management', count: 20 },
  { subject: 'Communication', count: 10 },
];

export const TOTAL_QUIZ_ITEMS = QUIZ_SUBJECT_QUOTAS.reduce((acc, item) => acc + item.count, 0);

const LOCAL_STORAGE_USED_IDS_KEY = 'esas_terms_quiz_used_ids_v1';

export function getUsedQuizQuestionIds(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USED_IDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveUsedQuizQuestionIds(used: Record<string, string[]>): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_USED_IDS_KEY, JSON.stringify(used));
  } catch (err) {
    console.warn('Failed to save used quiz question IDs', err);
  }
}

/**
 * Fisher-Yates shuffle returning a fresh shuffled copy
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a 70-item board exam quiz picking DIFFERENT questions every quiz.
 * Tracks used questions across quizzes so all questions in the bank are covered.
 */
export function generate70ItemQuiz(allQuestions: FlashcardQuestion[]): {
  quizQuestions: FlashcardQuestion[];
  updatedUsedIds: Record<string, string[]>;
} {
  const currentUsed = getUsedQuizQuestionIds();
  const nextUsed: Record<string, string[]> = { ...currentUsed };
  const selectedQuestions: FlashcardQuestion[] = [];

  for (const { subject, count } of QUIZ_SUBJECT_QUOTAS) {
    // 1. Filter all questions for this subject
    const subjectPool = allQuestions.filter((q) => q.subject === subject);

    if (subjectPool.length === 0) continue;

    const usedForSubj = new Set(nextUsed[subject] || []);

    // 2. Unused candidates in this subject
    let candidates = subjectPool.filter((q) => !usedForSubj.has(q.id));

    // 3. If remaining candidates are fewer than quota, reset subject history to cycle through again
    if (candidates.length < count) {
      nextUsed[subject] = [];
      candidates = [...subjectPool];
    }

    // 4. Shuffle candidates and select required count
    const shuffledCandidates = shuffleArray(candidates);
    const picked = shuffledCandidates.slice(0, Math.min(count, shuffledCandidates.length));

    selectedQuestions.push(...picked);

    // 5. Update used IDs record
    const updatedSubjUsed = Array.from(
      new Set([...(nextUsed[subject] || []), ...picked.map((q) => q.id)])
    );
    nextUsed[subject] = updatedSubjUsed;
  }

  // Save used IDs to local storage
  saveUsedQuizQuestionIds(nextUsed);

  // 6. Overall shuffle so subjects are intermixed throughout the 70 items
  const finalQuizList = shuffleArray(selectedQuestions);

  return {
    quizQuestions: finalQuizList,
    updatedUsedIds: nextUsed,
  };
}
