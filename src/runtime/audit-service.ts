import crypto from 'node:crypto';
import type { AuditRecord } from './audit-contract';
import type { AuditStore, AsyncAuditStore } from './audit-store';

export function buildAuditRecord(input: Omit<AuditRecord, 'id' | 'timestamp'>, now = new Date()): AuditRecord {
  return { ...input, id: crypto.randomUUID(), timestamp: now.toISOString() };
}

export function recordAudit(store: AuditStore, input: Omit<AuditRecord, 'id' | 'timestamp'>): AuditRecord {
  const record = buildAuditRecord(input);
  store.append(record);
  return record;
}

export async function recordAuditAsync(store: AsyncAuditStore, input: Omit<AuditRecord, 'id' | 'timestamp'>): Promise<AuditRecord> {
  const record = buildAuditRecord(input);
  await store.append(record);
  return record;
}
