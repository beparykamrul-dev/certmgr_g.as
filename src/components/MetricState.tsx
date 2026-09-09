import React from 'react';

export default function MetricState({ value, unit = '' }: { value: number | null | undefined; unit?: string }) {
  return <span className="font-mono">{typeof value === 'number' && Number.isFinite(value) ? `${value}${unit}` : '—'}</span>;
}
