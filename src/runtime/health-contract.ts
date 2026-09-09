export type HealthState = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
export type ComponentHealth = { name: string; state: HealthState; observedAt: string; latencyMs?: number; message?: string };
export type HealthSnapshot = { state: HealthState; components: ComponentHealth[]; observedAt: string };
