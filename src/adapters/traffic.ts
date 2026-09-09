import { env } from './env';
import { unavailable, configured, AdapterResult } from './result';

export function trafficConfig(): AdapterResult<{ endpoint: string }> {
  const endpoint = env('TRAFFIC_TELEMETRY_URL');
  return endpoint ? configured('traffic-telemetry', { endpoint }) : unavailable('traffic-telemetry', 'TRAFFIC_TELEMETRY_URL is not configured');
}
