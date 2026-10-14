export type SubjectCategory =
  | 'ESAS'
  | 'Economics'
  | 'Mechanics 1'
  | 'Mechanics 2'
  | 'EE Laws'
  | 'Project Management'
  | 'Communication'
  | 'General Engineering'
  | 'MATH'
  | 'EE';

export const ESAS_SUB_SUBJECTS: SubjectCategory[] = [
  'Economics',
  'Mechanics 1',
  'Mechanics 2',
  'EE Laws',
  'Project Management',
  'Communication',
];

export interface Choice {
  id: string; // 'A', 'B', 'C', 'D', etc.
  text: string;
}

export interface FlashcardQuestion {
  id: string;
  subject: SubjectCategory;
  sourceFileName: string;
  sourceFileId?: string;
  questionNumber?: number;
  question: string;
  choices: Choice[];
  correctChoiceId: string; // 'A', 'B', etc.
  explanation?: string;
  rawSnippet?: string;
}

/**
 * Determine subject from text or file name
 */
export function detectSubject(text: string, fileName: string): SubjectCategory {
  const combined = `${fileName} ${text}`.toLowerCase();

  if (
    combined.includes('ee law') ||
    combined.includes('ra 7920') ||
    combined.includes('r.a. 7920') ||
    combined.includes('republic act 7920') ||
    combined.includes('electrical engineering law') ||
    combined.includes('ra 11361') ||
    combined.includes('r.a. 11361') ||
    combined.includes('anti-obstruction') ||
    combined.includes('power line corridor') ||
    combined.includes('ra 11285') ||
    combined.includes('r.a. 11285') ||
    combined.includes('energy efficiency') ||
    combined.includes('ra 11371') ||
    combined.includes('r.a. 11371') ||
    combined.includes('murang kuryente') ||
    combined.includes('ra 9136') ||
    combined.includes('r.a. 9136') ||
    combined.includes('epira') ||
    combined.includes('ra 7832') ||
    combined.includes('r.a. 7832') ||
    combined.includes('anti-pilferage') ||
    combined.includes('pilferage') ||
    combined.includes('ra 10912') ||
    combined.includes('r.a. 10912') ||
    combined.includes('cpd law') ||
    combined.includes('ra 8981') ||
    combined.includes('r.a. 8981') ||
    combined.includes('prc modernization') ||
    combined.includes('philippine electrical code') ||
    combined.includes('pec') ||
    combined.includes('code of ethics')
  ) {
    return 'EE Laws';
  }

  if (
    combined.includes('mechanics 2') ||
    combined.includes('dynamics') ||
    combined.includes('kinematics') ||
    combined.includes('kinetics') ||
    combined.includes('rectilinear') ||
    combined.includes('curvilinear') ||
    combined.includes('momentum')
  ) {
    return 'Mechanics 2';
  }

  if (
    combined.includes('mechanics 1') ||
    combined.includes('statics') ||
    combined.includes('equilibrium') ||
    combined.includes('coplanar') ||
    combined.includes('truss') ||
    combined.includes('moment of inertia') ||
    combined.includes('centroid')
  ) {
    return 'Mechanics 1';
  }

  if (
    combined.includes('project management') ||
    combined.includes('engineering management') ||
    combined.includes('critical path') ||
    combined.includes('pert') ||
    combined.includes('cpm') ||
    combined.includes('gantt') ||
    combined.includes('wbs')
  ) {
    return 'Project Management';
  }

  if (
    combined.includes('communication') ||
    combined.includes('telecommunication') ||
    combined.includes('modulation') ||
    combined.includes('antenna') ||
    combined.includes('bandwidth') ||
    combined.includes('am fm') ||
    combined.includes('transmission line')
  ) {
    return 'Communication';
  }

  if (
    combined.includes('economics') ||
    combined.includes('engineering economics') ||
    combined.includes('interest') ||
    combined.includes('annuity') ||
    combined.includes('depreciation') ||
    combined.includes('sunk cost') ||
    combined.includes('salvage value') ||
    combined.includes('rate of return') ||
    combined.includes('cash flow')
  ) {
    return 'Economics';
  }

  return 'General Engineering';
}

/**
 * Generates an educational explanation providing background context NOT present in the question prompt
 */
export function generateContextualExplanation(
  questionText: string,
  choices: Choice[],
  correctChoiceId: string,
  subject: SubjectCategory,
  rawExplanation?: string
): string {
  const existing = (rawExplanation || '').trim();
  const correctChoiceObj = choices.find(
    (c) => c.id.toUpperCase() === correctChoiceId.toUpperCase()
  );
  const correctText = correctChoiceObj ? correctChoiceObj.text : '';

  const isTrivial =
    !existing ||
    existing.toLowerCase().includes('the correct answer is') ||
    existing.toLowerCase().startsWith('correct answer:') ||
    existing.trim().toLowerCase() === questionText.trim().toLowerCase() ||
    existing.split(' ').length < 5;

  if (!isTrivial) {
    return existing;
  }

  const qLower = questionText.toLowerCase();

  if (
    subject === 'EE Laws' ||
    qLower.includes('7920') ||
    qLower.includes('board') ||
    qLower.includes('prbee') ||
    qLower.includes('pec')
  ) {
    if (qLower.includes('florentino') || qLower.includes('chairman')) {
      return `Engr. Rafael F. Florentino served as PRBEE Chairman during the approval of R.A. 7920's Implementing Rules and Regulations (IRR) and Code of Ethics in 1995.`;
    }
    if (qLower.includes('delinquent') || qLower.includes('fee')) {
      return `Under Art. III Sec. 27 of R.A. 7920, practitioners delinquent in annual registration fees for 5 consecutive years are barred from practicing until reinstatement.`;
    }
    if (qLower.includes('admission') || qLower.includes('days prior')) {
      return `PRC rules require admission notices to be issued at least 10 days before the exam to give examinees sufficient time for verification.`;
    }
    return `Under Philippine electrical regulations and R.A. 7920 standards, "${correctText}" enforces statutory requirements for legal practice and safety compliance.`;
  }

  if (subject === 'Economics' || qLower.includes('cost') || qLower.includes('interest')) {
    if (qLower.includes('annuity')) {
      return `Annuities are uniform payment series. Ordinary annuities occur at end of periods, while annuity due payments occur at period start.`;
    }
    if (qLower.includes('sunk')) {
      return `Sunk costs are historical expenditures that cannot be recovered and must be excluded from prospective decision analyses.`;
    }
    return `In engineering economics, "${correctText}" is used to calculate cash flow equivalence, depreciation, and investment return feasibility.`;
  }

  if (subject.includes('Mechanics') || qLower.includes('force') || qLower.includes('friction')) {
    if (qLower.includes('sled') || qLower.includes('inclined') || qLower.includes('slope')) {
      return `For an object sliding on an incline of angle θ, normal contact force is N = mg cos θ, yielding kinetic friction f = μN = μ mg cos θ.`;
    }
    return `In mechanics, "${correctText}" applies fundamental equilibrium (∑F = 0) and dynamic acceleration equations (F = ma) to solve physical systems.`;
  }

  if (subject === 'Communication' || qLower.includes('signal') || qLower.includes('wave')) {
    return `In communication engineering, "${correctText}" governs signal modulation, spectral bandwidth allocation, and transmission channel capacity.`;
  }

  return `"${correctText}" represents the established technical principle and standardized definition in this domain.`;
}

/**
 * Extracts Answer Key block if present in document
 * e.g.:
 * ANSWER KEY
 * 1. A
 * 2. C
 * 3. B
 */
function extractAnswerKeyMap(text: string): Map<number, string> {
  const map = new Map<number, string>();
  const keyHeaderRegex = /(?:answer\s*keys?|solutions?|key\s*answers?|key\s*:)/i;
  const match = text.search(keyHeaderRegex);

  if (match !== -1) {
    const keySection = text.slice(match);
    // matches "1. A" or "1 - A" or "1: A" or "1) A" or "1 A"
    const entryRegex = /(?:^|\s|\n)(\d{1,4})[\.\s:\-\)]+([A-Da-d])(?:\b|\s|\n|$)/g;
    let entryMatch: RegExpExecArray | null;
    while ((entryMatch = entryRegex.exec(keySection)) !== null) {
      const qNum = parseInt(entryMatch[1], 10);
      const ansLetter = entryMatch[2].toUpperCase();
      if (!map.has(qNum)) {
        map.set(qNum, ansLetter);
      }
    }
  }

  return map;
}

/**
 * Parses raw text from a document into flashcard questions
 */
export function parseQuestionsFromText(
  rawContent: string,
  fileName: string,
  fileId: string,
  explicitSubject?: SubjectCategory
): FlashcardQuestion[] {
  const questions: FlashcardQuestion[] = [];
  const defaultSubject = explicitSubject || detectSubject('', fileName);
  const answerKeyMap = extractAnswerKeyMap(rawContent);

  // Check if content is CSV format
  if (fileName.endsWith('.csv') || rawContent.includes('Question,Choice') || rawContent.includes('Question,A,B,C,D')) {
    const csvQuestions = parseCsvContent(rawContent, fileName, fileId, defaultSubject);
    if (csvQuestions.length > 0) {
      return csvQuestions;
    }
  }

  const lines = rawContent.split(/\r?\n/);
  
  interface RawBlock {
    qNum?: number;
    questionLines: string[];
    choiceLines: { letter: string; text: string; isMarkedCorrect?: boolean }[];
    answerLetter?: string;
    explanationLines: string[];
    currentSubject?: SubjectCategory;
  }

  const blocks: RawBlock[] = [];
  let currentBlock: RawBlock | null = null;
  let activeSectionSubject = defaultSubject;

  // Patterns
  const subjectSectionRegex = /^(?:#+\s*|={3,}\s*|subject:\s*)(economics|mechanics\s*1|mechanics\s*2|ee\s*laws|project\s*management|communication)/i;
  const questionStartRegex = /^(?:(?:Q|Question|Item)\s*(\d+)[\.:\)]?|(\d{1,4})[\.\)]\s+)(.*)$/i;
  // Flexible choice pattern: allows bullet, asterisk, parentheses, brackets, dot, colon, dash (with or without spaces)
  const choiceRegex = /^[•\*\-\s]*[\(\[]?([A-Ha-h])(?:[\)\]\.\:]|[\s]+[-–—:\.]|[\s]*[\)\]\.\:])\s*(.*)$/i;
  // Flexible answer line: "Answer: A", "Ans: B", "Correct: C", "Answer is D", "KEY: A"
  const answerRegex = /^(?:(?:the\s*)?answer|ans|correct\s*answer|correct|key|solution)[\s\:\-=]+(?:option\s*)?[\(\[]?([A-Ha-h])[\)\]]?(.*)$/i;
  const explanationRegex = /^(?:explanation|rationale|solution|note)[\s\:\-]+(.*)$/i;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      // Empty line can signify end of a question block if it already has choices and answer
      if (currentBlock && currentBlock.choiceLines.length >= 2 && currentBlock.answerLetter) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    // Check if line indicates an explicit subject heading
    const subjMatch = line.match(subjectSectionRegex);
    if (subjMatch) {
      activeSectionSubject = detectSubject(subjMatch[1], fileName);
      continue;
    }

    // Check if new numbered question starts: "1. What is..." or "Question 1: ..."
    const qMatch = line.match(questionStartRegex);
    if (qMatch) {
      if (currentBlock && (currentBlock.questionLines.length > 0 || currentBlock.choiceLines.length > 0)) {
        blocks.push(currentBlock);
      }
      const qNum = parseInt(qMatch[1] || qMatch[2], 10);
      const firstLineText = (qMatch[3] || '').trim();
      currentBlock = {
        qNum: isNaN(qNum) ? undefined : qNum,
        questionLines: firstLineText ? [firstLineText] : [],
        choiceLines: [],
        explanationLines: [],
        currentSubject: explicitSubject || activeSectionSubject,
      };
      continue;
    }

    // Check for Answer line: "Answer: A" or "Ans: B"
    const ansMatch = line.match(answerRegex);
    if (ansMatch && currentBlock) {
      currentBlock.answerLetter = ansMatch[1].toUpperCase();
      if (ansMatch[2] && ansMatch[2].trim().length > 0) {
        currentBlock.explanationLines.push(ansMatch[2].trim());
      }
      continue;
    }

    // Check for Explanation line
    const expMatch = line.match(explanationRegex);
    if (expMatch && currentBlock) {
      currentBlock.explanationLines.push(expMatch[1].trim());
      continue;
    }

    // Check for Choice line: "A. Option", "(A) Option", "A) Option", "*A. Option"
    const choiceMatch = line.match(choiceRegex);
    if (choiceMatch) {
      const letter = choiceMatch[1].toUpperCase();
      let choiceText = choiceMatch[2].trim();
      let isMarkedCorrect = false;

      // If this choice is 'A' and the current block ALREADY has choices, finalize the old block and start new
      if (letter === 'A' && currentBlock && currentBlock.choiceLines.length >= 2) {
        blocks.push(currentBlock);
        currentBlock = null;
      }

      if (!currentBlock) {
        currentBlock = {
          questionLines: ['Question'],
          choiceLines: [],
          explanationLines: [],
          currentSubject: explicitSubject || activeSectionSubject,
        };
      }

      // Check if marked with asterisk or [x] or (correct)
      if (
        rawLine.startsWith('*') ||
        choiceText.endsWith('*') ||
        choiceText.startsWith('*') ||
        choiceText.includes('[x]') ||
        choiceText.includes('(correct)') ||
        choiceText.includes('(Correct)')
      ) {
        isMarkedCorrect = true;
        choiceText = choiceText
          .replace(/^\*/, '')
          .replace(/\*$/, '')
          .replace(/\[x\]/i, '')
          .replace(/\(correct\)/i, '')
          .trim();
      }

      currentBlock.choiceLines.push({
        letter,
        text: choiceText,
        isMarkedCorrect,
      });
      continue;
    }

    // If no block exists yet, start an unnumbered question block with this line
    if (!currentBlock) {
      currentBlock = {
        questionLines: [line],
        choiceLines: [],
        explanationLines: [],
        currentSubject: explicitSubject || activeSectionSubject,
      };
      continue;
    }

    // If block exists and already has choices
    if (currentBlock.choiceLines.length > 0) {
      if (currentBlock.answerLetter) {
        currentBlock.explanationLines.push(line);
      } else {
        // Append continuation to the last choice
        const lastChoice = currentBlock.choiceLines[currentBlock.choiceLines.length - 1];
        lastChoice.text += ' ' + line;
      }
    } else {
      // Append continuation to question text
      currentBlock.questionLines.push(line);
    }
  }

  if (currentBlock && (currentBlock.questionLines.length > 0 || currentBlock.choiceLines.length > 0)) {
    blocks.push(currentBlock);
  }

  // Convert raw blocks into structured flashcards
  blocks.forEach((b, idx) => {
    const questionText = b.questionLines.join(' ').trim();
    if (!questionText || b.choiceLines.length < 2) return;

    // Determine correct answer
    let correctId = b.answerLetter;

    // Check if marked inline
    if (!correctId) {
      const marked = b.choiceLines.find((c) => c.isMarkedCorrect);
      if (marked) {
        correctId = marked.letter;
      }
    }

    // Check in Answer Key Map if available
    if (!correctId && b.qNum && answerKeyMap.has(b.qNum)) {
      correctId = answerKeyMap.get(b.qNum);
    }

    // Fallback: If still not found, check if question number index exists in map
    if (!correctId && answerKeyMap.has(idx + 1)) {
      correctId = answerKeyMap.get(idx + 1);
    }

    // If still no correct answer found, we default to the first choice if indicated, or 'A'
    if (!correctId) {
      correctId = b.choiceLines[0].letter;
    }

    // Build choices ensuring unique letters/IDs across choices in the same question
    const seenLetters = new Set<string>();
    const standardLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const choices: Choice[] = [];

    b.choiceLines.forEach((c, cIdx) => {
      let letter = c.letter.toUpperCase();
      if (seenLetters.has(letter)) {
        const unused = standardLetters.find((l) => !seenLetters.has(l));
        letter = unused || `${letter}_${cIdx + 1}`;
      }
      seenLetters.add(letter);
      choices.push({
        id: letter,
        text: c.text,
      });
    });

    const subject = explicitSubject || b.currentSubject || detectSubject(questionText, fileName);

    let explanationText = b.explanationLines.join(' ').trim();
    if (explanationText.startsWith('.')) {
      explanationText = explanationText.replace(/^\.+\s*/, '').trim();
    }
    if (explanationText.toLowerCase().startsWith('correct answer:')) {
      explanationText = explanationText.replace(/^correct\s+answer:\s*/i, '').trim();
    }

    const finalExplanation = generateContextualExplanation(
      questionText,
      choices,
      correctId,
      subject,
      explanationText
    );

    const qItem: FlashcardQuestion = {
      id: `${fileId}-${b.qNum || idx + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      subject,
      sourceFileName: fileName,
      sourceFileId: fileId,
      questionNumber: b.qNum || idx + 1,
      question: questionText,
      choices,
      correctChoiceId: correctId,
      explanation: finalExplanation,
      rawSnippet: questionText + '\n' + choices.map((c) => `${c.id}. ${c.text}`).join('\n'),
    };

    questions.push(shuffleQuestionChoices(qItem));
  });

  return questions;
}

/**
 * Shuffles choices for a question so that the correct answer is distributed across A, B, C, D
 */
export function shuffleQuestionChoices(
  question: FlashcardQuestion,
  isShuffled: boolean = true,
  shuffleSeed: number = 0
): FlashcardQuestion {
  if (!isShuffled || !question || !question.choices || question.choices.length < 2) return question;

  const cleanExp = question.correctChoiceId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const correctChoiceObj = question.choices.find(
    (c) => c.id.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') === cleanExp
  );
  if (!correctChoiceObj) return question;

  const correctText = correctChoiceObj.text.trim();
  const choiceTexts = question.choices.map((c) => c.text);

  let seed = shuffleSeed;
  for (let i = 0; i < question.id.length; i++) {
    seed += question.id.charCodeAt(i) * (i + 1);
  }

  const shuffledTexts = [...choiceTexts];
  let m = shuffledTexts.length;
  let s = seed || 12345;
  while (m) {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    const i = Math.floor(rnd * m--);
    const t = shuffledTexts[m];
    shuffledTexts[m] = shuffledTexts[i];
    shuffledTexts[i] = t;
  }

  const standardLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const newChoices = shuffledTexts.map((text, i) => ({
    id: standardLetters[i] || `O${i + 1}`,
    text,
  }));

  const newCorrectChoice = newChoices.find(
    (c) => c.text.trim().toLowerCase() === correctText.toLowerCase()
  );
  const newCorrectChoiceId = newCorrectChoice ? newCorrectChoice.id : question.correctChoiceId;

  return {
    ...question,
    choices: newChoices,
    correctChoiceId: newCorrectChoiceId,
  };
}

/**
 * Parses CSV content into FlashcardQuestions
 */
function parseCsvContent(
  csv: string,
  fileName: string,
  fileId: string,
  defaultSubject: SubjectCategory
): FlashcardQuestion[] {
  const questions: FlashcardQuestion[] = [];
  const lines = csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return questions;

  // Simple CSV line splitter that respects quoted strings
  const splitCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuote = !inQuote;
        }
      } else if (ch === ',' && !inQuote) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const qIdx = header.findIndex((h) => h.includes('question') || h.includes('item'));
  const aIdx = header.findIndex((h) => h === 'a' || h.includes('option a') || h.includes('choice a'));
  const bIdx = header.findIndex((h) => h === 'b' || h.includes('option b') || h.includes('choice b'));
  const cIdx = header.findIndex((h) => h === 'c' || h.includes('option c') || h.includes('choice c'));
  const dIdx = header.findIndex((h) => h === 'd' || h.includes('option d') || h.includes('choice d'));
  const ansIdx = header.findIndex((h) => h.includes('answer') || h.includes('key') || h.includes('correct'));
  const subjIdx = header.findIndex((h) => h.includes('subject') || h.includes('category'));

  if (qIdx === -1 || aIdx === -1 || bIdx === -1) {
    return [];
  }

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const questionText = cols[qIdx];
    if (!questionText) continue;

    const choices: Choice[] = [];
    if (cols[aIdx]) choices.push({ id: 'A', text: cols[aIdx] });
    if (cols[bIdx]) choices.push({ id: 'B', text: cols[bIdx] });
    if (cIdx !== -1 && cols[cIdx]) choices.push({ id: 'C', text: cols[cIdx] });
    if (dIdx !== -1 && cols[dIdx]) choices.push({ id: 'D', text: cols[dIdx] });

    if (choices.length < 2) continue;

    let ans = 'A';
    if (ansIdx !== -1 && cols[ansIdx]) {
      const parsedAns = cols[ansIdx].trim().toUpperCase().charAt(0);
      if (['A', 'B', 'C', 'D'].includes(parsedAns)) {
        ans = parsedAns;
      }
    }

    let subj = defaultSubject;
    if (subjIdx !== -1 && cols[subjIdx]) {
      subj = detectSubject(cols[subjIdx], fileName);
    } else {
      subj = detectSubject(questionText, fileName);
    }

    questions.push({
      id: `${fileId}-csv-${i}-${Date.now()}`,
      subject: subj,
      sourceFileName: fileName,
      sourceFileId: fileId,
      questionNumber: i,
      question: questionText,
      choices,
      correctChoiceId: ans,
      rawSnippet: questionText,
    });
  }

  return questions;
}


