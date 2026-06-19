"use strict";

/* ------------------------------------------------------------------ *
 * Star Defender — API de ranking global em tempo real
 *   - Node puro (sem dependências externas)
 *   - GET  /api/scores   -> top N (JSON)
 *   - POST /api/scores   -> registra { name, score } e transmite a todos
 *   - GET  /api/stream   -> Server-Sent Events (atualização ao vivo)
 *   - GET  /api/health   -> healthcheck
 * Persistência: arquivo JSON (data/scores.json) — montar como volume.
 * ------------------------------------------------------------------ */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "scores.json");
const TOP_N = 10;       // quantos aparecem no ranking
const MAX_KEEP = 200;   // quantos registros mantemos no total

let scores = [];
const clients = new Set();   // conexões SSE abertas

function load() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    if (fs.existsSync(DATA_FILE)) {
      const arr = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      if (Array.isArray(arr)) { scores = arr; }
    }
  } catch (e) { console.error("load:", e.message); }
}

function persist() {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(scores)); }
  catch (e) { console.error("persist:", e.message); }
}

function top() { return scores.slice(0, TOP_N); }

function sanitizeName(raw) {
  const n = String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/[^\p{L}\p{N} ._-]/gu, "")   // remove caracteres de risco
    .slice(0, 12);
  return n || "ANÔNIMO";
}

function broadcast() {
  const payload = "event: scores\ndata: " + JSON.stringify(top()) + "\n\n";
  for (const res of clients) {
    try { res.write(payload); } catch (e) { /* ignora cliente morto */ }
  }
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

const server = http.createServer((req, res) => {
  setCors(res);
  const url = new URL(req.url, "http://internal");
  const p = url.pathname.replace(/\/+$/, "") || "/";

  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

  // --- listar top N ---
  if (p === "/api/scores" && req.method === "GET") {
    return sendJson(res, 200, top());
  }

  // --- registrar pontuação ---
  if (p === "/api/scores" && req.method === "POST") {
    let body = "";
    req.on("data", (c) => {
      body += c;
      if (body.length > 1e4) { req.destroy(); }   // limita payload
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body || "{}");
        const score = Math.max(0, Math.min(1e9, parseInt(data.score, 10) || 0));
        const entry = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
          name: sanitizeName(data.name),
          score: score,
          ts: Date.now()
        };
        scores.push(entry);
        scores.sort((a, b) => b.score - a.score);       // maior -> menor
        if (scores.length > MAX_KEEP) { scores = scores.slice(0, MAX_KEEP); }
        persist();
        broadcast();
        const rank = scores.findIndex((e) => e.id === entry.id) + 1;
        sendJson(res, 200, { ok: true, id: entry.id, rank: rank, scores: top() });
      } catch (e) {
        sendJson(res, 400, { ok: false, error: e.message });
      }
    });
    return;
  }

  // --- stream em tempo real (SSE) ---
  if (p === "/api/stream" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no"
    });
    res.write("retry: 3000\n\n");
    res.write("event: scores\ndata: " + JSON.stringify(top()) + "\n\n");
    clients.add(res);
    const keepAlive = setInterval(() => {
      try { res.write(": keep-alive\n\n"); } catch (e) {}
    }, 25000);
    req.on("close", () => { clearInterval(keepAlive); clients.delete(res); });
    return;
  }

  // --- saúde ---
  if (p === "/api/health") {
    return sendJson(res, 200, { ok: true, count: scores.length, clients: clients.size });
  }

  sendJson(res, 404, { error: "not found" });
});

load();
server.listen(PORT, () => console.log("Star Defender API ouvindo na porta " + PORT));
