import { env } from './env';
import { unavailable, configured, AdapterResult } from './result';

export function providerConfig(): AdapterResult<{ endpoint: string }> {
  const endpoint = env('PROVIDER_INTELLIGENCE_URL');
  return endpoint ? configured('provider-intelligence', { endpoint }) : unavailable('provider-intelligence', 'PROVIDER_INTELLIGENCE_URL is not configured');
}
