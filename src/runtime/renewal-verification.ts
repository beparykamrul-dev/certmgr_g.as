import type { ServiceHealth } from './service-health-verifier';

export type RenewalVerification = { healthy: boolean; reason: string };
export function verifyRenewalOutcome(health: ServiceHealth): RenewalVerification {
  if (health.status === 'healthy' && health.healthy) return { healthy: true, reason: 'service_healthy_after_renewal' };
  return { healthy: false, reason: health.reason || 'service_health_not_confirmed' };
}
