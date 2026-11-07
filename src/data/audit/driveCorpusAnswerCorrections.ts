import type { FlashcardQuestion } from '../../services/questionParser';

/** Independently checked corrections to obvious source-key errors in the Drive corpus. */
const corrections: Record<string, { correctChoiceId: string; subject: FlashcardQuestion['subject']; explanation: string }> = {
  'esas-corpus-UEEIgqDgBB-p10-q65-1aaed7f7': { correctChoiceId: 'C', subject: 'Project Management', explanation: 'Class C fires involve energized electrical equipment; Class A applies to ordinary combustibles.' },
  'esas-corpus-UEEIgqDgBB-p10-q67-31f67ade': { correctChoiceId: 'B', subject: 'Project Management', explanation: 'Class B fires involve flammable liquids and gases; Class A is for ordinary combustibles.' },
  'esas-corpus-UEEIgqDgBB-p10-q68-351d142c': { correctChoiceId: 'D', subject: 'Project Management', explanation: 'Class K is for cooking oils and fats. The source extraction also appended question 69 to choice D, so this item must be withheld until its choices are repaired.' },
};

export function auditDriveCorpusAnswers(questions: FlashcardQuestion[]): FlashcardQuestion[] {
  return questions.map(q => {
    const correction = corrections[q.id];
    if (!correction) return q;
    if (q.id === 'esas-corpus-UEEIgqDgBB-p10-q68-351d142c') return { ...q, subject: 'Needs Subject Review', classificationStatus: 'needs-review', explanation: correction.explanation };
    return { ...q, ...correction, rawSnippet: [q.question, ...q.choices.map(c => `${c.id}. ${c.text}`), `Answer: ${correction.correctChoiceId}`].join('\n') };
  });
}
