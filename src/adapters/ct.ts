import { env } from './env';
import { unavailable, configured, AdapterResult } from './result';

export function ctConfig(): AdapterResult<{ endpoint: string }> {
  const endpoint = env('CT_LOG_ENDPOINT');
  return endpoint ? configured('certificate-transparency', { endpoint }) : unavailable('certificate-transparency', 'CT_LOG_ENDPOINT is not configured');
}
