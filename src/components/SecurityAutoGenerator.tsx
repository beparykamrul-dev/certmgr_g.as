import React, { useEffect, useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export default function SecurityAutoGenerator() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Simulated event listener for attack detection
    const handleAttack = (e: any) => {
      const newAlert = {
        id: Date.now(),
        type: e.detail.type || 'Anomaly',
        message: `Detected ${e.detail.type}: ${e.detail.target}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setAlerts(prev => [newAlert, ...prev]);
    };
    window.addEventListener('attackDetected', handleAttack);
    return () => window.removeEventListener('attackDetected', handleAttack);
  }, []);

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3">
      {alerts.map(alert => (
        <div key={alert.id} className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl shadow-lg backdrop-blur flex items-center gap-3 animate-in slide-in-from-right-4">
          <ShieldAlert className="text-red-500" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-500">{alert.type}</p>
            <p className="text-xs text-red-400">{alert.message}</p>
          </div>
          <button onClick={() => dismissAlert(alert.id)} className="text-red-400 hover:text-red-300">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
