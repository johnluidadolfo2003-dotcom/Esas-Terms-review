import { GoogleGenAI } from '@google/genai';

let cachedAiClient: GoogleGenAI | null = null;
let cachedKey: string = '';

export function resolveGeminiApiKey(): string {
  const raw =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    '';
  return raw.trim().replace(/^["']|["']$/g, '');
}

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = resolveGeminiApiKey();
  if (!apiKey || /MY_GEMINI_API_KEY|PLACEHOLDER/i.test(apiKey)) {
    return null;
  }

  if (cachedAiClient && cachedKey === apiKey) {
    return cachedAiClient;
  }

  cachedKey = apiKey;
  cachedAiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  return cachedAiClient;
}

export function isGeminiConfigured(): boolean {
  return getGeminiClient() !== null;
}

export interface ExplainRequestPayload {
  question: string;
  choices: { id: string; text: string }[];
  correctChoiceId: string;
  subject?: string;
  userChoice?: string;
}

export interface ExplainResponseData {
  summary: string;
  boardExamTip?: string;
  modelUsed?: string;
  taskComplexity?: 'light' | 'complicated';
}

/**
 * Assesses whether an engineering problem is complicated (numerical, math formulas, circuit calculations)
 * or light (conceptual definition, law identification, standard naming, acronym).
 */
export function assessTaskComplexity(
  question: string,
  choices: { text: string }[] = []
): 'light' | 'complicated' {
  const combined = `${question} ${choices.map(c => c.text).join(' ')}`;
  const hasCalculation =
    /\b(calculate|compute|solve|derive|finding|determined by formula|efficiency|impedance|reactance|reactive power|apparent power|power factor|transformer ratio|torque|resonance|slip|integral|derivative|frequency resonance|voltage drop)\b/i.test(
      combined
    );
  const hasNumbersAndUnits =
    /\d+\.?\d*\s*(?:kW|MW|kV|Hz|kHz|MHz|rpm|HP|hp|ohms?|Ω|amps?|A|volts?|V|µF|mH|henry|joules?|rad\/s|m\/s|kVA|VAR)/i.test(
      combined
    );
  const isMultiStep = question.length > 300;

  return hasCalculation || hasNumbersAndUnits || isMultiStep ? 'complicated' : 'light';
}

export function assessQueryComplexity(query: string): 'light' | 'complicated' {
  const isComplex =
    query.length > 80 ||
    /\b(derive|calculate|compute|step-by-step math|prove|equation|integral|solve for|matrix|differential)\b/i.test(
      query
    );
  return isComplex ? 'complicated' : 'light';
}

async function callGenerateContentWithFallback(
  ai: GoogleGenAI,
  models: string[],
  request: {
    contents: string;
    config?: any;
  }
): Promise<{ text: string | undefined; model: string }> {
  let lastError: any = null;
  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        ...request,
        model,
      });
      return { text: response.text, model };
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || '');
      const isNotFound =
        err?.status === 404 ||
        /not found|unsupported model|not supported|not available/i.test(msg);
      if (isNotFound) {
        console.warn(`Gemini model ${model} unavailable, trying fallback model...`);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export async function generateQuestionExplanation(
  payload: ExplainRequestPayload
): Promise<ExplainResponseData> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('gemini-not-configured');
  }

  const { question, choices, correctChoiceId, subject = 'Electrical Engineering', userChoice } = payload;
  const formattedChoices = choices.map(c => `[${c.id}] ${c.text}`).join('\n');

  // Task-based model selection: light tasks use low-version Gemini to save tokens;
  // complicated tasks (math/calculations) use higher Gemini tier.
  const complexity = assessTaskComplexity(question, choices);
  const models =
    complexity === 'complicated'
      ? ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash']
      : ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-2.5-flash'];

  const prompt = `Subject: ${subject}
Question:
${question}

Choices:
${formattedChoices}

Official Correct Answer: Option ${correctChoiceId}
${userChoice ? `User selected Option: ${userChoice}` : ''}

Provide a direct, concise, token-efficient explanation.
Do NOT include detailed physics proofs, mathematical theories, governing equations, or choice breakdowns.

Respond strictly in valid JSON format with:
{
  "summary": "1-2 direct sentences explaining why Option ${correctChoiceId} is correct.",
  "boardExamTip": "1 short, practical rule of thumb or takeaway for the PRC Electrical Engineering Board Exam."
}`;

  const response = await callGenerateContentWithFallback(ai, models, {
    contents: prompt,
    config: {
      systemInstruction:
        'You are an expert Registered Electrical Engineer (REE / RME / PEE) professor. Provide ultra-concise, accurate, token-efficient explanations without filler. Output valid JSON only.',
      responseMimeType: 'application/json',
      temperature: 0.1,
    },
  });

  const rawText = response.text || '{}';
  try {
    const parsed = JSON.parse(rawText.trim());
    return {
      summary: parsed.summary || `Option ${correctChoiceId} is the correct answer.`,
      boardExamTip: parsed.boardExamTip || 'Review the core definition and standard terms for this question.',
      modelUsed: response.model,
      taskComplexity: complexity,
    };
  } catch {
    return {
      summary: `Option ${correctChoiceId} is the correct answer.`,
      boardExamTip: 'Review the fundamental PRC definitions governing this question.',
      modelUsed: response.model,
      taskComplexity: complexity,
    };
  }
}

export async function askGeminiTutor(
  questionContext: {
    question: string;
    choices: { id: string; text: string }[];
    correctChoiceId: string;
    subject?: string;
  },
  userQuery: string
): Promise<{ answer: string; modelUsed: string }> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('gemini-not-configured');
  }

  const queryComplexity = assessQueryComplexity(userQuery);
  const models =
    queryComplexity === 'complicated'
      ? ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash']
      : ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-2.5-flash'];

  const prompt = `Context:
Subject: ${questionContext.subject || 'Engineering Reviewer'}
Question: ${questionContext.question}
Choices:
${questionContext.choices.map(c => `[${c.id}] ${c.text}`).join('\n')}
Correct Answer: Option ${questionContext.correctChoiceId}

Student Question:
"${userQuery}"

Provide a direct, concise, 1-2 sentence answer for the engineering student. Avoid unnecessary filler or lengthy derivations.`;

  const response = await callGenerateContentWithFallback(ai, models, {
    contents: prompt,
    config: {
      systemInstruction:
        'You are an engineering tutor. Give ultra-concise, helpful, token-saving answers directly answering the student question.',
      temperature: 0.1,
    },
  });

  return {
    answer: response.text || 'Unable to generate an answer at this time.',
    modelUsed: response.model,
  };
}
