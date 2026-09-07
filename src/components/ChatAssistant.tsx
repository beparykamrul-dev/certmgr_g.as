import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 h-[400px] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-[#1a1a1a]">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">FTN-AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"><X size={18} /></button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-[#111]">
            <div className="bg-gray-100 dark:bg-[#1a1a1a] p-3 rounded-xl rounded-tl-none inline-block max-w-[85%]">
                Hello! I can help you analyze network intelligence, check certificate statuses, or monitor latency anomalies. Ask me anything.
            </div>
          </div>
          <div className="p-3 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a]">
            <input className="w-full p-2.5 px-4 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="Type your message..." />
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)] text-white transition-all hover:scale-105 active:scale-95">
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
}
