import crypto from 'node:crypto';
import type { AuditRecord } from './audit-contract';
import type { AuditStore } from './audit-store';

export function appendAudit(store: AuditStore, input: Omit<AuditRecord, 'id' | 'timestamp'>): AuditRecord {
  const record: AuditRecord = { ...input, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
  store.append(record);
  return record;
}
