export type PrometheusStatus = { configured: boolean; url: string | null; source: string };
export function prometheusStatus(env: NodeJS.ProcessEnv = process.env): PrometheusStatus { const url = env.PROMETHEUS_URL?.trim() || null; return { configured: Boolean(url), url, source: 'runtime-config' }; }
