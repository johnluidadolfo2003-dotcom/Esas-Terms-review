import React from 'react';

// Meta/filler words to ignore from fallback keyword matching
const IGNORE_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
  'may', 'might', 'must', 'can', 'could', 'of', 'in', 'to', 'for', 'with',
  'on', 'at', 'by', 'from', 'up', 'about', 'into', 'over', 'after', 'above',
  'below', 'under', 'between', 'and', 'or', 'nor', 'but', 'so', 'yet', 'as',
  'if', 'that', 'this', 'these', 'those', 'which', 'what', 'who', 'whom', 'whose',
  'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same', 'than',
  'too', 'very', 'just', 'also', 'known', 'called', 'used', 'defined', 'types',
  'type', 'kind', 'kinds', 'term', 'terms', 'refers', 'refer', 'means', 'statement',
  'following', 'given', 'select', 'choose', 'option', 'correct', 'value', 'values',
  'amount', 'ratio', 'rate', 'equal', 'total', 'part', 'number', 'system', 'device',
  'circuit', 'unit', 'units', 'find', 'calculate', 'determine', 'problem', 'example',
  'question', 'answers', 'answer', 'one', 'two', 'three', 'four', 'first', 'second',
  'third', 'state', 'states', 'according', 'per', 'due'
]);

// Well-known multi-word engineering, physics, math, and econ concepts
const DOMAIN_MULTIWORD_TERMS = [
  'simultaneous two way mode', 'two way mode of communications', 'two way mode',
  'power factor', 'reactive power', 'apparent power', 'real power', 'active power',
  'induction motor', 'synchronous motor', 'dc generator', 'dc motor', 'step up transformer',
  'step down transformer', 'kirchhoff\'s law', 'kirchhoffs law', 'ohm\'s law', 'ohms law',
  'faraday\'s law', 'lenz\'s law', 'maxwell\'s equations', 'carnot cycle', 'rankine cycle',
  'otto cycle', 'diesel cycle', 'brayton cycle', 'second law', 'first law', 'zeroth law',
  'shear stress', 'tensile stress', 'compressive stress', 'modulus of elasticity',
  'poisson\'s ratio', 'moment of inertia', 'center of gravity', 'fluid friction',
  'bernoulli\'s principle', 'pascal\'s law', 'reynolds number', 'present worth',
  'sinking fund', 'capitalized cost', 'annual cost', 'break-even', 'rate of return',
  'fourier series', 'laplace transform', 'differential equation', 'vector product',
  'dot product', 'electric field', 'magnetic field', 'magnetic flux', 'electromotive force',
  'phase angle', 'resonant frequency', 'skin effect', 'corona effect', 'line voltage',
  'phase voltage', 'short circuit', 'open circuit', 'ground fault', '3-phase', 'three phase',
  'electrical capacitance', 'electric charge', 'magnetic permeability', 'electric permittivity',
  'specific heat', 'thermal conductivity', 'viscosity', 'surface tension', 'bulk modulus'
];

/**
 * Strips question lead-in stems (e.g. "what do you call the", "what is the", "refers to")
 * to isolate the exact core definitional/predicate phrase of the question prompt.
 */
function extractCoreStemPhrase(questionText: string): string | null {
  const cleanQ = questionText.trim().replace(/[\?\.\:]+$/, '').trim();

  const stemPatterns = [
    /^(?:what|which|how|why|where|when)\s+(?:do\s+you\s+call|is\s+called|is\s+known\s+as|is\s+defined\s+as|do\s+we\s+call|is\s+referred\s+to\s+as)\s+(?:the|a|an)?\s*/i,
    /^(?:what|which|how)\s+(?:is|are|was|were)\s+(?:the|a|an)?\s*/i,
    /^(?:which\s+of\s+the\s+following|which\s+one\s+of\s+the\s+following)\s+(?:is|are|refers\s+to|is\s+defined\s+as|is\s+called|is\s+known\s+as)?\s+(?:the|a|an)?\s*/i,
    /^(?:it\s+is\s+defined\s+as|defined\s+as|it\s+refers\s+to|refers\s+to|is\s+defined\s+as|is\s+known\s+as|is\s+called)\s+(?:the|a|an)?\s*/i,
    /^(?:the\s+process\s+of|a\s+device\s+that|an\s+instrument\s+used\s+to|a\s+type\s+of|a\s+kind\s+of)\s*/i
  ];

  for (const pattern of stemPatterns) {
    if (pattern.test(cleanQ)) {
      const remainder = cleanQ.replace(pattern, '').trim();
      if (remainder.length >= 6) {
        return remainder;
      }
    }
  }

  return null;
}

/**
 * Extracts the exact core key phrase from the question prompt.
 */
export function extractKeywords(
  questionText: string,
  answerText: string
): { questionKeywords: Set<string>; answerKeywords: Set<string> } {
  const questionKeywords = new Set<string>();

  // 1. Core Stem Phrase Extraction (e.g. "what do you call the simultaneous two way mode of communications" -> "simultaneous two way mode of communications")
  const corePhrase = extractCoreStemPhrase(questionText);
  if (corePhrase) {
    questionKeywords.add(corePhrase);
    return { questionKeywords, answerKeywords: new Set<string>() };
  }

  // 2. Multi-word Domain Engineering Terms
  const qLower = questionText.toLowerCase();
  for (const term of DOMAIN_MULTIWORD_TERMS) {
    if (qLower.includes(term)) {
      const regex = new RegExp(term.replace(/'/g, "'?"), 'gi');
      const match = regex.exec(questionText);
      if (match) {
        questionKeywords.add(match[0]);
      }
    }
  }

  // 3. Match answer words in question
  const answerClean = answerText
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !IGNORE_WORDS.has(w));

  answerClean.forEach((ansWord) => {
    const wordRegex = new RegExp(`\\b${ansWord}\\b`, 'gi');
    let m;
    while ((m = wordRegex.exec(questionText)) !== null) {
      questionKeywords.add(m[0]);
    }
  });

  // 4. Named principles / laws / units in question
  const namedAndUnitsRegex =
    /\b(?:newton|carnot|faraday|lenz|joule|kelvin|coulomb|ampere|volt|watt|gauss|tesla|weber|henry|maxwell|bernoulli|fourier|laplace|poisson|hooke|young|archimedes|pascal|torricelli|thevenin|norton)\b|\b\d+(?:\.\d+)?\s*(?:hz|v|kv|w|kw|mw|a|ma|ohm|ohms|f|uf|pf|h|mh|j|kj|n|kn|pa|kpa|mpa|m|cm|mm|kg|g|rad|deg|°c|°f|k|rpm|fps|m\/s|m\/s²|%|hp|btu)\b/gi;

  let unitMatch;
  while ((unitMatch = namedAndUnitsRegex.exec(questionText)) !== null) {
    questionKeywords.add(unitMatch[0]);
  }

  // 5. Fallback: longest technical words
  if (questionKeywords.size === 0) {
    const qWords = questionText
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !IGNORE_WORDS.has(w.toLowerCase()));

    qWords.sort((a, b) => b.length - a.length);

    if (qWords.length > 0) {
      questionKeywords.add(qWords[0]);
    }
    if (qWords.length > 1) {
      questionKeywords.add(qWords[1]);
    }
  }

  const trimmedQuestionKeywords = new Set<string>(
    Array.from(questionKeywords).slice(0, 3)
  );

  return { questionKeywords: trimmedQuestionKeywords, answerKeywords: new Set<string>() };
}

/**
 * Renders JSX elements with highlighted keyword spans.
 */
export function highlightTextWithKeywords(
  text: string,
  keywords: Set<string>,
  variant: 'highlight' | 'underline' = 'highlight'
): React.ReactNode {
  if (!text || !keywords || keywords.size === 0) return text;

  // Sort keywords by length descending so longer phrases match first
  const sortedKeywords = Array.from(keywords).sort((a, b) => b.length - a.length);
  if (sortedKeywords.length === 0) return text;

  const escaped = sortedKeywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const start = match.index;
    const end = pattern.lastIndex;

    if (start > lastIndex) {
      parts.push(text.substring(lastIndex, start));
    }

    const matchedText = match[0];
    const highlightClasses = variant === 'highlight'
      ? "bg-yellow-700 text-white font-bold px-1.5 py-0.5 rounded shadow-xs relative z-10 inline-block mx-0.5"
      : "border-b-2 border-yellow-500 font-bold px-0.5 inline-block text-black print:text-black";

    parts.push(
      <mark
        key={`mark-${start}-${end}-${matchedText}`}
        className={highlightClasses}
      >
        {matchedText}
      </mark>
    );

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}
