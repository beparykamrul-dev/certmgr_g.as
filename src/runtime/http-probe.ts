export type HttpProbeResult = { ok: boolean; status: number | null; latencyMs: number | null; error?: string };

export async function httpProbe(url: string, timeoutMs = 3000, fetchImpl: typeof fetch = fetch): Promise<HttpProbeResult> {
  const started = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, { method: 'GET', signal: controller.signal, redirect: 'manual' });
    return { ok: response.status >= 200 && response.status < 400, status: response.status, latencyMs: Math.round(performance.now() - started) };
  } catch (error) {
    return { ok: false, status: null, latencyMs: Math.round(performance.now() - started), error: error instanceof Error ? error.message : 'probe_failed' };
  } finally { clearTimeout(timer); }
}
