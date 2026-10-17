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
  detailedAnalysis: string;
  formulaOrRule?: string;
  boardExamTip?: string;
  optionsBreakdown?: { id: string; status: 'correct' | 'incorrect'; note: string }[];
}

const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];

async function callGenerateContentWithFallback(
  ai: GoogleGenAI,
  request: {
    contents: string;
    config?: any;
  }
) {
  let lastError: any = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      return await ai.models.generateContent({
        ...request,
        model,
      });
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || '');
      const isNotFound = err?.status === 404 || /not found|unsupported model|not supported|not available/i.test(msg);
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

  const prompt = `Subject: ${subject}
Question:
${question}

Choices:
${formattedChoices}

Official Correct Answer: Option ${correctChoiceId}
${userChoice ? `User selected Option: ${userChoice}` : ''}

Please analyze this engineering question thoroughly. Provide:
1. Short Summary: A concise, direct statement of why the correct option is the right answer.
2. Detailed Analysis: The underlying physics, electrical theory, mathematics, or Philippine Electrical Code (PEC) / RA 7920 legal statute. Explain any relevant equations or principles step-by-step.
3. Formula or Standard: The relevant formula, equation, or code section (if applicable).
4. Board Exam Tip: A practical memory tip, rule of thumb, or key takeaway for the PRC Electrical Engineering Board Examination.
5. Options Breakdown: A brief note for each option explaining why it is correct or incorrect.

Keep your response factual, rigorous, and easy to read. Output in structured JSON format with the keys:
"summary" (string),
"detailedAnalysis" (string),
"formulaOrRule" (string),
"boardExamTip" (string),
"optionsBreakdown" (array of objects with "id", "status" as "correct" or "incorrect", and "note")`;

  const response = await callGenerateContentWithFallback(ai, {
    contents: prompt,
    config: {
      systemInstruction:
        'You are an expert Registered Electrical Engineer (REE / RME / PEE) and Philippine PRC Board Examination reviewer professor. You provide rigorous, accurate, and easy-to-follow explanations for engineering students. You never hallucinate codes or formulas. Output valid JSON only.',
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const rawText = response.text || '{}';
  try {
    const parsed = JSON.parse(rawText.trim());
    return {
      summary: parsed.summary || `The correct answer is Option ${correctChoiceId}.`,
      detailedAnalysis: parsed.detailedAnalysis || parsed.explanation || '',
      formulaOrRule: parsed.formulaOrRule || '',
      boardExamTip: parsed.boardExamTip || '',
      optionsBreakdown: Array.isArray(parsed.optionsBreakdown) ? parsed.optionsBreakdown : [],
    };
  } catch {
    return {
      summary: `The correct answer is Option ${correctChoiceId}.`,
      detailedAnalysis: rawText,
      boardExamTip: 'Review the fundamental laws and definitions governing this topic.',
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
): Promise<string> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('gemini-not-configured');
  }

  const prompt = `Context:
Subject: ${questionContext.subject || 'Engineering Reviewer'}
Question: ${questionContext.question}
Choices:
${questionContext.choices.map(c => `[${c.id}] ${c.text}`).join('\n')}
Correct Answer: Option ${questionContext.correctChoiceId}

Student Question:
"${userQuery}"

Provide a direct, helpful, and concise answer explaining the concept to the engineering student. Avoid unnecessary filler.`;

  const response = await callGenerateContentWithFallback(ai, {
    contents: prompt,
    config: {
      systemInstruction:
        'You are an authoritative engineering tutor helping a reviewee prepare for the Philippine Electrical Engineering board examination. Be clear, accurate, and concise.',
      temperature: 0.2,
    },
  });

  return response.text || 'Unable to generate an answer at this time.';
}
