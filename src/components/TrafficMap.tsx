import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Globe2, RefreshCw, MapPin } from 'lucide-react';
import type { TrafficMapData, TrafficMapPoint } from '../runtime/map-contract';

export default function TrafficMap({ context }: { context: string }) {
  const [data, setData] = useState<TrafficMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<TrafficMapPoint | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/traffic-map-data?context=${encodeURIComponent(context)}`, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const next = (await response.json()) as TrafficMapData;
      setData(next);
      setSelected(next.points?.[0] ?? null);
    } catch (err) {
      setData(null);
      setSelected(null);
      setError(err instanceof Error ? err.message : 'Traffic map unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 15000);
    return () => window.clearInterval(timer);
  }, [context]);

  const points = data?.points ?? [];
  const observed = data?.observedAt ? new Date(data.observedAt).toLocaleString() : '—';
  const configured = points.length > 0;

  const projected = useMemo(() => points.map(point => ({
    point,
    left: Math.max(1, Math.min(99, ((point.lng + 180) / 360) * 100)),
    top: Math.max(4, Math.min(96, ((90 - point.lat) / 180) * 100))
  })), [points]);

  return (
    <div id="section-traffic-map" className="pt-2 flex flex-col space-y-4">
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-3 dark:border-white/5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2"><Globe2 size={20} className="text-blue-500" /><h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Global Traffic Intelligence Map</h3></div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Live PoP telemetry for context: <span className="font-semibold">{context}</span></p>
        </div>
        <button onClick={() => void load()} className="self-start rounded-xl border border-gray-200 p-2 text-gray-500 dark:border-white/10 dark:bg-[#151515]" title="Refresh live map"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
      </div>

      {error && <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-600 dark:text-red-300">Traffic map unavailable: {error}</div>}
      {!error && !loading && !configured && <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500 dark:border-white/10 dark:bg-[#0c0c0c]">Not Configured — no live traffic map telemetry is connected.</div>}

      {configured && (
        <>
          <div className="relative h-[420px] overflow-hidden rounded-2xl border border-gray-200 bg-[#07101a] dark:border-white/10">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '10% 10%' }} />
            <div className="absolute inset-[7%] rounded-[45%] border border-cyan-400/10" />
            {projected.map(({ point, left, top }) => (
              <button key={point.id} onClick={() => setSelected(point)} className="absolute -translate-x-1/2 -translate-y-1/2 text-left" style={{ left: `${left}%`, top: `${top}%` }} title={point.name}>
                <span className="block h-3 w-3 rounded-full bg-cyan-400 ring-4 ring-cyan-400/20" />
                <span className="mt-1 block whitespace-nowrap rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-semibold text-white">{point.city || point.name}{point.latencyMs == null ? '' : ` · ${point.latencyMs}ms`}</span>
              </button>
            ))}
            <div className="absolute left-3 top-3 rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-gray-300 backdrop-blur"><Activity size={13} className="mr-1 inline" />{points.length} live PoP{points.length === 1 ? '' : 's'}</div>
          </div>

          {selected && <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <Info label="PoP" value={selected.name} icon={<MapPin size={13} />} />
            <Info label="Latency" value={selected.latencyMs == null ? '—' : `${selected.latencyMs} ms`} />
            <Info label="Throughput" value={selected.throughputGbps == null ? '—' : `${selected.throughputGbps} Gbps`} />
            <Info label="Health" value={selected.health == null ? '—' : `${selected.health}%`} />
            <Info label="Observed" value={new Date(selected.observedAt).toLocaleTimeString()} />
          </div>}
          <div className="text-[10px] text-gray-500">Dataset observed: {observed}</div>
        </>
      )}
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-[#111]"> <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-gray-500">{icon}{label}</div><div className="mt-1 truncate text-sm font-bold text-gray-900 dark:text-gray-100">{value}</div></div>;
}
