import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export default function AuditTrail() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(setLogs);

    const handleAddLog = (e: any) => {
      setLogs(prev => [{ id: Date.now(), action: e.detail.action, user: e.detail.user, time: new Date().toLocaleTimeString() }, ...prev]);
    };
    window.addEventListener('addAuditLog', handleAddLog);
    return () => window.removeEventListener('addAuditLog', handleAddLog);
  }, []);

  const exportCSV = () => {
    const csv = logs.map(l => `${l.id},${l.action},${l.user},${l.time}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit.csv';
    a.click();
  };

  return (
    <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Audit Trail</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">System activity and compliance logs</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-sm font-medium transition-colors text-gray-700 dark:text-gray-300">
            <Download size={16} /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-medium">
                <th className="pb-3 pr-4 font-medium">Action</th>
                <th className="pb-3 px-4 font-medium">User</th>
                <th className="pb-3 pl-4 font-medium text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {logs.map(log => (
              <tr key={log.id} className="group hover:bg-gray-50 dark:hover:bg-white-[0.02] transition-colors">
                <td className="py-4 pr-4 text-gray-900 dark:text-gray-200 font-medium">{log.action}</td>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 dark:bg-[#1a1a1a] text-xs font-medium">
                        {log.user}
                    </span>
                </td>
                <td className="py-4 pl-4 text-gray-400 dark:text-gray-500 text-right font-mono text-xs">{log.time}</td>
              </tr>
            ))}
            {logs.length === 0 && (
                <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500 dark:text-gray-400">No logs found</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
