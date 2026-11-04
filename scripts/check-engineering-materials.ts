import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ENGINEERING_MATERIALS_QUESTIONS as materials } from '../src/data/engineeringMaterialsQuestions';
import { DRIVE_COPIED_QUESTIONS as bank } from '../src/data/driveQuestions';
import { detectSubject, ESAS_SUB_SUBJECTS, getParentCategory, parseQuestionsFromText } from '../src/services/questionParser';
import manifest from '../docs/engineering-materials-import.json';

const answer = (id: string) => {
  const q = materials.find(q => q.id === id);
  assert.ok(q, id);
  return q.choices.find(c => c.id === q.correctChoiceId)!.text;
};
const stem = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();

test('all 150 quiz and 50 Materials PDF occurrences map to a playable reviewed question', () => {
  assert.equal(manifest.sourceDecisions.length, 200);
  assert.equal(manifest.sourceDecisions.filter(d => d.source === 'quiz').length, 150);
  assert.equal(manifest.sourceDecisions.filter(d => d.source === 'discussion').length, 50);
  assert.equal(materials.length, manifest.uniqueQuestions);
  for (const source of ['quiz', 'discussion']) {
    const numbers = manifest.sourceDecisions.filter(d => d.source === source).map(d => d.sourceQuestionNumber).sort((a, b) => a - b);
    assert.deepEqual(numbers, Array.from({ length: source === 'quiz' ? 150 : 50 }, (_, i) => i + 1));
  }
  for (const entry of manifest.sourceDecisions) assert.ok(materials.some(q => q.id === entry.appQuestionId), entry.appQuestionId);
  assert.ok(manifest.sourceDecisions.filter(d => d.source === 'discussion').every(d => 'sourcePage' in d && typeof d.sourcePage === 'number' && [2, 3, 4].includes(d.sourcePage)));
});

test('every Materials item survives app deduplication and has valid distinct choices and a matching raw key', () => {
  assert.equal(new Set(materials.map(q => q.id)).size, materials.length);
  assert.equal(new Set(materials.map(q => stem(q.question))).size, materials.length);
  for (const q of materials) {
    assert.equal(q.subject, 'Engineering Materials');
    assert.equal(q.choices.length, 4, q.id);
    assert.equal(q.choices.filter(c => c.id === q.correctChoiceId).length, 1, q.id);
    assert.equal(new Set(q.choices.map(c => c.id)).size, 4, q.id);
    assert.equal(new Set(q.choices.map(c => c.text.toLowerCase().trim())).size, 4, q.id);
    assert.ok(q.sourceFileId && q.sourceFileName && q.questionNumber && q.explanation, q.id);
    assert.equal(bank.filter(item => item.id === q.id).length, 1, q.id);
    assert.ok(q.rawSnippet!.startsWith(q.question), q.id);
    assert.ok(q.rawSnippet!.endsWith(`Answer: ${q.correctChoiceId}`), q.id);
  }
  for (const letter of ['A', 'B', 'C', 'D']) assert.ok(materials.filter(q => q.correctChoiceId === letter).length > 30);
});

test('Materials is an ESAS subject and explicit titles override overlapping heat/stress keywords', () => {
  assert.equal(ESAS_SUB_SUBJECTS.filter(s => s === 'Engineering Materials').length, 1);
  assert.equal(getParentCategory('Engineering Materials'), 'ESAS');
  assert.equal(detectSubject('stress, heat, Poisson ratio', 'ESAS - Engineering Materials.quiz'), 'Engineering Materials');
  assert.equal(detectSubject('ENGINEERING MATERIALS', 'reviewer.txt'), 'Engineering Materials');
  assert.equal(detectSubject('', 'Strength of Materials.pdf'), 'Strength of Materials');
  const parsed = parseQuestionsFromText('Subject: Engineering Materials\n1. Wire drawing describes which property?\nA. Ductility\nB. Hardness\nC. Stiffness\nD. Brittleness\nAnswer: A', 'reviewer.txt', 'test-materials');
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].subject, 'Engineering Materials');
  assert.equal(parsed[0].choices.find(c => c.id === parsed[0].correctChoiceId)!.text, 'Ductility');
});

test('high-risk source keys and false premises use the reviewed corrections', () => {
  assert.match(answer('engineering-materials-quiz-095'), /ductility/i);
  assert.equal(answer('engineering-materials-quiz-085'), 'Annealing');
  assert.equal(answer('engineering-materials-quiz-119'), 'Proportional limit');
  assert.equal(answer('engineering-materials-quiz-122'), 'Bismuth');
  assert.match(answer('engineering-materials-quiz-092'), /lead/i);
  assert.match(materials.find(q => q.id === 'engineering-materials-quiz-092')!.question, /machinability/);
  assert.match(materials.find(q => q.id === 'engineering-materials-quiz-083')!.question, /tempered martensite/);
  assert.equal(answer('engineering-materials-quiz-146'), '4');
  assert.match(materials.find(q => q.id === 'engineering-materials-quiz-146')!.question, /silicon and germanium/i);
});
