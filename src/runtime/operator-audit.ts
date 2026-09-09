import type { AuditStore } from './audit-store';
import { appendAudit } from './audit-api';

export function recordOperatorDecision(store: AuditStore, actor: string, requestId: string, target: string, approved: boolean) {
  return appendAudit(store, { action: approved ? 'approval.approve' : 'approval.deny', actor, target, requestId, outcome: approved ? 'approved' : 'denied' });
}
