export type RuntimeHealthState = 'healthy' | 'degraded' | 'unhealthy' | 'not_configured';

export function healthState(configured: boolean, healthy: boolean): RuntimeHealthState {
  if (!configured) return 'not_configured';
  return healthy ? 'healthy' : 'unhealthy';
}
