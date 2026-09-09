export type TrafficPoint = { timestamp: string; provider: string; context: string; value: number; unit: string };
export type TrafficSeries = { provider: string; context: string; points: TrafficPoint[]; observedAt: string };
