import type { SqlClient } from './postgres-client';
import { runMigrations } from './migration-runner';
import { MIGRATIONS } from './migration-catalog';

export async function bootstrapDatabase(db: SqlClient): Promise<void> {
  await runMigrations(db, MIGRATIONS);
}
