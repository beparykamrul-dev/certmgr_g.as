import React, { useEffect, useState } from 'react';

type Target = { id: string; name: string; engine: string; configured: boolean; healthy?: boolean; latencyMs?: number; sizeBytes?: number };

export default function DatabaseControlPanel() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [selected, setSelected] = useState('');
  const [objects, setObjects] = useState<any[]>([]);
  const [sql, setSql] = useState('SELECT current_database(), version()');
  const [result, setResult] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => { fetch('/api/database/targets').then(r => r.json()).then(d => setTargets(d.targets || [])).catch(() => setMessage('Database control API unavailable')); }, []);
  const loadObjects = async (id: string) => { setSelected(id); const r = await fetch(`/api/database/${encodeURIComponent(id)}/objects`); const d = await r.json(); setObjects(d.objects || []); };
  const runQuery = async () => { setMessage(''); setResult(null); const r = await fetch('/api/database/query', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ targetId: selected, sql, parameters: [], readOnly: true }) }); const d = await r.json(); if (!r.ok) { setMessage(d.reason || d.message || 'Query rejected'); return; } setResult(d); };

  return <section className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-5">
    <div><h2 className="text-lg font-bold">Database Control</h2><p className="text-xs text-gray-500 mt-1">PostgreSQL + optional DuckDB / LMDB / LMDB++ / MDBX / NuRaft / Seastar control boundaries</p></div>
    {message && <div className="text-xs text-amber-600">{message}</div>}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">{targets.map(t => <button key={t.id} onClick={() => loadObjects(t.id)} className={`text-left p-4 rounded-xl border ${selected===t.id?'border-blue-500':'border-gray-200 dark:border-white/10'}`}><div className="font-semibold text-sm">{t.name}</div><div className="text-[11px] text-gray-500 mt-1">{t.engine} · {t.configured?'configured':'not configured'}</div><div className="text-[11px] mt-2">{t.healthy===true?'Healthy':t.healthy===false?'Unhealthy':'Unknown'} {t.latencyMs != null && `· ${t.latencyMs}ms`}</div></button>)}</div>
    {selected && <><div className="overflow-auto"><table className="w-full text-xs"><thead><tr className="text-left text-gray-500"><th className="p-2">Schema</th><th className="p-2">Object</th><th className="p-2">Kind</th><th className="p-2">Size</th></tr></thead><tbody>{objects.map((o,i)=><tr key={i} className="border-t border-gray-100 dark:border-white/5"><td className="p-2">{o.schema||'—'}</td><td className="p-2 font-medium">{o.name}</td><td className="p-2">{o.kind}</td><td className="p-2">{o.sizeBytes ?? '—'}</td></tr>)}</tbody></table></div><div className="space-y-2"><textarea value={sql} onChange={e=>setSql(e.target.value)} className="w-full min-h-28 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/30 p-3 font-mono text-xs" /><button onClick={runQuery} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold">Run Read-only Query</button>{result && <pre className="max-h-80 overflow-auto rounded-xl bg-black text-white p-3 text-[11px]">{JSON.stringify(result,null,2)}</pre>}</div></>}
  </section>;
}
