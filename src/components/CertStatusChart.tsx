import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function CertStatusChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/cert-status')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900/90 text-white backdrop-blur-md border border-gray-700/50 py-2 px-3 rounded-xl shadow-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
          <p className="text-sm font-semibold">{data.name}</p>
          <p className="text-sm font-bold ml-2">{data.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 mt-4 w-full relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col mt-[-10px]">
        <span className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{data.reduce((acc, item: any) => acc + item.value, 0)}</span>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Certs</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry: any, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} className="transition-all duration-300 hover:opacity-80" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value, entry: any) => <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
