import { env } from './env';
import { unavailable, configured, AdapterResult } from './result';

export function prometheusConfig(): AdapterResult<{ url: string }> {
  const url = env('PROMETHEUS_URL');
  return url ? configured('prometheus', { url }) : unavailable('prometheus', 'PROMETHEUS_URL is not configured');
}
