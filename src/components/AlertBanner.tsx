import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Alert {
  id: number;
  message: string;
  severity: 'high' | 'medium';
}

export default function AlertBanner() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data));
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className="bg-red-50 dark:bg-red-500/10 border-b border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 p-3 px-6 flex items-start sm:items-center shadow-sm">
      <AlertTriangle className="mr-3 shrink-0 mt-0.5 sm:mt-0" size={18} />
      <div className="flex-1 space-y-1">
        {alerts.map(alert => (
          <div key={alert.id} className="text-sm font-semibold">{alert.message}</div>
        ))}
      </div>
    </div>
  );
}
