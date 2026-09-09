import type { SqlClient } from './postgres-client';

export async function runMigrations(db: SqlClient, migrations: readonly string[]): Promise<void> {
  await db.query('CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
  for (const migration of migrations) {
    const exists = await db.query<{ version: string }>('SELECT version FROM schema_migrations WHERE version=$1', [migration]);
    if (exists.rows.length) continue;
    await db.query('BEGIN');
    try {
      await db.query(migration);
      await db.query('INSERT INTO schema_migrations(version) VALUES($1)', [migration]);
      await db.query('COMMIT');
    } catch (error) { await db.query('ROLLBACK'); throw error; }
  }
}
