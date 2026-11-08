import fs from 'fs';
import { COACH_G_1000_QUESTIONS } from '../src/data/coachG1000Questions.ts';

function cleanOcrSpacing(text) {
  if (!text) return '';
  let s = text;
  
  const fixes = [
    [/mater\s+i\s+al/gi, 'material'],
    [/mater\s+i\s+als/gi, 'materials'],
    [/insul\s+a\s+tion/gi, 'insulation'],
    [/instal\s+l/gi, 'install'],
    [/repla\s+c/gi, 'replac'],
    [/fa\s+i\s+l/gi, 'fail'],
    [/qu\s+i\s+c\s+k/gi, 'quick'],
    [/per\s+i\s+od/gi, 'period'],
    [/per\s+i\s+ods/gi, 'periods'],
    [/c\s+r\s+y\s+s\s+t\s+al/gi, 'crystal'],
    [/o\s+rig\s+i\s+na\s+l/gi, 'original'],
    [/rig\s+i\s+na\s+ly/gi, 'originally'],
    [/teles\s+c\s+o\s+p\s+e/gi, 'telescope'],
    [/c\s+o\s+m\s+p\s+u\s+t\s+e\s+r/gi, 'computer'],
    [/soft\s+w\s+a\s+r\s+e/gi, 'software'],
    [/net\s+wo\s+r\s+k/gi, 'network'],
    [/de\s+bug\s+gi\s+ng/gi, 'debugging'],
    [/e\s+lec\s+t\s+r\s+i\s+c\s+al/gi, 'electrical'],
    [/con\s+duc\s+t\s+or/gi, 'conductor'],
    [/res\s+is\s+t\s+an\s+ce/gi, 'resistance'],
    [/vol\s+t\s+ag\s+e/gi, 'voltage'],
    [/cur\s+r\s+en\s+t/gi, 'current'],
    [/en\s+er\s+gy/gi, 'energy'],
    [/pow\s+er/gi, 'power'],
    [/ther\s+mo\s+dy\s+nam\s+ics/gi, 'thermodynamics'],
    [/pres\s+s\s+ur\s+e/gi, 'pressure'],
    [/tem\s+per\s+a\s+t\s+ur\s+e/gi, 'temperature'],
    [/vol\s+um\s+e/gi, 'volume'],
    [/den\s+si\s+ty/gi, 'density'],
    [/vis\s+cos\s+i\s+ty/gi, 'viscosity'],
    [/stres\s+s/gi, 'stress'],
    [/stra\s+in/gi, 'strain'],
    [/mod\s+u\s+lu\s+s/gi, 'modulus'],
    [/elas\s+tic\s+i\s+ty/gi, 'elasticity'],
    [/de\s+for\s+ma\s+ti\s+on/gi, 'deformation'],
    [/an\s+nu\s+i\s+ty/gi, 'annuity'],
    [/in\s+ter\s+es\s+t/gi, 'interest'],
    [/dep\s+re\s+ci\s+a\s+ti\s+on/gi, 'depreciation'],
    [/cap\s+i\s+tal/gi, 'capital'],
    [/rece\s+i\s+pt/gi, 'receipt'],
    [/dis\s+burse\s+men\s+t/gi, 'disbursement'],
  ];

  for (const [regex, replacement] of fixes) {
    s = s.replace(regex, replacement);
  }

  return s.replace(/\s+/g, ' ').trim();
}

const cleaned = COACH_G_1000_QUESTIONS.map(q => {
  const qClean = cleanOcrSpacing(q.question);
  const choicesClean = q.choices.map(c => ({
    id: c.id,
    text: cleanOcrSpacing(c.text)
  }));
  return {
    ...q,
    question: qClean,
    choices: choicesClean
  };
});

for (const q of cleaned) {
  if (!q.id || !q.question || q.choices.length !== 4 || !['A','B','C','D'].includes(q.correctChoiceId)) {
    throw new Error(`Invalid question: ${JSON.stringify(q)}`);
  }
}

const tsContent = `import { FlashcardQuestion } from '../services/questionParser';\n\nexport const COACH_G_1000_QUESTIONS: FlashcardQuestion[] = ${JSON.stringify(cleaned, null, 2)};\n`;
fs.writeFileSync('src/data/coachG1000Questions.ts', tsContent);
console.log('Successfully cleaned and saved COACH G 1000 questions!');
