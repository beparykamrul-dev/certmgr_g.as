import { env } from './env';
import { AdapterResult, unavailable } from './result';

export async function getJson<T>(url: string, tokenEnv?: string): Promise<AdapterResult<T>> {
  const token = tokenEnv ? env(tokenEnv) : undefined;
  try {
    const response = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined, signal: AbortSignal.timeout(5000) });
    if (!response.ok) return unavailable<T>(url, `HTTP ${response.status}`);
    return { state: 'configured', configured: true, source: url, data: await response.json() as T };
  } catch (error) {
    return unavailable<T>(url, error instanceof Error ? error.message : 'request failed');
  }
}
