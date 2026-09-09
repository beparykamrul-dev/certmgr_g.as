export interface TrafficSample { provider: string; observedAt: string; ingressBps?: number; egressBps?: number; requestsPerSecond?: number; latencyMs?: number; packetLossPct?: number; source: string; }
export interface AnomalySample extends TrafficSample { baselineBps?: number; deviationPct?: number; classification?: 'spike' | 'drop' | 'normal' | 'unknown'; }
