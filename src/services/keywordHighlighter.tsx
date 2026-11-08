import React from 'react';

// Common stop words to exclude from keyword extraction
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
  'may', 'might', 'must', 'can', 'could', 'of', 'in', 'to', 'for', 'with',
  'on', 'at', 'by', 'from', 'up', 'about', 'into', 'over', 'after', 'above',
  'below', 'under', 'between', 'and', 'or', 'nor', 'but', 'so', 'yet', 'as',
  'if', 'that', 'this', 'these', 'those', 'which', 'what', 'who', 'whom', 'whose',
  'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same', 'than',
  'too', 'very', 's', 't', 'just', 'don', 'now', 'd', 'll', 'm', 'o', 're',
  've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven',
  'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren',
  'won', 'wouldn', 'also', 'known', 'called', 'used', 'defined', 'types', 'type',
  'term', 'terms', 'refers', 'refer', 'means', 'statement', 'following', 'given',
  'select', 'choose', 'option', 'correct', 'value', 'amount', 'ratio', 'rate',
  'equal', 'total', 'part', 'number', 'system', 'device', 'circuit'
]);

/**
 * Extracts key technical terms and matching answer keywords from question & answer.
 */
export function extractKeywords(
  questionText: string,
  answerText: string
): { questionKeywords: Set<string>; answerKeywords: Set<string> } {
  const getTokens = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^\w\s\-%°]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const qTokens = getTokens(questionText);
  const aTokens = getTokens(answerText);

  const aTokensSet = new Set(aTokens);

  const questionKeywords = new Set<string>();
  const answerKeywords = new Set<string>();

  // 1. Cross-matching tokens (words in question that match answer or vice versa)
  qTokens.forEach((tok) => {
    if (aTokensSet.has(tok)) {
      questionKeywords.add(tok);
      answerKeywords.add(tok);
    }
  });

  // 2. Technical numbers, formulas, units in question (e.g. 60Hz, 100°C, 3-phase, etc.) or distinct capitalized words
  const techRegex =
    /\b\d+(?:\.\d+)?(?:\s*(?:hz|v|kv|w|kw|mw|a|ma|ohm|ohms|f|uf|pf|h|mh|j|kj|n|kn|pa|kpa|mpa|m|cm|mm|kg|g|rad|deg|°c|°f|k|rpm|fps|m\/s|m\/s²|%|hp|btu))?\b|\b[A-Z][a-zA-Z0-9\-]{2,}\b/g;

  let match;
  while ((match = techRegex.exec(questionText)) !== null) {
    const word = match[0].toLowerCase();
    if (!STOP_WORDS.has(word) && word.length > 2) {
      questionKeywords.add(word);
    }
  }

  // 3. Ensure answer has key words highlighted (if answer is short or technical)
  aTokens.forEach((tok) => {
    if (tok.length >= 3 && !STOP_WORDS.has(tok)) {
      answerKeywords.add(tok);
    }
  });

  // If question keywords list is empty, pick top 2-3 longest non-stop-word tokens
  if (questionKeywords.size === 0 && qTokens.length > 0) {
    [...qTokens]
      .sort((a, b) => b.length - a.length)
      .slice(0, 3)
      .forEach((w) => questionKeywords.add(w));
  }

  return { questionKeywords, answerKeywords };
}

/**
 * Renders JSX elements with highlighted keyword spans.
 */
export function highlightTextWithKeywords(
  text: string,
  keywords: Set<string>,
  highlightStyle: 'question' | 'answer' = 'question'
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
    const isAnsStyle = highlightStyle === 'answer';

    parts.push(
      <mark
        key={`mark-${start}-${end}-${matchedText}`}
        className="bg-yellow-500 text-white font-bold px-1.5 py-0.5 rounded shadow-xs relative z-10 inline-block mx-0.5"
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
