import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, Route, Zap, Plus, AlertCircle, GripVertical } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import NotConfiguredState from './NotConfiguredState';

type Path = { id: string; name: string; pop: string; provider: string; latencyMs: number | null; priority: string; active: boolean };

const SortablePath: React.FC<{ path: Path; togglePath: (id: string) => void }> = ({ path, togglePath }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: path.id });
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`p-3 rounded-xl border flex items-center justify-between ${path.active ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10 opacity-70'}`}>
    <div className="flex items-center gap-3"><div {...attributes} {...listeners} className="cursor-grab text-gray-400"><GripVertical size={16}/></div><div className="p-2 rounded-lg bg-gray-200 dark:bg-[#222] text-gray-500"><Route size={16}/></div><div><div className="flex items-center gap-2 text-sm font-bold">{path.name}{path.priority === 'Critical' && <AlertCircle size={14} className="text-red-500"/>}</div><div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><span>{path.pop}</span><ArrowRightLeft size={10}/><span>{path.provider}</span><span>•</span><span>{path.latencyMs == null ? 'n/a' : `${path.latencyMs}ms`}</span></div></div></div>
    <input type="checkbox" checked={path.active} onChange={() => togglePath(path.id)} aria-label={`Enable ${path.name}`} />
  </div>;
};

export default function SmartSilkRouting() {
  const [paths, setPaths] = useState<Path[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [newName, setNewName] = useState(''); const [newPoP, setNewPoP] = useState(''); const [newProvider, setNewProvider] = useState(''); const [newPriority, setNewPriority] = useState('High');

  const load = async () => { setLoading(true); try { const r = await fetch('/api/latency?context=Global'); const json = await r.json(); const rows = Array.isArray(json) ? json : []; setConfigured(rows.length > 0); setPaths(rows.map((x: any, i: number) => ({ id: String(x.id ?? x.provider ?? i), name: x.name ?? x.provider ?? `Path ${i + 1}`, pop: x.pop ?? x.context ?? 'unknown', provider: x.provider ?? 'unknown', latencyMs: Number.isFinite(Number(x.latency)) ? Number(x.latency) : null, priority: x.priority ?? 'Normal', active: x.active !== false }))); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);

  const togglePath = async (id: string) => { const path = paths.find(p => p.id === id); if (!path) return; const r = await fetch('/api/bulk-action', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ action: path.active ? 'disable-routing-path' : 'enable-routing-path', providers: [path.provider] }) }); if (r.status === 409) return; if (r.ok) setPaths(ps => ps.map(p => p.id === id ? {...p, active: !p.active} : p)); };
  const addPath = () => { if (!newName || !newPoP || !newProvider) return; setPaths(ps => [{id: crypto.randomUUID(), name:newName, pop:newPoP, provider:newProvider, latencyMs:null, priority:newPriority, active:false}, ...ps]); setNewName(''); setNewPoP(''); setNewProvider(''); };
  const reorder = ({active, over}: any) => { if (!over || active.id === over.id) return; setPaths(items => arrayMove(items, items.findIndex(x=>x.id===active.id), items.findIndex(x=>x.id===over.id))); };

  return <div className="h-full flex flex-col pt-2"><div className="flex justify-between items-center mb-4"><div><h3 className="text-xl font-bold flex items-center gap-2"><Zap className="text-amber-500" size={20}/>Smart Silk Routing</h3><p className="text-sm text-gray-500">Real routing telemetry only; privileged changes require backend approval.</p></div><button onClick={() => void load()} className="p-2 border rounded-lg" aria-label="Refresh routing telemetry">↻</button></div>{!loading && !configured && <NotConfiguredState feature="Smart Silk routing" reason="No live routing telemetry is configured."/>}<div className="flex flex-col gap-2 mb-4 bg-gray-50 dark:bg-[#1a1a1a] p-3 rounded-xl border"><div className="flex gap-2"><input className="flex-1 bg-white dark:bg-[#111] border rounded-lg px-3 py-2 text-sm" placeholder="Path Name" value={newName} onChange={e=>setNewName(e.target.value)}/><select className="bg-white dark:bg-[#111] border rounded-lg px-3 py-2 text-sm" value={newPriority} onChange={e=>setNewPriority(e.target.value)}><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></div><div className="flex gap-2"><input className="flex-1 bg-white dark:bg-[#111] border rounded-lg px-3 py-2 text-sm" placeholder="Local PoP" value={newPoP} onChange={e=>setNewPoP(e.target.value)}/><input className="flex-1 bg-white dark:bg-[#111] border rounded-lg px-3 py-2 text-sm" placeholder="Global Provider" value={newProvider} onChange={e=>setNewProvider(e.target.value)}/><button onClick={addPath} disabled={!newName||!newPoP||!newProvider} className="bg-amber-500 disabled:opacity-50 text-white p-2 rounded-lg"><Plus size={20}/></button></div></div><div className="flex-1 overflow-y-auto space-y-2"><DndContext collisionDetection={closestCenter} onDragEnd={reorder}><SortableContext items={paths.map(p=>p.id)} strategy={verticalListSortingStrategy}>{paths.map(p=><SortablePath key={p.id} path={p} togglePath={togglePath}/>)}</SortableContext></DndContext></div></div>;
}
