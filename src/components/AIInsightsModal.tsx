import React, { useState } from 'react';

export default function AIInsightsModal({ onClose }: { onClose: () => void }) {
  const [insights, setInsights] = useState('');

  React.useEffect(() => {
    fetch('/api/ai-insights', { method: 'POST', headers: {'Content-Type': 'application/json'} })
      .then(res => res.json())
      .then(data => setInsights(data.insights));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">AI Insights</h3>
        <p className="text-gray-700">{insights || 'Analyzing...'}</p>
        <button onClick={onClose} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">Close</button>
      </div>
    </div>
  );
}
