import crypto from 'node:crypto';
import type { AuditRecord } from './audit-contract';
import type { AsyncAuditStore } from './audit-store';
export async function recordAudit(store: AsyncAuditStore, input: Omit<AuditRecord, 'id' | 'timestamp'>): Promise<AuditRecord> { const record: AuditRecord = { ...input, id: crypto.randomUUID(), timestamp: new Date().toISOString() }; await store.append(record); return record; }
