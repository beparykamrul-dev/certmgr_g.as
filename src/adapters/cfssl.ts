import { env } from './env';
import { unavailable, configured, AdapterResult } from './result';

export function cfsslConfig(): AdapterResult<{ url: string }> {
  const url = env('CFSSL_URL');
  return url ? configured('cfssl', { url }) : unavailable('cfssl', 'CFSSL_URL is not configured');
}
