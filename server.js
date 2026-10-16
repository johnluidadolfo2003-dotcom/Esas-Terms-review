// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
var CUSTOM_QUESTIONS_FILE = path.join(__dirname, "custom_questions.json");
app.use(express.json({ limit: "50mb" }));
function readServerQuestions() {
  try {
    if (fs.existsSync(CUSTOM_QUESTIONS_FILE)) {
      const data = fs.readFileSync(CUSTOM_QUESTIONS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Could not read custom_questions.json:", err);
  }
  return [];
}
function writeServerQuestions(questions) {
  try {
    fs.writeFileSync(CUSTOM_QUESTIONS_FILE, JSON.stringify(questions, null, 2), "utf-8");
  } catch (err) {
    console.error("Could not write custom questions to server storage:", err);
  }
}
app.get("/api/custom-questions", (_req, res) => {
  const questions = readServerQuestions();
  res.json({ questions });
});
app.post("/api/custom-questions", (req, res) => {
  const { questions } = req.body;
  if (!Array.isArray(questions)) {
    res.status(400).json({ error: "Invalid payload: questions array expected" });
    return;
  }
  writeServerQuestions(questions);
  res.json({ success: true, count: questions.length });
});
app.post("/api/save-drive-questions", (req, res) => {
  const { questions } = req.body;
  if (!Array.isArray(questions)) {
    res.status(400).json({ error: "Invalid payload: questions array expected" });
    return;
  }
  writeServerQuestions(questions);
  res.json({ success: true, count: questions.length });
});
var distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));
app.get("/healthz", (_req, res) => {
  res.status(200).send("OK");
});
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Reviewer app running on port ${PORT}`);
});
