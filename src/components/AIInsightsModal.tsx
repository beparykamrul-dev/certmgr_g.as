import React, { useEffect, useState } from 'react';
import NotConfiguredState from './NotConfiguredState';

export default function AIInsightsModal({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<{ status: string; insights?: string; reason?: string } | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/ai-insights', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
      .then(async res => ({ ok: res.ok, body: await res.json() }))
      .then(({ body }) => active && setState(body))
      .catch(() => active && setState({ status: 'error', reason: 'AI API request failed' }));
    return () => { active = false; };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white dark:bg-[#111] p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-200 dark:border-white/10">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">AI Insights</h3>
        {!state ? <p className="text-gray-500">Loading adapter state…</p> : state.status === 'unavailable' || state.status === 'not-configured' ? <NotConfiguredState feature="FTN-AI insights" reason={state.reason} /> : state.status === 'error' ? <p className="text-red-500 text-sm">{state.reason || 'AI request failed.'}</p> : <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{state.insights || 'No insight returned.'}</p>}
        <button onClick={onClose} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">Close</button>
      </div>
    </div>
  );
}
