import type { HealthSnapshot } from './health-contract';

export type ServiceHealthProbe = {
  service: string;
  url: string;
  timeoutMs?: number;
};

export async function probeServiceHealth(probe: ServiceHealthProbe, fetchImpl: typeof fetch = fetch): Promise<HealthSnapshot> {
  const started = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), probe.timeoutMs ?? 5000);
  try {
    const response = await fetchImpl(probe.url, { signal: controller.signal });
    const latencyMs = Math.round(performance.now() - started);
    return {
      state: response.ok ? 'healthy' : 'unhealthy',
      components: [{ name: probe.service, state: response.ok ? 'healthy' : 'unhealthy', latencyMs }],
    };
  } catch {
    return { state: 'unhealthy', components: [{ name: probe.service, state: 'unhealthy', latencyMs: Math.round(performance.now() - started) }] };
  } finally {
    clearTimeout(timeout);
  }
}
