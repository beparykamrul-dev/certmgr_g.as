export type ServiceState = 'running' | 'stopped' | 'degraded' | 'unknown';
export type ServiceStatus = { name: string; state: ServiceState; observedAt: string; version?: string; message?: string };
