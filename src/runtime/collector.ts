export type CollectorStatus = { name: string; configured: boolean; healthy: boolean | null; source: string; observedAt?: string; latencyMs?: number; error?: string };

const configured = (value?: string) => Boolean(value?.trim());

export function getCollectorStatuses(env: NodeJS.ProcessEnv = process.env): CollectorStatus[] {
  const entries: Array<[string, string | undefined]> = [
    ['postgresql', env.DATABASE_URL],
    ['alertmanager', env.ALERTMANAGER_URL],
    ['prometheus', env.PROMETHEUS_URL],
    ['acme', env.ACME_DIRECTORY_URL],
    ['traffic', env.TRAFFIC_COLLECTOR_URL],
  ];
  return entries.map(([name, value]) => ({
    name,
    configured: configured(value),
    healthy: null,
    source: configured(value) ? 'runtime-config-awaiting-healthcheck' : 'runtime-config',
  }));
}

export function configuredCollectorCount(env: NodeJS.ProcessEnv = process.env): number {
  return getCollectorStatuses(env).filter(c => c.configured).length;
}

export function hasLiveCollector(statuses: CollectorStatus[]): boolean {
  return statuses.some(status => status.configured && status.healthy === true);
}

export async function probeHttpCollector(url: string, timeoutMs = 2500): Promise<{ healthy: boolean; latencyMs?: number; error?: string }> {
  const started = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { method: 'GET', signal: controller.signal, headers: { accept: 'application/json,text/plain,*/*' } });
    return { healthy: response.ok, latencyMs: Math.round(performance.now() - started), ...(response.ok ? {} : { error: `HTTP ${response.status}` }) };
  } catch (error) {
    return { healthy: false, latencyMs: Math.round(performance.now() - started), error: error instanceof Error ? error.message : 'collector probe failed' };
  } finally {
    clearTimeout(timeout);
  }
}

export async function probeCollectorStatuses(env: NodeJS.ProcessEnv = process.env): Promise<CollectorStatus[]> {
  const statuses = getCollectorStatuses(env);
  const urls: Record<string, string | undefined> = {
    prometheus: env.PROMETHEUS_URL,
    alertmanager: env.ALERTMANAGER_URL,
    acme: env.ACME_DIRECTORY_URL,
    traffic: env.TRAFFIC_COLLECTOR_URL,
  };
  return Promise.all(statuses.map(async status => {
    const url = urls[status.name];
    if (!status.configured) return status;
    if (!url) return { ...status, source: 'runtime-config-no-http-probe' };
    const probe = await probeHttpCollector(url);
    return { ...status, ...probe, source: 'live-http-healthcheck', observedAt: new Date().toISOString() };
  }));
}
