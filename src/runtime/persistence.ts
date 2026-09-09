import type { SqlClient } from './postgres-client';
import { createPostgresApprovalStore } from './postgres-approval-store';
import { createPostgresAuditStore } from './postgres-audit-store';
export function createPersistentStores(db: SqlClient) { return { approvals: createPostgresApprovalStore(db), audit: createPostgresAuditStore(db) }; }
