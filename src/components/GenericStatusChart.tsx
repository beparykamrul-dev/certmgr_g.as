import React, { useEffect, useState } from 'react';
import NotConfiguredState from './NotConfiguredState';

export default function GenericStatusChart({ name, status, trend }: { name: string; status: string; trend: string }) {
  const [state, setState] = useState<any[] | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/module-trend?module=${encodeURIComponent(name)}&status=${encodeURIComponent(status)}`, { headers: { Accept: 'application/json' } })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => active && setState(Array.isArray(data) ? data : []))
      .catch(() => active && setState([]));
    return () => { active = false; };
  }, [name, status]);

  if (state === null) return <div className="mt-2 text-xs text-gray-400">Loading telemetry…</div>;
  if (state.length === 0) return <NotConfiguredState feature={`${name} telemetry`} reason="No live module telemetry is configured." />;
  return <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3 text-xs dark:border-white/5"><span className="text-gray-500">{state.length} live samples</span><span className="text-gray-400">Live trend: {trend}</span></div>;
}
