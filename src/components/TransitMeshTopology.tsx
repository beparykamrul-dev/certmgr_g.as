import React, { useEffect, useState } from 'react';
import { Network, RefreshCw } from 'lucide-react';
import NotConfiguredState from './NotConfiguredState';

interface MeshState { configured?: boolean; reason?: string; source?: string; peers?: unknown[]; [key: string]: unknown }

export default function TransitMeshTopology() {
  const [state, setState] = useState<MeshState | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/traffic-map-data?context=Global');
      const body = await res.json();
      setState(Array.isArray(body) && body.length ? { configured: true, peers: body, source: 'live adapter' } : { configured: false, reason: 'No live transit-mesh telemetry is configured.' });
    } catch {
      setState({ configured: false, reason: 'Transit-mesh API request failed.' });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return <div className="w-full rounded-2xl border border-gray-200 dark:border-white/10 p-5 space-y-4">
    <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
      <div><h3 className="text-base font-bold flex items-center gap-2"><Network size={18} /> Anycast Mesh & Transit Peering</h3><p className="text-xs text-gray-500 mt-1">Topology is rendered only from configured live telemetry.</p></div>
      <button onClick={load} disabled={loading} className="p-2 rounded-xl border"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
    </div>
    {state?.configured ? <pre className="text-xs whitespace-pre-wrap break-words bg-gray-50 dark:bg-white/5 rounded-xl p-4">{JSON.stringify(state.peers, null, 2)}</pre> : <NotConfiguredState feature="Transit mesh telemetry" reason={state?.reason} />}
  </div>;
}
