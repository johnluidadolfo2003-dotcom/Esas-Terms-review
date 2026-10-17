import express from 'express';
import {
  isGeminiConfigured,
  generateQuestionExplanation,
  askGeminiTutor,
} from './geminiService.ts';

export function createGeminiRouter(): express.Router {
  const router = express.Router();

  // Status check for Gemini API
  router.get('/api/gemini/config', (_req, res) => {
    res.set('Cache-Control', 'no-store').json({
      configured: isGeminiConfigured(),
      model: 'gemini-3.8-flash',
      provider: 'Google Gemini',
    });
  });

  // Explain question with Gemini 3.8 Flash
  router.post('/api/gemini/explain', express.json({ limit: '32kb' }), async (req, res) => {
    res.set('Cache-Control', 'no-store');

    if (!isGeminiConfigured()) {
      res.status(503).json({ error: 'gemini-not-configured' });
      return;
    }

    const { question, choices, correctChoiceId, subject, userChoice } = req.body || {};

    if (!question || typeof question !== 'string' || !Array.isArray(choices) || !correctChoiceId) {
      res.status(400).json({ error: 'invalid-request-payload' });
      return;
    }

    try {
      const explanation = await generateQuestionExplanation({
        question,
        choices,
        correctChoiceId,
        subject,
        userChoice,
      });
      res.json({ success: true, explanation });
    } catch (err: any) {
      console.error('Gemini explanation error:', err);
      const isQuota = err?.status === 429 || /quota/i.test(err?.message || '');
      res.status(isQuota ? 429 : 502).json({
        error: isQuota ? 'gemini-quota-exceeded' : 'gemini-generation-failed',
        message: err?.message || 'Failed to generate explanation',
      });
    }
  });

  // Ask Gemini follow-up question
  router.post('/api/gemini/ask', express.json({ limit: '32kb' }), async (req, res) => {
    res.set('Cache-Control', 'no-store');

    if (!isGeminiConfigured()) {
      res.status(503).json({ error: 'gemini-not-configured' });
      return;
    }

    const { context, query } = req.body || {};
    if (!context || !query || typeof query !== 'string' || query.trim().length === 0) {
      res.status(400).json({ error: 'invalid-request-payload' });
      return;
    }

    try {
      const answer = await askGeminiTutor(context, query.trim());
      res.json({ success: true, answer });
    } catch (err: any) {
      console.error('Gemini ask tutor error:', err);
      res.status(502).json({
        error: 'gemini-generation-failed',
        message: err?.message || 'Failed to answer student question',
      });
    }
  });

  return router;
}
