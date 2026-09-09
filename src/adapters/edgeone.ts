import { env } from './env';
import { unavailable, configured, AdapterResult } from './result';

export function edgeOneConfig(): AdapterResult<{ endpoint: string }> {
  const endpoint = env('EDGEONE_API_URL');
  return endpoint ? configured('edgeone', { endpoint }) : unavailable('edgeone', 'EDGEONE_API_URL is not configured');
}
