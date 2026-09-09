import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ApiErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-600 dark:text-rose-400"><div className="flex items-center gap-2 font-semibold"><AlertTriangle size={16} /> Live API request failed</div><div className="mt-1 text-xs opacity-80">{message}</div>{onRetry && <button onClick={onRetry} className="mt-2 rounded-lg border px-2 py-1 text-xs">Retry</button>}</div>;
}
