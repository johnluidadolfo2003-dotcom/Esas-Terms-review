import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

import fs from 'fs';

const CUSTOM_QUESTIONS_FILE = path.join(__dirname, 'custom_questions.json');

app.use(express.json({ limit: '50mb' }));

// Helper to load questions stored on server
function readServerQuestions() {
  try {
    if (fs.existsSync(CUSTOM_QUESTIONS_FILE)) {
      const data = fs.readFileSync(CUSTOM_QUESTIONS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read custom_questions.json:', err);
  }
  return [];
}

// Helper to write questions stored on server
function writeServerQuestions(questions: any[]) {
  try {
    fs.writeFileSync(CUSTOM_QUESTIONS_FILE, JSON.stringify(questions, null, 2), 'utf-8');
    // Runtime saves belong to custom storage, never the reviewed source bank.
  } catch (err) {
    console.error('Could not write custom questions to server storage:', err);
  }
}

// API Route: GET /api/custom-questions
app.get('/api/custom-questions', (_req, res) => {
  const questions = readServerQuestions();
  res.json({ questions });
});

// API Route: POST /api/custom-questions
app.post('/api/custom-questions', (req, res) => {
  const { questions } = req.body;
  if (!Array.isArray(questions)) {
    res.status(400).json({ error: 'Invalid payload: questions array expected' });
    return;
  }
  writeServerQuestions(questions);
  res.json({ success: true, count: questions.length });
});

// API Route: POST /api/save-drive-questions
app.post('/api/save-drive-questions', (req, res) => {
  const { questions } = req.body;
  if (!Array.isArray(questions)) {
    res.status(400).json({ error: 'Invalid payload: questions array expected' });
    return;
  }
  writeServerQuestions(questions);
  res.json({ success: true, count: questions.length });
});

// Serve built assets
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Healthcheck for Render
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Reviewer app running on port ${PORT}`);
});
