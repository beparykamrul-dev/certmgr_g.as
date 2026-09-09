import React, { useEffect, useState } from 'react';
import NotConfiguredState from './NotConfiguredState';

interface Event { id: number | string; section: string; event: string; timestamp: string; }
export default function EventHistory() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { let active = true; fetch('/api/event-history', { headers: { Accept: 'application/json' } }).then(async r => ({ ok: r.ok, body: await r.json() })).then(({ ok, body }) => { if (!active) return; setError(!ok); setEvents(ok && Array.isArray(body) ? body : []); }).catch(() => active && setError(true)); return () => { active = false; }; }, []);
  return <div className="pt-2"><div className="mb-6"><h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Event History</h3><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Recent changes and system events from the live audit source</p></div>{error ? <NotConfiguredState feature="Event history" reason="The event-history API is unavailable; no local or synthetic events are shown." /> : events === null ? <p className="text-xs text-gray-400">Loading event history…</p> : events.length === 0 ? <NotConfiguredState feature="Event history" reason="No live events have been reported." /> : <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr className="border-b border-gray-200 dark:border-white/10"><th className="pb-3 pr-4">Section</th><th className="pb-3 px-4">Event</th><th className="pb-3 pl-4 text-right">Time</th></tr></thead><tbody className="divide-y divide-gray-100 dark:divide-white/5">{events.map(event => <tr key={event.id}><td className="py-4 pr-4 font-semibold">{event.section}</td><td className="py-4 px-4 text-gray-600 dark:text-gray-400">{event.event}</td><td className="py-4 pl-4 text-right font-mono text-xs text-gray-400">{event.timestamp}</td></tr>)}</tbody></table></div>}</div>;
}
