import React, { useEffect, useState } from 'react';
import { Cpu, MemoryStick, Network, ShieldCheck } from 'lucide-react';
import { certControlApi } from '../lib/api';
import MetricState from './MetricState';
import LiveStateBadge from './LiveStateBadge';

interface Stats { cpu_percent: number | null; memory: { rss_mb: number; heap_used_mb: number; heap_total_mb: number }; active_connections: number | null; source?: string; }

export default function SystemStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [live, setLive] = useState(false);
  useEffect(() => { const load = async () => { try { const [s, n] = await Promise.all([certControlApi.systemStats(), certControlApi.networkStatus()]); setStats(s); setLive(n.connected); } catch { setLive(false); } }; void load(); const id = setInterval(load, 5000); return () => clearInterval(id); }, []);
  const items = [
    { icon: Cpu, label: 'CPU Process Load', value: stats?.cpu_percent, unit: '%', sub: 'sampled process CPU', color: 'text-blue-500' },
    { icon: MemoryStick, label: 'RSS Memory', value: stats?.memory.rss_mb, unit: ' MB', sub: 'Node.js process', color: 'text-purple-500' },
    { icon: Network, label: 'Active Connections', value: stats?.active_connections, unit: '', sub: 'collector source required', color: 'text-emerald-500' },
    { icon: ShieldCheck, label: 'Collector State', value: null, unit: '', sub: live ? 'live telemetry' : 'no live collector', color: 'text-cyan-500' }
  ];
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
    {items.map(({ icon: Icon, label, value, unit, sub, color }) => <div key={label} className="bg-white dark:bg-[#111] p-3 rounded-xl border border-gray-200 dark:border-white/5 shadow-xs flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0"><Icon size={20} className={color} /></div><div className="min-w-0"><div className="flex items-center justify-between gap-2"><p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">{label}</p>{label === 'Collector State' && <LiveStateBadge live={live} />}</div><p className="text-lg font-bold text-gray-900 dark:text-white font-mono">{label === 'Collector State' ? (live ? 'LIVE' : '—') : <MetricState value={value} unit={unit} />}</p><span className="text-[10px] text-gray-400">{sub}</span></div></div>)}
  </div>;
}
