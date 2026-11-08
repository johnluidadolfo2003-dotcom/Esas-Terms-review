import 'dotenv/config';
import express from 'express';
import { createGeminiSpeechRouter } from './server/geminiSpeech';
import { createGeminiRouter } from './server/geminiRouter';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', true);
const PORT = Number(process.env.PORT) || 3000;

// Healthcheck for Render (always unauthenticated so Render monitors uptime)
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// Optional App Passcode / Link Lock via environment variable (APP_PASSWORD)
app.use((req, res, next) => {
  const expectedPassword = process.env.APP_PASSWORD?.trim();
  if (!expectedPassword) {
    // No password configured: allow public access
    return next();
  }

  const expectedUser = process.env.APP_USERNAME?.trim();
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8');
      const colonIdx = decoded.indexOf(':');
      const user = colonIdx !== -1 ? decoded.substring(0, colonIdx) : decoded;
      const pass = colonIdx !== -1 ? decoded.substring(colonIdx + 1) : '';

      const isValid = expectedUser
        ? user === expectedUser && pass === expectedPassword
        : pass === expectedPassword || user === expectedPassword;

      if (isValid) {
        return next();
      }
    } catch {
      // Decode error, proceed to 401
    }
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="ECE Reviewer - Enter Passcode to Access"');
  res.status(401).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Protected Access - ECE Reviewer</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #090d16;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 1.5rem;
    }
    .card {
      background: #131b2e;
      border: 1px solid #1e293b;
      border-radius: 1rem;
      padding: 2.25rem;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
    .icon {
      font-size: 3rem;
      margin-bottom: 0.75rem;
    }
    h1 {
      font-size: 1.35rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: #38bdf8;
    }
    p {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.55;
      margin: 0 0 1.5rem;
    }
    button {
      background: linear-gradient(135deg, #0284c7, #2563eb);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
      transition: opacity 0.15s ease;
    }
    button:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🔒</div>
    <h1>Access Protected</h1>
    <p>This Engineering Reviewer application is private. A valid passcode is required to view questions and use this system.</p>
    <button onclick="location.reload()">Enter Passcode</button>
  </div>
</body>
</html>`);
});

import fs from 'fs';

const CUSTOM_QUESTIONS_FILE = path.join(__dirname, 'custom_questions.json');

app.use(createGeminiSpeechRouter());
app.use(createGeminiRouter());
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

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Reviewer app running on port ${PORT}`);
});
