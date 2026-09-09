import type { AuditRecord } from './audit-contract';
import type { AuditStore } from './audit-store';
import type { SqlClient } from './postgres-client';

export function createPostgresAuditStore(db: SqlClient): AuditStore {
  return {
    async append(record) {
      await db.query(`INSERT INTO audit_records (id, action, actor, outcome, target, timestamp, request_id) VALUES ($1,$2,$3,$4,$5,$6,$7)`, [record.id, record.action, record.actor, record.outcome, record.target ?? null, record.timestamp, record.requestId ?? null]);
    },
    async list(limit = 100) {
      const result = await db.query<AuditRecord>('SELECT id, action, actor, outcome, target, timestamp, request_id AS "requestId" FROM audit_records ORDER BY timestamp DESC LIMIT $1', [Math.min(Math.max(limit, 1), 1000)]);
      return result.rows;
    },
  } as AuditStore;
}
