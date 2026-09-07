import React, { useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

export default function GenericStatusChart({ name, status, trend }: { name: string, status: string, trend: string }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/module-trend?module=${encodeURIComponent(name)}&status=${status}`)
      .then(res => res.json())
      .then(setData)
      .catch(() => {
        // Fallback flat line if fetch fails
        setData(Array.from({ length: 20 }).map((_, i) => ({ health: status === 'green' ? 95 : 50 })));
      });
  }, [name, status]);

  const color = status === 'green' ? '#10b981' : status === 'yellow' ? '#f59e0b' : '#ef4444';
  const id = `color-${name.replace(/[^a-zA-Z0-9]/g, '-')}`;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-black/95 border border-gray-200 dark:border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md z-50 min-w-[140px]">
          <p className="font-bold text-gray-800 dark:text-gray-100 text-xs mb-2 border-b border-gray-100 dark:border-white/10 pb-1">{name} ({data.time})</p>
          <div className="space-y-1.5 text-[10px]">
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-500 font-medium">Health</span>
              <span className="font-bold text-emerald-500">{data.health.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-500 font-medium">Latency</span>
              <span className="font-bold text-blue-500">{data.latency.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-500 font-medium">Error Rate</span>
              <span className="font-bold text-red-500">{data.errorRate.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-2 flex flex-col justify-between flex-1">
      <div className="h-12 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`lat-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id={`err-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            <YAxis yAxisId="lat" domain={['auto', 'auto']} hide />
            <YAxis yAxisId="err" domain={[0, 100]} hide />
            <Area 
              yAxisId="lat"
              type="monotoneX" 
              dataKey="latency" 
              stroke="#3b82f6" 
              strokeWidth={1.5}
              fill={`url(#lat-${id})`} 
              isAnimationActive={false}
            />
            <Area 
              yAxisId="err"
              type="monotoneX" 
              dataKey="errorRate" 
              stroke="#ef4444" 
              strokeWidth={1.5}
              fill={`url(#err-${id})`} 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1">
              1H Trend
            </span>
            <span className="flex gap-1 items-center ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            </span>
        </div>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          status === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
          status === 'yellow' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
          'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
        }`}>
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
