export type ProviderHealth = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
export interface ProviderTelemetry { provider: string; observedAt: string; health: ProviderHealth; latencyMs?: number; packetLossPct?: number; source: string; }
