import React, { useState } from 'react';
import { Folder, Maximize2, RotateCcw, BarChart3, PieChart, Table as TableIcon, Layers } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  percentage: number;
  requests: string;
  color: string;
}

export default function CategoryAnalysis() {
  const [viewType, setViewType] = useState<'doughnut' | 'pie' | 'bar' | 'table'>('doughnut');
  const [hoveredCategory, setHoveredCategory] = useState<CategoryItem | null>(null);

  const categories: CategoryItem[] = [
    { id: 'other', name: 'Other (L4 Raw TCP / UDP)', percentage: 47.5, requests: '70.7M', color: '#ef4444' },
    { id: 'prod', name: 'Productivity (mTLS Enterprise Mesh)', percentage: 17.5, requests: '26.0M', color: '#84cc16' },
    { id: 'comm', name: 'Communication (HTTP/3 QUIC)', percentage: 12.2, requests: '18.1M', color: '#06b6d4' },
    { id: 'browser', name: 'Browser (TLS 1.3 ChaCha20)', percentage: 11.5, requests: '17.1M', color: '#6366f1' },
    { id: 'dev', name: 'Development (gRPC / API Gateway)', percentage: 11.3, requests: '16.8M', color: '#0ea5e9' }
  ];

  // SVG Donut calculations
  let accumulatedAngle = 0;
  const radius = 68;
  const strokeWidth = 32;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="w-full bg-[#182230] dark:bg-[#0f172a] text-white rounded-2xl border border-gray-700/50 shadow-xl p-5 font-sans relative">
      {/* Top Header matching reference 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-700/60 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <Folder className="text-amber-400 fill-amber-400/20" size={20} />
          <h3 className="text-base font-bold text-gray-100 tracking-tight">Category Analysis</h3>
        </div>

        {/* View Switcher Tabs matching reference 2: Doughnut, Pie, Bar, Chart, Table */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="bg-[#0f172a] dark:bg-[#090d16] p-1 rounded-lg border border-gray-700/60 flex items-center gap-1 text-xs">
            <button 
              onClick={() => setViewType('doughnut')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${viewType === 'doughnut' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Doughnut
            </button>
            <button 
              onClick={() => setViewType('pie')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${viewType === 'pie' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Pie
            </button>
            <button 
              onClick={() => setViewType('bar')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${viewType === 'bar' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Bar
            </button>
            <button 
              onClick={() => setViewType('table')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${viewType === 'table' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Table
            </button>
          </div>

          <span className="text-xs text-gray-400 font-medium px-2 py-1 bg-gray-800/40 rounded-lg border border-gray-700/40">
            Time distribution by category
          </span>

          <div className="flex items-center gap-1 text-gray-400">
            <button className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors" title="Reload Analysis">
              <RotateCcw size={14} />
            </button>
            <button className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors" title="Toggle Expanded View">
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewType === 'doughnut' && (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-72 h-72">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {categories.map((cat) => {
                const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedAngle;
                accumulatedAngle += (cat.percentage / 100) * circumference;

                const isHovered = hoveredCategory?.id === cat.id;

                return (
                  <circle
                    key={cat.id}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={cat.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(cat)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              })}
            </svg>

            {/* Center Stat / Hover Indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
              {hoveredCategory ? (
                <>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: hoveredCategory.color }}>
                    {hoveredCategory.name.split(' ')[0]}
                  </span>
                  <span className="text-2xl font-black text-white font-mono">{hoveredCategory.percentage}%</span>
                  <span className="text-[11px] text-gray-300">{hoveredCategory.requests} reqs</span>
                </>
              ) : (
                <>
                  <span className="text-[11px] text-gray-400 font-mono uppercase tracking-widest">TOTAL TRAFFIC</span>
                  <span className="text-xl font-bold text-white font-mono">148.9M</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">100% Inspected</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {viewType === 'pie' && (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {categories.map((cat) => {
                const strokeDasharray = `${(cat.percentage / 100) * (2 * Math.PI * 45)} ${2 * Math.PI * 45}`;
                const strokeDashoffset = -accumulatedAngle;
                accumulatedAngle += (cat.percentage / 100) * (2 * Math.PI * 45);

                return (
                  <circle
                    key={cat.id}
                    cx="100"
                    cy="100"
                    r="45"
                    fill="none"
                    stroke={cat.color}
                    strokeWidth="90"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer hover:opacity-90"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {viewType === 'bar' && (
        <div className="py-4 space-y-3 max-w-2xl mx-auto">
          {categories.map((cat) => (
            <div key={cat.id} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-300">{cat.name}</span>
                <span className="font-bold text-white">{cat.percentage}% ({cat.requests})</span>
              </div>
              <div className="h-4 w-full bg-black/40 rounded-lg overflow-hidden flex">
                <div 
                  className="h-full rounded-lg transition-all duration-700"
                  style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {viewType === 'table' && (
        <div className="overflow-x-auto py-2">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-gray-700 text-gray-400 uppercase">
              <tr>
                <th className="py-2.5 px-3">Category / Protocol</th>
                <th className="py-2.5 px-3">Percentage</th>
                <th className="py-2.5 px-3">Requests Inspected</th>
                <th className="py-2.5 px-3">SLA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: cat.color }} />
                    <span className="text-gray-200 font-semibold">{cat.name}</span>
                  </td>
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">{cat.percentage}%</td>
                  <td className="py-2.5 px-3 text-gray-300">{cat.requests}</td>
                  <td className="py-2.5 px-3 text-emerald-400">Optimal (0.4ms)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom Colorful Legend matching reference 2 */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-gray-700/60 text-xs font-mono">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
            onMouseEnter={() => setHoveredCategory(cat)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <span className="w-3 h-3 rounded-xs shrink-0" style={{ backgroundColor: cat.color }} />
            <span className="text-gray-300">{cat.name.split(' ')[0]} ({cat.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
