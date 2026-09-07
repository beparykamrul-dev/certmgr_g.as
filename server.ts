import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

  app.get("/api/network-status", (req, res) => {
    res.json({ connected: true });
  });

  app.get("/api/audit-logs", (req, res) => {
    res.json([
      { id: 1, action: "User logged in", user: "admin", time: "10:00 AM" },
      { id: 2, action: "Certificate renewed", user: "system", time: "09:45 AM" }
    ]);
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
