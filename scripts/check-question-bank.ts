import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DRIVE_COPIED_QUESTIONS as bank, ORIGINAL_DRIVE_QUESTIONS as original } from '../src/data/driveQuestions';
import audit from '../src/data/audit/esasContentAudit.json';
import review from '../docs/esas-drive-review.json';
import { applyKnownContentCorrections } from '../src/data/audit/applyContentAudit';

const key = (q: typeof bank[number]) => `${q.subject}_${q.question.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim()}`;
const answer = (id: string) => {
  const q = bank.find(q => q.id === id);
  assert.ok(q, `Missing question ${id}`);
  return q.choices.find(c => c.id === q.correctChoiceId)!.text;
};

test('every playable question has one existing answer, distinct options and a unique ID', () => {
  assert.equal(new Set(bank.map(q => q.id)).size, bank.length);
  for (const q of bank) {
    assert.ok(q.question.trim(), q.id);
    assert.ok(q.choices.length >= 2, q.id);
    assert.equal(q.choices.filter(c => c.id === q.correctChoiceId).length, 1, q.id);
    assert.equal(new Set(q.choices.map(c => c.id)).size, q.choices.length, q.id);
    assert.equal(new Set(q.choices.map(c => c.text.toLowerCase().trim())).size, q.choices.length, q.id);
  }
});

test('only the nine authorized subjects change; existing unrelated records remain identical', () => {
  const scope = new Set(audit.scope);
  assert.equal(scope.size, 9);
  assert.deepEqual(bank.filter(q => !scope.has(q.subject)), original.filter(q => !scope.has(q.subject)));
  assert.ok(audit.additions.every(q => scope.has(q.subject)));
  assert.deepEqual(new Set(bank.map(q => q.subject)), new Set(original.map(q => q.subject)));
});

test('reviewed subjects have no duplicate normalized stems or withheld IDs', () => {
  const scoped = bank.filter(q => audit.scope.includes(q.subject));
  assert.equal(new Set(scoped.map(key)).size, scoped.length);
  for (const id of Object.keys(audit.excluded)) assert.ok(!bank.some(q => q.id === id), id);
  for (const [id, patch] of Object.entries(audit.patches)) {
    const actual = bank.find(q => q.id === id)!;
    assert.ok(actual, id);
    for (const [field, value] of Object.entries(patch.updates)) assert.deepEqual(actual[field as keyof typeof actual], value, `${id}.${field}`);
    assert.ok(actual.rawSnippet?.includes(`Answer: ${actual.correctChoiceId}`));
    assert.ok(actual.rawSnippet?.startsWith(actual.question));
  }
});

test('every distinct Drive stem is accounted for, with source provenance on each addition', () => {
  assert.equal(review.sourceDecisions.length, review.distinctSourceStems);
  assert.equal(review.sourceDecisions.filter(q => q.status === 'add').length, audit.additions.length);
  for (const q of audit.additions) {
    assert.ok(q.sourceFileId && q.sourceFileName && q.questionNumber);
    assert.ok(q.explanation);
    assert.ok(review.sourceDecisions.some(d => 'appQuestionId' in d && d.appQuestionId === q.id));
  }
});

test('high-risk corrections retain the reviewed answer and code conditions', () => {
  assert.equal(answer('pec-44'), '6.0 mm');
  assert.equal(answer('pec-261'), '135%');
  assert.equal(answer('pec-91'), '1800 mm');
  assert.equal(answer('pec-195'), '75 mm');
  assert.match(bank.find(q => q.id === 'pec-235')!.question, /2017/);
  assert.match(answer('pec-235'), /No general42\/48limit/);
  for (const id of ['pec-37', 'pec-55', 'pec-293']) assert.ok(!bank.some(q => q.id === id));
});

test('cached known IDs are corrected/excluded without adding the built-in bank to custom storage', () => {
  const old = original.find(q => q.id === 'pec-44')!;
  const withheld = original.find(q => q.id === 'pec-293')!;
  const custom = { ...old, id: 'unrelated-user-authored-question' };
  const fixed = applyKnownContentCorrections([old, withheld, custom]);
  assert.equal(fixed.length, 2);
  assert.equal(fixed[0].correctChoiceId, 'C');
  assert.deepEqual(fixed[1], custom);
  assert.deepEqual(applyKnownContentCorrections([]), []);
});

test('new numerical items agree with independently calculated results', () => {
  const byFragment = (fragment: string) => {
    const q = audit.additions.find(q => q.question.includes(fragment));
    assert.ok(q, fragment);
    return answer(q.id);
  };
  assert.equal(byFragment('advertising 9.5 percent'), 'Quarterly');
  assert.equal(Math.round(((1 + .095 / 4) ** 4 - 1) * 10000) / 100, 9.84);
  assert.equal(Number.parseFloat(byFragment('eight receptacle yokes')), Number((8 * 180 / 220).toFixed(2)));
  assert.equal(Number.parseFloat(byFragment('Two continuous-duty motors')), 1.25 * 10 + 8);
  assert.equal(Number.parseFloat(byFragment('One thermochemical calorie')), 4.184);
  assert.equal(Number.parseFloat(byFragment('1 kwhr')), 1000 * 3600 / 1000);
});
