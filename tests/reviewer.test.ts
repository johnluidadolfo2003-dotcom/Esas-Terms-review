import test from 'node:test';
import assert from 'node:assert/strict';
import { DRIVE_COPIED_QUESTIONS } from '../src/data/driveQuestions';
import { shuffleQuestionChoices, parseQuestionsFromText } from '../src/services/questionParser';
import { generate70ItemQuiz } from '../src/services/quizService';
import { isQuestionBank } from '../src/services/questionValidation';
const memory = new Map<string, string>();
Object.assign(globalThis, { localStorage: { getItem: (key: string) => memory.get(key) || null, setItem: (key: string, value: string) => memory.set(key, value) } });
test('built-in bank is valid and has no normalized duplicates', () => {
  assert.equal(DRIVE_COPIED_QUESTIONS.length, 986);
  assert.ok(isQuestionBank(DRIVE_COPIED_QUESTIONS));
  const normalized = DRIVE_COPIED_QUESTIONS.map(q => q.question.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim());
  assert.equal(new Set(normalized).size, normalized.length);
});
test('shuffled quiz scores the displayed correct answer against the same stable bank', () => {
  memory.clear();
  const generated = generate70ItemQuiz(DRIVE_COPIED_QUESTIONS).quizQuestions;
  assert.equal(generated.length, 70);
  const stored = generated.map(q => shuffleQuestionChoices(q, true, 42));
  assert.ok(stored.some((q, i) => q.correctChoiceId !== generated[i].correctChoiceId));
  const answers = Object.fromEntries(stored.map(q => [q.id, q.correctChoiceId]));
  assert.equal(stored.filter(q => answers[q.id] === q.correctChoiceId).length, 70);
  stored.forEach((q,i) => assert.equal(q.choices.find(c=>c.id===q.correctChoiceId)?.text, generated[i].choices.find(c=>c.id===generated[i].correctChoiceId)?.text));
});
test('quiz cycles include all remaining unused questions before recycling', () => {
  memory.clear();
  const pool = DRIVE_COPIED_QUESTIONS.filter(q => q.subject === 'Mechanics 2').slice(0, 7);
  const first = generate70ItemQuiz(pool).quizQuestions;
  const second = generate70ItemQuiz(pool).quizQuestions;
  const seen = new Set([...first, ...second].map(q=>q.id));
  assert.equal(first.length,5); assert.equal(second.length,5); assert.equal(seen.size,7);
  assert.equal(new Set(second.map(q=>q.id)).size,5);
});
test('imports never invent a correct answer when an answer key is absent', () => {
  assert.equal(parseQuestionsFromText('1. Sample question?\nA. First\nB. Second', 'notes.txt', 'x').length,0);
  const parsed = parseQuestionsFromText('1. Sample question?\nA. First\nB. Second\nAnswer: B', 'notes.txt', 'x')[0];
  assert.equal(parsed.choices.find(c => c.id === parsed.correctChoiceId)?.text, 'Second');
});
test('API rejects invalid answer letters, duplicate IDs and malformed choices', () => {
  const q=DRIVE_COPIED_QUESTIONS[0];
  assert.equal(isQuestionBank([{...q,correctChoiceId:'Z'}]),false);
  assert.equal(isQuestionBank([q,q]),false);
  assert.equal(isQuestionBank([{...q,choices:[null,null]}]),false);
  assert.equal(isQuestionBank([]),true);
});

test('exported CSV header and multiline cells import as questions rather than item numbers', () => {
  const csv = 'Subject,Item #,Question Text,Choice A,Choice B,Choice C,Choice D,Correct Choice Letter\nEconomics,1,"Line one\nLine two",First,Second,Third,Fourth,B';
  const parsed = parseQuestionsFromText(csv, 'bank.csv', 'csv-test');
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].question, 'Line one\nLine two');
  assert.equal(parsed[0].choices.find(c => c.id === parsed[0].correctChoiceId)?.text, 'Second');
});
