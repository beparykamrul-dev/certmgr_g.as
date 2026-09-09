import React, { useEffect, useState } from 'react';
import { Folder, RefreshCw } from 'lucide-react';
import NotConfiguredState from './NotConfiguredState';

export default function CategoryAnalysis() {
  const [data, setData] = useState<any[] | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const load = async () => { setLoading(true); setError(null); try { const r = await fetch('/api/traffic-trend?context=Global', { headers: { Accept: 'application/json' } }); if (!r.ok) throw new Error(`Traffic API HTTP ${r.status}`); const body = await r.json(); setData(Array.isArray(body) ? body : []); } catch (e) { setError(e instanceof Error ? e.message : 'Traffic API request failed'); setData([]); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  return <div className="w-full rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-[#111] p-5"><div className="flex items-center justify-between border-b pb-4 mb-4"><div><h3 className="font-bold flex items-center gap-2"><Folder size={19} className="text-amber-400"/>Category Analysis</h3><p className="text-xs text-gray-500 mt-1">Derived only from live traffic collector data.</p></div><button onClick={() => void load()} disabled={loading} className="p-2 rounded-lg border"><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/></button></div>{error && <div className="text-xs text-rose-500 mb-3">{error}</div>}{!loading && data?.length === 0 && <NotConfiguredState feature="Traffic category analysis" reason="No live traffic collector has supplied category data." />}{data && data.length > 0 && <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>}</div>;
}
