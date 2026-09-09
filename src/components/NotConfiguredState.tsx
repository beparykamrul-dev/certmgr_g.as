import React from 'react';
import { CircleOff } from 'lucide-react';

export default function NotConfiguredState({ feature, reason }: { feature: string; reason?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm">
      <CircleOff size={18} className="text-amber-400 shrink-0" />
      <div><div className="font-semibold text-gray-800 dark:text-gray-200">{feature} is not configured</div><div className="text-xs text-gray-500 dark:text-gray-400">{reason || 'No live collector or provider adapter is configured.'}</div></div>
    </div>
  );
}
