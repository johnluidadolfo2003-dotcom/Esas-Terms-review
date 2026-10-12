// server.ts
import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync, gunzipSync } from "node:zlib";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// src/services/questionValidation.ts
var subjects = /* @__PURE__ */ new Set(["Economics", "Mechanics 1", "Mechanics 2", "EE Laws", "Project Management", "Communication", "General Engineering"]);
function isQuestionBank(value) {
  if (!Array.isArray(value) || value.length > 1e4) return false;
  const ids = /* @__PURE__ */ new Set();
  return value.every((q) => {
    if (!q || typeof q.id !== "string" || !q.id || ids.has(q.id) || !subjects.has(q.subject) || typeof q.question !== "string" || !q.question.trim() || typeof q.correctChoiceId !== "string" || !Array.isArray(q.choices) || q.choices.length < 2 || q.choices.length > 26) return false;
    ids.add(q.id);
    const choiceIds = /* @__PURE__ */ new Set();
    return q.choices.every((c) => {
      if (!c || typeof c.id !== "string" || !c.id || choiceIds.has(c.id) || typeof c.text !== "string" || !c.text.trim()) return false;
      choiceIds.add(c.id);
      return true;
    }) && choiceIds.has(q.correctChoiceId);
  });
}

// server.ts
var app = express();
app.disable("x-powered-by");
var credentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (credentials) initializeApp({ credential: cert(JSON.parse(credentials)) });
var cloudEnabled = Boolean(credentials);
app.use(express.json({ limit: "10mb" }));
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.get("/healthz", (_req, res) => res.json({ status: "ok", cloudStorage: cloudEnabled }));
app.get("/api/config", (_req, res) => res.json({ cloudStorage: cloudEnabled }));
app.use("/api/questions", async (req, res, next) => {
  if (!cloudEnabled) {
    res.status(503).json({ error: "Cloud saving is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON on Render." });
    return;
  }
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) {
    res.status(401).json({ error: "Sign in to save questions." });
    return;
  }
  try {
    const identity = await getAuth().verifyIdToken(token, true);
    res.locals.uid = identity.uid;
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please sign in again." });
  }
});
app.get("/api/questions", async (_req, res, next) => {
  try {
    const doc = await getFirestore().collection("reviewerBanks").doc(res.locals.uid).get();
    const data = doc.data();
    const questions = data?.payload ? JSON.parse(gunzipSync(Buffer.from(data.payload, "base64")).toString("utf8")) : [];
    res.json({ questions, version: data?.version || 0 });
  } catch (error) {
    next(error);
  }
});
app.put("/api/questions", async (req, res, next) => {
  if (!isQuestionBank(req.body?.questions) || !Number.isInteger(req.body?.version) || req.body.version < 0) {
    res.status(400).json({ error: "Invalid question bank or version." });
    return;
  }
  const payload = gzipSync(JSON.stringify(req.body.questions)).toString("base64");
  if (Buffer.byteLength(payload) > 8e5) {
    res.status(413).json({ error: "Bank too large. Export a backup and split it into smaller banks." });
    return;
  }
  try {
    const db = getFirestore();
    const ref = db.collection("reviewerBanks").doc(res.locals.uid);
    const version = await db.runTransaction(async (tx) => {
      const snapshot = await tx.get(ref);
      const current = snapshot.data()?.version || 0;
      if (req.body.version !== current) return null;
      tx.set(ref, { payload, version: current + 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
      return current + 1;
    });
    if (version === null) {
      res.status(409).json({ error: "Another device updated this bank. Reload before saving again." });
      return;
    }
    res.json({ success: true, count: req.body.questions.length, version });
  } catch (error) {
    next(error);
  }
});
app.use("/api", (_req, res) => res.status(404).json({ error: "API route not found." }));
var distPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "dist");
app.use(express.static(distPath, { index: false }));
app.get("*", (_req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(distPath, "index.html"));
});
app.use((err, _req, res, _next) => {
  const status = err.status === 413 ? 413 : err instanceof SyntaxError ? 400 : 500;
  if (status === 500) console.error("Request failed:", err.message);
  res.status(status).json({ error: status === 500 ? "Cloud request failed. Check Firebase configuration and try again." : "Invalid or oversized request." });
});
app.listen(Number(process.env.PORT) || 3e3, "0.0.0.0", () => console.log("Reviewer web service started"));
