import express from "express";
import path from "path";
import os from "os";
import { createServer as createViteServer } from "vite";

const providers = [
  "Google", "AWS", "Cloudflare", "Facebook/Meta", "Netflix", "EdgeNext", "Akamai",
  "TikTok/ByteDance", "Ookla", "IMO", "PUBG", "Free Fire", "Fastly", "Bunny",
  "Tencent Cloud", "Alibaba Cloud", "Oracle Cloud", "DigitalOcean", "Linode", "Vultr",
  "Hetzner", "OVHcloud", "IBM Cloud", "Microsoft Azure"
];

const startedAt = Date.now();
const app = express();
const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || "development";
const API_TOKEN = process.env.FTN_API_TOKEN?.trim();
const allowMutations = Boolean(API_TOKEN);

app.disable("x-powered-by");
app.set("trust proxy", process.env.TRUST_PROXY === "true");
app.use(express.json({ limit: "256kb" }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  if (NODE_ENV === "production") res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) console.log(`${req.method} ${req.path}`);
  next();
});

function requireOperator(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!allowMutations) return res.status(503).json({ success: false, error: "operator control is not configured" });
  const supplied = req.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (!supplied || supplied !== API_TOKEN) return res.status(401).json({ success: false, error: "unauthorized" });
  next();
}

function unavailable(feature: string) {
  return { status: "unavailable", configured: false, feature, reason: "No live collector/provider connector is configured" };
}

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "certmgr-control", environment: NODE_ENV, uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000) }));
app.get("/api/livez", (_req, res) => res.json({ status: "ok" }));
app.get("/api/readyz", (_req, res) => {
  const ready = Boolean(process.env.FTN_API_TOKEN);
  res.status(ready ? 200 : 503).json({ status: ready ? "ready" : "not_ready", checks: { operatorControl: ready } });
});
app.get("/api/network-status", (_req, res) => res.json({ connected: true, status: "api-online", liveCollectorsConfigured: false }));

app.get("/api/alerts", (_req, res) => res.json([]));
app.get("/api/event-history", (_req, res) => res.json([]));
app.get("/api/audit-logs", (_req, res) => res.json([]));

app.post("/api/ai-insights", async (_req, res) => {
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: "AI provider is not configured" });
  return res.status(501).json({ error: "AI execution adapter is not installed; no synthetic insight is returned" });
});

app.get("/api/health-check", (_req, res) => res.json(providers.map(name => ({ name, health: null, status: "unknown", error: null, source: "not-configured" }))));
app.get("/api/system-stats", (_req, res) => {
  const mem = process.memoryUsage();
  res.json({ cpuUsage: null, memoryUsageBytes: mem.rss, heapUsedBytes: mem.heapUsed, activeConnections: null, source: "process" });
});

app.post("/api/bulk-action", requireOperator, (_req, res) => res.status(409).json({ success: false, error: "approval_required", message: "Privileged provider actions require an explicit approval workflow before execution" }));

app.get("/api/ct-logs", (_req, res) => res.json({ logs: [], certificates: [], totalTrackedCertificates: 0, rfcStandards: ["RFC 6962", "RFC 9162", "RFC 8659", "RFC 8446", "RFC 6960"], ...unavailable("certificate-transparency") }));
app.post("/api/ct-issue-test-cert", requireOperator, (_req, res) => res.status(501).json({ success: false, error: "not_implemented", message: "Test certificate issuance is disabled until a real ACME/CT adapter is configured" }));

app.get("/api/edgeone-security", (_req, res) => res.json({ ...unavailable("edgeone-security"), mode: "not-configured", autoDefenseEnabled: false, totalInspectedRequests: null, blockedThreatsCount: null, autoReroutedMaliciousTrafficGbps: null, currentCleanTrafficRatio: null, wafVersion: null, ddosScrubbingCapacity: null, activePoPs: [], activeIncidents: [] }));
app.post("/api/edgeone-toggle-defense", requireOperator, (_req, res) => res.status(501).json({ success: false, error: "not_implemented", message: "EdgeOne control adapter is not configured" }));
app.post("/api/simulate-threat", (_req, res) => res.status(410).json({ success: false, error: "simulation_disabled" }));

app.get("/api/forecast", (_req, res) => res.json({ data: [], ...unavailable("forecasting") }));
app.get("/api/provider-details/:name", (req, res) => res.json({ name: req.params.name, ...unavailable("provider-intelligence") }));
app.get("/api/traffic-trend", (_req, res) => res.json([]));
app.get("/api/cert-status", (_req, res) => res.json({ valid: 0, expiring: 0, expired: 0, total: 0, source: "not-configured" }));
app.get("/api/ssl-acceleration", (_req, res) => res.json([]));
app.get("/api/latency", (_req, res) => res.json(providers.map(provider => ({ provider, latency: null, errorRate: null, packetLoss: null, source: "not-configured" }))));
app.get("/api/module-trend", (_req, res) => res.json([]));
app.get("/api/traffic-map-data", (_req, res) => res.json([]));
app.get("/api/throughput-history", (_req, res) => res.json([]));
app.get("/api/traffic-anomalies", (_req, res) => res.json({ providers: [], timeSlots: [], data: [], lastUpdated: null, ...unavailable("traffic-anomaly-detection") }));

app.get("/api/metrics", (_req, res) => {
  const uptime = Math.floor((Date.now() - startedAt) / 1000);
  const body = [
    "# HELP certmgr_uptime_seconds Process uptime in seconds",
    "# TYPE certmgr_uptime_seconds gauge",
    `certmgr_uptime_seconds ${uptime}`,
    "# HELP certmgr_provider_count Configured provider names",
    "# TYPE certmgr_provider_count gauge",
    `certmgr_provider_count ${providers.length}`,
    "# HELP certmgr_live_collectors_configured Whether live collectors are configured",
    "# TYPE certmgr_live_collectors_configured gauge",
    "certmgr_live_collectors_configured 0"
  ].join("\n") + "\n";
  res.type("text/plain; version=0.0.4").send(body);
});

app.get("/api/export-report", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=report.json");
  res.send(JSON.stringify({ timestamp: new Date().toISOString(), service: "certmgr-control", status: "live-api", syntheticData: false }, null, 2));
});

if (NODE_ENV !== "production") {
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath, { index: "index.html" }));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
}

app.listen(PORT, "0.0.0.0", () => console.log(`certmgr-control listening on :${PORT}`));
