import React from 'react';

export default function QuickFilter({ onFilter }: { onFilter: (group: string) => void }) {
  const groups = ['All Cloud', 'Global Content', 'Regional ISP'];
  return (
    <div className="flex gap-2 mb-4">
      {groups.map(group => (
        <button key={group} onClick={() => onFilter(group)} className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300">
          {group}
        </button>
      ))}
    </div>
  );
}
