// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
app.use(express.json({ limit: "50mb" }));
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
