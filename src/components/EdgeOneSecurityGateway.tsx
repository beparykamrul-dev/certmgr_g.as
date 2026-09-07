import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Radio, 
  AlertTriangle, 
  RefreshCw, 
  Server, 
  ArrowRight, 
  Play, 
  Lock, 
  CheckCircle2, 
  Activity,
  Globe,
  Sliders,
  Bell,
  Cpu
} from 'lucide-react';

interface EdgePoP {
  id: string;
  name: string;
  lat: number;
  lng: number;
  latency: number;
  status: string;
  load: string;
}

interface Incident {
  id: string;
  type: string;
  attackerIp: string;
  country: string;
  target: string;
  severity: string;
  autoAction: string;
  mitigatedAt: string;
  status: string;
}

interface EdgeOneData {
  mode: string;
  autoDefenseEnabled: boolean;
  totalInspectedRequests: number;
  blockedThreatsCount: number;
  autoReroutedMaliciousTrafficGbps: number;
  currentCleanTrafficRatio: number;
  wafVersion: string;
  ddosScrubbingCapacity: string;
  activePoPs: EdgePoP[];
  activeIncidents: Incident[];
}

export default function EdgeOneSecurityGateway() {
  const [data, setData] = useState<EdgeOneData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [recentMitigation, setRecentMitigation] = useState<Incident | null>(null);
  const [selectedPoP, setSelectedPoP] = useState<EdgePoP | null>(null);
  const [autoDefense, setAutoDefense] = useState<boolean>(true);

  const fetchEdgeOneData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/edgeone-security');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setAutoDefense(json.autoDefenseEnabled);
      }
    } catch (err) {
      console.error('Failed to fetch EdgeOne data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEdgeOneData();
    const interval = setInterval(fetchEdgeOneData, 12000);
    return () => clearInterval(interval);
  }, []);

  const toggleAutoDefense = async () => {
    try {
      const nextState = !autoDefense;
      setAutoDefense(nextState);
      const res = await fetch('/api/edgeone-toggle-defense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState })
      });
      if (res.ok) {
        const result = await res.json();
        setData(prev => prev ? { ...prev, autoDefenseEnabled: result.autoDefenseEnabled, mode: result.mode } : null);
        
        // Dispatch audit log
        const evt = new CustomEvent('addAuditLog', {
          detail: {
            action: `Tencent Cloud EdgeOne Auto-Defense ${nextState ? 'ARMED (Automated Mitigation Active)' : 'SET TO MONITORING'}`,
            user: 'SecOps Officer'
          }
        });
        window.dispatchEvent(evt);
      }
    } catch (err) {
      console.error('Failed to toggle defense:', err);
    }
  };

  const handleSimulateThreat = async (threatType: string) => {
    try {
      setIsSimulating(true);
      const res = await fetch('/api/simulate-threat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threatType })
      });

      if (res.ok) {
        const result = await res.json();
        const incident: Incident = result.incident;
        setRecentMitigation(incident);

        // Update local state
        setData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            blockedThreatsCount: prev.blockedThreatsCount + 1,
            activeIncidents: [incident, ...prev.activeIncidents]
          };
        });

        // Broadcast attack event to triggers
        const attackEvt = new CustomEvent('attackDetected', {
          detail: {
            type: incident.type,
            target: incident.target,
            autoAction: incident.autoAction
          }
        });
        window.dispatchEvent(attackEvt);

        // Add audit trail entry
        const auditEvt = new CustomEvent('addAuditLog', {
          detail: {
            action: `[CRIMINAL THREAT NEUTRALIZED] ${incident.type} from ${incident.attackerIp} -> ${incident.autoAction}`,
            user: 'EdgeOne Auto-Defense Engine'
          }
        });
        window.dispatchEvent(auditEvt);

        setTimeout(() => setRecentMitigation(null), 6000);
      }
    } catch (err) {
      console.error('Threat simulation failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div id="section-edgeone-gateway" className="pt-2 space-y-4">
      {/* Header with Tencent Cloud EdgeOne branding */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-gray-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Zap className="text-amber-500" size={20} />
              Tencent Cloud EdgeOne Security Gateway
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
              <Radio size={10} className="animate-pulse text-emerald-500" /> Auto-Mitigation Active
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Unified L4/L7 Anycast Gateway, DDoS Scrubbing Shield (3.2 Tbps), and automated neutralization of criminal cyber attacks
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Auto Defense Toggle Button */}
          <button
            onClick={toggleAutoDefense}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-xs ${
              autoDefense
                ? 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600'
                : 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
            }`}
          >
            <ShieldCheck size={14} />
            {autoDefense ? 'Auto-Mitigation: ENFORCED' : 'Auto-Mitigation: PAUSED'}
          </button>

          <button
            onClick={fetchEdgeOneData}
            disabled={loading}
            className="p-1.5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#252525] border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-600 dark:text-gray-300 transition-colors"
            title="Refresh Gateway Metrics"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Real-time Auto-Mitigation Toast Alert */}
      {recentMitigation && (
        <div className="p-3.5 bg-red-500/10 border-2 border-red-500/40 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-3 shadow-lg">
          <ShieldAlert size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wide">
                Criminal Activity Intercepted:
              </span>
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{recentMitigation.type}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 rounded">
                IP: {recentMitigation.attackerIp} ({recentMitigation.country})
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 size={13} /> {recentMitigation.autoAction}
            </p>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">{recentMitigation.mitigatedAt}</span>
        </div>
      )}

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-white/5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-semibold">Total Inspected Ingress</span>
            <Activity size={14} className="text-blue-500" />
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100 font-mono">
            {data ? (data.totalInspectedRequests / 1000000).toFixed(1) + 'M' : '148.9M'}
          </p>
          <span className="text-[10px] text-emerald-500 font-semibold">100% L4/L7 WAF Inspected</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-white/5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-semibold">Threats Auto-Mitigated</span>
            <ShieldCheck size={14} className="text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-500 font-mono">
            {data?.blockedThreatsCount.toLocaleString() || '4,281'}
          </p>
          <span className="text-[10px] text-emerald-500 font-semibold">0ms Origin Impact (Zero-Trust)</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-white/5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-semibold">DDoS Scrubbing Shield</span>
            <Flame size={14} className="text-amber-500" />
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100 font-mono">
            {data?.ddosScrubbingCapacity || '3.2 Tbps'}
          </p>
          <span className="text-[10px] text-gray-400 font-medium">Tencent Anycast Backbone</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-white/5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-semibold">Clean Traffic Ratio</span>
            <Lock size={14} className="text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-indigo-500 font-mono">
            {data?.currentCleanTrafficRatio || 99.88}%
          </p>
          <span className="text-[10px] text-gray-400 font-medium">Auto Honeypot Reroute Active</span>
        </div>
      </div>

      {/* Threat Simulation & Malicious Defense Lab */}
      <div className="p-4 bg-gray-50 dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h4 className="text-xs md:text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Play size={14} className="text-amber-500" />
              Automated Criminal Activity Mitigation Tester (Live Simulation Lab)
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Trigger a simulated cyber attack to verify instant EdgeOne automated isolation, IP blacklisting, and traffic scrubbing
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-500/20 font-bold">
            Safe Sandbox
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => handleSimulateThreat('Criminal Credential Stuffing')}
            disabled={isSimulating}
            className="p-3 bg-white dark:bg-[#1a1a1a] hover:bg-red-50 dark:hover:bg-red-500/10 border border-gray-200 dark:border-white/10 hover:border-red-500/40 rounded-xl text-left transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-500 transition-colors">
                1. Test Credential Stuffing
              </span>
              <AlertTriangle size={13} className="text-red-500" />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Simulates Tor brute force on /api/auth. Watch instant IP drop & honeypot trapping.
            </p>
          </button>

          <button
            onClick={() => handleSimulateThreat('Volumetric L7 HTTP Flood')}
            disabled={isSimulating}
            className="p-3 bg-white dark:bg-[#1a1a1a] hover:bg-amber-50 dark:hover:bg-amber-500/10 border border-gray-200 dark:border-white/10 hover:border-amber-500/40 rounded-xl text-left transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-amber-500 transition-colors">
                2. Test 120k RPS Bot Flood
              </span>
              <Flame size={13} className="text-amber-500" />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Simulates distributed botnet flood. Watch EdgeOne Anycast DDoS scrubbing sinkhole.
            </p>
          </button>

          <button
            onClick={() => handleSimulateThreat('Unauthorized Certificate Impersonation')}
            disabled={isSimulating}
            className="p-3 bg-white dark:bg-[#1a1a1a] hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-gray-200 dark:border-white/10 hover:border-blue-500/40 rounded-xl text-left transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition-colors">
                3. Test Rogue Cert Spoof
              </span>
              <Lock size={13} className="text-blue-500" />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Simulates unverified rogue TLS certificate. Rebuffed via RFC 6962 CT checking.
            </p>
          </button>
        </div>
      </div>

      {/* Grid: Anycast PoPs & Live Intercepted Threat Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 1 Col: EdgeOne Global PoPs & Latency */}
        <div className="p-4 bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Globe size={13} /> EdgeOne Anycast PoP Mesh
            </h4>
            <span className="text-[10px] font-bold text-emerald-500">7 Connected</span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {data?.activePoPs.map((pop) => (
              <div
                key={pop.id}
                onClick={() => setSelectedPoP(pop)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedPoP?.id === pop.id
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10'
                    : 'border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{pop.name}</p>
                  <p className="text-[10px] text-gray-400">Load: {pop.load} • Status: {pop.status}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold font-mono ${pop.latency < 20 ? 'text-emerald-500' : pop.latency < 50 ? 'text-blue-500' : 'text-amber-500'}`}>
                    {pop.latency}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Real-time Auto-Mitigated Incidents Table */}
        <div className="lg:col-span-2 p-4 bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-red-500" />
              Real-time Neutralized Criminal & Malicious Attack Ledger
            </h4>
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10">
              100% Auto-Mitigated
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#181818] border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 uppercase text-[9px] tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Threat & Target</th>
                  <th className="py-2.5 px-3">Attacker IP / Location</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Automated Mitigation Action</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {data?.activeIncidents.slice(0, 5).map((inc) => (
                  <tr key={inc.id} className="hover:bg-red-50/20 dark:hover:bg-red-500/5 transition-colors">
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-[11px]">{inc.type}</p>
                      <span className="text-[9px] font-mono text-gray-400">{inc.target}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] font-bold text-gray-700 dark:text-gray-300 block">
                        {inc.attackerIp}
                      </span>
                      <span className="text-[9px] text-gray-400">{inc.country}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        inc.severity === 'CRITICAL'
                          ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={12} className="flex-shrink-0" />
                        <span>{inc.autoAction}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[10px] text-gray-400">
                      {inc.mitigatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
