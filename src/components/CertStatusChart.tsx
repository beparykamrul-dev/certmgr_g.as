import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import NotConfiguredState from './NotConfiguredState';

export default function CertStatusChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/cert-status').then(r => r.json()).then(v => setData(Array.isArray(v) ? v : [])).finally(() => setLoading(false)); }, []);
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);
  if (!loading && total === 0) return <NotConfiguredState feature="Certificate health" reason="No live certificate inventory is configured." />;
  return <div className="h-64 mt-4 w-full relative"><div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col mt-[-10px]"><span className="text-3xl font-extrabold">{total}</span><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Certs</span></div><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">{data.map((entry, index) => <Cell key={index} fill={entry.color}/>)}</Pie><Tooltip/><Legend verticalAlign="bottom" height={36} iconType="circle"/></PieChart></ResponsiveContainer></div>;
}
