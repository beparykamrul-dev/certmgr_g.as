import React from 'react';
import { X } from 'lucide-react';
import NotConfiguredState from './NotConfiguredState';

export default function ProviderPanel({ provider, onClose }: { provider: string; onClose: () => void }) {
  const [details, setDetails] = React.useState<any>(null);
  React.useEffect(() => { let active = true; fetch(`/api/provider-details/${encodeURIComponent(provider)}`).then(r => r.json()).then(v => active && setDetails(v)).catch(() => active && setDetails({ status: 'error', reason: 'Provider API request failed' })); return () => { active = false; }; }, [provider]);
  return <><div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} /><div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-white dark:bg-[#111] border-l border-gray-200 dark:border-white/10 shadow-2xl p-6 z-50 flex flex-col"><div className="flex items-center justify-between mb-8"><h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{provider}</h2><button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500"><X size={20} /></button></div>{!details ? <p className="text-gray-400 animate-pulse">Loading provider state…</p> : details.configured === false ? <NotConfiguredState feature={`${provider} intelligence`} reason={details.reason} /> : <div className="space-y-4"><div className="text-xs text-gray-500">Source: {details.source || 'live adapter'}</div><pre className="text-xs whitespace-pre-wrap break-words bg-gray-50 dark:bg-white/5 rounded-xl p-3">{JSON.stringify(details, null, 2)}</pre></div>}</div></>;
}
