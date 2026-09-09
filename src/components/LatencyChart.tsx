import React, { useEffect, useState } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import NotConfiguredState from './NotConfiguredState';

export default function LatencyChart({ context = 'Global' }: { context?: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); fetch(`/api/latency?context=${encodeURIComponent(context)}`).then(r=>r.json()).then(v=>setData(Array.isArray(v)?v.slice(0,8):[])).finally(()=>setLoading(false)); }, [context]);
  if (!loading && data.length === 0) return <NotConfiguredState feature="Traffic intelligence / latency" reason="No live latency collector has supplied telemetry."/>;
  return <div className="h-64 mt-4 w-full"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={data} margin={{top:10,right:0,left:-20,bottom:0}}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="provider"/><YAxis yAxisId="left"/><YAxis yAxisId="right" orientation="right"/><Tooltip/><Legend/><Area yAxisId="left" type="monotone" dataKey="latency" name="Latency" fillOpacity={0.15} stroke="#3b82f6"/><Line yAxisId="left" type="monotone" dataKey="silkSpike" name="Silk" stroke="#d946ef"/><Line yAxisId="right" type="step" dataKey="errorRate" name="Error %" stroke="#ef4444"/></ComposedChart></ResponsiveContainer></div>;
}
