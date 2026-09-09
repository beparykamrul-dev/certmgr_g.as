export interface MetricSample { name: string; value: number; labels?: Record<string, string>; timestamp?: number; }
export interface MetricsSnapshot { observedAt: string; source: string; samples: MetricSample[]; }
