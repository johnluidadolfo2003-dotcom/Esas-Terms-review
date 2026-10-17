/**
 * Gemini AI Service for Engineering Reviewer
 * Client-side interface to server-backed Gemini 3.8 Flash model.
 * Provides detailed conceptual explanations, formulas, derivations, and Q&A.
 */

export interface GeminiConfig {
  configured: boolean;
  model: string;
  provider: string;
}

export interface GeminiExplanation {
  summary: string;
  detailedAnalysis: string;
  formulaOrRule?: string;
  boardExamTip?: string;
  optionsBreakdown?: { id: string; status: 'correct' | 'incorrect'; note: string }[];
}

export interface ExplainQuestionParams {
  question: string;
  choices: { id: string; text: string }[];
  correctChoiceId: string;
  subject?: string;
  userChoice?: string;
}

let cachedConfig: GeminiConfig | null = null;

export async function getGeminiConfig(): Promise<GeminiConfig> {
  if (cachedConfig) return cachedConfig;
  try {
    const res = await fetch('/api/gemini/config');
    if (!res.ok) {
      return { configured: false, model: 'gemini-3.8-flash', provider: 'Google Gemini' };
    }
    const data = await res.json();
    cachedConfig = data;
    return data;
  } catch {
    return { configured: false, model: 'gemini-3.8-flash', provider: 'Google Gemini' };
  }
}

export async function fetchGeminiExplanation(
  params: ExplainQuestionParams,
  signal?: AbortSignal
): Promise<GeminiExplanation> {
  const response = await fetch('/api/gemini/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    signal,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    if (response.status === 503) {
      throw new Error('Gemini API is not configured on this server. Check GEMINI_API_KEY environment variable.');
    }
    if (response.status === 429) {
      throw new Error('Gemini API quota reached. Please wait a moment before asking again.');
    }
    throw new Error(data.message || data.error || 'Failed to generate explanation with Gemini.');
  }

  const result = await response.json();
  return result.explanation;
}

export async function askGeminiTutorQuestion(
  context: {
    question: string;
    choices: { id: string; text: string }[];
    correctChoiceId: string;
    subject?: string;
  },
  query: string,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch('/api/gemini/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context, query }),
    signal,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || data.error || 'Failed to get answer from Gemini.');
  }

  const result = await response.json();
  return result.answer;
}
