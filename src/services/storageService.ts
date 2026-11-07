import { FlashcardQuestion, questionMatchesSubject } from './questionParser';
import jsPDF from 'jspdf';

export type { FlashcardQuestion };

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
      ? questions.filter((q) => questionMatchesSubject(q, subjectFilter))
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
      ? questions.filter((q) => questionMatchesSubject(q, subjectFilter))
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
      ? questions.filter((q) => questionMatchesSubject(q, subjectFilter))
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
 * Formats a question into a concise Quick Recall / Cheat-Sheet pair:
 * Term (Answer) and Clue (Short concept/definition).
 * Tailored for rapid board exam memorization: 1 short line per number.
 */
export function formatQuickRecallItem(q: FlashcardQuestion): { term: string; clue: string } {
  const correctChoice = q.choices.find(
    (c) => c.id.toUpperCase() === q.correctChoiceId.toUpperCase()
  );
  let rawChoiceText = correctChoice ? correctChoice.text.trim() : `Option ${q.correctChoiceId}`;
  rawChoiceText = rawChoiceText.replace(/^[A-Da-d][\.\)]\s*/, '').replace(/^\([A-Da-d]\)\s*/, '').trim();

  const rawQ = q.question.trim();
  let term = rawChoiceText;
  let clue = '';

  // 1. Inverted definition check: If choice is a long sentence (>28 chars) and question defines a concept
  const conceptMatch = rawQ.match(/^([A-Za-z0-9\s,\-\(\)\/]{3,40}?)\s+(?:can be considered as|is defined as|refers to|is characterized by|is described as|is called|is known as)\b/i);
  if (conceptMatch && rawChoiceText.length > 28) {
    term = conceptMatch[1].replace(/^(?:a |an |the )/i, '').trim();
    clue = rawChoiceText;
  }

  // Check 'What is X?' / 'Define X'
  const whatIsMatch = rawQ.match(/^(?:what is (?:the definition of |the |an? )?|define |what refers to )([^?\.,]{3,35})\??$/i);
  if (whatIsMatch && whatIsMatch[1] && rawChoiceText.length > 25) {
    term = whatIsMatch[1].trim();
    clue = rawChoiceText;
  }

  // 2. High-yield board exam direct concept pairs
  if (!clue) {
    if (/FCC.*shall NOT be used/i.test(rawQ)) {
      term = rawChoiceText;
      clue = 'Flat conductor cable (FCC) prohibited in';
    } else if (/primarily used for service/i.test(rawQ)) {
      term = 'Service Entrance Cable';
      clue = 'Conductor assembly primarily used for service';
    } else if (/load of a given area.*concentrated/i.test(rawQ)) {
      term = 'Load Center';
      clue = 'Point where given area load is concentrated';
    } else if (/quarterbends/i.test(rawQ)) {
      term = `${rawChoiceText} quarterbends`;
      clue = 'Maximum bends allowed in a conduit run';
    } else if (/for banks.*lighting load/i.test(rawQ)) {
      term = rawChoiceText;
      clue = 'Bank general lighting load per sq meter';
    } else if (/dwelling units.*above 120,000/i.test(rawQ)) {
      term = rawChoiceText;
      clue = 'Demand factor for dwelling load above 120 kVA';
    } else if (/branch circuit rating for non-time delay fuse/i.test(rawQ)) {
      term = rawChoiceText;
      clue = 'Motor non-time delay fuse multiplier';
    } else if (/rms speed of different molecules/i.test(rawQ)) {
      term = 'RMS molecular speed';
      clue = rawChoiceText;
    } else if (/frictional force is.*area of contact/i.test(rawQ)) {
      term = 'Frictional force';
      clue = 'Independent of contact surface area';
    }
  }

  // 3. If still no clue, check explanation first (if clean and informative)
  if (!clue && q.explanation && typeof q.explanation === 'string' && q.explanation.trim().length > 15) {
    let exp = q.explanation.trim();
    // Stop at first sentence boundary if long
    const firstSent = exp.match(/^([^\.\?!]+)(?:[\.\?!]|$)/);
    if (firstSent && firstSent[1] && firstSent[1].length >= 15) {
      exp = firstSent[1].trim();
    }
    // Clean boilerplate
    exp = exp
      .replace(/^(?:according to [^,]+,?\s*|it is known that\s*|note that\s*|in general,?\s*)/i, '')
      .trim();

    // Strip term from explanation start
    const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    exp = exp.replace(new RegExp(`^${esc}\\s+(?:is |studies |refers to |describes |states that |has |count )?`, 'i'), '');

    if (exp.length >= 12) {
      clue = exp;
    }
  }

  // 4. Fill in the blank replacement if no explanation
  if (!clue && rawQ.includes('___')) {
    let filled = rawQ.replace(/_{2,}/, rawChoiceText);
    filled = filled
      .replace(/^(?:in |for |according to [^,]+,?\s*)/i, '')
      .replace(/\s*(?:is called|are called|is known as)\s*[\.:\?]?$/i, '')
      .trim();
    if (filled.length < 85) {
      clue = filled;
    }
  }

  // 5. Fallback to cleaning the raw question
  if (!clue) {
    let src = rawQ
      .replace(/^Item\s*\d+[\.:\s]*/i, '')
      .replace(/^\d+[\.:\s]*/, '')
      .replace(/^(?:which of the following (?:is defined as|describes|refers to|best describes|is|are)|which of the following)\s+/i, '')
      .replace(/^(?:what is the definition of|what is the purpose of|what is the unit of|what is the|what is|what are the|what are|what refers to|what do you call)\s+/i, '')
      .replace(/^(?:identify the|determine the|define the|named as|known as|referred to as|give the formula for|give the unit of|formula for|unit of|symbol of|symbol for)\s+/i, '')
      .replace(/^(?:it refers to|it is defined as|it is a|it is an|this is a|this is an|defined as|refers to|described as|classified as)\s+/i, '')
      .replace(/^(?:according to the philippine electrical code|according to pec|under ra 7920|under the law|in electrical engineering|in engineering economics|in physics|in chemistry|in general),?\s*/i, '')
      .replace(/\b(?:enumerated below EXCEPT one\.?|EXCEPT one\.?|EXCEPT:?|NOT applicable:?|is NOT true:?|all of the following except\??|which one is this\??)\b/gi, '')
      .replace(/_{2,}/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    src = src.replace(/^(?:a |an |the )/i, '');
    src = src.replace(/^(?:point at which|condition where|process by which|device that|assembly provided with or without an overall covering,?\s*primarily used for|system where|state in which|type of|method of)\s+/i, '');
    src = src.replace(/\s*(?:is called|are called|is known as|are known as|is termed|is defined as|is given by|is equal to|refers to|shall be computed at|is assumed to be)\s*[\.:\?]?$/i, '');

    // Stop at first punctuation
    const punct = src.search(/[\.;\?]/);
    if (punct > 15 && punct < 75) {
      src = src.slice(0, punct).trim();
    }

    const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    src = src.replace(new RegExp(`^${esc}\\s+(?:is |studies |refers to |describes |states that |has )?`, 'i'), '');

    clue = src;
  }

  // 6. Natural word-boundary limit: 110 characters (allows complete thought on 1-2 lines without cutting off)
  if (clue.length > 110) {
    const cutPos = clue.lastIndexOf(' ', 108);
    if (cutPos > 40) {
      clue = clue.slice(0, cutPos).trim();
    }
  }

  // Clean trailing dangling words, prepositions, conjunctions, and copulas
  const danglingRegex = /\s+(?:of|in|for|with|an|a|the|at|to|by|and|or|as|is|are|shall|be|from|on|which|that|where|its|their|whose|into|onto|than|then|when|about|foundational|generalized|compared|respectively|without|closed|equal|depending|forming)$/i;
  while (danglingRegex.test(clue)) {
    clue = clue.replace(danglingRegex, '').trim();
  }
  clue = clue.replace(/[\.,;:\-\(\)]+$/, '').trim();

  // Balance parentheses if needed
  const openCount = (clue.match(/\(/g) || []).length;
  const closeCount = (clue.match(/\)/g) || []).length;
  if (openCount > closeCount) {
    clue += ')'.repeat(openCount - closeCount);
  }

  // Clean term
  if (term.length > 55) {
    const cutPos = term.lastIndexOf(' ', 50);
    if (cutPos > 20) term = term.slice(0, cutPos).trim();
  }
  term = term.replace(/[\.,;:\-]+$/, '').trim();

  if (!clue) clue = rawQ.slice(0, 45).replace(/\s+\S*$/, '');
  clue = clue.charAt(0).toUpperCase() + clue.slice(1);
  term = term.charAt(0).toUpperCase() + term.slice(1);

  return { term, clue };
}

/**
 * Downloads a high-density, 1-line per number Quick Recall Cheat Sheet PDF per subject or all subjects.
 * Mimics high-yield board exam recall notes with highlighted key terms and short definitions.
 */
export function downloadQuickRecallPdf(
  questions: FlashcardQuestion[],
  subjectFilter?: string
): void {
  const filtered =
    subjectFilter && subjectFilter !== 'All'
      ? questions.filter((q) => questionMatchesSubject(q, subjectFilter))
      : questions;

  if (filtered.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      y = margin;
    }
  };

  // Header Banner
  doc.setFillColor(24, 27, 34); // Slate Dark Header Banner
  doc.rect(margin, y, contentWidth, 36, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  const subjTitle =
    subjectFilter && subjectFilter !== 'All'
      ? subjectFilter.toUpperCase()
      : 'ALL SUBJECTS';
  doc.text(`RAPID RECALL REVIEWER - ${subjTitle}`, margin + 12, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 210, 225);
  doc.text(
    `High-Yield Flash Recall Sheet | ${filtered.length} Items | Quick Memorization Form`,
    margin + 12,
    y + 28
  );

  y += 48;

  filtered.forEach((q, idx) => {
    const { term, clue } = formatQuickRecallItem(q);
    const itemNum = `${idx + 1}.`;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    const numWidth = doc.getTextWidth(itemNum) + 6;

    // Check width of term
    const termWidth = doc.getTextWidth(term);

    // Full text estimation (using standard hyphen, not em dash)
    const fullText = `${itemNum} ${term} - ${clue}`;
    const wrappedLines = doc.splitTextToSize(fullText, contentWidth);
    const itemHeight = Math.max(15, wrappedLines.length * 12.5 + 3);

    checkPageBreak(itemHeight);

    // Soft pastel yellow highlighter behind the key term (mimicking marker highlight in review notes)
    doc.setFillColor(254, 240, 138); // Marker yellow highlight
    const highlightW = Math.min(termWidth + 4, contentWidth - numWidth - 10);
    doc.rect(margin + numWidth - 2, y - 9, highlightW, 11, 'F');

    // Number in bold dark slate
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 60, 75);
    doc.text(itemNum, margin, y);

    // Term in bold dark ink
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(term, margin + numWidth, y);

    // Dash and Clue
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const prefixOffset = numWidth + termWidth;

    if (prefixOffset + 12 < contentWidth) {
      // First line continuation
      const remainingWidth = contentWidth - prefixOffset - 8;
      const clueLead = ` - ${clue}`;
      const clueLines = doc.splitTextToSize(clueLead, remainingWidth);

      doc.text(clueLines[0], margin + prefixOffset, y);

      // Subsequent wrapped lines if any
      if (clueLines.length > 1) {
        for (let l = 1; l < clueLines.length; l++) {
          y += 12.5;
          doc.text(clueLines[l], margin + numWidth + 8, y);
        }
      }
    } else {
      // Very long term, wrap clue to next line
      y += 12.5;
      const wrappedClue = doc.splitTextToSize(`- ${clue}`, contentWidth - numWidth);
      for (let l = 0; l < wrappedClue.length; l++) {
        if (l > 0) y += 12.5;
        doc.text(wrappedClue[l], margin + numWidth, y);
      }
    }

    y += 13.5;

    // Subtle hairline separator every 5 items for easy visual tracking
    if ((idx + 1) % 5 === 0 && idx + 1 < filtered.length) {
      doc.setDrawColor(230, 233, 240);
      doc.line(margin, y - 4, pageWidth - margin, y - 4);
      y += 3.5;
    }
  });

  // Footer page numbers
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 145, 155);
    doc.text(
      `Page ${i} of ${totalPages} • Rapid Recall Reviewer • ${subjTitle}`,
      pageWidth / 2,
      pageHeight - 14,
      { align: 'center' }
    );
  }

  const filenameSubject =
    subjectFilter && subjectFilter !== 'All'
      ? subjectFilter.replace(/\s+/g, '_')
      : 'All_Subjects';
  doc.save(`Rapid_Recall_${filenameSubject}_${new Date().toISOString().slice(0, 10)}.pdf`);
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
