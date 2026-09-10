import type { DatabaseObject, DatabaseQueryRequest, DatabaseQueryResult, DatabaseSummary, DatabaseTarget } from '../contracts/database-control';
import type { DatabaseAdapter } from './database-adapter';
import type { SqlClient } from './postgres-client';
import { databaseEngineDefinition } from './database-engine-registry';
import { validateDatabaseSql } from './database-sql-guard';
import { postgresCatalogObjects, postgresLocks, postgresSessions } from './postgres-catalog';

export class PostgresDatabaseAdapter implements DatabaseAdapter {
  constructor(private readonly db: SqlClient, private readonly target: DatabaseTarget = { id: 'postgresql', name: 'FTN PostgreSQL', engine: 'postgresql', configured: true }) {}

  async discover(): Promise<DatabaseTarget[]> { return [this.target]; }

  async summary(targetId: string): Promise<DatabaseSummary> {
    if (targetId !== this.target.id) throw new Error('database_target_not_found');
    const started = performance.now();
    const result = await this.db.query<{ version: string; size_bytes: number | string }>('SELECT version() AS version, pg_database_size(current_database()) AS size_bytes');
    const row = result.rows[0];
    return { target: this.target, healthy: true, latencyMs: Math.round(performance.now() - started), sizeBytes: Number(row?.size_bytes ?? 0), version: row?.version, capabilities: databaseEngineDefinition('postgresql')?.capabilities ?? [] };
  }

  async objects(targetId: string, kind?: DatabaseObject['kind']): Promise<DatabaseObject[]> {
    if (targetId !== this.target.id) throw new Error('database_target_not_found');
    return postgresCatalogObjects(this.db, kind);
  }

  async query(request: DatabaseQueryRequest): Promise<DatabaseQueryResult> {
    if (request.targetId !== this.target.id) throw new Error('database_target_not_found');
    const check = validateDatabaseSql(request.sql, request.readOnly);
    if (!check.allowed) throw new Error(check.reason);
    const started = performance.now();
    const result = await this.db.query<Record<string, unknown>>(request.sql, request.parameters ?? []);
    return { columns: result.rows.length ? Object.keys(result.rows[0]) : [], rows: result.rows, rowCount: result.rowCount ?? result.rows.length, durationMs: Math.round(performance.now() - started), readOnly: request.readOnly };
  }

  async sessions() { return postgresSessions(this.db); }
  async locks() { return postgresLocks(this.db); }
}
