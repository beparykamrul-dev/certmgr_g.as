export type HealthState = 'ok' | 'degraded' | 'not_configured' | 'failed';
export interface HealthComponent { name: string; state: HealthState; reason?: string; observedAt?: string; }
export interface ReadinessResponse { ready: boolean; components: HealthComponent[]; }
