import type { ApprovalRequest } from './approval-contract';
import type { AuditRecord } from './audit-contract';

export type StorageRecord =
  | { kind: 'approval'; record: ApprovalRequest }
  | { kind: 'audit'; record: AuditRecord };

export type StorageBackend = {
  append(record: StorageRecord): Promise<void> | void;
  list(kind?: StorageRecord['kind']): Promise<StorageRecord[]> | StorageRecord[];
};
