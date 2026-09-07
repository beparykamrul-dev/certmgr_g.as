import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/alerts", (req, res) => {
    res.json([
      { id: 1, message: "Critical: PKI Core sync failure detected.", severity: "high" },
      { id: 2, message: "Warning: API Gateway latency above 200ms.", severity: "medium" }
    ]);
  });

  app.get("/api/event-history", (req, res) => {
    res.json([
      { id: 1, section: "API", event: "Status changed to Warning", timestamp: "10:00 AM" },
      { id: 2, section: "Auth / RBAC", event: "Unauthorized access attempt", timestamp: "09:45 AM" },
      { id: 3, section: "Monitoring", event: "Alert threshold breached", timestamp: "09:30 AM" },
      { id: 4, section: "Docker", event: "Container restart triggered", timestamp: "09:15 AM" },
      { id: 5, section: "CI/CD", event: "Build failed", timestamp: "09:00 AM" }
    ]);
  });

  app.post("/api/ai-insights", async (req, res) => {
    // Basic implementation using Gemini
    const { data } = req.body;
    
    // In a real app, instantiate the client correctly with User-Agent header
    // import { GoogleGenAI } from "@google/genai";
    // const ai = new GoogleGenAI({
    //   apiKey: process.env.GEMINI_API_KEY,
    //   httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    // });
    
    // Mock response for simplicity in this turn
    res.json({ insights: "Based on current monitoring data (latency/loss), the API Gateway shows elevated latency. Suggest increasing replica counts for the Auth service to mitigate risk." });
  });

  // Keep health somewhat stable for demo purposes
  const providerState = new Map();
  const providers = ["Google", "AWS", "Cloudflare", "Facebook/Meta", "Netflix", "EdgeNext", "Akamai", "TikTok/ByteDance", "Ookla", "IMO", "PUBG", "Free Fire", "Fastly", "Bunny", "Tencent Cloud", "Alibaba Cloud", "Oracle Cloud", "DigitalOcean", "Linode", "Vultr", "Hetzner", "OVHcloud", "IBM Cloud", "Microsoft Azure"];
  
  providers.forEach(p => providerState.set(p, 95 + Math.floor(Math.random() * 5))); // Initialize healthy

  app.get("/api/health-check", (req, res) => {
    // Randomly degrade one provider occasionally for the demo
    if (Math.random() > 0.7) {
      const target = providers[Math.floor(Math.random() * 4)]; // Target one of the first few
      if (providerState.get(target) > 60) {
        providerState.set(target, Math.floor(Math.random() * 30) + 20); // Drop to 20-50%
      }
    }
    
    // Recover slowly
    providers.forEach(p => {
       const current = providerState.get(p);
       if (current < 95) providerState.set(p, current + 5);
    });

    res.json(providers.map(p => ({ 
      name: p, 
      health: providerState.get(p), 
      error: providerState.get(p) < 60 ? '503' : null 
    })));
  });

  app.post("/api/bulk-action", (req, res) => {
    const { action, providers } = req.body;
    console.log(`Executing ${action} on ${providers.join(', ')}`);
    res.json({ success: true, message: `${action} completed for ${providers.length} providers.` });
  });

  app.get("/api/system-stats", (req, res) => {
    res.json({
      cpuUsage: Math.floor(Math.random() * 20) + 15,
      memoryUsage: Math.floor(Math.random() * 25) + 38,
      activeConnections: Math.floor(Math.random() * 400) + 1240
    });
  });

  // Certificate Transparency (RFC 6962 / Google CT / Let's Encrypt Test Certs)
  const ctLogsState = [
    {
      id: "google-argon-2026",
      name: "Google 'Argon 2026' Log",
      operator: "Google Trust Services",
      url: "https://ct.googleapis.com/logs/argon2026",
      status: "Usable (RFC 6962)",
      treeSize: 1482920412,
      sthTimestamp: new Date().toISOString(),
      rootHash: "9a7d3f8e2c1b4a5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
      compliance: "RFC 6962 & RFC 9162 Compliant",
      inclusionProofLatency: "28ms"
    },
    {
      id: "google-xenon-2027",
      name: "Google 'Xenon 2027' Log",
      operator: "Google Trust Services",
      url: "https://ct.googleapis.com/logs/xenon2027",
      status: "Usable (RFC 6962)",
      treeSize: 981240192,
      sthTimestamp: new Date().toISOString(),
      rootHash: "4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b19a7d3f8e2c1b",
      compliance: "RFC 6962 & RFC 9162 Compliant",
      inclusionProofLatency: "34ms"
    },
    {
      id: "letsencrypt-oak-2026",
      name: "Let's Encrypt 'Oak 2026' Log",
      operator: "Internet Security Research Group (ISRG)",
      url: "https://oak.ct.letsencrypt.org/2026",
      status: "Usable (RFC 6962)",
      treeSize: 1120491823,
      sthTimestamp: new Date().toISOString(),
      rootHash: "1f2e3d4c5b6a708192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
      compliance: "RFC 6962 & ACME Staging Compatible",
      inclusionProofLatency: "22ms"
    },
    {
      id: "letsencrypt-test-certs",
      name: "Let's Encrypt Test-Certs-Site Staging Log",
      operator: "Let's Encrypt Staging Environment",
      url: "https://acme-staging-v02.api.letsencrypt.org/directory",
      status: "Testing / Validation",
      treeSize: 45291034,
      sthTimestamp: new Date().toISOString(),
      rootHash: "7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
      compliance: "Automated ACME v2 Sandbox",
      inclusionProofLatency: "19ms"
    },
    {
      id: "cloudflare-nimbus-2026",
      name: "Cloudflare 'Nimbus 2026' Log",
      operator: "Cloudflare, Inc.",
      url: "https://ct.cloudflare.com/logs/nimbus2026",
      status: "Usable (RFC 6962)",
      treeSize: 843912091,
      sthTimestamp: new Date().toISOString(),
      rootHash: "0a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5",
      compliance: "RFC 6962 RFC 9162 Compliant",
      inclusionProofLatency: "25ms"
    }
  ];

  let testCertsList = [
    {
      id: "cert-001",
      domain: "*.familytime.net",
      san: ["familytime.net", "api.familytime.net", "auth.familytime.net", "cdn.familytime.net"],
      issuer: "Let's Encrypt Authority E1",
      serialNumber: "04:3A:9F:81:B2:7D:6E:5C:4B:3A:29:18:F0:E4:D3:C2",
      validFrom: "2026-08-01",
      validTo: "2026-11-01",
      algorithm: "ECDSA P-256 with SHA-256",
      sctVerified: true,
      sctLog: "Google 'Argon 2026' + Let's Encrypt 'Oak 2026'",
      ctEntryIndex: 1482920390,
      merkleVerified: true,
      ocspStapling: "Good (RFC 6960)",
      hstsPreload: true
    },
    {
      id: "cert-002",
      domain: "edgeone.familytime.net",
      san: ["edgeone.familytime.net", "gateway.edgeone.tencent.com"],
      issuer: "Tencent Cloud EdgeOne DV Server CA",
      serialNumber: "03:D8:E7:C6:B5:A4:93:82:71:60:5F:4E:3D:2C:1B:0A",
      validFrom: "2026-07-15",
      validTo: "2027-07-15",
      algorithm: "RSA-4096 with SHA-384",
      sctVerified: true,
      sctLog: "Google 'Xenon 2027' + Cloudflare 'Nimbus 2026'",
      ctEntryIndex: 981240150,
      merkleVerified: true,
      ocspStapling: "Good (RFC 6960)",
      hstsPreload: true
    },
    {
      id: "cert-003",
      domain: "test-staging.letsencrypt.org",
      san: ["test-staging.letsencrypt.org", "sandbox-acme.familytime.net"],
      issuer: "(STAGING) Artificial Let's Encrypt Root",
      serialNumber: "00:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88",
      validFrom: "2026-09-01",
      validTo: "2026-12-01",
      algorithm: "ECDSA P-384 with SHA-384",
      sctVerified: true,
      sctLog: "Let's Encrypt Test-Certs-Site Log",
      ctEntryIndex: 45291028,
      merkleVerified: true,
      ocspStapling: "Active (Mock OCSP responder)",
      hstsPreload: false
    }
  ];

  app.get("/api/ct-logs", (req, res) => {
    res.json({
      logs: ctLogsState,
      certificates: testCertsList,
      totalTrackedCertificates: 2489100,
      rfcStandards: ["RFC 6962 (Certificate Transparency)", "RFC 9162 (CT v2.0)", "RFC 8659 (DNS CAA)", "RFC 8446 (TLS 1.3)", "RFC 6960 (OCSP)"]
    });
  });

  app.post("/api/ct-issue-test-cert", (req, res) => {
    const { domain, algorithm = "ECDSA P-256" } = req.body;
    const cleanDomain = (domain || "dev-test.familytime.net").trim().toLowerCase();
    
    const newCert = {
      id: `cert-${Date.now()}`,
      domain: cleanDomain,
      san: [cleanDomain, `www.${cleanDomain}`],
      issuer: "Let's Encrypt Staging CA (test-certs-site)",
      serialNumber: Array.from({length: 16}, () => Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':').toUpperCase(),
      validFrom: new Date().toISOString().split('T')[0],
      validTo: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      algorithm: algorithm,
      sctVerified: true,
      sctLog: "Let's Encrypt 'Oak 2026' + Test-Certs Staging",
      ctEntryIndex: Math.floor(Math.random() * 100000) + 1482920400,
      merkleVerified: true,
      ocspStapling: "Good (RFC 6960)",
      hstsPreload: true
    };

    testCertsList.unshift(newCert);
    if (testCertsList.length > 20) testCertsList.pop();

    res.json({
      success: true,
      certificate: newCert,
      message: `Issued RFC 6962 audited test certificate for ${cleanDomain}`
    });
  });

  // Tencent Cloud EdgeOne Security Gateway & Malicious Activity Auto-Mitigation
  let edgeOneState = {
    mode: "Auto-Mitigation Active",
    autoDefenseEnabled: true,
    totalInspectedRequests: 148920150,
    blockedThreatsCount: 4281,
    autoReroutedMaliciousTrafficGbps: 18.4,
    currentCleanTrafficRatio: 99.88,
    wafVersion: "EdgeOne WAF v4.2.0-CRS",
    ddosScrubbingCapacity: "3.2 Tbps Anycast",
    activePoPs: [
      { id: "pop-sg", name: "Singapore Anycast PoP", lat: 1.3521, lng: 103.8198, latency: 18, status: "Healthy", load: "42%" },
      { id: "pop-hk", name: "Hong Kong EdgeOne PoP", lat: 22.3193, lng: 114.1694, latency: 15, status: "Healthy", load: "58%" },
      { id: "pop-tokyo", name: "Tokyo EdgeOne PoP", lat: 35.6762, lng: 139.6503, latency: 26, status: "Healthy", load: "48%" },
      { id: "pop-mumbai", name: "Mumbai Shield PoP", lat: 19.0760, lng: 72.8777, latency: 22, status: "Healthy", load: "39%" },
      { id: "pop-fra", name: "Frankfurt Origin Shield", lat: 50.1109, lng: 8.6821, latency: 98, status: "Healthy", load: "51%" },
      { id: "pop-sv", name: "Silicon Valley EdgeOne", lat: 37.3861, lng: -122.0839, latency: 140, status: "Healthy", load: "45%" },
      { id: "pop-dhaka", name: "Dhaka BDIX Direct Gateway", lat: 23.8103, lng: 90.4125, latency: 6, status: "Healthy", load: "62%" }
    ],
    activeIncidents: [
      {
        id: "inc-101",
        type: "Criminal SQLi & WebShell Exploit",
        attackerIp: "185.220.101.42",
        country: "NL (Tor Exit)",
        target: "/api/v1/auth/login",
        severity: "CRITICAL",
        autoAction: "Auto-Blocked at EdgeOne WAF & IP Quarantined",
        mitigatedAt: new Date(Date.now() - 4 * 60000).toLocaleTimeString(),
        status: "Auto-Mitigated"
      },
      {
        id: "inc-102",
        type: "Malicious Layer-7 Botnet Flood (85,000 RPS)",
        attackerIp: "Multiple Botnet Nodes (ASN 49505)",
        country: "RU / BR / VN",
        target: "/api/health-check",
        severity: "HIGH",
        autoAction: "Auto-Rerouted to EdgeOne Scrubbing Sinkhole (Zero Impact)",
        mitigatedAt: new Date(Date.now() - 14 * 60000).toLocaleTimeString(),
        status: "Auto-Mitigated"
      },
      {
        id: "inc-103",
        type: "Rogue CA Certificate Forgery / Spoofing Attempt",
        attackerIp: "194.26.29.11",
        country: "UA",
        target: "TLS Handshake (*.familytime.net)",
        severity: "CRITICAL",
        autoAction: "CT Log Inclusion Check Failed -> Dropped Handshake Immediately",
        mitigatedAt: new Date(Date.now() - 28 * 60000).toLocaleTimeString(),
        status: "Auto-Mitigated"
      }
    ]
  };

  app.get("/api/edgeone-security", (req, res) => {
    res.json(edgeOneState);
  });

  app.post("/api/edgeone-toggle-defense", (req, res) => {
    const { enabled } = req.body;
    edgeOneState.autoDefenseEnabled = enabled !== undefined ? enabled : !edgeOneState.autoDefenseEnabled;
    edgeOneState.mode = edgeOneState.autoDefenseEnabled ? "Auto-Mitigation Active" : "Learning / Alert Only";
    res.json({ success: true, autoDefenseEnabled: edgeOneState.autoDefenseEnabled, mode: edgeOneState.mode });
  });

  app.post("/api/simulate-threat", (req, res) => {
    const { threatType } = req.body;
    const threats = [
      {
        type: "Criminal Credential Stuffing & Brute Force",
        ip: "45.154.255.88",
        country: "DE",
        target: "/api/auth/token",
        severity: "CRITICAL",
        autoAction: "Auto-Mitigated: IP Added to EdgeOne Banning Table & Honeypot Rerouted"
      },
      {
        type: "Volumetric L7 HTTP Flood (120,000 RPS)",
        ip: "Distributed Mirai Variant (ASN 136258)",
        country: "Global Botnet",
        target: "/gateway/traffic",
        severity: "HIGH",
        autoAction: "Auto-Mitigated: Scrubbed via Anycast DDoS Shield, Ingress Normalized"
      },
      {
        type: "Unauthorized Certificate Impersonation Attack",
        ip: "103.145.13.22",
        country: "HK",
        target: "TLS Ingress SNI familytime.net",
        severity: "CRITICAL",
        autoAction: "Auto-Mitigated: Cryptographic SCT Verification Failed -> Connection Terminated"
      }
    ];

    const selectedThreat = threats.find(t => t.type.includes(threatType)) || threats[Math.floor(Math.random() * threats.length)];
    const newIncident = {
      id: `inc-${Date.now()}`,
      type: selectedThreat.type,
      attackerIp: selectedThreat.ip,
      country: selectedThreat.country,
      target: selectedThreat.target,
      severity: selectedThreat.severity,
      autoAction: selectedThreat.autoAction,
      mitigatedAt: new Date().toLocaleTimeString(),
      status: "Auto-Mitigated"
    };

    edgeOneState.blockedThreatsCount += 1;
    edgeOneState.activeIncidents.unshift(newIncident);
    if (edgeOneState.activeIncidents.length > 25) edgeOneState.activeIncidents.pop();

    res.json({
      success: true,
      incident: newIncident,
      message: `EdgeOne Auto-Mitigation triggered: ${newIncident.type} was instantly neutralized.`
    });
  });

  app.get("/api/audit-logs", (req, res) => {
    const { section } = req.query;
    const logs = [
      { id: 1, action: "User logged in", user: "admin", time: "10:00 AM", section: "Auth" },
      { id: 2, action: "Certificate renewed", user: "system", time: "09:45 AM", section: "Cert" },
      { id: 3, action: "System update", user: "admin", time: "09:00 AM", section: "System" }
    ];
    if (section) {
      res.json(logs.filter(log => log.section === section));
    } else {
      res.json(logs);
    }
  });

  app.get("/api/forecast", (req, res) => {
    res.json({ forecast: "Bottlenecks expected in 15 days for PKI certificates." });
  });

  app.get("/api/provider-details/:name", (req, res) => {
    res.json({
      name: req.params.name,
      certExpiry: "2026-12-31",
      activeIncidents: Math.floor(Math.random() * 5),
      latencyAverage: 25,
      trend: Math.random() > 0.5 ? 'up' : 'down'
    });
  });

  app.get("/api/traffic-trend", (req, res) => {
    const context = req.query.context as string;
    const isLocal = context === 'Local Device';
    
    // Mock time series data
    const data = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() - (23 - i) * 3600 * 1000);
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ingress: isLocal ? Math.floor(Math.random() * 100) + 20 : Math.floor(Math.random() * 500) + 200,
        egress: isLocal ? Math.floor(Math.random() * 80) + 10 : Math.floor(Math.random() * 400) + 150,
        silkTraffic: isLocal ? Math.floor(Math.random() * 500) + 50 : Math.floor(Math.random() * 800) + 100,
        errorRate: isLocal ? Math.random() * 2 : Math.random() * 5 // lower errors locally usually
      });
    }
    res.json(data);
  });

  app.get("/api/cert-status", (req, res) => {
    res.json([
      { name: "Valid (>30d)", value: 450, color: "#10b981" },
      { name: "Expiring (<30d)", value: 35, color: "#f59e0b" },
      { name: "Critical (<7d)", value: 12, color: "#ef4444" },
      { name: "Expired", value: 3, color: "#6b7280" }
    ]);
  });

  app.get("/api/ssl-acceleration", (req, res) => {
    // Generate 60 data points (e.g. last 60 minutes)
    const data = [];
    let baseHw = 8000;
    let baseSw = 2000;
    
    for(let i=0; i<60; i++) {
        // HW usually handles bulk, SW handles fallback/complex cipher suites
        baseHw += (Math.random() * 1000 - 400); 
        baseSw += (Math.random() * 200 - 100);
        
        // Occasional spike in SW fallback due to unoptimized handshakes
        const isSpike = Math.random() > 0.9;
        
        data.push({
            time: `-${60-i}m`,
            hwOffload: Math.max(5000, Math.floor(baseHw)),
            swFallback: Math.max(500, Math.floor(isSpike ? baseSw * 2.5 : baseSw)),
            efficiency: Math.min(99.9, Math.max(85, 95 + (Math.random() * 5 - 2))) // %
        });
    }
    res.json(data);
  });

  app.get("/api/latency", (req, res) => {
    const context = req.query.context as string;
    const isLocal = context === 'Local Device';

    const baseData = [
      { provider: "Google", latency: 15, silkSpike: 18, errorRate: 0.1, packetLoss: 0.01 },
      { provider: "AWS", latency: 45, silkSpike: 65, errorRate: 2.5, packetLoss: 0.5 },
      { provider: "Cloudflare", latency: 12, silkSpike: 14, errorRate: 0.05, packetLoss: 0 },
      { provider: "Akamai", latency: 30, silkSpike: 45, errorRate: 1.2, packetLoss: 0.2 },
      { provider: "Facebook/Meta", latency: 18, silkSpike: 22, errorRate: 0.2, packetLoss: 0.05 },
      { provider: "Netflix", latency: 35, silkSpike: 40, errorRate: 0.8, packetLoss: 0.1 },
      { provider: "EdgeNext", latency: 22, silkSpike: 30, errorRate: 0.5, packetLoss: 0.1 },
      { provider: "TikTok/ByteDance", latency: 28, silkSpike: 35, errorRate: 0.6, packetLoss: 0.2 },
      { provider: "Ookla", latency: 42, silkSpike: 55, errorRate: 2.1, packetLoss: 0.4 },
      { provider: "IMO", latency: 55, silkSpike: 70, errorRate: 3.5, packetLoss: 1.2 },
      { provider: "PUBG", latency: 38, silkSpike: 45, errorRate: 1.1, packetLoss: 0.3 },
      { provider: "Free Fire", latency: 40, silkSpike: 50, errorRate: 1.3, packetLoss: 0.4 },
      { provider: "Fastly", latency: 20, silkSpike: 25, errorRate: 0.3, packetLoss: 0.02 },
      { provider: "Bunny", latency: 25, silkSpike: 28, errorRate: 0.4, packetLoss: 0.05 },
      { provider: "Tencent Cloud", latency: 33, silkSpike: 42, errorRate: 0.9, packetLoss: 0.2 },
      { provider: "Alibaba Cloud", latency: 35, silkSpike: 45, errorRate: 1.0, packetLoss: 0.2 },
      { provider: "Oracle Cloud", latency: 28, silkSpike: 32, errorRate: 0.7, packetLoss: 0.1 },
      { provider: "DigitalOcean", latency: 22, silkSpike: 26, errorRate: 0.2, packetLoss: 0.05 },
      { provider: "Linode", latency: 24, silkSpike: 29, errorRate: 0.3, packetLoss: 0.05 },
      { provider: "Vultr", latency: 26, silkSpike: 31, errorRate: 0.4, packetLoss: 0.08 },
      { provider: "Hetzner", latency: 20, silkSpike: 24, errorRate: 0.2, packetLoss: 0.02 },
      { provider: "OVHcloud", latency: 23, silkSpike: 28, errorRate: 0.3, packetLoss: 0.05 },
      { provider: "IBM Cloud", latency: 32, silkSpike: 38, errorRate: 0.8, packetLoss: 0.1 },
      { provider: "Microsoft Azure", latency: 30, silkSpike: 35, errorRate: 0.7, packetLoss: 0.1 }
    ];

    if (isLocal) {
      // Return lower latency and modified stats simulating direct local BDIX/PoP routes
      res.json(baseData.map(d => ({
        ...d,
        latency: Math.max(5, Math.floor(d.latency * 0.4)),
        silkSpike: Math.max(8, Math.floor(d.silkSpike * 0.5)),
        errorRate: +(d.errorRate * 0.3).toFixed(2),
        packetLoss: +(d.packetLoss * 0.1).toFixed(3)
      })));
    } else {
      res.json(baseData);
    }
  });

  app.get("/api/module-trend", (req, res) => {
    const moduleName = req.query.module as string || 'Unknown';
    const status = req.query.status as string || 'green';
    
    // Generate 60 data points representing 1 hour of data (1 point per minute)
    let seed = 0;
    for (let i = 0; i < moduleName.length; i++) {
        seed += moduleName.charCodeAt(i);
    }
    
    const data = [];
    for (let i = 0; i < 60; i++) {
      let baseHealth = status === 'green' ? 95 : status === 'yellow' ? 70 : 40;
      let baseLatency = status === 'green' ? 20 : status === 'yellow' ? 80 : 200;
      let baseError = status === 'green' ? 0.1 : status === 'yellow' ? 2.5 : 8.0;
      
      let noiseH = (Math.sin(seed + i) * 5) + (Math.cos(seed * i) * 2);
      let noiseL = (Math.cos(seed + i) * 15) + (Math.sin(seed * i) * 10);
      let noiseE = Math.abs((Math.sin(seed + i) * 1) + (Math.cos(seed * i) * 0.5));
      
      data.push({
        time: `-${60 - i}m`,
        health: Math.max(0, Math.min(100, baseHealth + noiseH)),
        latency: Math.max(1, baseLatency + noiseL),
        errorRate: Math.max(0, baseError + noiseE)
      });
    }
    res.json(data);
  });

  app.get("/api/traffic-map-data", (req, res) => {
    res.json([
      { name: "Singapore (AWS)", coordinates: [103.8198, 1.3521], flow: 600, latency: 45 },
      { name: "Mumbai (GCP)", coordinates: [72.8777, 19.0760], flow: 450, latency: 32 },
      { name: "Frankfurt (Linode)", coordinates: [8.6821, 50.1109], flow: 200, latency: 135 },
      { name: "Tokyo (Azure)", coordinates: [139.6917, 35.6895], flow: 350, latency: 110 },
      { name: "Sydney (Cloudflare)", coordinates: [151.2093, -33.8688], flow: 150, latency: 220 }
    ]);
  });

  app.get("/api/throughput-history", (req, res) => {
    const now = Date.now();
    const data = [];
    const baseLoad = 420; // Gbps
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now - i * 3600 * 1000);
      // Realistic diurnal curve + upward growth trend + noise
      const hourOfDay = time.getHours();
      const diurnal = Math.sin((hourOfDay - 6) * (Math.PI / 12)) * 120;
      const trendGrowth = (24 - i) * 3.8; // gradual 3.8 Gbps/hr growth
      const noise = (Math.sin(i * 1.7) * 22) + (Math.cos(i * 3.1) * 15);
      const total = Math.max(150, Math.round(baseLoad + diurnal + trendGrowth + noise));
      const ingress = Math.round(total * 0.54);
      const egress = Math.round(total * 0.31);
      const silk = total - ingress - egress;

      data.push({
        step: 24 - i, // 0..24
        timestamp: time.toISOString(),
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        throughput: total,
        ingress,
        egress,
        silk
      });
    }
    res.json(data);
  });

  app.get("/api/traffic-anomalies", (req, res) => {
    const providers = [
      "Google", "AWS", "Cloudflare", "Akamai", 
      "Meta", "Netflix", "EdgeNext", "TikTok", 
      "Microsoft Azure", "Fastly"
    ];
    const timeSlots = ["-60m", "-50m", "-40m", "-30m", "-20m", "-10m", "Now"];
    
    // Seeded pseudo-random variations with controlled spikes/drops
    const matrix: any[] = [];
    providers.forEach((provider, pIdx) => {
      let baseline = 180 + (pIdx * 45);
      timeSlots.forEach((slot, tIdx) => {
        let deviation = Math.sin((pIdx + 1) * 1.5 + (tIdx + 1) * 0.8) * 18;
        
        // Injected known operational anomalies
        if (provider === "Cloudflare" && (slot === "-20m" || slot === "-10m" || slot === "Now")) {
          deviation += 54; // Severe spike
        } else if (provider === "AWS" && slot === "-30m") {
          deviation += 48; // Transient spike
        } else if (provider === "Netflix" && (slot === "-40m" || slot === "-30m")) {
          deviation -= 42; // Cache offload drop
        } else if (provider === "Meta" && slot === "Now") {
          deviation += 36; // Evening peak spike
        } else if (provider === "EdgeNext" && slot === "-10m") {
          deviation -= 38; // ISP peering drop
        }

        const deviationPct = Math.round(deviation);
        const currentGbps = Math.max(20, Math.round(baseline * (1 + deviationPct / 100)));
        const status = deviationPct >= 30 ? 'spike' : deviationPct <= -25 ? 'drop' : 'normal';

        matrix.push({
          provider,
          time: slot,
          deviationPct,
          baselineGbps: baseline,
          currentGbps,
          status
        });
      });
    });

    res.json({
      providers,
      timeSlots,
      data: matrix,
      lastUpdated: new Date().toISOString()
    });
  });

  app.get("/api/export-report", (req, res) => {
    const report = { timestamp: new Date().toISOString(), status: "summary", certificates: "ok", traffic: "normal" };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=report.json');
    res.send(JSON.stringify(report, null, 2));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
