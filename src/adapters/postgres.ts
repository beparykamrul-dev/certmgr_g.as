import { env } from './env';
import { AdapterResult, unavailable } from './result';

export type PostgresConfig = { url?: string; poolMax: number };
export function postgresConfig(): AdapterResult<PostgresConfig> {
  const url = env('DATABASE_URL');
  if (!url) return unavailable('postgresql', 'DATABASE_URL is not configured');
  return { state: 'configured', configured: true, source: 'DATABASE_URL', data: { url, poolMax: Number(env('PGPOOL_MAX') || 10) } };
}
