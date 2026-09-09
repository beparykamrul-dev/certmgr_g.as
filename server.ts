import express from "express";
import path from "path";
import os from "os";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { loadRuntimeConfig, operatorControlConfigured as isOperatorControlConfigured } from "./src/runtime/config";
import { configuredCollectorCount, getCollectorStatuses } from "./src/runtime/collector";
import { readiness } from "./src/runtime/health";
import { unavailable as apiUnavailable } from "./src/runtime/api";
import { evaluatePrivilegedAction } from "./src/runtime/policy";

const providers = [
  "Google", "AWS", "Cloudflare", "Facebook/Meta", "Netflix", "EdgeNext", "Akamai",
  "TikTok/ByteDance", "Ookla", "IMO", "PUBG", "Free Fire", "Fastly", "Bunny",
  "Tencent Cloud", "Alibaba Cloud", "Oracle Cloud", "DigitalOcean", "Linode", "Vultr",
  "Hetzner", "OVHcloud", "IBM Cloud", "Microsoft Azure"
];

const startedAt = Date.now();
const app = express();
const config = loadRuntimeConfig();
const PORT = config.port;
const NODE_ENV = config.nodeEnv;
const API_TOKEN = config.apiToken;
const operatorControlConfigured = isOperatorControlConfigured(config);
let lastCpuUsage = process.cpuUsage();
let lastCpuAt = process.hrtime.bigint();

app.disable("x-powered-by");
app.set("trust proxy", config.trustProxy);
app.use(express.json({ limit: "256kb" }));
app.use((_req, res, next) => {
  res.setHeader("X-Request-ID", crypto.randomUUID());
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (NODE_ENV === "production") res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

function requireOperator(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!operatorControlConfigured) return res.status(503).json({ success: false, error: "operator_control_not_configured" });
  const supplied = req.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (!supplied || supplied.length !== API_TOKEN!.length || !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(API_TOKEN!))) {
    return res.status(401).json({ success: false, error: "unauthorized" });
  }
  next();
}

function unavailable(feature: string) { return apiUnavailable(feature); }
function collectorCount() { return configuredCollectorCount(process.env); }

function cpuPercent() {
  const now = process.hrtime.bigint();
  const elapsedMicros = Number(now - lastCpuAt) / 1000;
  const usage = process.cpuUsage(lastCpuUsage);
  lastCpuUsage = process.cpuUsage();
  lastCpuAt = now;
  if (!elapsedMicros || elapsedMicros <= 0) return null;
  return Math.min(100, Number(((usage.user + usage.system) / elapsedMicros * 100).toFixed(2)));
}

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "ftn-cert-control", environment: NODE_ENV, uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000), liveCollectorsConfigured: collectorCount(), collectors: getCollectorStatuses(process.env) }));
app.get("/api/livez", (_req, res) => res.json({ status: "ok", service: "ftn-cert-control" }));
app.get("/api/readyz", (_req, res) => {
  const result = readiness({ process: true, operatorControl: operatorControlConfigured, liveCollectors: collectorCount() > 0 });
  res.status(result.ready ? 200 : 503).json(result);
});
app.get("/api/network-status", (_req, res) => { const count = collectorCount(); res.json({ connected: count > 0, status: count > 0 ? "live" : "not-configured", liveCollectorsConfigured: count, source: "runtime-config" }); });

app.get("/api/alerts", (_req, res) => res.json([]));
app.get("/api/event-history", (_req, res) => res.json([]));
app.get("/api/audit-logs", (_req, res) => res.json([]));
app.post("/api/ai-insights", async (_req, res) => {
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: "AI provider is not configured" });
  return res.status(501).json({ error: "AI execution adapter is not installed; no synthetic insight is returned" });
});

app.get("/api/health-check", (_req, res) => res.json(providers.map(name => ({ name, health: null, status: "unknown", error: null, source: "not-configured" }))));
app.get("/api/system-stats", (_req, res) => { const mem = process.memoryUsage(); res.json({ cpu_percent: cpuPercent(), memory: { rss_mb: +(mem.rss / 1048576).toFixed(2), heap_used_mb: +(mem.heapUsed / 1048576).toFixed(2), heap_total_mb: +(mem.heapTotal / 1048576).toFixed(2) }, active_connections: null, source: "process", host: os.hostname() }); });

app.post("/api/bulk-action", requireOperator, (_req, res) => { const decision = evaluatePrivilegedAction(); res.status(409).json({ success: false, error: "approval_required", message: decision.reason, approval: { required: decision.approvalRequired, state: "pending" } }); });
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
  const count = collectorCount();
  const body = [
    "# HELP ftn_cert_control_uptime_seconds Process uptime in seconds",
    "# TYPE ftn_cert_control_uptime_seconds gauge",
    `ftn_cert_control_uptime_seconds ${uptime}`,
    "# HELP ftn_cert_control_provider_count Provider names known to the UI",
    "# TYPE ftn_cert_control_provider_count gauge",
    `ftn_cert_control_provider_count ${providers.length}`,
    "# HELP ftn_cert_control_live_collectors_configured Number of configured live collectors",
    "# TYPE ftn_cert_control_live_collectors_configured gauge",
    `ftn_cert_control_live_collectors_configured ${count}`,
    "# HELP ftn_cert_control_operator_control_configured Whether privileged operator control is configured",
    "# TYPE ftn_cert_control_operator_control_configured gauge",
    `ftn_cert_control_operator_control_configured ${operatorControlConfigured ? 1 : 0}`
  ].join("\n") + "\n";
  res.type("text/plain; version=0.0.4").send(body);
});

app.get("/api/export-report", (_req, res) => { const count = collectorCount(); res.setHeader("Content-Type", "application/json"); res.setHeader("Content-Disposition", "attachment; filename=ftn-cert-control-report.json"); res.send(JSON.stringify({ timestamp: new Date().toISOString(), service: "ftn-cert-control", status: "live-api", syntheticData: false, liveCollectorsConfigured: count }, null, 2)); });

if (NODE_ENV !== "production") { const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" }); app.use(vite.middlewares); } else { const distPath = path.join(process.cwd(), "dist"); app.use(express.static(distPath, { index: "index.html" })); app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html"))); }

app.listen(PORT, "0.0.0.0", () => console.log(`ftn-cert-control listening on :${PORT}`));
