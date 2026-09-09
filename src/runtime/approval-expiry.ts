import type { ApprovalRequest } from './approval-contract';
import type { AsyncApprovalStore } from './approval-store';
export async function expirePendingApprovals(store: AsyncApprovalStore, now = Date.now()): Promise<number> { const records = await store.list(); let changed = 0; for (const record of records) { if (record.state === 'pending' && record.expiresAt && Date.parse(record.expiresAt) <= now) { await store.put({ ...record, state: 'expired' }); changed++; } } return changed; }
export function isApprovalUsable(record: ApprovalRequest | undefined, now = Date.now()): boolean { return Boolean(record && record.state === 'approved' && (!record.expiresAt || Date.parse(record.expiresAt) > now)); }
