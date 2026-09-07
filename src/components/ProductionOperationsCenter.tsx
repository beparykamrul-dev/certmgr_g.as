import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, RefreshCw, BarChart2, CheckCircle2, TrendingUp } from 'lucide-react';

interface TeamEfficiency {
  node: string;
  inspected: number;
  scrubbed: number;
}

interface DailyStat {
  date: string;
  val: number;
}

export default function ProductionOperationsCenter() {
  const [safeDays, setSafeDays] = useState(1048);
  const [selectedNode, setSelectedNode] = useState<string>('Node-D');
  const [isLivePulse, setIsLivePulse] = useState(true);

  // Live timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setIsLivePulse(prev => !prev);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const completionRates = [
    { label: "Class A (TLS 1.3)", rate: 96.7, color: "#06b6d4" },
    { label: "Class B (EdgeOne)", rate: 96.3, color: "#38bdf8" },
    { label: "Class C (CT Proof)", rate: 91.7, color: "#0ea5e9" },
    { label: "Class D (DNSSEC)", rate: 99.5, color: "#22d3ee" }
  ];

  const teamEfficiencies: TeamEfficiency[] = [
    { node: 'Node D (APAC Core)', inspected: 10.0, scrubbed: 5.5 },
    { node: 'Node C (EU DE-CIX)', inspected: 8.0, scrubbed: 5.2 },
    { node: 'Node B (US Equinix)', inspected: 9.0, scrubbed: 4.8 },
    { node: 'Node A (Dhaka BDIX)', inspected: 8.0, scrubbed: 5.0 }
  ];

  const dailyStats: DailyStat[] = [
    { date: "01-Sep", val: 1345 },
    { date: "02-Sep", val: 1875 },
    { date: "03-Sep", val: 1498 },
    { date: "04-Sep", val: 1390 },
    { date: "05-Sep", val: 1234 },
    { date: "06-Sep", val: 1537 },
    { date: "07-Sep", val: 1876 },
    { date: "08-Sep", val: 1234 },
    { date: "09-Sep", val: 1438 },
    { date: "10-Sep", val: 1639 },
    { date: "11-Sep", val: 1528 },
    { date: "12-Sep", val: 1376 },
    { date: "13-Sep", val: 1627 },
    { date: "14-Sep", val: 1708 },
    { date: "15-Sep", val: 1364 },
    { date: "16-Sep", val: 1511 },
    { date: "17-Sep", val: 1200 },
    { date: "18-Sep", val: 1348 },
    { date: "19-Sep", val: 1477 },
    { date: "20-Sep", val: 1408 },
    { date: "21-Sep", val: 1374 },
    { date: "22-Sep", val: 1483 },
    { date: "23-Sep", val: 1484 },
    { date: "24-Sep", val: 1398 },
    { date: "25-Sep", val: 1208 },
    { date: "26-Sep", val: 1743 },
    { date: "27-Sep", val: 1489 },
    { date: "28-Sep", val: 1863 },
    { date: "29-Sep", val: 1630 },
    { date: "30-Sep", val: 1740 },
    { date: "01-Oct", val: 1648 }
  ];

  // Month data for bottom area/line pass rate graph
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const areaPoints = [
    { month: "Jan", prod: 42000, pass: 98.4 },
    { month: "Feb", prod: 46000, pass: 97.2 },
    { month: "Mar", prod: 49000, pass: 96.1 },
    { month: "Apr", prod: 54000, pass: 98.8 },
    { month: "May", prod: 52000, pass: 96.8 },
    { month: "June", prod: 58000, pass: 99.1 },
    { month: "July", prod: 55000, pass: 95.9 },
    { month: "Aug", prod: 59000, pass: 99.2 },
    { month: "Sept", prod: 57000, pass: 96.4 },
    { month: "Oct", prod: 61000, pass: 98.5 },
    { month: "Nov", prod: 59000, pass: 97.8 },
    { month: "Dec", prod: 63000, pass: 99.4 }
  ];

  // Convert safeDays to 4 digits
  const dayDigits = String(safeDays).padStart(4, '0').split('');

  return (
    <div className="w-full bg-[#031326] dark:bg-[#020b18] text-white rounded-2xl border border-cyan-500/20 shadow-2xl p-5 font-sans relative overflow-hidden">
      {/* Background Cyber Tech Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.2) 0%, transparent 70%), linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 30px 30px, 30px 30px'
        }}
      />

      {/* Top Header Banner matching reference 1 */}
      <div className="relative z-10 flex flex-col items-center justify-center border-b border-cyan-500/20 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-cyan-400" />
          <h2 className="text-lg md:text-xl font-bold tracking-widest text-cyan-300 uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            FTN Enterprise Production Security Management
          </h2>
          <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-cyan-400" />
        </div>
        <div className="flex items-center gap-3 mt-1 text-[11px] text-cyan-400/80 font-mono tracking-wider">
          <span>ANYCAST CORE MESH</span>
          <span>•</span>
          <span>RFC 6962 CT LEDGER</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE TELEMETRY
          </span>
        </div>
      </div>

      {/* Main Grid matching reference 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        
        {/* LEFT COLUMN: Safe Days Flip Counter + Production Comparison Donut + 4 Circular Rates */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Flip Counter: Number of safe production days */}
          <div className="bg-[#041c33]/80 rounded-xl p-3.5 border border-cyan-500/30">
            <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Number of safe production days</span>
              <ShieldCheck size={14} className="text-cyan-400" />
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              {dayDigits.map((digit, idx) => (
                <div 
                  key={idx} 
                  className="w-12 h-14 bg-gradient-to-b from-[#0b3b64] to-[#041e38] rounded-lg border border-cyan-400/50 flex items-center justify-center text-2xl font-black font-mono text-cyan-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_4px_10px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-1/2 h-px bg-black/60 shadow-xs" />
                  <span className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">{digit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Production Comparison Donut */}
          <div className="bg-[#041c33]/80 rounded-xl p-3.5 border border-cyan-500/30 flex flex-col">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2">
              Anycast Node Throughput Ratio
            </span>
            <div className="flex items-center justify-center py-2">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Arc A (24% - Blue) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="57.3 238.7" strokeDashoffset="0" />
                  {/* Arc B (23% - Red/Orange) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray="54.9 238.7" strokeDashoffset="-57.3" />
                  {/* Arc C (22% - Cyan) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="12" strokeDasharray="52.5 238.7" strokeDashoffset="-112.2" />
                  {/* Arc D (31% - Silver/Gray) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#64748b" strokeWidth="12" strokeDasharray="74.0 238.7" strokeDashoffset="-164.7" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] text-cyan-200/70 font-mono">BDIX Mesh</span>
                  <span className="text-sm font-bold text-cyan-400">4.8 Tbps</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 ml-4 text-xs font-mono">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /><span className="text-gray-300">A (BDIX): 24%</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500" /><span className="text-gray-300">B (US-West): 23%</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" /><span className="text-gray-300">C (DE-CIX): 22%</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-500" /><span className="text-gray-300">D (APAC): 31%</span></div>
              </div>
            </div>
          </div>

          {/* 4 Circular Completion Rate Rings (Class A, B, C, D) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 bg-[#041c33]/80 rounded-xl p-3 border border-cyan-500/30">
            {completionRates.map((item, idx) => {
              const radius = 22;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (item.rate / 100) * circumference;
              return (
                <div key={idx} className="flex flex-col items-center justify-center text-center">
                  <div className="relative w-14 h-14">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 54 54">
                      <circle cx="27" cy="27" r={radius} fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="4" />
                      <circle 
                        cx="27" 
                        cy="27" 
                        r={radius} 
                        fill="none" 
                        stroke={item.color} 
                        strokeWidth="4" 
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-mono font-bold text-cyan-200">
                        {item.rate}%
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] text-cyan-300/80 font-medium mt-1 leading-tight">{item.label}</span>
                </div>
              );
            })}
          </div>

        </div>

        {/* CENTER COLUMN: Efficiency Statistics Bars + Waveform Line Area Chart */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Efficiency Statistics of each node / team */}
          <div className="bg-[#041c33]/80 rounded-xl p-3.5 border border-cyan-500/30 flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Efficiency Statistics of Each Node
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-red-500" /> Inspected (M req/s)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-cyan-400" /> Scrubbed (Gbps)</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {teamEfficiencies.map((team, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-300 font-mono">
                    <span className="font-bold text-cyan-300">{team.node}</span>
                    <span className="text-cyan-400">{team.inspected}M / {team.scrubbed} Gbps</span>
                  </div>
                  {/* Dual Bar: Red upper, Cyan lower */}
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full transition-all duration-700" 
                        style={{ width: `${(team.inspected / 10) * 100}%` }}
                      />
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-300 rounded-full transition-all duration-700" 
                        style={{ width: `${(team.scrubbed / 6) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Area + Line pass rate curve (Jan - Dec) */}
          <div className="bg-[#041c33]/80 rounded-xl p-3.5 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Throughput & Compliance Pass Rate
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2.5 h-1 bg-cyan-400 inline-block" /> Throughput
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2 h-2 rounded-full border border-rose-400 inline-block" /> Pass Rate %
                </span>
              </div>
            </div>

            {/* SVG Area + Line chart */}
            <div className="relative h-44 w-full mt-2">
              <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                
                {/* Horizontal Grid lines */}
                <line x1="30" y1="30" x2="490" y2="30" stroke="rgba(6,182,212,0.1)" strokeDasharray="3 3" />
                <line x1="30" y1="70" x2="490" y2="70" stroke="rgba(6,182,212,0.1)" strokeDasharray="3 3" />
                <line x1="30" y1="110" x2="490" y2="110" stroke="rgba(6,182,212,0.1)" strokeDasharray="3 3" />
                <line x1="30" y1="140" x2="490" y2="140" stroke="rgba(6,182,212,0.2)" />

                {/* Area Fill */}
                <path 
                  d="M 40 90 Q 80 80 120 75 T 200 60 T 280 65 T 360 55 T 440 45 L 480 40 L 480 140 L 40 140 Z" 
                  fill="url(#area-grad)" 
                />
                {/* Area Top Cyan Line */}
                <path 
                  d="M 40 90 Q 80 80 120 75 T 200 60 T 280 65 T 360 55 T 440 45 L 480 40" 
                  fill="none" 
                  stroke="#22d3ee" 
                  strokeWidth="2.5" 
                />

                {/* Pass rate red zigzag line with nodes */}
                <polyline 
                  fill="none" 
                  stroke="#f43f5e" 
                  strokeWidth="1.8" 
                  points="40,50 80,68 120,80 160,54 200,75 240,48 280,82 320,46 360,78 400,56 440,68 480,48" 
                />
                {/* Dots on pass rate line */}
                {[[40,50],[80,68],[120,80],[160,54],[200,75],[240,48],[280,82],[320,46],[360,78],[400,56],[440,68],[480,48]].map(([x,y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
                ))}
              </svg>
              
              {/* Bottom Month Labels */}
              <div className="flex justify-between text-[9px] text-cyan-300/70 font-mono px-4 -mt-2">
                {months.map((m, idx) => (
                  <span key={idx}>{m}</span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Daily Production Statistics (Vertical Ranking List matching reference 1) */}
        <div className="lg:col-span-3 bg-[#041c33]/80 rounded-xl p-3.5 border border-cyan-500/30 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
              Daily Node Ingress Log
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">31 Days</span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[380px] pr-1 space-y-1.5 custom-scrollbar">
            {dailyStats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[10px] font-mono group hover:bg-cyan-500/10 p-0.5 rounded transition-colors">
                <span className="w-12 text-gray-400 shrink-0">{stat.date}</span>
                <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-300 rounded-full" 
                    style={{ width: `${(stat.val / 2000) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-cyan-300 font-semibold shrink-0">{stat.val}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-cyan-300/80">
            <span>Peak Day: 02-Sep</span>
            <span className="text-emerald-400 font-bold">1,876k Req/s</span>
          </div>
        </div>

      </div>
    </div>
  );
}
