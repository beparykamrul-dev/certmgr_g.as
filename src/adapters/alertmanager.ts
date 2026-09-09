import { env } from './env';
import { unavailable, configured, AdapterResult } from './result';

export function alertmanagerConfig(): AdapterResult<{ url: string }> {
  const url = env('ALERTMANAGER_URL');
  return url ? configured('alertmanager', { url }) : unavailable('alertmanager', 'ALERTMANAGER_URL is not configured');
}
