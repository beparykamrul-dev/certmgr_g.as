import type { SqlClient } from './postgres-client';
import { runMigrations } from './migration-runner';
import { RUNTIME_MIGRATIONS } from './migrations';

export async function migrateRuntimeDatabase(db: SqlClient): Promise<void> {
  await runMigrations(db, RUNTIME_MIGRATIONS);
}
