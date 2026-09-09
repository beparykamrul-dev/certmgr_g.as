import { env } from './env';
import { unavailable, configured, AdapterResult } from './result';

export function serviceControllerConfig(): AdapterResult<{ endpoint: string }> {
  const endpoint = env('SERVICE_CONTROLLER_URL');
  return endpoint ? configured('service-controller', { endpoint }) : unavailable('service-controller', 'SERVICE_CONTROLLER_URL is not configured');
}
