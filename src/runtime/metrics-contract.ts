export type MetricSample = { name: string; value: number; labels?: Record<string, string>; observedAt: string };

export function metric(name: string, value: number, labels?: Record<string, string>): MetricSample { return { name, value, labels, observedAt: new Date().toISOString() }; }
