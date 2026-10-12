import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));

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
