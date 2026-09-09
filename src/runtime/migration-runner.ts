import type { SqlClient } from './postgres-client';

export type Migration = { version: string; sql: string };

export async function runMigrations(db: SqlClient, migrations: readonly Migration[]): Promise<void> {
  await db.query('CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
  const seen = new Set<string>();
  for (const migration of migrations) {
    const version = migration.version.trim();
    const sql = migration.sql.trim();
    if (!version || !sql) throw new Error('Migration version and SQL are required');
    if (seen.has(version)) throw new Error(`Duplicate migration version: ${version}`);
    seen.add(version);
    const exists = await db.query<{ version: string }>('SELECT version FROM schema_migrations WHERE version=$1', [version]);
    if (exists.rows.length) continue;
    await db.query('BEGIN');
    try {
      await db.query(sql);
      await db.query('INSERT INTO schema_migrations(version) VALUES($1)', [version]);
      await db.query('COMMIT');
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }
}
