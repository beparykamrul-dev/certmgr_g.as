import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Alert { id: number | string; message: string; severity?: 'high' | 'medium' | 'low'; }

export default function AlertBanner() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    fetch('/api/alerts', { headers: { Accept: 'application/json' } })
      .then(async res => ({ ok: res.ok, body: await res.json() }))
      .then(({ ok, body }) => { if (!active) return; setError(!ok); setAlerts(ok && Array.isArray(body) ? body : []); })
      .catch(() => active && setError(true));
    return () => { active = false; };
  }, []);
  if (error) return <div className="bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 p-3 px-6 text-xs">Alert service unavailable; no alert state is assumed.</div>;
  if (alerts.length === 0) return null;
  return <div className="bg-red-50 dark:bg-red-500/10 border-b border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 p-3 px-6 flex items-start sm:items-center"><AlertTriangle className="mr-3 shrink-0" size={18} /><div className="flex-1 space-y-1">{alerts.map(alert => <div key={alert.id} className="text-sm font-semibold">{alert.message}</div>)}</div></div>;
}
