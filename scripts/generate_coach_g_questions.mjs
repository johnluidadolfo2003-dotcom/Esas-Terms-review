import fs from 'fs';

const rawQs = JSON.parse(fs.readFileSync('scripts/parsed_coach_g_perfect.json'));

const formattedQuestions = rawQs.map(q => {
  const globalQNum = (q.setNum - 1) * 100 + q.qNum;
  const id = `coachg-s${q.setNum}-q${q.qNum}`;

  const choices = q.choices.map(c => ({ id: c.id, text: c.text }));

  // Fix the 4 minor PDF duplicate typos so every question has distinct choices:
  // S7 Q63: stainless steel rod grounding electrode. A. 12, B. 16 (correct), C. 12 (typo in PDF), D. 10
  if (q.setNum === 7 && q.qNum === 63) {
    const cChoice = choices.find(c => c.id === 'C');
    if (cChoice && cChoice.text === '12') cChoice.text = '12.5';
  }

  // S8 Q12: loop-the-loop track height. Vertical fractions: A. h = 1/2 r, B. h = 5/2 r (correct), C. h = r, D. h = 2 r
  if (q.setNum === 8 && q.qNum === 12) {
    choices[0].text = 'h = 1/2 r';
    choices[1].text = 'h = 5/2 r';
    choices[2].text = 'h = r';
    choices[3].text = 'h = 2 r';
  }

  // S9 Q9: motor compressor overload relay trip rating. A. 115, B. 125 (correct), C. 130, D. 115 (typo in PDF for 140)
  if (q.setNum === 9 && q.qNum === 9) {
    const dChoice = choices.find(c => c.id === 'D');
    if (dChoice && dChoice.text === '115') dChoice.text = '140';
  }

  // S9 Q22: prefix tera. A. 10^12 (correct), B. 10^5, C. 10^-12, D. 10
  if (q.setNum === 9 && q.qNum === 22) {
    const aChoice = choices.find(c => c.id === 'A');
    const cChoice = choices.find(c => c.id === 'C');
    if (aChoice) aChoice.text = '10^12';
    if (cChoice) cChoice.text = '10^-12';
    const bChoice = choices.find(c => c.id === 'B');
    if (bChoice && bChoice.text === '105') bChoice.text = '10^5';
  }

  return {
    id,
    subject: 'COACH G 1000 TERMS',
    sourceFileName: 'COACH_G_1000_TERMS_54292455.pdf',
    questionNumber: globalQNum,
    question: q.stem,
    choices,
    correctChoiceId: q.correctChoiceId,
  };
});

console.log(`Formatted ${formattedQuestions.length} questions.`);

// Verify all 1000 questions
for (let i = 0; i < formattedQuestions.length; i++) {
  const q = formattedQuestions[i];
  if (!q.id) throw new Error(`Missing ID at index ${i}`);
  if (q.subject !== 'COACH G 1000 TERMS') throw new Error(`Wrong subject at index ${i}`);
  if (!q.question.trim()) throw new Error(`Empty question at index ${i}: ${q.id}`);
  if (q.choices.length !== 4) throw new Error(`Choices not 4 at index ${i}: ${q.id}`);
  if (!['A', 'B', 'C', 'D'].includes(q.correctChoiceId)) throw new Error(`Invalid answer at index ${i}: ${q.id}`);
  const setTexts = new Set(q.choices.map(c => c.text.toLowerCase().trim()));
  if (setTexts.size !== 4) throw new Error(`Duplicate choices at ${q.id}: ${q.choices.map(c => c.text).join(', ')}`);
}

const fileHeader = `import { FlashcardQuestion } from '../services/questionParser';\n\nexport const COACH_G_1000_QUESTIONS: FlashcardQuestion[] = `;
const tsContent = fileHeader + JSON.stringify(formattedQuestions, null, 2) + ';\n';

fs.writeFileSync('src/data/coachG1000Questions.ts', tsContent);
console.log(`Written src/data/coachG1000Questions.ts (${(tsContent.length / 1024).toFixed(1)} KB)`);
