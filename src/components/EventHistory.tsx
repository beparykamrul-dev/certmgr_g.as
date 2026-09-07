import React, { useEffect, useState } from 'react';

interface Event { id: number; section: string; event: string; timestamp: string; }

export default function EventHistory() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/event-history')
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  return (
    <div className="pt-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Event History</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Recent changes and system events</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-medium">
              <th className="pb-3 pr-4 font-medium">Section</th>
              <th className="pb-3 px-4 font-medium">Event</th>
              <th className="pb-3 pl-4 font-medium text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {events.map(event => (
              <tr key={event.id} className="group hover:bg-gray-50 dark:hover:bg-white-[0.02] transition-colors">
                <td className="py-4 pr-4 font-semibold text-gray-900 dark:text-gray-200">{event.section}</td>
                <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{event.event}</td>
                <td className="py-4 pl-4 text-gray-400 dark:text-gray-500 text-right font-mono text-xs">{event.timestamp}</td>
              </tr>
            ))}
            {events.length === 0 && (
                <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500 dark:text-gray-400">No events found</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
