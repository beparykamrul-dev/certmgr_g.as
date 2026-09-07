import React, { useEffect, useState } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, Legend } from 'recharts';

export default function LatencyChart({ context = 'Global' }: { context?: string }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/latency?context=${encodeURIComponent(context)}`)
      .then(res => res.json())
      .then(data => setData(data.slice(0, 8))); // Keep it clean, show top 8
  }, [context]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900/90 text-white backdrop-blur-md border border-gray-700/50 p-3 rounded-xl shadow-xl min-w-[160px]">
          <p className="text-xs font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-sm text-gray-300">Base</span>
              </div>
              <span className="font-bold">{data.latency} <span className="text-xs text-gray-400 font-normal">ms</span></span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
                <span className="text-sm text-gray-300">Silk</span>
              </div>
              <span className="font-bold">{data.silkSpike} <span className="text-xs text-gray-400 font-normal">ms</span></span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-gray-700/50 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm text-gray-300">Errors</span>
              </div>
              <span className="font-bold text-red-400">{data.errorRate}%</span>
            </div>
            {data.packetLoss !== undefined && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-sm text-gray-300">Packet Loss</span>
                </div>
                <span className="font-bold text-orange-400">{data.packetLoss}%</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 mt-4 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorSilk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d946ef" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#c026d3" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" strokeOpacity={0.15} />
          <XAxis 
            dataKey="provider" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#888', fontWeight: 500 }} 
            dy={10}
          />
          <YAxis 
            yAxisId="left"
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#888', fontWeight: 500 }}
            tickFormatter={(value) => `${value}ms`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#ef4444', fontWeight: 500 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          <Area yAxisId="left" type="monotone" dataKey="latency" name="Historical Base" fill="url(#colorBlue)" stroke="#3b82f6" strokeWidth={2} />
          <Line yAxisId="left" type="monotone" dataKey="silkSpike" name="Real-time Silk" stroke="#d946ef" strokeWidth={3} dot={{ r: 4, fill: '#d946ef', strokeWidth: 0 }} activeDot={{ r: 6 }} />
          <Line yAxisId="right" type="step" dataKey="errorRate" name="5xx Error %" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
