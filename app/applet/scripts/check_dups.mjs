import { COACH_G_1000_QUESTIONS } from '../src/data/coachG1000Questions';

const seenTexts = new Set();
const duplicates = [];

const normalizeQuestionText = (q) =>
  `${q.subject || 'All'}_${q.question.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim()}`;

for (const q of COACH_G_1000_QUESTIONS) {
  const norm = normalizeQuestionText(q);
  if (seenTexts.has(norm)) {
    duplicates.push({ id: q.id, question: q.question });
  } else {
    seenTexts.add(norm);
  }
}

console.log('Total COACH G questions:', COACH_G_1000_QUESTIONS.length);
console.log('Unique normalized texts:', seenTexts.size);
console.log('Duplicates found:', duplicates.length);
if (duplicates.length > 0) {
  console.log(duplicates);
}
