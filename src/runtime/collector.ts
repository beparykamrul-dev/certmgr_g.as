export type CollectorStatus = { name: string; configured: boolean; healthy: boolean | null; source: string };

const configured = (value?: string) => Boolean(value?.trim());

export function getCollectorStatuses(env: NodeJS.ProcessEnv = process.env): CollectorStatus[] {
  const entries: Array<[string, string | undefined]> = [
    ['postgresql', env.DATABASE_URL],
    ['alertmanager', env.ALERTMANAGER_URL],
    ['prometheus', env.PROMETHEUS_URL],
    ['acme', env.ACME_DIRECTORY_URL],
  ];
  return entries.map(([name, value]) => ({ name, configured: configured(value), healthy: null, source: 'runtime-config' }));
}

export function configuredCollectorCount(env: NodeJS.ProcessEnv = process.env): number {
  return getCollectorStatuses(env).filter(c => c.configured).length;
}
