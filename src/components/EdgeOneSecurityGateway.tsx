import React, { useEffect, useState } from 'react';
import { RefreshCw, ShieldCheck, Zap } from 'lucide-react';
import NotConfiguredState from './NotConfiguredState';

interface EdgeOneState {
  configured?: boolean;
  reason?: string;
  source?: string;
  mode?: string;
  autoDefenseEnabled?: boolean;
  activePoPs?: unknown[];
  activeIncidents?: unknown[];
  [key: string]: unknown;
}

export default function EdgeOneSecurityGateway() {
  const [data, setData] = useState<EdgeOneState | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionState, setActionState] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/edgeone-security', { headers: { Accept: 'application/json' } });
      const body = await res.json();
      setData(body);
    } catch {
      setData({ configured: false, reason: 'EdgeOne API request failed' });
    } finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 15000);
    return () => window.clearInterval(timer);
  }, []);

  const toggleDefense = async () => {
    const enabled = !Boolean(data?.autoDefenseEnabled);
    setActionState('Approval required; no change executed yet.');
    try {
      const res = await fetch('/api/edgeone-toggle-defense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ enabled })
      });
      const body = await res.json();
      if (!res.ok || body.status === 'approval_required') {
        setActionState(body.message || 'Approval required; no change executed.');
        return;
      }
      setData(prev => ({ ...(prev || {}), ...body }));
      setActionState('Change accepted by the configured adapter.');
    } catch {
      setActionState('EdgeOne control request failed.');
    }
  };

  if (loading && !data) return <div className="p-4 text-xs text-gray-400">Loading EdgeOne adapter state…</div>;

  if (data?.configured !== true) {
    return (
      <div className="pt-2 space-y-4">
        <Header onRefresh={load} loading={loading} />
        <NotConfiguredState feature="Tencent Cloud EdgeOne Security Gateway" reason={data?.reason || 'No live EdgeOne connector is configured.'} />
      </div>
    );
  }

  return (
    <div className="pt-2 space-y-4">
      <Header onRefresh={load} loading={loading} />
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={16} /> Live adapter connected</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <Metric label="Mode" value={String(data.mode ?? '—')} />
          <Metric label="Auto defense" value={data.autoDefenseEnabled == null ? '—' : data.autoDefenseEnabled ? 'enabled' : 'disabled'} />
          <Metric label="Active PoPs" value={Array.isArray(data.activePoPs) ? String(data.activePoPs.length) : '—'} />
          <Metric label="Incidents" value={Array.isArray(data.activeIncidents) ? String(data.activeIncidents.length) : '—'} />
        </div>
        <button onClick={toggleDefense} className="px-3 py-2 rounded-xl border text-xs font-semibold">Request auto-defense change</button>
        {actionState && <p className="text-xs text-amber-600">{actionState}</p>}
        <p className="text-[10px] text-gray-400">Source: {String(data.source ?? 'live adapter')}</p>
      </div>
    </div>
  );
}

function Header({ onRefresh, loading }: { onRefresh: () => void; loading: boolean }) {
  return <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3"><div><h3 className="text-base font-bold flex items-center gap-2"><Zap size={18} className="text-amber-500" /> Tencent Cloud EdgeOne Security Gateway</h3><p className="text-xs text-gray-500 mt-1">Live EdgeOne telemetry only. Simulation and fabricated metrics are disabled.</p></div><button onClick={onRefresh} disabled={loading} className="p-2 rounded-xl border"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-3"><div className="text-[10px] uppercase text-gray-400">{label}</div><div className="font-mono font-bold mt-1">{value}</div></div>;
}
