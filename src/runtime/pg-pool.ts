import { createRequire } from 'node:module';
import type { SqlClient, SqlResult } from './postgres-client';

type Pool = { query<T = unknown>(text: string, values?: readonly unknown[]): Promise<SqlResult<T>>; end?: () => Promise<void> };
export type PostgresClient = SqlClient & { close: () => Promise<void> };
const require = createRequire(import.meta.url);

export function createPostgresPool(databaseUrl: string, max = 10): PostgresClient {
  let pg: { Pool: new (options: { connectionString: string; max: number }) => Pool };
  try { pg = require('pg') as typeof pg; } catch { throw new Error('PostgreSQL driver is not installed; install pg before enabling DATABASE_URL'); }
  const pool = new pg.Pool({ connectionString: databaseUrl, max });
  return {
    query: (text, values) => pool.query(text, values),
    close: async () => { if (pool.end) await pool.end(); },
  };
}
