import React, { useState } from 'react';
import { Network, Server, ArrowUpRight, Zap, Shield, Globe } from 'lucide-react';

interface PeerVessel {
  id: string;
  name: string;
  flag: string;
  asn: string;
  trafficVolume: string;
  latency: number;
  status: 'active' | 'optimal' | 'rerouting';
  role: string;
  coords: { x: number; y: number };
}

export default function TransitMeshTopology() {
  const [selectedVessel, setSelectedVessel] = useState<PeerVessel | null>(null);

  const hub = {
    name: "BDIX Core Gateway (AS13335)",
    status: "Primary Anycast Hub",
    x: 480,
    y: 190,
    cleanTraffic: "4.8 Tbps"
  };

  const vessels: PeerVessel[] = [
    // Top arc
    { id: 'v1', name: 'Al Moustafa IX', flag: '🇦🇪', asn: 'AS8966', trafficVolume: '380k req/s', latency: 31, status: 'optimal', role: 'Middle-East Gateway', coords: { x: 380, y: 70 } },
    { id: 'v2', name: 'Azza Transit', flag: '🇸🇬', asn: 'AS4657', trafficVolume: '620k req/s', latency: 18, status: 'optimal', role: 'SingTel Direct', coords: { x: 500, y: 70 } },
    { id: 'v3', name: 'Lia Edge', flag: '🇭🇰', asn: 'AS9269', trafficVolume: '540k req/s', latency: 24, status: 'optimal', role: 'HKIX Mega Core', coords: { x: 610, y: 70 } },
    { id: 'v4', name: 'Petra DE-CIX', flag: '🇩🇪', asn: 'AS6695', trafficVolume: '490k req/s', latency: 74, status: 'active', role: 'Frankfurt Core', coords: { x: 740, y: 130 } },
    
    // Left side
    { id: 'v5', name: 'Argo West', flag: '🇮🇳', asn: 'AS9583', trafficVolume: '410k req/s', latency: 19, status: 'optimal', role: 'NIXI Mumbai', coords: { x: 190, y: 130 } },
    { id: 'v6', name: 'Harmony Pacific', flag: '🇯🇵', asn: 'AS2516', trafficVolume: '350k req/s', latency: 42, status: 'optimal', role: 'JPIX Tokyo', coords: { x: 200, y: 270 } },
    { id: 'v7', name: 'Global Beauty SV', flag: '🇺🇸', asn: 'AS15169', trafficVolume: '720k req/s', latency: 138, status: 'active', role: 'Silicon Valley Anycast', coords: { x: 210, y: 440 } },
    
    // Bottom arc
    { id: 'v8', name: 'PK Phoenix', flag: '🇬🇧', asn: 'AS2856', trafficVolume: '480k req/s', latency: 81, status: 'active', role: 'LINX London', coords: { x: 480, y: 520 } },
    { id: 'v9', name: 'Cathay Ocean', flag: '🇦🇺', asn: 'AS7575', trafficVolume: '290k req/s', latency: 112, status: 'active', role: 'Sydney Equinix', coords: { x: 620, y: 520 } },
    { id: 'v10', name: 'Faxon Edge', flag: '🇹🇭', asn: 'AS4765', trafficVolume: '310k req/s', latency: 14, status: 'optimal', role: 'Bangkok BKNIX', coords: { x: 440, y: 640 } },
    { id: 'v11', name: 'Fortune Lady MyIX', flag: '🇲🇾', asn: 'AS4788', trafficVolume: '430k req/s', latency: 22, status: 'optimal', role: 'Kuala Lumpur IX', coords: { x: 570, y: 640 } }
  ];

  return (
    <div className="w-full bg-[#111722] text-white rounded-2xl border border-gray-800 shadow-2xl p-5 font-sans relative overflow-hidden">
      {/* Header matching reference 5 style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="text-blue-400" size={20} />
            <h3 className="text-base font-bold text-gray-100 tracking-tight">Anycast Mesh & Ship-to-Ship Transit Peering</h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Inter-Autonomous System routing and high-availability Anycast mesh topology
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1a2332] px-3 py-1.5 rounded-lg border border-gray-700/60 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-gray-300">11 Peer Nodes Synchronized</span>
          </div>
        </div>
      </div>

      {/* Hero Description Box matching reference 5 overlay */}
      <div className="relative w-full h-[580px] bg-[#0c121c] rounded-xl border border-gray-800/80 overflow-hidden">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Narrative Box from reference 5 */}
        <div className="absolute top-28 right-8 z-20 max-w-xs bg-[#16202f]/90 backdrop-blur-md p-4 rounded-xl border border-blue-500/30 shadow-xl pointer-events-none">
          <p className="text-xs md:text-sm font-semibold text-blue-100 leading-relaxed">
            The <span className="text-blue-400 font-bold">BDIX Core Gateway</span> facilitates 4.8 Tbps of Anycast peering across <span className="text-emerald-400 font-bold">11 distinct global edge vessels</span>, safeguarding origin infrastructure with zero downtime.
          </p>
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>SCT Merkle Synced</span>
            <span className="text-cyan-300">99.999% SLA</span>
          </div>
        </div>

        {/* SVG Bezier Cable Network matching reference 5 */}
        <svg className="w-full h-full" viewBox="0 0 960 720">
          <defs>
            <linearGradient id="cable-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="cable-active" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Curved Bezier Connectors radiating from Central Hub */}
          {vessels.map((v) => {
            const isSelected = selectedVessel?.id === v.id;
            // Control points calculation for natural organic arcs matching reference 5
            const dx = (v.coords.x - hub.x) * 0.5;
            const dy = (v.coords.y - hub.y) * 0.5;
            const cx1 = hub.x + dx * 0.2;
            const cy1 = hub.y + dy * 1.5;
            const cx2 = v.coords.x - dx * 0.2;
            const cy2 = v.coords.y - dy * 0.5;

            const pathD = `M ${hub.x} ${hub.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${v.coords.x} ${v.coords.y}`;

            return (
              <g key={v.id}>
                {/* Background Shadow Curve */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSelected ? "rgba(245, 158, 11, 0.3)" : "rgba(59, 130, 246, 0.15)"}
                  strokeWidth={isSelected ? "6" : "3"}
                />
                {/* Main Illuminated Fiber Cable */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSelected ? "url(#cable-active)" : "url(#cable-gradient)"}
                  strokeWidth={isSelected ? "3" : "1.8"}
                  strokeDasharray="4 3"
                />
              </g>
            );
          })}
        </svg>

        {/* Central Flagship Hub Node (Dhaka Core) */}
        <div 
          style={{ left: `${(hub.x / 960) * 100}%`, top: `${(hub.y / 720) * 100}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center cursor-pointer group"
          onClick={() => setSelectedVessel(null)}
        >
          {/* Hub Icon Ship */}
          <div className="w-16 h-10 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500 rounded-2xl border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)] flex items-center justify-center text-white relative">
            <Server size={20} className="animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black animate-ping" />
          </div>

          {/* Hub Label Badge matching reference 5 */}
          <div className="mt-2 bg-[#1b283d]/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-blue-400/50 shadow-xl text-center">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-center">
              <span>🇧🇩</span> {hub.name}
            </div>
            <div className="text-[10px] font-mono text-cyan-300">{hub.cleanTraffic} Clean Ingress</div>
          </div>
        </div>

        {/* 11 Edge Vessels (Nodes) matching reference 5 labels */}
        {vessels.map((v) => {
          const isSelected = selectedVessel?.id === v.id;
          const leftPct = (v.coords.x / 960) * 100;
          const topPct = (v.coords.y / 720) * 100;

          return (
            <div
              key={v.id}
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              onClick={() => setSelectedVessel(v)}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer transition-transform hover:scale-110 group"
            >
              {/* Vessel Node Marker */}
              <div className={`w-10 h-6 rounded-lg border flex items-center justify-center shadow-lg transition-all ${
                isSelected 
                  ? 'bg-amber-500 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
                  : 'bg-[#182436] border-gray-600 group-hover:border-cyan-400'
              }`}>
                <span className="text-xs">{v.flag}</span>
              </div>

              {/* Vessel Floating Metadata Tag matching reference 5 */}
              <div className={`mt-1.5 px-2 py-1 rounded-md text-[10px] font-mono border whitespace-nowrap shadow-md transition-all ${
                isSelected 
                  ? 'bg-amber-950/90 text-amber-200 border-amber-500 font-bold scale-105' 
                  : 'bg-black/80 text-gray-200 border-gray-700 group-hover:border-blue-400'
              }`}>
                <div className="font-semibold">{v.name}</div>
                <div className="text-[9px] text-gray-400 flex items-center gap-2">
                  <span>{v.latency}ms</span>
                  <span className="text-emerald-400">{v.trafficVolume}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Selected Vessel Inspector Drawer */}
        {selectedVessel && (
          <div className="absolute bottom-4 left-4 z-40 bg-[#16202f]/95 backdrop-blur-md p-4 rounded-xl border border-cyan-500/40 shadow-2xl max-w-sm">
            <div className="flex items-center justify-between gap-4 border-b border-gray-700 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedVessel.flag}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{selectedVessel.name}</h4>
                  <p className="text-[10px] text-cyan-300 font-mono">{selectedVessel.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedVessel(null)}
                className="text-gray-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-black/30 p-2 rounded-lg border border-gray-800">
                <span className="text-gray-400 block text-[9px]">ASN / Peering</span>
                <span className="text-white font-bold">{selectedVessel.asn}</span>
              </div>
              <div className="bg-black/30 p-2 rounded-lg border border-gray-800">
                <span className="text-gray-400 block text-[9px]">Ingress Throughput</span>
                <span className="text-emerald-400 font-bold">{selectedVessel.trafficVolume}</span>
              </div>
              <div className="bg-black/30 p-2 rounded-lg border border-gray-800">
                <span className="text-gray-400 block text-[9px]">Round Trip Time</span>
                <span className="text-cyan-300 font-bold">{selectedVessel.latency} ms</span>
              </div>
              <div className="bg-black/30 p-2 rounded-lg border border-gray-800">
                <span className="text-gray-400 block text-[9px]">Encryption Protocol</span>
                <span className="text-purple-300 font-bold">TLS 1.3 ChaCha</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
