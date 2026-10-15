import { FlashcardQuestion } from './questionParser';
import jsPDF from 'jspdf';

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

    // Sync with backend server API so all users logging into the site see updated questions
    fetch('/api/custom-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions }),
    }).catch((err) => console.warn('Background server question sync notice:', err));

    return true;
  } catch (err) {
    console.error('Failed to save custom questions to localStorage:', err);
    return false;
  }
}

/**
 * Fetches custom questions from server endpoint /api/custom-questions
 */
export async function fetchServerCustomQuestions(): Promise<FlashcardQuestion[]> {
  try {
    const res = await fetch('/api/custom-questions');
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data.questions)) {
      return data.questions;
    }
  } catch (err) {
    console.warn('Could not fetch server custom questions:', err);
  }
  return [];
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
 * Helper to escape CSV cell values properly
 */
function escapeCsvValue(val: string | undefined | null): string {
  if (!val) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Downloads questions as a CSV spreadsheet file containing Questions, Choices A-D, and Final Correct Answer.
 * Can filter by specific subject or download all subjects.
 */
export function downloadQuestionsCsv(
  questions: FlashcardQuestion[],
  subjectFilter?: string
): void {
  const filtered =
    subjectFilter && subjectFilter !== 'All'
      ? questions.filter((q) => q.subject === subjectFilter)
      : questions;

  if (filtered.length === 0) return;

  const headers = [
    'Subject',
    'Item #',
    'Question Text',
    'Choice A',
    'Choice B',
    'Choice C',
    'Choice D',
    'Correct Choice Letter',
    'Correct Choice Text',
    'Explanation',
    'Source File',
  ];

  const rows = filtered.map((q, idx) => {
    const choiceA = q.choices.find((c) => c.id.toUpperCase() === 'A')?.text || '';
    const choiceB = q.choices.find((c) => c.id.toUpperCase() === 'B')?.text || '';
    const choiceC = q.choices.find((c) => c.id.toUpperCase() === 'C')?.text || '';
    const choiceD = q.choices.find((c) => c.id.toUpperCase() === 'D')?.text || '';
    const correctChoice = q.choices.find(
      (c) => c.id.toUpperCase() === q.correctChoiceId.toUpperCase()
    );
    const correctText = correctChoice ? correctChoice.text : '';

    return [
      escapeCsvValue(q.subject),
      escapeCsvValue(String(idx + 1)),
      escapeCsvValue(q.question),
      escapeCsvValue(choiceA),
      escapeCsvValue(choiceB),
      escapeCsvValue(choiceC),
      escapeCsvValue(choiceD),
      escapeCsvValue(q.correctChoiceId.toUpperCase()),
      escapeCsvValue(correctText),
      escapeCsvValue(q.explanation || ''),
      escapeCsvValue(q.sourceFileName || ''),
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n'); // UTF-8 BOM for Excel compatibility
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const filenameSubject =
    subjectFilter && subjectFilter !== 'All'
      ? subjectFilter.replace(/\s+/g, '_')
      : 'All_Subjects';
  a.download = `Question_Bank_${filenameSubject}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads questions as a nicely formatted text document.
 * Format:
 * 1. Question
 * A. Choice A
 * B. Choice B
 * C. Choice C
 * D. Choice D
 * Answer: A Choice wordings
 */
export function downloadQuestionsTxt(
  questions: FlashcardQuestion[],
  subjectFilter?: string
): void {
  const filtered =
    subjectFilter && subjectFilter !== 'All'
      ? questions.filter((q) => q.subject === subjectFilter)
      : questions;

  if (filtered.length === 0) return;

  // Group by subject
  const grouped: Record<string, FlashcardQuestion[]> = {};
  filtered.forEach((q) => {
    const subj = q.subject || 'General';
    if (!grouped[subj]) grouped[subj] = [];
    grouped[subj].push(q);
  });

  const lines: string[] = [];

  Object.entries(grouped).forEach(([subj, qList]) => {
    lines.push(`SUBJECT: ${subj.toUpperCase()} (${qList.length} Items)`);
    lines.push(`=================================================================\n`);

    qList.forEach((q, idx) => {
      lines.push(`${idx + 1}. ${q.question}`);
      q.choices.forEach((c) => {
        lines.push(`${c.id.toUpperCase()}. ${c.text}`);
      });
      const correctChoice = q.choices.find(
        (c) => c.id.toUpperCase() === q.correctChoiceId.toUpperCase()
      );
      const answerWording = correctChoice
        ? `${q.correctChoiceId.toUpperCase()} ${correctChoice.text}`
        : q.correctChoiceId.toUpperCase();
      lines.push(`Answer: ${answerWording}`);
      if (q.explanation) {
        lines.push(`Explanation: ${q.explanation}`);
      }
      lines.push(''); // blank line between items
    });

    lines.push('\n');
  });

  const textContent = lines.join('\n');
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const filenameSubject =
    subjectFilter && subjectFilter !== 'All'
      ? subjectFilter.replace(/\s+/g, '_')
      : 'All_Subjects';
  a.download = `Question_Bank_${filenameSubject}_${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads questions formatted as a clean PDF document per subject or for all subjects.
 * Format:
 * 1. Question
 * A. Choice A
 * B. Choice B
 * C. Choice C
 * D. Choice D
 * Answer: A Choice wordings
 */
export function downloadQuestionsPdf(
  questions: FlashcardQuestion[],
  subjectFilter?: string
): void {
  const filtered =
    subjectFilter && subjectFilter !== 'All'
      ? questions.filter((q) => q.subject === subjectFilter)
      : questions;

  if (filtered.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 20) {
      doc.addPage();
      y = margin;
    }
  };

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  const subjTitle =
    subjectFilter && subjectFilter !== 'All'
      ? subjectFilter.toUpperCase()
      : 'ALL SUBJECTS';
  doc.text(`REVIEWER - ${subjTitle}`, margin, y);
  y += 20;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Total Questions: ${filtered.length} | Date: ${new Date().toLocaleDateString()}`,
    margin,
    y
  );
  y += 14;

  doc.setDrawColor(210, 210, 210);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  doc.setTextColor(0, 0, 0);

  filtered.forEach((q, idx) => {
    const correctChoice = q.choices.find(
      (c) => c.id.toUpperCase() === q.correctChoiceId.toUpperCase()
    );
    const answerWordings = correctChoice
      ? `${q.correctChoiceId.toUpperCase()} ${correctChoice.text}`
      : q.correctChoiceId.toUpperCase();

    // Prepare Question text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    const qHeader = `${idx + 1}. ${q.question}`;
    const qLines = doc.splitTextToSize(qHeader, contentWidth);

    // Prepare Choice lines
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const choiceLines = q.choices.map((c) => ({
      lines: doc.splitTextToSize(`${c.id.toUpperCase()}. ${c.text}`, contentWidth - 10),
    }));

    // Prepare Answer line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    const answerText = `Answer: ${answerWordings}`;
    const answerLines = doc.splitTextToSize(answerText, contentWidth - 10);

    // Calculate height
    let totalHeight = qLines.length * 13 + 4;
    choiceLines.forEach((cl) => {
      totalHeight += cl.lines.length * 12 + 2;
    });
    totalHeight += answerLines.length * 12 + 10;

    checkPageBreak(totalHeight);

    // Render Question
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(qLines, margin, y);
    y += qLines.length * 13 + 2;

    // Render Choices
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    choiceLines.forEach((cl) => {
      doc.text(cl.lines, margin + 10, y);
      y += cl.lines.length * 12 + 2;
    });

    // Render Answer
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(16, 122, 70); // Emerald Green
    doc.text(answerLines, margin + 10, y);
    y += answerLines.length * 12 + 12;

    // Item separator line
    doc.setDrawColor(235, 235, 235);
    doc.line(margin, y - 6, pageWidth - margin, y - 6);
  });

  // Footer page numbers
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 15,
      { align: 'center' }
    );
  }

  const filenameSubject =
    subjectFilter && subjectFilter !== 'All'
      ? subjectFilter.replace(/\s+/g, '_')
      : 'All_Subjects';
  doc.save(`Reviewer_${filenameSubject}_${new Date().toISOString().slice(0, 10)}.pdf`);
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
