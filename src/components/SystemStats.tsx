import React, { useEffect, useState } from 'react';
import { Cpu, MemoryStick, Network, ShieldCheck } from 'lucide-react';

export default function SystemStats() {
  const [stats, setStats] = useState({ cpuUsage: 14, memoryUsage: 42, activeConnections: 12840 });

  useEffect(() => {
    const fetchStats = () => {
      fetch('/api/system-stats')
        .then(res => res.json())
        .then(setStats)
        .catch(() => {});
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {[
        { icon: Cpu, label: "CPU Core Load", value: `${stats.cpuUsage}%`, sub: "8 Cores Active", color: "text-blue-500" },
        { icon: MemoryStick, label: "Memory Allocated", value: `${stats.memoryUsage}%`, sub: "6.8 / 16 GB", color: "text-purple-500" },
        { icon: Network, label: "Active TCP/QUIC", value: stats.activeConnections.toLocaleString(), sub: "Anycast Mesh", color: "text-emerald-500" },
        { icon: ShieldCheck, label: "Edge Security SLA", value: "99.999%", sub: "Zero Packet Loss", color: "text-cyan-500" }
      ].map((stat, idx) => (
        <div key={idx} className="bg-white dark:bg-[#111] p-3 rounded-xl border border-gray-200 dark:border-white/5 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
            <stat.icon size={20} className={stat.color} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">{stat.label}</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">{stat.value}</p>
              <span className="text-[10px] text-gray-400 hidden sm:inline">{stat.sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

