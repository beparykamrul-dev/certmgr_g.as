import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

type SecurityTelemetry = {
  configured?: boolean;
  observedAt?: string;
  ingressGbps?: number;
  scrubbedGbps?: number;
  mitigationRatePct?: number;
  confidencePct?: number;
  status?: string;
};

export default function CyberGlowTelemetry() {
  const [data, setData] = useState<SecurityTelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/edgeone-security', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setData(await response.json());
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : 'Security telemetry unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 15000);
    return () => window.clearInterval(timer);
  }, []);

  const configured = Boolean(data?.configured);
  const observed = data?.observedAt ? new Date(data.observedAt).toLocaleString() : '—';

  if (loading && !data) {
    return <div className="w-full rounded-2xl border border-blue-900/40 bg-[#050b14] p-5 text-sm text-gray-400">Loading live security telemetry…</div>;
  }

  if (error) {
    return <div className="w-full rounded-2xl border border-red-900/40 bg-[#050b14] p-5 text-sm text-red-300">Security telemetry unavailable: {error}</div>;
  }

  if (!configured) {
    return (
      <div className="w-full rounded-2xl border border-gray-800 bg-[#050b14] p-5 text-white">
        <div className="flex items-center gap-2 font-semibold"><Activity size={16} /> Security Telemetry</div>
        <p className="mt-2 text-sm text-gray-400">Not Configured — no live security telemetry source is connected.</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-blue-900/40 bg-[#050b14] text-white shadow-2xl p-5">
      <div className="flex items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div>
          <div className="flex items-center gap-2"><Activity size={17} className="text-cyan-400" /><h3 className="text-sm font-bold">Live Security Telemetry</h3></div>
          <p className="mt-1 text-[11px] text-gray-400">Source-backed Edge security measurements only.</p>
        </div>
        <button onClick={() => void load()} className="rounded-lg border border-white/10 p-2 text-gray-400 hover:text-white" title="Refresh">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Metric icon={<Activity size={14} />} label="Ingress" value={data?.ingressGbps == null ? '—' : `${data.ingressGbps} Gbps`} />
        <Metric icon={<ShieldAlert size={14} />} label="Scrubbed" value={data?.scrubbedGbps == null ? '—' : `${data.scrubbedGbps} Gbps`} />
        <Metric icon={<CheckCircle2 size={14} />} label="Mitigation" value={data?.mitigationRatePct == null ? '—' : `${data.mitigationRatePct}%`} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 p-3"><span className="text-xs text-gray-400">Security confidence</span><div className="mt-1 text-lg font-bold">{data?.confidencePct == null ? '—' : `${data.confidencePct}%`}</div></div>
        <div className="rounded-xl border border-white/10 bg-black/20 p-3"><span className="text-xs text-gray-400">Status</span><div className="mt-1 text-lg font-bold">{data?.status || '—'}</div></div>
      </div>

      <div className="mt-3 text-[10px] text-gray-500">Observed: {observed}</div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-[#0b1322] p-3"><div className="flex items-center gap-2 text-xs text-gray-400">{icon}{label}</div><div className="mt-2 text-xl font-black font-mono">{value}</div></div>;
}
