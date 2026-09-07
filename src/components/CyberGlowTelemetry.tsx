import React from 'react';
import { ShieldAlert, Zap, Activity, CheckCircle, BarChart2 } from 'lucide-react';

export default function CyberGlowTelemetry() {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  // Wave data for Ingress vs Scrubbed Threats
  const ingressWave = [57, 52, 49, 58, 62, 59, 64, 60, 63, 67, 65, 70];
  const scrubbedWave = [42, 39, 44, 40, 48, 43, 46, 41, 45, 47, 44, 49];

  // Radial meters
  const meters = [
    { label: "SLA Fulfillment", value: 99.4, color: "#06b6d4" },
    { label: "Edge Mitigation", value: 99.8, color: "#10b981" },
    { label: "Zero-Trust Rate", value: 97.5, color: "#f43f5e" }
  ];

  // Grouped bar data
  const barData = [
    { month: 'JAN', clean: 45, threat: 20, latency: 18 },
    { month: 'FEB', clean: 50, threat: 25, latency: 19 },
    { month: 'MAR', clean: 48, threat: 22, latency: 16 },
    { month: 'APR', clean: 60, threat: 30, latency: 21 },
    { month: 'MAY', clean: 75, threat: 35, latency: 24 },
    { month: 'JUN', clean: 58, threat: 28, latency: 17 },
    { month: 'JUL', clean: 62, threat: 32, latency: 19 },
    { month: 'AUG', clean: 55, threat: 26, latency: 15 },
    { month: 'SEP', clean: 68, threat: 34, latency: 20 },
    { month: 'OCT', clean: 72, threat: 36, latency: 22 },
    { month: 'NOV', clean: 66, threat: 31, latency: 18 },
    { month: 'DEC', clean: 80, threat: 40, latency: 23 }
  ];

  return (
    <div className="w-full bg-[#050b14] text-white rounded-2xl border border-blue-900/40 shadow-2xl p-5 font-sans relative overflow-hidden">
      {/* Glow effect background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid container matching reference 7 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 relative z-10">
        
        {/* TOP LEFT: Ingress vs Scrubbed Wave Chart (Matching "Payroll vs Extra Pay" in reference 7) */}
        <div className="bg-[#0b1322]/90 rounded-xl p-4 border border-blue-800/40 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-gray-100 tracking-tight">Ingress Volume vs Scrubbed Attacks</h4>
              <p className="text-[11px] text-gray-400 font-mono">Real-time spectral analysis (Gbps)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-cyan-400 font-bold">$305,490 Gbps Clean</span>
              <span className="text-purple-400 font-bold">$146,260 Gbps Scrubbed</span>
            </div>
          </div>

          {/* SVG Wave Chart with Neon Glowing Lines */}
          <div className="relative h-48 w-full mt-2">
            <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="neon-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="neon-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#e879f9" />
                </linearGradient>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid lines */}
              <line x1="20" y1="40" x2="480" y2="40" stroke="rgba(255,255,255,0.05)" />
              <line x1="20" y1="80" x2="480" y2="80" stroke="rgba(255,255,255,0.05)" />
              <line x1="20" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.05)" />

              {/* Cyan Upper Wave */}
              <path 
                d="M 30 30 Q 80 28 130 32 T 230 26 T 330 30 T 430 24 L 470 20" 
                fill="none" 
                stroke="url(#neon-cyan)" 
                strokeWidth="3" 
                filter="url(#glow-cyan)" 
              />
              
              {/* Purple Lower Wave */}
              <path 
                d="M 30 75 Q 80 82 130 88 T 230 78 T 330 84 T 430 76 L 470 70" 
                fill="none" 
                stroke="url(#neon-purple)" 
                strokeWidth="2.5" 
              />

              {/* Glowing Value Markers matching reference 7 (57K, 49K, 40K) */}
              <g transform="translate(130, 88)">
                <line x1="0" y1="0" x2="0" y2="40" stroke="rgba(192, 132, 252, 0.4)" strokeDasharray="2 2" />
                <circle cx="0" cy="0" r="4" fill="#e879f9" stroke="#ffffff" strokeWidth="1.5" />
                <text x="0" y="-8" fill="#e879f9" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">49K</text>
              </g>

              <g transform="translate(230, 78)">
                <line x1="0" y1="0" x2="0" y2="50" stroke="rgba(192, 132, 252, 0.4)" strokeDasharray="2 2" />
                <circle cx="0" cy="0" r="4" fill="#e879f9" stroke="#ffffff" strokeWidth="1.5" />
                <text x="0" y="-8" fill="#e879f9" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">40K</text>
              </g>

              <g transform="translate(80, 28)">
                <circle cx="0" cy="0" r="4" fill="#22d3ee" stroke="#ffffff" strokeWidth="1.5" />
                <text x="0" y="-8" fill="#22d3ee" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">57K</text>
              </g>
            </svg>

            {/* Months labels */}
            <div className="flex justify-between text-[9px] text-gray-400 font-mono px-3 mt-1">
              {months.map((m, idx) => (
                <span key={idx}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* TOP RIGHT: 3 Circular Meters (Budget fulfillment, Employee performance, Task compliance) */}
        <div className="bg-[#0b1322]/90 rounded-xl p-4 border border-blue-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
            <h4 className="text-sm font-bold text-gray-100 tracking-tight">Real-Time Core Performance Metrics</h4>
            <span className="text-[10px] text-emerald-400 font-mono">100% Operational</span>
          </div>

          <div className="grid grid-cols-3 gap-3 py-3">
            {meters.map((meter, idx) => {
              const radius = 28;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (meter.value / 100) * circumference;

              return (
                <div key={idx} className="flex flex-col items-center justify-center text-center">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 68 68">
                      {/* Background circle */}
                      <circle cx="34" cy="34" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                      {/* Meter bar */}
                      <circle 
                        cx="34" 
                        cy="34" 
                        r={radius} 
                        fill="none" 
                        stroke={meter.color} 
                        strokeWidth="6" 
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-xs font-black font-mono text-white">
                        {meter.value}%
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-300 font-medium mt-2">{meter.label}</span>
                </div>
              );
            })}
          </div>

          <div className="bg-black/30 p-2.5 rounded-lg border border-gray-800/60 flex items-center justify-between text-xs font-mono text-gray-300">
            <span>Overall Security Confidence</span>
            <span className="text-emerald-400 font-bold">Grade A+ (99.85%)</span>
          </div>
        </div>

        {/* BOTTOM LEFT: Sunburst / Radial Polar Ring (Employee categories in reference 7) */}
        <div className="bg-[#0b1322]/90 rounded-xl p-4 border border-blue-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
            <h4 className="text-sm font-bold text-gray-100 tracking-tight">Security Topology & Peer Roles</h4>
            <span className="text-xs font-mono text-cyan-400 font-bold">958,220 Verified Nodes</span>
          </div>

          <div className="flex items-center justify-center gap-6 py-2">
            {/* Multi-layer colorful fan/donut */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="36" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="45 180" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="36" fill="none" stroke="#ec4899" strokeWidth="8" strokeDasharray="35 180" strokeDashoffset="-48" />
                <circle cx="50" cy="50" r="36" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="30 180" strokeDashoffset="-86" />
                <circle cx="50" cy="50" r="36" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="25 180" strokeDashoffset="-118" />
                <circle cx="50" cy="50" r="36" fill="none" stroke="#06b6d4" strokeWidth="8" strokeDasharray="40 180" strokeDashoffset="-146" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-gray-400 font-mono">TOTAL</span>
                <span className="text-xs font-bold text-white font-mono">958K</span>
              </div>
            </div>

            {/* Category list */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-purple-400" /><span className="text-gray-300">Admin Gateway</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-pink-400" /><span className="text-gray-300">Contractors / IXPs</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-amber-400" /><span className="text-gray-300">Core Transit</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-emerald-400" /><span className="text-gray-300">Edge Scrubbing</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-cyan-400" /><span className="text-gray-300">Remote PoPs</span></div>
            </div>
          </div>
        </div>

        {/* BOTTOM RIGHT: Cost Structure & Productivity Bar + Line (Matching reference 7) */}
        <div className="bg-[#0b1322]/90 rounded-xl p-4 border border-blue-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
            <div>
              <h4 className="text-sm font-bold text-gray-100 tracking-tight">Throughput Structure & Latency Correlation</h4>
              <p className="text-[10px] text-gray-400 font-mono">Monthly Scrubbing Efficiency vs RTT</p>
            </div>
            <div className="text-right text-xs font-mono">
              <span className="text-emerald-400 font-bold">62% Origin Offload</span>
            </div>
          </div>

          {/* Grouped Bars with Overlay Curve */}
          <div className="relative h-40 w-full mt-2">
            <svg className="w-full h-full" viewBox="0 0 480 140" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bar-gradient-cyan" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="bar-gradient-pink" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e879f9" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              {/* Bars */}
              {barData.map((d, i) => {
                const x = 30 + i * 36;
                const hClean = (d.clean / 100) * 80;
                const hThreat = (d.threat / 100) * 45;
                const yClean = 110 - hClean;
                const yThreat = yClean - hThreat;

                return (
                  <g key={i}>
                    {/* Clean traffic bottom bar */}
                    <rect x={x} y={yClean} width="14" height={hClean} fill="url(#bar-gradient-cyan)" rx="2" />
                    {/* Threat upper bar */}
                    <rect x={x} y={yThreat} width="14" height={hThreat} fill="url(#bar-gradient-pink)" rx="2" />
                  </g>
                );
              })}

              {/* Amber Trendline connecting the tops */}
              <polyline 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="2" 
                points={barData.map((d, i) => `${37 + i * 36},${85 - (d.latency - 15) * 4}`).join(' ')}
              />

              {barData.map((d, i) => (
                <circle 
                  key={i} 
                  cx={37 + i * 36} 
                  cy={85 - (d.latency - 15) * 4} 
                  r="2.5" 
                  fill="#f59e0b" 
                  stroke="#ffffff" 
                  strokeWidth="1" 
                />
              ))}
            </svg>

            {/* Months */}
            <div className="flex justify-between text-[8px] text-gray-400 font-mono px-4">
              {months.map((m, idx) => (
                <span key={idx}>{m}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
