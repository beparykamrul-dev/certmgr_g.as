import React, { useState, useEffect } from 'react';
import { X, Settings, RotateCcw, AlertTriangle } from 'lucide-react';

export default function UserSettingsModal({ onClose, onSave }: { onClose: () => void; onSave: (interval: number) => void }) {
  const [interval, setInterval] = useState(Number(localStorage.getItem('pollInterval') || 5000));
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 w-full max-w-sm">
        <h3 className="font-bold text-lg mb-4">Settings</h3>
        <label className="block mb-2 text-sm">Polling Interval (ms)</label>
        <select value={interval} onChange={e => setInterval(Number(e.target.value))} className="w-full p-2 bg-gray-800 rounded mb-4">
          <option value={5000}>5s</option>
          <option value={15000}>15s</option>
          <option value={30000}>30s</option>
        </select>
        <button onClick={() => { localStorage.setItem('pollInterval', interval.toString()); onSave(interval); onClose(); }} className="w-full bg-blue-600 p-2 rounded">Save</button>
      </div>
    </div>
  );
}
