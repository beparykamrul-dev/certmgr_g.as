import React, { useEffect, useState } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import NotConfiguredState from './NotConfiguredState';

export default function SSLAcceleratorChart() {
  const [data,setData]=useState<any[]>([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{fetch('/api/ssl-acceleration').then(r=>r.json()).then(v=>setData(Array.isArray(v)?v:[])).finally(()=>setLoading(false));},[]);
  if(!loading && !data.length)return <NotConfiguredState feature="SSL acceleration" reason="No live TLS offload telemetry is configured."/>;
  const latest=data[data.length-1]||{}; const total=Number(latest.hwOffload||0)+Number(latest.swFallback||0); const ratio=total?(Number(latest.hwOffload||0)/total)*100:0;
  const gauge=[{name:'HW Offload',value:Number(latest.hwOffload||0),color:'#10b981'},{name:'SW Fallback',value:Number(latest.swFallback||0),color:'#a855f7'}];
  return <div className="min-h-[250px] w-full pt-2 flex flex-col"><div className="flex-1 flex flex-col lg:flex-row gap-6"><div className="relative flex flex-col items-center justify-center w-full lg:w-1/3"><ResponsiveContainer width="100%" height={140}><PieChart><Pie data={gauge} cx="50%" cy="75%" startAngle={180} endAngle={0} innerRadius="75%" outerRadius="100%" dataKey="value" stroke="none">{gauge.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none"><span className="text-2xl font-black">{ratio.toFixed(1)}%</span><span className="text-[10px] font-semibold text-emerald-500 uppercase">HW Efficiency</span></div></div><div className="flex-1 h-[180px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><Tooltip/><Area type="monotone" dataKey="hwOffload" name="HW Offload" stroke="#10b981" fillOpacity={0.15}/><Area type="monotone" dataKey="swFallback" name="SW Fallback" stroke="#a855f7" fillOpacity={0.1}/></AreaChart></ResponsiveContainer></div></div></div>;
}
