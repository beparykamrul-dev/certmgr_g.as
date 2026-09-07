/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

const SECTIONS = [
  "FTN Certificate / PKI Core",
  "FTN API Gateway",
  "FTN-AI Integration",
  "Monitoring API",
  "Control API",
  "Network Intelligence",
  "Prometheus / Alertmanager"
];

const TRAFFIC_PROVIDERS = [
  "Facebook/Meta", "Google", "Netflix", "EdgeNext", "Akamai", "AWS",
  "Cloudflare", "TikTok/ByteDance", "Ookla", "IMO", "PUBG", "Free Fire",
  "Fastly", "Bunny", "Tencent Cloud"
];

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">FTN CertMgr</h1>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTIONS.map((section) => (
          <div key={section} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{section}</h2>
            <div className="text-sm text-gray-500">Dashboard for {section}</div>
          </div>
        ))}
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Traffic Providers</h2>
          <div className="flex flex-wrap gap-2">
            {TRAFFIC_PROVIDERS.map((provider) => (
              <span key={provider} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {provider}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
