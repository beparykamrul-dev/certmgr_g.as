import type { ApprovalRequest } from './approval-contract';
import type { AuditRecord } from './audit-contract';

export function linksApprovalAudit(approval: ApprovalRequest, audit: AuditRecord): boolean {
  return audit.requestId === approval.id && audit.target === approval.target;
}
