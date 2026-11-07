import assert from 'node:assert/strict';
import { test } from 'node:test';
import manifest from '../docs/drive-corpus-import.json';
import { DRIVE_CORPUS_QUESTIONS as corpus } from '../src/data/driveCorpusQuestions';
import { DRIVE_COPIED_QUESTIONS as bank } from '../src/data/driveQuestions';

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

test('Drive corpus manifest accounts for every distinct extracted source record', () => {
  assert.equal(manifest.decisions.length, manifest.distinctSourceRecords);
  assert.equal(manifest.added, corpus.length);
  assert.equal(manifest.added, 956);
  assert.equal(manifest.duplicateExisting + manifest.duplicateDrive + manifest.withheld + manifest.excluded + manifest.added, manifest.distinctSourceRecords);
});

test('every added Drive question is playable, classified and traceable', () => {
  assert.equal(new Set(corpus.map(q => q.id)).size, corpus.length);
  assert.equal(new Set(corpus.map(q => normalize(q.question))).size, corpus.length);
  for (const question of corpus) {
    assert.ok(question.sourceFileId, question.id);
    assert.ok(question.sourceFileName, question.id);
    assert.ok(question.questionNumber, question.id);
    assert.equal(question.classificationStatus, 'classified', question.id);
    assert.ok(question.subject !== 'Needs Subject Review', question.id);
    assert.ok(question.choices.length === 4 || question.choices.length === 5 ||
      (question.choices.length === 2 && question.choices.some(c => /true/i.test(c.text)) && question.choices.some(c => /false/i.test(c.text))), question.id);
    assert.equal(question.choices.filter(c => c.id === question.correctChoiceId).length, 1, question.id);
  }
});

test('manifest additions map one-to-one to the integrated question bank', () => {
  const ids = new Set(corpus.map(q => q.id));
  const added = manifest.decisions.filter(d => d.status === 'add');
  assert.equal(added.length, corpus.length);
  for (const decision of added) assert.ok(decision.appQuestionId && ids.has(decision.appQuestionId), decision.appQuestionId);
  for (const question of corpus) assert.ok(bank.some(q => q.id === question.id), question.id);
});

test('conflicting source keys never overwrite the previously reviewed bank', () => {
  const conflicts = manifest.decisions.filter(d => d.answerConflict);
  assert.equal(conflicts.length, manifest.answerConflictsPreservingReviewedBank);
  assert.ok(conflicts.every(d => d.status === 'duplicate' && d.existingQuestionId));
  for (const decision of conflicts) assert.ok(bank.some(q => q.id === decision.existingQuestionId), decision.existingQuestionId);
});
