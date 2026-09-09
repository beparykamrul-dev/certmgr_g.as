import { env } from './env';
import { unavailable, configured, AdapterResult } from './result';

export function meshConfig(): AdapterResult<{ endpoint: string }> {
  const endpoint = env('MESH_TELEMETRY_URL');
  return endpoint ? configured('mesh', { endpoint }) : unavailable('mesh', 'MESH_TELEMETRY_URL is not configured');
}
