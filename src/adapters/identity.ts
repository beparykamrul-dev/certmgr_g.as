import { env } from './env';
import { unavailable, configured, AdapterResult } from './result';

export function identityConfig(): AdapterResult<{ issuer: string }> {
  const issuer = env('OIDC_ISSUER_URL');
  return issuer ? configured('identity', { issuer }) : unavailable('identity', 'OIDC_ISSUER_URL is not configured');
}
