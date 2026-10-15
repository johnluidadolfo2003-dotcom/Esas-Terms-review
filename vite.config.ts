import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function questionSyncPlugin(): Plugin {
  return {
    name: 'question-sync-plugin',
    configureServer(server) {
      const customQuestionsFile = path.resolve(process.cwd(), 'custom_questions.json');
      const driveQuestionsFile = path.resolve(process.cwd(), 'src/data/driveQuestions.ts');

      server.middlewares.use('/api/custom-questions', (req, res) => {
        if (req.method === 'GET') {
          try {
            if (fs.existsSync(customQuestionsFile)) {
              const data = fs.readFileSync(customQuestionsFile, 'utf-8');
              const questions = JSON.parse(data);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ questions }));
              return;
            }
          } catch (err) {
            console.warn('Could not read custom_questions.json in dev server:', err);
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ questions: [] }));
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const questions = data.questions;
              if (!Array.isArray(questions)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Array of questions expected' }));
                return;
              }

              fs.writeFileSync(customQuestionsFile, JSON.stringify(questions, null, 2), 'utf-8');

              if (fs.existsSync(driveQuestionsFile)) {
                const fileContent = `import { FlashcardQuestion } from '../services/questionParser';\n\nexport const DRIVE_COPIED_QUESTIONS: FlashcardQuestion[] = ${JSON.stringify(questions, null, 2)};\n`;
                fs.writeFileSync(driveQuestionsFile, fileContent, 'utf-8');
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, count: questions.length }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err?.message || 'Failed to save questions' }));
            }
          });
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
      });

      server.middlewares.use('/api/save-drive-questions', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const questions = data.questions;
              if (!Array.isArray(questions)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Array of questions expected' }));
                return;
              }

              fs.writeFileSync(customQuestionsFile, JSON.stringify(questions, null, 2), 'utf-8');

              if (fs.existsSync(driveQuestionsFile)) {
                const fileContent = `import { FlashcardQuestion } from '../services/questionParser';\n\nexport const DRIVE_COPIED_QUESTIONS: FlashcardQuestion[] = ${JSON.stringify(questions, null, 2)};\n`;
                fs.writeFileSync(driveQuestionsFile, fileContent, 'utf-8');
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, count: questions.length }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err?.message || 'Failed to save questions' }));
            }
          });
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), questionSyncPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
