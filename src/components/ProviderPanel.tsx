import React from 'react';
import { X } from 'lucide-react';

export default function ProviderPanel({ provider, onClose }: { provider: string, onClose: () => void }) {
  const [details, setDetails] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(`/api/provider-details/${provider}`)
      .then(res => res.json())
      .then(setDetails);
  }, [provider]);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-white dark:bg-[#111] border-l border-gray-200 dark:border-white/10 shadow-2xl p-6 z-50 flex flex-col transition-transform">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{provider}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500"><X size={20} /></button>
        </div>
        {details ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a]">
                <p className="text-sm text-gray-500 mb-1 font-medium">Certificate Expiry</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{details.certExpiry}</p>
            </div>
            <div className="p-4 rounded-xl border border-rose-100 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10">
                <p className="text-sm text-rose-600 dark:text-rose-400 mb-1 font-medium">Active Incidents</p>
                <p className="text-2xl font-bold text-rose-700 dark:text-rose-500">{details.activeIncidents}</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a]">
                <p className="text-sm text-gray-500 mb-1 font-medium">Avg Latency</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{details.latencyAverage} <span className="text-sm text-gray-400">ms</span></p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 font-medium animate-pulse">Loading intelligence...</p>
          </div>
        )}
      </div>
    </>
  );
}
