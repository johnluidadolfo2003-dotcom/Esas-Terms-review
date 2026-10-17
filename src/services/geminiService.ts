/**
 * Gemini AI Service for Engineering Reviewer
 * Client-side interface to server-backed Gemini 3.8 Flash model.
 * Provides detailed conceptual explanations, formulas, derivations, and Q&A.
 */

export interface GeminiConfig {
  configured: boolean;
  model: string;
  provider: string;
  serverReachable?: boolean;
  renderGuidance?: string;
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

export async function getGeminiConfig(forceRefresh = false): Promise<GeminiConfig> {
  if (cachedConfig && !forceRefresh) return cachedConfig;
  try {
    const res = await fetch('/api/gemini/config');
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      const isStaticHtml = contentType.includes('text/html');
      const config: GeminiConfig = {
        configured: false,
        model: 'gemini-3.8-flash',
        provider: 'Google Gemini',
        serverReachable: false,
        renderGuidance: isStaticHtml
          ? 'Deployed as a Static Site instead of a Web Service. On Render, create a Web Service running "npm start" so the Node API server runs.'
          : 'Server API route unavailable (HTTP ' + res.status + '). Ensure your Render Web Service is running.',
      };
      cachedConfig = config;
      return config;
    }
    const data = await res.json();
    const config: GeminiConfig = {
      ...data,
      serverReachable: true,
    };
    cachedConfig = config;
    return config;
  } catch {
    const config: GeminiConfig = {
      configured: false,
      model: 'gemini-3.8-flash',
      provider: 'Google Gemini',
      serverReachable: false,
      renderGuidance: 'Cannot reach server API. Check your Render deployment status and network connection.',
    };
    cachedConfig = config;
    return config;
  }
}

export async function refreshGeminiConfig(): Promise<GeminiConfig> {
  return getGeminiConfig(true);
}

export async function fetchGeminiExplanation(
  params: ExplainQuestionParams,
  signal?: AbortSignal
): Promise<GeminiExplanation> {
  let response: Response;
  try {
    response = await fetch('/api/gemini/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  } catch (netErr: any) {
    if (netErr.name === 'AbortError') throw netErr;
    throw new Error('Network error: Unable to connect to backend server. If using Render, ensure your Web Service is healthy.');
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    if (response.status === 404 || contentType.includes('text/html')) {
      throw new Error(
        'Gemini API endpoint not found. On Render, deploy as a Web Service (Node.js) with start command "npm start", not as a Static Site.'
      );
    }
    const data = await response.json().catch(() => ({}));
    if (response.status === 503) {
      throw new Error(
        'Gemini API key is not configured. On Render: Go to your Web Service -> Environment -> Add GEMINI_API_KEY with your key from aistudio.google.com, then save changes.'
      );
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
