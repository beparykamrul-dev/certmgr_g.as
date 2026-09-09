import type { HealthSnapshot } from './health-contract';

export function isReady(snapshot: HealthSnapshot): boolean {
  return snapshot.state === 'healthy' && snapshot.components.length > 0 && snapshot.components.every(c => c.state === 'healthy');
}
