import type { SqlClient } from './postgres-client';

export type DatabaseHealth = { configured: boolean; healthy: boolean; latencyMs?: number; message?: string };

export async function checkDatabaseHealth(db: SqlClient | undefined): Promise<DatabaseHealth> {
  if (!db) return { configured: false, healthy: false, message: 'Database client is not configured' };
  const started = performance.now();
  try {
    await db.query('SELECT 1');
    return { configured: true, healthy: true, latencyMs: Math.round(performance.now() - started) };
  } catch (error) {
    return { configured: true, healthy: false, latencyMs: Math.round(performance.now() - started), message: error instanceof Error ? error.message : 'database_probe_failed' };
  }
}
