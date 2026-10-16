import type { FlashcardQuestion } from '../../services/questionParser';
import auditData from './esasContentAudit.json';

type ContentAudit = {
  scope: string[];
  patches: Record<string, { updates: Partial<FlashcardQuestion>; reason: string }>;
  excluded: Record<string, string>;
  additions: FlashcardQuestion[];
};

const audit = auditData as ContentAudit;

/** Apply reviewed corrections before App.tsx merges/deduplicates the bank. */
export function applyKnownContentCorrections(original: FlashcardQuestion[]): FlashcardQuestion[] {
  return original.flatMap(question => {
    if (Object.hasOwn(audit.excluded, question.id)) return [];
    const patch = audit.patches[question.id];
    if (!patch) return [question];
    const corrected = { ...question, ...patch.updates };
    // Exports/imports must not resurrect the old choices or answer from raw text.
    corrected.rawSnippet = [
      corrected.question,
      ...corrected.choices.map(choice => `${choice.id}. ${choice.text}`),
      `Answer: ${corrected.correctChoiceId}`,
    ].join('\n');
    return [corrected];
  });
}

export function applyContentAudit(original: FlashcardQuestion[]): FlashcardQuestion[] {
  return applyKnownContentCorrections(original).concat(audit.additions);
}
