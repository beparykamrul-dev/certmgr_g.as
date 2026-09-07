import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center pt-20">
      <div className="bg-white dark:bg-[#111] w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden p-2">
        <div className="flex items-center gap-2 p-2 border-b border-gray-100 dark:border-white/5">
          <Search size={20} className="text-gray-400" />
          <input
            autoFocus
            className="w-full bg-transparent outline-none p-2 text-sm text-gray-900 dark:text-white"
            placeholder="Search dashboard sections..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
            <p className="px-2 py-1">Quick navigation coming soon...</p>
        </div>
      </div>
    </div>
  );
}
