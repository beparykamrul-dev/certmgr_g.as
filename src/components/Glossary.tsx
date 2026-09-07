import React from 'react';

const GLOSSARY = {
  "PKI": "Public Key Infrastructure - standard for digital certificates.",
  "RBAC": "Role-Based Access Control - managing permissions.",
  "ASN": "Autonomous System Number - network routing identifier.",
  "CDN": "Content Delivery Network - distributed servers for faster content delivery."
};

export default function Glossary() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mt-6">
      <h3 className="text-lg font-semibold mb-4">Ecosystem Glossary</h3>
      <dl className="space-y-2">
        {Object.entries(GLOSSARY).map(([term, definition]) => (
          <div key={term}>
            <dt className="font-bold text-blue-800">{term}</dt>
            <dd className="text-sm text-gray-600">{definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
