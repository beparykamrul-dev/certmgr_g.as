import { env } from './env';
import { unavailable, configured, AdapterResult } from './result';

export function acmeConfig(): AdapterResult<{ directory: string }> {
  const directory = env('ACME_DIRECTORY_URL');
  return directory ? configured('acme', { directory }) : unavailable('acme', 'ACME_DIRECTORY_URL is not configured');
}
