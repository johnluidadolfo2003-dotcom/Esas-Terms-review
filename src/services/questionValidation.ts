import type { FlashcardQuestion } from './questionParser';
const subjects = new Set(['Economics', 'Mechanics 1', 'Mechanics 2', 'EE Laws', 'Project Management', 'Communication', 'General Engineering']);
export function isQuestionBank(value: unknown): value is FlashcardQuestion[] {
  if (!Array.isArray(value) || value.length > 10000) return false;
  const ids = new Set<string>();
  return value.every((q) => {
    if (!q || typeof q.id !== 'string' || !q.id || ids.has(q.id) || !subjects.has(q.subject) || typeof q.question !== 'string' || !q.question.trim() || typeof q.correctChoiceId !== 'string' || !Array.isArray(q.choices) || q.choices.length < 2 || q.choices.length > 26) return false;
    ids.add(q.id);
    const choiceIds = new Set();
    return q.choices.every((c: any) => {
      if (!c || typeof c.id !== 'string' || !c.id || choiceIds.has(c.id) || typeof c.text !== 'string' || !c.text.trim()) return false;
      choiceIds.add(c.id); return true;
    }) && choiceIds.has(q.correctChoiceId);
  });
}
