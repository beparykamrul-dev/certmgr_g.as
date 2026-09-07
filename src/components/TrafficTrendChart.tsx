import React, { useEffect, useState } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function TrafficTrendChart({ context = 'Global' }: { context?: string }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/traffic-trend?context=${encodeURIComponent(context)}`)
      .then(res => res.json())
      .then(data => setData(data.reverse())); // Show oldest to newest left-to-right
  }, [context]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 text-white backdrop-blur-md border border-gray-700/50 p-3 rounded-xl shadow-xl min-w-[170px]">
          <p className="text-xs font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => {
            const isError = entry.name.includes("Error");
            return (
              <div key={index} className="flex justify-between items-center mb-1.5 last:mb-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm font-medium text-gray-300 capitalize">{entry.name}</span>
                </div>
                <span className={`text-sm font-bold ${isError ? 'text-red-400' : ''}`}>
                  {isError ? Number(entry.value).toFixed(1) : entry.value} 
                  <span className="text-xs font-normal text-gray-400 ml-1">{isError ? '%' : 'Gbps'}</span>
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 mt-4 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIngress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorEgress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSilk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" strokeOpacity={0.15} />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#888', fontWeight: 500 }}
            dy={10}
            minTickGap={30}
          />
          <YAxis 
            yAxisId="left"
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#888', fontWeight: 500 }}
            tickFormatter={(value) => `${value}G`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#ef4444', fontWeight: 500 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          <Area yAxisId="left" type="monotone" dataKey="ingress" name="Ingress" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIngress)" />
          <Area yAxisId="left" type="monotone" dataKey="egress" name="Egress" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorEgress)" />
          <Area yAxisId="left" type="step" dataKey="silkTraffic" name="Local Silk Path" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorSilk)" />
          <Line yAxisId="right" type="monotone" dataKey="errorRate" name="Error Rate" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
