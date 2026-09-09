import { env } from './env';
import { unavailable, configured, AdapterResult } from './result';

export function notificationsConfig(): AdapterResult<{ endpoint: string }> {
  const endpoint = env('NOTIFICATIONS_URL');
  return endpoint ? configured('notifications', { endpoint }) : unavailable('notifications', 'NOTIFICATIONS_URL is not configured');
}
