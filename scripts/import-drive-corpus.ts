import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { DRIVE_COPIED_QUESTIONS as existing } from '../src/data/driveQuestions';
import { detectSubject, type FlashcardQuestion, type SubjectCategory } from '../src/services/questionParser';

type Extracted = {
  sourceFileId: string; sourceFileName: string; sourcePath: string;
  sourcePage: number; questionNumber: number; question: string;
  choices: { id: string; text: string }[]; correctChoiceId?: string | null;
  answerEvidence?: string | null; rawSnippet?: string; extractionMode?: string;
};

const root = '/workspace/scratch/6b2c7a88feda';
const read = (file: string) => JSON.parse(fs.readFileSync(file, 'utf8')) as Extracted[];
const readParts = (dir: string) => fs.readdirSync(dir).filter(f => f.endsWith('.json')).flatMap(f => read(path.join(dir, f)));
const vector = read(path.join(root, 'drive-esas-vector.json'));
const raster = readParts(path.join(root, 'drive-esas-raster-parts'));
const force = readParts(path.join(root, 'drive-esas-force-parts'));
const ebook = read(path.join(root, 'drive-esas-ebook.json'));

const preferForce = new Set([
  '1RS-U9oI3B1J3IRHAUxhqN7EvovFwKcDo', // OME 3; broken text layer
  '11MSWGxoBZAiOH8-D1zLCjch-IunCRoEm', // GON 2; broken text order
  '1rmYEpYM4I1ab2MxMF0khfxMEpva_UOtJ', // 1001; fuller OCR sequence
]);
const forceIds = new Set(force.map(q => q.sourceFileId));
const extracted = [
  ...vector.filter(q => !preferForce.has(q.sourceFileId)),
  ...raster.filter(q => !forceIds.has(q.sourceFileId)),
  ...force.filter(q => preferForce.has(q.sourceFileId)),
  ...ebook,
];

const normalize = (value: string) => value.toLowerCase()
  .replace(/[½]/g, '1/2').replace(/[–—]/g, '-').replace(/\bo\b/g, '0')
  .replace(/\b(?:the|a|an|of|to|in|is|are|what|which|following|for|and|on|with|by|that)\b/g, ' ')
  .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
const stemKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
const tokens = (value: string) => new Set(normalize(value).split(' ').filter(t => t.length > 1));
const tokenJaccard = (a: Set<string>, b: Set<string>) => {
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection++;
  return intersection / Math.max(1, a.size + b.size - intersection);
};
const trigrams = (value: string) => {
  const s = `  ${normalize(value)}  `; const result = new Set<string>();
  for (let i = 0; i + 3 <= s.length; i++) result.add(s.slice(i, i + 3));
  return result;
};
const dice = (a: Set<string>, b: Set<string>) => {
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection++;
  return 2 * intersection / Math.max(1, a.size + b.size);
};

const subjects = new Set<SubjectCategory>([
  'Economics', 'Mechanics 1', 'Mechanics 2', 'Strength of Materials',
  'Engineering Materials', 'Fluid Mechanics', 'Thermodynamics', 'EE Laws',
  'Project Management', 'Communication', 'Physics 1', 'Physics 2',
  'Chemistry', 'Computer', 'PEC',
]);

// Keep regeneration idempotent: compare only with the pre-corpus reviewed bank.
const known = existing.filter(q => !q.id.startsWith('esas-corpus-') && subjects.has(q.subject));
const knownTokens = known.map(q => tokens(q.question));
const knownTri = known.map(q => trigrams(q.question));
const inverted = new Map<string, number[]>();
knownTokens.forEach((set, index) => set.forEach(token => {
  const list = inverted.get(token) ?? []; list.push(index); inverted.set(token, list);
}));

function nearest(question: string) {
  const set = tokens(question); const tri = trigrams(question); const candidates = new Set<number>();
  for (const token of set) for (const index of inverted.get(token) ?? []) candidates.add(index);
  let best: { question: FlashcardQuestion; score: number; jaccard: number; dice: number } | undefined;
  for (const index of candidates) {
    const j = tokenJaccard(set, knownTokens[index]);
    if (j < .25) continue;
    const d = dice(tri, knownTri[index]);
    const score = Math.max(j, d * .9);
    if (!best || score > best.score) best = { question: known[index], score, jaccard: j, dice: d };
  }
  return best;
}

function subjectFor(q: Extracted, match?: ReturnType<typeof nearest>): SubjectCategory {
  const title = q.sourceFileName.toLowerCase();
  const text = `${q.question} ${q.choices.map(c => c.text).join(' ')}`.toLowerCase();
  if (title.includes('chemistry')) return 'Chemistry';
  if (title.includes('computer')) return 'Computer';
  if (title.includes('econ')) return 'Economics';
  if (title.includes('fluid')) return 'Fluid Mechanics';
  if (title.includes('thermo')) return 'Thermodynamics';
  if (title.includes('strema')) return 'Strength of Materials';
  if (title.includes('1. physics')) return 'Physics 2';
  const rules: [SubjectCategory, RegExp][] = [
    ['PEC', /\b(?:philippine electrical code|pec|branch circuit|receptacle|raceway|conduit|grounded conductor|grounding electrode|service entrance|overcurrent|ampacity|feeder|wire size|circuit breaker|electrical circuit|electrical system|service drop|luminaires?|cable termination|circuit conductors?)\b/],
    ['EE Laws', /\b(?:ra\s*\d{4,5}|republic act|article\s+[ivx]+|registered electrical engineer|master electrician|prc|board of electrical|code of ethics|epira|anti-obstruction|cpd)\b/],
    ['Project Management', /\b(?:management function|manager|planning|organizing|staffing|directing|controlling|leadership|motivation|authority|pert|cpm|critical path|eoq|inventory|occupational safety|osha|safety|hazard|fire|extinguisher|health and safety|training|organization structure|matrix organization|projectized|policy|procedure|project)\b/],
    ['Strength of Materials', /\b(?:normal stress|shear stress|strain|poisson|young'?s modulus|modulus of rigidity|bulk modulus|beam|torsion|spring|column|bending|flexure|deflection|hooke'?s law|section modulus|moment of inertia|pressure vessel)\b/],
    ['Engineering Materials', /\b(?:microstructure|microscope|twinning|crystal|unit cell|bcc|fcc|grain|corrosion|alloy|steel|cast iron|polymer|ceramic|hardness|ductility|malleability|heat treatment|astm|viscoelastic|material defect|fatigue strength|insulating material)\b/],
    ['Computer', /\b(?:computer|software|hardware|program|programming|database|processor|cpu|memory|register|binary|hexadecimal|fortran|algorithm|operating system|data bus|logic circuit|truth table|cache|byte|bit|firmware|spreadsheet|matlab|randi|blog)\b/],
    ['Chemistry', /\b(?:atom|atomic|element|molecule|electron|proton|neutron|oxidation|reduction|acid|base|chemical bond|compound|periodic table|valence|mole|electrochem|isotope|carbonyl|alkane|alkene|catalyst)\b/],
    ['Thermodynamics', /\b(?:thermodynamic|entropy|enthalpy|refriger|heat engine|carnot|rankine|otto cycle|diesel cycle|brayton|gas turbine|boiler|steam|ideal gas|isobaric|isochoric|isothermal|adiabatic|specific heat|latent heat|zeroth law)\b/],
    ['Fluid Mechanics', /\b(?:fluid|hydraulic|pump|bernoulli|reynolds|viscosity|manometer|piezometer|venturi|orifice|weir|buoyancy|surface tension|cavitation|water hammer|aquifer|flow rate|head loss)\b/],
    ['Economics', /\b(?:interest rate|annuity|depreciation|present worth|future worth|capitalized cost|sinking fund|investment|bond|break even|salvage value|rate of return|economic life|amortization)\b/],
    ['Communication', /\b(?:shannon|hartley|modulation|carrier wave|antenna|transmitter|receiver|signal to noise|bandwidth|baud|telecommunication|amplitude modulation|frequency modulation)\b/],
    ['Physics 2', /\b(?:sound|light|thunder|wavelength|frequency|optical|optics|lens|mirror|refraction|reflection|diffraction|interference|polarization|doppler|electromagnetic|radioactive|blackbody|photon|pendulum|wave speed|sound intensity)\b/],
    ['Mechanics 2', /\b(?:projectile|momentum|impulse|acceleration|kinematics|kinetics|free fall|falling body|gravitational force|coefficient of restitution|angular velocity|centripetal|work done|work energy|kinetic energy|conservation of energy|circular orbit)\b/],
    ['Mechanics 1', /\b(?:statics|equilibrium|truss|resultant force|moment of a force|couple|centroid|friction|free body diagram|support reaction)\b/],
  ];
  for (const [subject, pattern] of rules) if (pattern.test(text)) return subject;
  const detected = detectSubject(q.question, '');
  if (subjects.has(detected)) return detected;
  if (match && match.score >= .25 && subjects.has(match.question.subject)) return match.question.subject;
  return 'Physics 1';
}

function sourceValid(q: Extracted) {
  if (!q.question || q.question.length < 12 || q.question.length > 900) return 'invalid-stem';
  if (!q.correctChoiceId) return 'answer-not-resolved';
  const ids = new Set(q.choices.map(c => c.id));
  if (q.choices.length < 2 || q.choices.length > 5 || ids.size !== q.choices.length) return 'invalid-choices';
  if (q.choices.length < 4) {
    const values = q.choices.map(c => normalize(c.text));
    const trueFalse = q.choices.length === 2 && values.some(v => /\btrue\b/.test(v)) && values.some(v => /\bfalse\b/.test(v));
    if (!trueFalse) return 'incomplete-choices';
  }
  const answer = q.choices.find(c => c.id === q.correctChoiceId)?.text;
  if (!answer || answer.length > 320) return 'invalid-answer';
  if (new Set(q.choices.map(c => normalize(c.text))).size !== q.choices.length) return 'duplicate-choices';
  return null;
}

const sourceDecision = (q: Extracted) => ({
  sourceFileId: q.sourceFileId, sourceFileName: q.sourceFileName, sourcePath: q.sourcePath,
  sourcePage: q.sourcePage, questionNumber: q.questionNumber, sourceQuestion: q.question,
  answerEvidence: q.answerEvidence,
});

const decisions: any[] = [];
const additions: FlashcardQuestion[] = [];
const acceptedTokens = knownTokens.slice();
const acceptedTri = knownTri.slice();
const acceptedQuestions: FlashcardQuestion[] = known.slice();
const seenSource = new Set<string>();
const ordered = extracted.sort((a, b) => Number(Boolean(b.correctChoiceId)) - Number(Boolean(a.correctChoiceId)));

for (const q of ordered) {
  const sourceIdentity = `${q.sourceFileId}:${q.sourcePage}:${q.questionNumber}:${stemKey(q.question)}`;
  if (seenSource.has(sourceIdentity)) continue;
  seenSource.add(sourceIdentity);
  const invalid = sourceValid(q);
  const match = nearest(q.question);
  if (invalid) {
    decisions.push({ status: invalid === 'answer-not-resolved' ? 'withheld' : 'excluded', reason: invalid, ...sourceDecision(q) });
    continue;
  }
  if (match && (match.jaccard >= .66 || match.dice >= .84)) {
    const sourceAnswer = q.choices.find(c => c.id === q.correctChoiceId)?.text;
    const existingAnswer = match.question.choices.find(c => c.id === match.question.correctChoiceId)?.text;
    decisions.push({
      status: 'duplicate', reason: 'same-question-existing-bank', existingQuestionId: match.question.id,
      similarity: Number(match.score.toFixed(3)), sourceAnswer, existingAnswer,
      answerConflict: normalize(sourceAnswer ?? '') !== normalize(existingAnswer ?? ''), ...sourceDecision(q),
    });
    continue;
  }

  // Compare against additions already selected from another Drive copy.
  const qt = tokens(q.question), qtri = trigrams(q.question);
  let duplicate: { index: number; score: number } | undefined;
  for (let i = known.length; i < acceptedQuestions.length; i++) {
    const j = tokenJaccard(qt, acceptedTokens[i]);
    if (j < .45) continue;
    const d = dice(qtri, acceptedTri[i]);
    const score = Math.max(j, d * .9);
    if ((j >= .66 || d >= .84) && (!duplicate || score > duplicate.score)) duplicate = { index: i, score };
  }
  if (duplicate) {
    decisions.push({ status: 'duplicate', reason: 'same-question-drive-copy', existingQuestionId: acceptedQuestions[duplicate.index].id, similarity: Number(duplicate.score.toFixed(3)), ...sourceDecision(q) });
    continue;
  }

  const subject = subjectFor(q, match);
  const safeId = q.sourceFileId.replace(/[^A-Za-z0-9]/g, '').slice(-10);
  const suffix = createHash('sha1').update(stemKey(q.question)).digest('hex').slice(0, 8);
  const id = `esas-corpus-${safeId}-p${q.sourcePage}-q${q.questionNumber}-${suffix}`;
  const answerText = q.choices.find(c => c.id === q.correctChoiceId)!.text;
  const item: FlashcardQuestion = {
    id, subject, sourceFileName: q.sourceFileName, sourceFileId: q.sourceFileId,
    questionNumber: q.questionNumber, question: q.question,
    choices: q.choices, correctChoiceId: q.correctChoiceId!,
    explanation: `The correct answer is ${answerText}.`, rawSnippet: q.rawSnippet,
    classificationStatus: 'classified', classificationConfidence: match ? Math.max(.55, Math.min(.99, match.score)) : .55,
  };
  additions.push(item); acceptedQuestions.push(item); acceptedTokens.push(qt); acceptedTri.push(qtri);
  decisions.push({ status: 'add', appQuestionId: id, subject, ...sourceDecision(q) });
}

const output = `import { FlashcardQuestion } from '../services/questionParser';\n\nexport const DRIVE_CORPUS_QUESTIONS: FlashcardQuestion[] = ${JSON.stringify(additions, null, 2)};\n`;
fs.writeFileSync('src/data/driveCorpusQuestions.ts', output);
const bySubject: Record<string, number> = {};
for (const question of additions) bySubject[question.subject] = (bySubject[question.subject] ?? 0) + 1;
const manifest = {
  generatedAt: new Date().toISOString(), sourceFolderId: '1QuOW-WCYJ-kdQXTLGrh3V_OHTq3awb3d',
  sourceFilesScanned: new Set(extracted.map(q => q.sourceFileId)).size,
  extractedRecords: extracted.length, distinctSourceRecords: seenSource.size,
  added: additions.length, duplicateExisting: decisions.filter(d => d.reason === 'same-question-existing-bank').length,
  duplicateDrive: decisions.filter(d => d.reason === 'same-question-drive-copy').length,
  withheld: decisions.filter(d => d.status === 'withheld').length,
  excluded: decisions.filter(d => d.status === 'excluded').length,
  answerConflictsPreservingReviewedBank: decisions.filter(d => d.answerConflict).length,
  bySubject: Object.fromEntries(Object.entries(bySubject).sort()),
  decisions,
};
fs.writeFileSync('docs/drive-corpus-import.json', JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({ ...manifest, decisions: undefined }, null, 2));
