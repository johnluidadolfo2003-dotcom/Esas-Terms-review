// server.ts
import express2 from "express";

// server/geminiSpeech.ts
import "dotenv/config";
import express from "express";
import { createHash } from "node:crypto";
var NARRATOR = "Puck";
var TTS_MODEL = "gemini-3.8-flash-tts";
var SPEECH_STYLE = "Clear American English pronunciation, warm conversational delivery, calm and easy to understand, with natural sentence pauses at a moderate pace.";
var MAX_TEXT = 1800;
var MAX_AUDIO = 8 * 1024 * 1024;
var SpeechFailure = class extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
    this.code = code;
  }
};
function buildSpeechRequest(text, rate = 1) {
  return {
    model: TTS_MODEL,
    store: false,
    input: [{ type: "user_input", content: [{ type: "text", text, annotations: [{ type: "speech_metadata", style: `${SPEECH_STYLE} Delivery pace: ${rate} times a normal conversational reading pace.` }] }] }],
    response_format: { type: "audio", mime_type: "audio/wav" },
    generation_config: { speech_config: [{ voice: NARRATOR }] }
  };
}
function extractWav(result) {
  const audio = (result?.steps || []).filter((step) => step.type === "model_output").flatMap((step) => step.content || []).filter((part) => part.type === "audio").at(-1);
  if (typeof audio?.data !== "string" || audio.data.length > MAX_AUDIO * 1.4) throw new SpeechFailure(502, "invalid-audio");
  const wav = Buffer.from(audio.data, "base64");
  if (wav.length <= 44 || wav.length > MAX_AUDIO || wav.toString("ascii", 0, 4) !== "RIFF" || wav.toString("ascii", 8, 12) !== "WAVE") {
    throw new SpeechFailure(502, "invalid-audio");
  }
  return wav;
}
function createGeminiSpeechRouter(options = {}) {
  const router = express.Router();
  const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY ?? "";
  const configured = Boolean(apiKey && !/MY_GEMINI_API_KEY|PLACEHOLDER/i.test(apiKey));
  const request = options.fetchImpl ?? fetch;
  const cache = /* @__PURE__ */ new Map();
  const pending = /* @__PURE__ */ new Map();
  const limits = /* @__PURE__ */ new Map();
  let cacheBytes = 0;
  router.get("/api/speech/config", (_req, res) => {
    res.set("Cache-Control", "no-store").json({ provider: "Gemini", voice: NARRATOR, configured });
  });
  router.post("/api/speech", express.json({ limit: "16kb" }), async (req, res) => {
    res.set("Cache-Control", "no-store");
    if (!configured) {
      res.status(503).json({ error: "speech-not-configured" });
      return;
    }
    const text = req.body?.text;
    const rate = req.body?.rate ?? 1;
    if (typeof text !== "string" || !text.trim() || text.length > MAX_TEXT || typeof rate !== "number" || !Number.isFinite(rate) || rate < 0.5 || rate > 2) {
      res.status(400).json({ error: "invalid-speech-text" });
      return;
    }
    const origin = req.get("origin");
    if (origin) {
      try {
        if (new URL(origin).host !== req.get("host")) throw new Error();
      } catch {
        res.status(403).json({ error: "origin-not-allowed" });
        return;
      }
    }
    const now = Date.now();
    const ip = req.ip || "unknown";
    for (const [key2, value] of limits) if (value.until <= now) limits.delete(key2);
    const limit = limits.get(ip) || { count: 0, until: now + 6e4 };
    if (limit.count >= 20 || !limits.has(ip) && limits.size >= 1e3) {
      res.set("Retry-After", "60").status(429).json({ error: "speech-rate-limit" });
      return;
    }
    limit.count++;
    limits.set(ip, limit);
    const key = createHash("sha256").update(JSON.stringify([text, rate])).digest("hex");
    for (const [id, entry] of cache) if (entry.expires <= now) {
      cacheBytes -= entry.wav.length;
      cache.delete(id);
    }
    try {
      let wav = cache.get(key)?.wav;
      if (!wav) {
        let job = pending.get(key);
        if (!job) {
          if (pending.size >= 2) {
            res.set("Retry-After", "2").status(429).json({ error: "speech-busy" });
            return;
          }
          job = (async () => {
            const response = await request("https://generativelanguage.googleapis.com/v1beta/interactions", {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
              body: JSON.stringify(buildSpeechRequest(text, rate)),
              signal: AbortSignal.timeout(45e3)
            });
            if (!response.ok) {
              throw new SpeechFailure(
                response.status === 429 ? 429 : 502,
                response.status === 429 ? "speech-quota" : [401, 403].includes(response.status) ? "speech-key-rejected" : "speech-provider-error"
              );
            }
            const buffer = extractWav(await response.json());
            while (cacheBytes + buffer.length > 16 * 1024 * 1024 && cache.size) {
              const first = cache.keys().next().value;
              cacheBytes -= cache.get(first).wav.length;
              cache.delete(first);
            }
            cache.set(key, { wav: buffer, expires: Date.now() + 30 * 6e4 });
            cacheBytes += buffer.length;
            return buffer;
          })().finally(() => pending.delete(key));
          pending.set(key, job);
        }
        wav = await job;
      }
      if (!res.destroyed) res.type("audio/wav").send(wav);
    } catch (error) {
      const failure = error instanceof SpeechFailure ? error : new SpeechFailure(502, "speech-provider-error");
      if (!res.destroyed) res.status(failure.status).json({ error: failure.code });
    }
  });
  return router;
}

// server.ts
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express2();
var PORT = Number(process.env.PORT) || 3e3;
var CUSTOM_QUESTIONS_FILE = path.join(__dirname, "custom_questions.json");
app.use(createGeminiSpeechRouter());
app.use(express2.json({ limit: "50mb" }));
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
app.use(express2.static(distPath));
app.get("/healthz", (_req, res) => {
  res.status(200).send("OK");
});
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Reviewer app running on port ${PORT}`);
});
