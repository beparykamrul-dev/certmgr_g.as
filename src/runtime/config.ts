export type RuntimeConfig = {
  nodeEnv: string;
  port: number;
  apiToken?: string;
  trustProxy: boolean;
  databaseUrl?: string;
  alertmanagerUrl?: string;
  prometheusUrl?: string;
  acmeDirectoryUrl?: string;
  trafficCollectorUrl?: string;
};

export function loadRuntimeConfig(env: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const port = Number(env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
  return {
    nodeEnv: env.NODE_ENV || 'development',
    port,
    apiToken: env.FTN_API_TOKEN?.trim() || undefined,
    trustProxy: env.TRUST_PROXY === 'true',
    databaseUrl: env.DATABASE_URL?.trim() || undefined,
    alertmanagerUrl: env.ALERTMANAGER_URL?.trim() || undefined,
    prometheusUrl: env.PROMETHEUS_URL?.trim() || undefined,
    acmeDirectoryUrl: env.ACME_DIRECTORY_URL?.trim() || undefined,
    trafficCollectorUrl: env.TRAFFIC_COLLECTOR_URL?.trim() || undefined,
  };
}

export function operatorControlConfigured(config: RuntimeConfig): boolean {
  return Boolean(config.apiToken && config.apiToken.length >= 32);
}
