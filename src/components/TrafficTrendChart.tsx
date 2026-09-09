import React, { useEffect, useState } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import NotConfiguredState from './NotConfiguredState';

export default function TrafficTrendChart({ context = 'Global' }: { context?: string }) {
  const [data, setData] = useState<any[]>([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{setLoading(true);fetch(`/api/traffic-trend?context=${encodeURIComponent(context)}`).then(r=>r.json()).then(v=>setData(Array.isArray(v)?[...v].reverse():[])).finally(()=>setLoading(false));},[context]);
  if(!loading && data.length===0)return <NotConfiguredState feature="Network traffic trend" reason="No live traffic collector has supplied telemetry."/>;
  return <div className="h-64 mt-4 w-full"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={data} margin={{top:10,right:0,left:-20,bottom:0}}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="time"/><YAxis yAxisId="left"/><YAxis yAxisId="right" orientation="right"/><Tooltip/><Legend/><Area yAxisId="left" type="monotone" dataKey="ingress" name="Ingress" fillOpacity={0.15} stroke="#10b981"/><Area yAxisId="left" type="monotone" dataKey="egress" name="Egress" fillOpacity={0.1} stroke="#6366f1"/><Area yAxisId="left" type="step" dataKey="silkTraffic" name="Silk Path" fillOpacity={0.1} stroke="#f59e0b"/><Line yAxisId="right" type="monotone" dataKey="errorRate" name="Error %" stroke="#ef4444"/></ComposedChart></ResponsiveContainer></div>;
}
