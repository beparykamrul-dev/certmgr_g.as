import { httpProbe } from './http-probe';
import type { CollectorStatus } from './collector';

export async function probeCollectors(statuses: CollectorStatus[], env: NodeJS.ProcessEnv = process.env, timeoutMs = 3000): Promise<CollectorStatus[]> {
  const envKey: Record<string, string> = { prometheus: 'PROMETHEUS_URL', alertmanager: 'ALERTMANAGER_URL', acme: 'ACME_DIRECTORY_URL', traffic: 'TRAFFIC_COLLECTOR_URL' };
  return Promise.all(statuses.map(async status => {
    if (!status.configured || status.name === 'postgresql') return status;
    const url = env[envKey[status.name]]?.trim();
    if (!url) return status;
    const result = await httpProbe(url, timeoutMs);
    return { ...status, healthy: result.ok, source: result.ok ? 'live-http-probe' : 'live-http-probe-failed' };
  }));
}
