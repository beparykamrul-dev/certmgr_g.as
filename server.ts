import express from "express";
import path from "path";
import os from "os";
import crypto from "crypto";
import { createViteServer } from "vite";
import { loadRuntimeConfig, operatorControlConfigured as isOperatorControlConfigured } from "./src/runtime/config";
import { getCollectorStatuses, hasLiveCollector, probeCollectorStatuses, type CollectorStatus } from "./src/runtime/collector";
import { readiness } from "./src/runtime/health";
import { unavailable as apiUnavailable } from "./src/runtime/api";
import { evaluatePrivilegedAction } from "./src/runtime/policy";
import { createMemoryApprovalStore, type AsyncApprovalStore } from "./src/runtime/approval-store";
import { createApproval, approveApproval } from "./src/runtime/approval-api";
import { createMemoryAuditStore, type AsyncAuditStore } from "./src/runtime/audit-store";
import { recordAudit } from "./src/runtime/audit-service-async";
import { readConfiguredCertificates } from "./src/runtime/certificate-files";
import { createPostgresPool } from "./src/runtime/pg-pool";
import { bootstrapDatabase } from "./src/runtime/database-bootstrap";
import { createPersistentStores } from "./src/runtime/persistence";
import { listCertificateInventory, replaceCertificateInventory } from "./src/runtime/postgres-certificate-store";
import { databaseConfigured } from "./src/runtime/postgres-client";
import { requestIdFrom } from "./src/runtime/request-context";
import { createDatabaseTargetRegistry } from "./src/runtime/database-target-registry";
import { PostgresDatabaseAdapter } from "./src/runtime/postgres-database-adapter";
import { UnconfiguredDatabaseAdapter } from "./src/runtime/unconfigured-database-adapter";
import { DatabaseControlService } from "./src/runtime/database-control-service";
import { registerDatabaseControlRoutes } from "./src/runtime/database-control-api";

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
const useDatabase = databaseConfigured(process.env);
const db = config.databaseUrl ? createPostgresPool(config.databaseUrl) : undefined;
const memoryApprovals = createMemoryApprovalStore();
const memoryAudit = createMemoryAuditStore();
const persistentStores = db ? createPersistentStores(db) : null;
const approvalStore: AsyncApprovalStore = persistentStores?.approvals ?? {
  put: async request => memoryApprovals.put(request),
  get: async id => memoryApprovals.get(id),
  list: async () => memoryApprovals.list(),
};
const auditStore: AsyncAuditStore = persistentStores?.audit ?? {
  append: async record => memoryAudit.append(record),
  list: async limit => memoryAudit.list(limit),
};

const databaseTargets = createDatabaseTargetRegistry(process.env);
const databaseAdapter = db ? new PostgresDatabaseAdapter(db) : new UnconfiguredDatabaseAdapter();
const databaseControl = new DatabaseControlService(databaseAdapter, databaseTargets, approvalStore);

if (db) {
  await bootstrapDatabase(db);
  const configuredCertificates = await readConfiguredCertificates(process.env);
  if (configuredCertificates.length) await replaceCertificateInventory(db, configuredCertificates.map(({ status: _status, ...record }) => record));
}

let lastCpuUsage = process.cpuUsage();
let lastCpuAt = process.hrtime.bigint();
let collectorSnapshot: CollectorStatus[] = getCollectorStatuses(process.env);
let collectorProbeAt = 0;
let collectorProbeInFlight: Promise<void> | null = null;

async function refreshCollectors(force = false): Promise<void> {
  const now = Date.now();
  if (!force && now - collectorProbeAt < 30000) return;
  if (collectorProbeInFlight) return collectorProbeInFlight;
  collectorProbeInFlight = probeCollectorStatuses(process.env).then(snapshot => {
    collectorSnapshot = snapshot;
    collectorProbeAt = Date.now();
  }).finally(() => { collectorProbeInFlight = null; });
  await collectorProbeInFlight;
}

app.disable("x-powered-by");
app.set("trust proxy", config.trustProxy);
app.use(express.json({ limit: "256kb" }));
app.use((req, res, next) => {
  const requestId = requestIdFrom(req);
  res.setHeader("X-Request-ID", requestId);
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
  if (!supplied || supplied.length !== API_TOKEN!.length || !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(API_TOKEN!))) return res.status(401).json({ success: false, error: "unauthorized" });
  next();
}

function unavailable(feature: string) { return apiUnavailable(feature); }
function collectorStatuses() { return collectorSnapshot; }
function collectorCount() { return collectorSnapshot.filter(c => c.configured).length; }
function liveCollectorAvailable() { return hasLiveCollector(collectorSnapshot); }
function actor(req: express.Request) { return req.header("x-operator-id")?.trim() || "operator"; }

function cpuPercent() {
  const now = process.hrtime.bigint();
  const elapsedMicros = Number(now - lastCpuAt) / 1000;
  const usage = process.cpuUsage(lastCpuUsage);
  lastCpuUsage = process.cpuUsage();
  lastCpuAt = now;
  if (!elapsedMicros || elapsedMicros <= 0) return null;
  return Math.min(100, Number(((usage.user + usage.system) / elapsedMicros * 100).toFixed(2)));
}

app.get("/api/health", async (_req, res) => { await refreshCollectors(); res.json({ status: "ok", service: "ftn-cert-control", environment: NODE_ENV, uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000), storage: useDatabase ? "postgres" : "memory-fallback", liveCollectorsConfigured: collectorCount(), liveCollectorAvailable: liveCollectorAvailable(), collectors: collectorStatuses(), collectorProbeAt: collectorProbeAt ? new Date(collectorProbeAt).toISOString() : null }); });
app.get("/api/livez", (_req, res) => res.json({ status: "ok", service: "ftn-cert-control" }));
app.get("/api/readyz", async (_req, res) => { await refreshCollectors(); const result = readiness({ process: true, operatorControl: operatorControlConfigured, liveCollectors: liveCollectorAvailable() }); res.status(result.ready ? 200 : 503).json({ ...result, storage: useDatabase ? "postgres" : "memory-fallback" }); });
app.get("/api/network-status", async (_req, res) => { await refreshCollectors(); const configuredCount = collectorCount(); const live = liveCollectorAvailable(); res.json({ connected: live, status: live ? "live" : configuredCount > 0 ? "configured-but-unhealthy" : "not-configured", liveCollectorsConfigured: configuredCount, source: "live-health-probe", collectors: collectorStatuses() }); });

registerDatabaseControlRoutes(app, databaseControl, requireOperator, actor);

app.get("/api/alerts", (_req, res) => res.json([]));
app.get("/api/event-history", (_req, res) => res.json([]));
app.get("/api/audit-logs", async (_req, res) => res.json(await auditStore.list(100)));
app.get("/api/approvals", requireOperator, async (_req, res) => res.json(await approvalStore.list()));
app.post("/api/approvals", requireOperator, async (req, res) => {
  const action = typeof req.body?.action === "string" ? req.body.action.trim() : "";
  const target = typeof req.body?.target === "string" ? req.body.target.trim() : "";
  if (!action || !target) return res.status(400).json({ success: false, error: "action_and_target_required" });
  const request = await createApproval(approvalStore, action, target, actor(req));
  const audit = await recordAudit(auditStore, { action: "approval.request", actor: actor(req), target, requestId: request.id, outcome: "requested" });
  res.status(201).json({ approval: request, audit });
});
app.post("/api/approvals/:id/approve", requireOperator, async (req, res) => {
  const approved = await approveApproval(approvalStore, req.params.id);
  if (!approved) return res.status(404).json({ success: false, error: "approval_not_found_or_not_pending" });
  const record = await recordAudit(auditStore, { action: "approval.approve", actor: actor(req), target: approved.target, requestId: approved.id, outcome: approved.state === "approved" ? "approved" : "failed" });
  res.json({ approval: approved, audit: record });
});
app.post("/api/ai-insights", async (_req, res) => { if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: "AI provider is not configured" }); return res.status(501).json({ error: "AI execution adapter is not installed; no synthetic insight is returned" }); });
app.get("/api/health-check", (_req, res) => res.json(providers.map(name => ({ name, health: null, status: "unknown", error: null, source: "not-configured" }))));
app.get("/api/system-stats", (_req, res) => { const mem = process.memoryUsage(); res.json({ cpu_percent: cpuPercent(), memory: { rss_mb: +(mem.rss / 1048576).toFixed(2), heap_used_mb: +(mem.heapUsed / 1048576).toFixed(2), heap_total_mb: +(mem.heapTotal / 1048576).toFixed(2) }, active_connections: null, source: "process", host: os.hostname() }); });
app.post("/api/bulk-action", requireOperator, async (req, res) => {
  const decision = evaluatePrivilegedAction();
  const action = typeof req.body?.action === "string" ? req.body.action.trim() : "privileged.action";
  const target = typeof req.body?.target === "string" ? req.body.target.trim() : "unknown";
  const approval = await createApproval(approvalStore, action, target, actor(req));
  const audit = await recordAudit(auditStore, { action: "approval.request", actor: actor(req), target, requestId: approval.id, outcome: "requested" });
  res.status(202).json({ success: false, error: "approval_required", message: decision.reason, approval, audit });
});
app.get("/api/cert-inventory", async (_req, res) => {
  const certificates = db ? await listCertificateInventory(db) : await readConfiguredCertificates(process.env);
  res.json({ certificates, observedAt: new Date().toISOString(), configured: certificates.length > 0, source: db ? "postgres" : "configured-certificate-files" });
});
app.get("/api/ct-logs", (_req, res) => res.json({ logs: [], certificates: [], totalTrackedCertificates: 0, rfcStandards: ["RFC 6962", "RFC 9162", "RFC 8659", "RFC 8446", "RFC 6960"], ...unavailable("certificate-transparency") }));
app.post("/api/ct-issue-test-cert", requireOperator, (_req, res) => res.status(501).json({ success: false, error: "not_implemented", message: "Test certificate issuance is disabled until a real ACME/CT adapter is configured" }));
app.get("/api/edgeone-security", (_req, res) => res.json({ ...unavailable("edgeone-security"), mode: "not-configured", autoDefenseEnabled: false, totalInspectedRequests: null, blockedThreatsCount: null, autoReroutedMaliciousTrafficGbps: null, currentCleanTrafficRatio: null, wafVersion: null, ddosScrubbingCapacity: null, activePoPs: [], activeIncidents: [] }));
app.post("/api/edgeone-toggle-defense", requireOperator, (_req, res) => res.status(501).json({ success: false, error: "not_implemented", message: "EdgeOne control adapter is not configured" }));
app.post("/api/simulate-threat", (_req, res) => res.status(410).json({ success: false, error: "simulation_disabled" }));
app.get("/api/forecast", (_req, res) => res.json({ data: [], ...unavailable("forecasting") }));
app.get("/api/provider-details/:name", (req, res) => res.json({ name: req.params.name, ...unavailable("provider-intelligence") }));
app.get("/api/traffic-trend", (_req, res) => res.json([]));
app.get("/api/cert-status", async (_req, res) => { const certificates = db ? await listCertificateInventory(db) : await readConfiguredCertificates(process.env); res.json({ valid: certificates.filter(c => c.status === "valid").length, expiring: certificates.filter(c => c.status === "expiring").length, expired: certificates.filter(c => c.status === "expired").length, total: certificates.length, source: db ? "postgres" : certificates.length ? "configured-certificate-files" : "not-configured" }); });
app.get("/api/ssl-acceleration", (_req, res) => res.json([]));
app.get("/api/latency", (_req, res) => res.json(providers.map(provider => ({ provider, latency: null, errorRate: null, packetLoss: null, source: "not-configured" }))));
app.get("/api/module-trend", (_req, res) => res.json([]));
app.get("/api/traffic-map-data", (_req, res) => res.json([]));
app.get("/api/throughput-history", (_req, res) => res.json([]));
app.get("/api/traffic-anomalies", (_req, res) => res.json({ providers: [], timeSlots: [], data: [], lastUpdated: null, ...unavailable("traffic-anomaly-detection") }));

app.get("/api/metrics", async (_req, res) => { await refreshCollectors(); const uptime = Math.floor((Date.now() - startedAt) / 1000); const count = collectorCount(); const live = liveCollectorAvailable(); const approvals = await approvalStore.list(); const body = ["# HELP ftn_cert_control_uptime_seconds Process uptime in seconds", "# TYPE ftn_cert_control_uptime_seconds gauge", `ftn_cert_control_uptime_seconds ${uptime}`, "# HELP ftn_cert_control_provider_count Provider names known to the UI", "# TYPE ftn_cert_control_provider_count gauge", `ftn_cert_control_provider_count ${providers.length}`, "# HELP ftn_cert_control_collectors_configured Number of configured collector endpoints", "# TYPE ftn_cert_control_collectors_configured gauge", `ftn_cert_control_collectors_configured ${count}`, "# HELP ftn_cert_control_live_collector_available Whether at least one collector has a confirmed live health state", "# TYPE ftn_cert_control_live_collector_available gauge", `ftn_cert_control_live_collector_available ${live ? 1 : 0}`, "# HELP ftn_cert_control_operator_control_configured Whether privileged operator control is configured", "# TYPE ftn_cert_control_operator_control_configured gauge", `ftn_cert_control_operator_control_configured ${operatorControlConfigured ? 1 : 0}`, "# HELP ftn_cert_control_persistence_configured Whether PostgreSQL persistence is configured", "# TYPE ftn_cert_control_persistence_configured gauge", `ftn_cert_control_persistence_configured ${useDatabase ? 1 : 0}`, "# HELP ftn_cert_control_pending_approvals Number of pending operator approvals", "# TYPE ftn_cert_control_pending_approvals Number of pending operator approvals", `ftn_cert_control_pending_approvals ${approvals.filter(a => a.state === "pending").length}`].join("\n") + "\n"; res.type("text/plain; version=0.0.4").send(body); });
app.get("/api/export-report", async (_req, res) => { await refreshCollectors(); const count = collectorCount(); res.setHeader("Content-Type", "application/json"); res.setHeader("Content-Disposition", "attachment; filename=ftn-cert-control-report.json"); res.send(JSON.stringify({ timestamp: new Date().toISOString(), service: "ftn-cert-control", status: "live-api", syntheticData: false, storage: useDatabase ? "postgres" : "memory-fallback", liveCollectorsConfigured: count, liveCollectorAvailable: liveCollectorAvailable(), collectors: collectorStatuses(), approvals: await approvalStore.list(), auditLogs: await auditStore.list(100) }, null, 2)); });

if (NODE_ENV !== "production") { const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" }); app.use(vite.middlewares); } else { const distPath = path.join(process.cwd(), "dist"); app.use(express.static(distPath, { index: "index.html" })); app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html"))); }

const server = app.listen(PORT, "0.0.0.0", () => console.log(`ftn-cert-control listening on :${PORT} storage=${useDatabase ? "postgres" : "memory-fallback"}`));

async function shutdown(signal: string) {
  console.log(`ftn-cert-control shutting down: ${signal}`);
  server.close(async () => {
    const pool = db as (typeof db & { end?: () => Promise<void> }) | undefined;
    if (pool?.end) await pool.end();
    process.exit(0);
  });
}
process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGINT", () => void shutdown("SIGINT"));
