import React, { useEffect, useState } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function SSLAcceleratorChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/ssl-acceleration')
      .then(res => res.json())
      .then(setData);
  }, []);

  const latest = data.length ? data[data.length - 1] : { hwOffload: 0, swFallback: 0, efficiency: 0 };
  const total = latest.hwOffload + latest.swFallback;
  const hwRatio = total > 0 ? (latest.hwOffload / total) * 100 : 0;
  
  const gaugeData = [
    { name: 'HW Offload', value: latest.hwOffload, color: '#10b981' },
    { name: 'SW Fallback', value: latest.swFallback, color: '#a855f7' }
  ];

  return (
    <div className="h-full min-h-[250px] w-full pt-2 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">Edge SSL Acceleration</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">AES-NI Hardware Throughput vs Fallback</p>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row gap-6">
          <div className="relative flex flex-col items-center justify-center w-full lg:w-1/3">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="75%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="75%"
                  outerRadius="100%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={true}
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.95)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
                <span className="text-2xl font-black text-gray-900 dark:text-white drop-shadow-sm">
                    {hwRatio.toFixed(1)}%
                </span>
                <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest">
                    HW Efficiency
                </span>
            </div>
            
            <div className="w-full mt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/10 pt-2">
                <div className="text-[10px] font-bold text-emerald-500">HW: {latest.hwOffload}</div>
                <div className="text-[10px] font-bold text-purple-500">SW: {latest.swFallback}</div>
            </div>
          </div>
          
          <div className="flex-1 w-full lg:w-2/3 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorSw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.95)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="hwOffload" name="HW Offload" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorHw)" />
                <Area type="monotone" dataKey="swFallback" name="SW Fallback" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorSw)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
}
