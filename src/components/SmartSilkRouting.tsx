import React, { useState } from 'react';
import { ArrowRightLeft, Route, Zap, Plus, AlertCircle, GripVertical, Play } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortablePath: React.FC<{ path: any; togglePath: (id: number) => void; key?: any }> = ({ path, togglePath }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: path.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`p-3 rounded-xl border flex items-center justify-between transition-all ${path.active ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10 opacity-70'}`}>
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
          <GripVertical size={16} />
        </div>
        <div className={`p-2 rounded-lg ${path.active ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-gray-200 dark:bg-[#222] text-gray-500'}`}>
          <Route size={16} />
        </div>
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
            {path.name}
            {path.priority === 'Critical' && <AlertCircle size={14} className="text-red-500" />}
          </div>
          <div className="text-xs font-medium text-gray-500 mt-0.5 flex items-center gap-1">
            <span>{path.pop}</span>
            <ArrowRightLeft size={10} className="text-gray-400 mx-0.5" />
            <span>{path.provider}</span>
            <span className="mx-1">•</span>
            <span className={path.latency < 25 ? 'text-green-500' : 'text-amber-500'}>{path.latency}ms</span>
          </div>
        </div>
      </div>
      
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={path.active} onChange={() => togglePath(path.id)} />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
      </label>
    </div>
  );
};

export default function SmartSilkRouting() {
  const [silkPaths, setSilkPaths] = useState([
    { id: 1, name: 'BDIX Fast Lane', pop: 'Dhaka', provider: 'Cloudflare', latency: 12, priority: 'High', active: true },
    { id: 2, name: 'AWS Direct', pop: 'Singapore', provider: 'AWS', latency: 45, priority: 'Medium', active: false },
    { id: 3, name: 'GCP Peering', pop: 'Mumbai', provider: 'Google', latency: 32, priority: 'High', active: true }
  ]);

  const [newName, setNewName] = useState('');
  const [newPoP, setNewPoP] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newPriority, setNewPriority] = useState('High');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleAddPath = () => {
    if (newPoP && newProvider && newName) {
      setSilkPaths([{ 
        id: Date.now(), 
        name: newName,
        pop: newPoP, 
        provider: newProvider, 
        latency: Math.floor(Math.random() * 40) + 10,
        priority: newPriority,
        active: true
      }, ...silkPaths]);
      setNewName('');
      setNewPoP('');
      setNewProvider('');
      
      const evt = new CustomEvent('addAuditLog', { detail: { action: `Silk Path Added: [${newName}] ${newPoP} -> ${newProvider} (${newPriority})`, user: 'admin' } });
      window.dispatchEvent(evt);
    }
  };

  const togglePath = (id: number) => {
    setSilkPaths(paths => paths.map(p => {
      if (p.id === id) {
        const newState = !p.active;
        const evt = new CustomEvent('addAuditLog', { detail: { action: `Silk Path ${newState ? 'Enabled' : 'Disabled'}: ${p.name}`, user: 'admin' } });
        window.dispatchEvent(evt);
        return { ...p, active: newState };
      }
      return p;
    }));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSilkPaths((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        const evt = new CustomEvent('addAuditLog', { detail: { action: `Silk Routing Prioritization Updated`, user: 'admin' } });
        window.dispatchEvent(evt);
        
        return newOrder;
      });
    }
  };
  
  const simulateImpact = () => {
    setIsSimulating(true);
    setTimeout(() => {
        setSilkPaths(paths => paths.map(p => ({
            ...p,
            latency: p.active ? Math.max(5, p.latency - Math.floor(Math.random() * 8 + 2)) : p.latency
        })));
        setIsSimulating(false);
        const evt = new CustomEvent('addAuditLog', { detail: { action: `FTN-AI Impact Simulated`, user: 'system' } });
        window.dispatchEvent(evt);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col pt-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Zap className="text-amber-500" size={20} /> Smart Silk Routing
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Drag to prioritize paths</p>
        </div>
        <button 
            onClick={simulateImpact}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 dark:text-indigo-300 rounded-lg text-xs font-semibold transition-colors border border-indigo-200 dark:border-indigo-500/30"
        >
            {isSimulating ? <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /> : <Play size={14} />}
            Simulate Impact
        </button>
      </div>
      
      <div className="flex flex-col gap-2 mb-4 bg-gray-50 dark:bg-[#1a1a1a] p-3 rounded-xl border border-gray-200 dark:border-white/10">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Path Name" 
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="flex-[2] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500"
          />
          <select
            value={newPriority}
            onChange={e => setNewPriority(e.target.value)}
            className="flex-1 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 appearance-none cursor-pointer"
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Local PoP" 
            value={newPoP}
            onChange={e => setNewPoP(e.target.value)}
            className="flex-1 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500"
          />
          <input 
            type="text" 
            placeholder="Global Provider" 
            value={newProvider}
            onChange={e => setNewProvider(e.target.value)}
            className="flex-1 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500"
          />
          <button 
            onClick={handleAddPath}
            disabled={!newName || !newPoP || !newProvider}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.2)]"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={silkPaths.map(p => p.id)} strategy={verticalListSortingStrategy}>
                {silkPaths.map(path => (
                    <SortablePath key={path.id} path={path} togglePath={togglePath} />
                ))}
            </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
