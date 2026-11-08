import { FlashcardQuestion, sanitizeFlashcardQuestion } from '../../services/questionParser';
import auditData from './esasContentAudit.json';
import { auditDriveCorpusAnswers } from './driveCorpusAnswerCorrections';
import { LEGACY_1001_SUBJECT_ASSIGNMENTS } from '../legacy1001SubjectAssignments';

type ContentAudit = {
  scope: string[];
  patches: Record<string, { updates: Partial<FlashcardQuestion>; reason: string }>;
  excluded: Record<string, string>;
  additions: FlashcardQuestion[];
};

const audit = auditData as ContentAudit;

function classifyLegacy1001Question(rawQuestion: FlashcardQuestion): FlashcardQuestion {
  const question = sanitizeFlashcardQuestion(rawQuestion);
  const assignment = LEGACY_1001_SUBJECT_ASSIGNMENTS[question.id];
  if (!assignment) return question;

  const normalizedChoiceTexts = question.choices.map(choice => choice.text.trim().toLowerCase());
  const hasContentIssue =
    !question.choices.some(choice => choice.id === question.correctChoiceId) ||
    new Set(question.choices.map(choice => choice.id)).size !== question.choices.length ||
    new Set(normalizedChoiceTexts).size !== normalizedChoiceTexts.length;
  const needsReview = assignment.needsReview || hasContentIssue;

  return {
    ...question,
    subject: needsReview ? 'Needs Subject Review' : assignment.subject,
    sourceSubject: assignment.sourceSubject as FlashcardQuestion['sourceSubject'],
    classificationStatus: needsReview ? 'needs-review' : 'classified',
    suggestedSubject: assignment.suggestedSubject,
    classificationConfidence: assignment.confidence,
  };
}

/** Apply reviewed corrections before App.tsx merges/deduplicates the bank. */
export function applyKnownContentCorrections(original: FlashcardQuestion[]): FlashcardQuestion[] {
  return original.flatMap(rawQuestion => {
    const question = sanitizeFlashcardQuestion(rawQuestion);
    if (Object.hasOwn(audit.excluded, question.id)) return [];
    const patch = audit.patches[question.id];
    if (!patch) return [classifyLegacy1001Question(question)];
    const corrected = sanitizeFlashcardQuestion({ ...question, ...patch.updates });
    // Exports/imports must not resurrect the old choices or answer from raw text.
    corrected.rawSnippet = [
      corrected.question,
      ...corrected.choices.map(choice => `${choice.id}. ${choice.text}`),
      `Answer: ${corrected.correctChoiceId}`,
    ].join('\n');
    return [classifyLegacy1001Question(corrected)];
  });
}

export function applyContentAudit(original: FlashcardQuestion[]): FlashcardQuestion[] {
  return auditDriveCorpusAnswers(applyKnownContentCorrections(original).concat(audit.additions));
}
