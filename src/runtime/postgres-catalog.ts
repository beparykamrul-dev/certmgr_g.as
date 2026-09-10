import type { SqlClient } from './postgres-client';
import type { DatabaseObject } from '../contracts/database-control';

export async function postgresCatalog(db: SqlClient): Promise<DatabaseObject[]> {
  const { rows } = await db.query<{ schema: string; name: string; kind: DatabaseObject['kind']; size_bytes?: string }>(`
    SELECT n.nspname AS schema, c.relname AS name,
      CASE c.relkind WHEN 'r' THEN 'table' WHEN 'v' THEN 'view' WHEN 'm' THEN 'materialized_view' WHEN 'i' THEN 'index' WHEN 'S' THEN 'sequence' ELSE 'unknown' END AS kind,
      pg_total_relation_size(c.oid)::text AS size_bytes
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname NOT IN ('pg_catalog','information_schema')
      AND c.relkind IN ('r','v','m','i','S') ORDER BY n.nspname, c.relname
  `);
  return rows.map(row => ({ schema: row.schema, name: row.name, kind: row.kind, sizeBytes: row.size_bytes ? Number(row.size_bytes) : undefined }));
}

export async function postgresActiveSessions(db: SqlClient) {
  return db.query(`SELECT pid, usename, datname, state, wait_event_type, wait_event, query_start, left(query, 500) AS query FROM pg_stat_activity WHERE pid <> pg_backend_pid() ORDER BY query_start DESC NULLS LAST`);
}

export async function postgresLocks(db: SqlClient) {
  return db.query(`SELECT l.pid, l.mode, l.granted, a.usename, a.datname, left(a.query, 500) AS query FROM pg_locks l LEFT JOIN pg_stat_activity a ON a.pid = l.pid ORDER BY l.granted, l.pid`);
}
