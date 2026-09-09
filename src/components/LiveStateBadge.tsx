import React from 'react';

export default function LiveStateBadge({ live, label }: { live: boolean; label?: string }) {
  return <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${live ? 'text-emerald-500' : 'text-amber-500'}`}><span className={`h-2 w-2 rounded-full ${live ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />{label || (live ? 'LIVE' : 'NOT CONFIGURED')}</span>;
}
