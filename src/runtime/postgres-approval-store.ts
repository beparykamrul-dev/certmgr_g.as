import type { ApprovalRequest, ApprovalState } from './approval-contract';
import type { ApprovalStore } from './approval-store';
import type { SqlClient } from './postgres-client';

type Row = { id: string; action: string; target: string; requested_by: string; state: ApprovalState; created_at: string; expires_at: string | null };

const mapRow = (row: Row): ApprovalRequest => ({ id: row.id, action: row.action, target: row.target, requestedBy: row.requested_by, state: row.state, createdAt: row.created_at, ...(row.expires_at ? { expiresAt: row.expires_at } : {}) });

export function createPostgresApprovalStore(db: SqlClient): ApprovalStore {
  return {
    async put(request) {
      await db.query(`INSERT INTO approval_requests (id, action, target, requested_by, state, created_at, expires_at) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO UPDATE SET action=EXCLUDED.action,target=EXCLUDED.target,requested_by=EXCLUDED.requested_by,state=EXCLUDED.state,expires_at=EXCLUDED.expires_at`, [request.id, request.action, request.target, request.requestedBy, request.state, request.createdAt, request.expiresAt ?? null]);
    },
    async get(id) { const result = await db.query<Row>('SELECT id, action, target, requested_by, state, created_at, expires_at FROM approval_requests WHERE id=$1', [id]); return result.rows[0] ? mapRow(result.rows[0]) : undefined; },
    async list() { const result = await db.query<Row>('SELECT id, action, target, requested_by, state, created_at, expires_at FROM approval_requests ORDER BY created_at DESC'); return result.rows.map(mapRow); },
  } as ApprovalStore;
}
