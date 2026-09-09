import type { AuditRecord } from './audit-contract';

export type AuditStore = {
  append(record: AuditRecord): void;
  list(limit?: number): AuditRecord[];
};

export type AsyncAuditStore = {
  append(record: AuditRecord): Promise<void>;
  list(limit?: number): Promise<AuditRecord[]>;
};

export function createMemoryAuditStore(): AuditStore {
  const records: AuditRecord[] = [];
  return {
    append: record => { records.push(record); },
    list: limit => (limit ? records.slice(-limit) : [...records]),
  };
}
