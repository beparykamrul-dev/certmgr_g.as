export type ServiceHealth = { healthy: boolean; status: 'healthy' | 'unhealthy' | 'unknown'; latencyMs?: number; reason?: string };
export type ServiceHealthProbe = { check(service: string): Promise<ServiceHealth> };

export async function verifyServiceHealth(probe: ServiceHealthProbe, service: string): Promise<ServiceHealth> {
  const name = service.trim();
  if (!name) return { healthy: false, status: 'unknown', reason: 'service_required' };
  try { return await probe.check(name); }
  catch (error) { return { healthy: false, status: 'unhealthy', reason: error instanceof Error ? error.message : 'health_probe_failed' }; }
}
