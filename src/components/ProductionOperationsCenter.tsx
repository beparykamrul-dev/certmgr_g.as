import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, RefreshCw } from 'lucide-react';
import { certControlApi } from '../lib/api';
import NotConfiguredState from './NotConfiguredState';
import LiveStateBadge from './LiveStateBadge';

export default function ProductionOperationsCenter() {
  const [health, setHealth] = useState<any[]>([]); const [network, setNetwork] = useState<any>(null); const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); try { const [h, n] = await Promise.all([certControlApi.healthChecks(), certControlApi.networkStatus()]); setHealth(h); setNetwork(n); } finally { setLoading(false); } };
  useEffect(() => { void load(); const id = setInterval(() => void load(), 10000); return () => clearInterval(id); }, []);
  const live = Boolean(network?.connected && network.liveCollectorsConfigured > 0);
  const configured = health.filter(h => h.source !== 'not-configured').length;
  return <div className="w-full rounded-2xl border border-cyan-500/20 bg-[#031326] text-white p-5"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4 mb-4"><div><h2 className="text-lg font-bold tracking-wider flex items-center gap-2"><ShieldCheck size={19} className="text-cyan-400"/> FTN Production Operations Center</h2><div className="mt-1 flex items-center gap-3 text-[10px] text-cyan-300"><LiveStateBadge live={live}/><span>{configured} provider adapters reporting</span></div></div><button onClick={() => void load()} disabled={loading} className="p-2 rounded-lg border border-cyan-500/20"><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/></button></div>{!live && <NotConfiguredState feature="Production telemetry" reason="No live collector is configured; dashboard will not invent throughput, SLA, or security values." />}<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3"><div className="rounded-xl border border-white/10 p-4"><div className="text-xs text-gray-400">Live collectors</div><div className="text-2xl font-bold font-mono">{network?.liveCollectorsConfigured ?? 0}</div></div><div className="rounded-xl border border-white/10 p-4"><div className="text-xs text-gray-400">Provider records</div><div className="text-2xl font-bold font-mono">{health.length}</div></div><div className="rounded-xl border border-white/10 p-4"><div className="text-xs text-gray-400 flex items-center gap-1"><Activity size={12}/> Telemetry source</div><div className="text-sm font-mono mt-1">{live ? 'LIVE' : 'NOT CONFIGURED'}</div></div></div></div>;
}
