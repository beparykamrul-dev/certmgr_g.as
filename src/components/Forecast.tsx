import React, { useEffect, useState } from 'react';

export default function Forecast() {
  const [forecast, setForecast] = useState('');

  useEffect(() => {
    fetch('/api/forecast')
      .then(res => res.json())
      .then(data => setForecast(data.forecast));
  }, []);

  return (
    <div className="pt-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">FTN-AI Forecast</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Predictive analysis based on historical patterns</p>
        </div>
      </div>
      <div className="p-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl text-sm font-medium text-blue-800 dark:text-blue-300 shadow-sm flex items-start gap-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 animate-pulse shrink-0" />
        <p className="leading-relaxed">
            {forecast || 'Loading forecast intelligence...'}
        </p>
      </div>
    </div>
  );
}
