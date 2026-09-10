import crypto from 'node:crypto';
import type { AsyncApprovalStore } from './approval-store';
import { canExecuteApproval } from './approval-service-async';
import type { AsyncAuditStore } from './audit-store';
import { recordAudit } from './audit-service-async';

export type CertificateExecutionResult = {
  commandId: string;
  approvalId: string;
  executed: boolean;
  reason: string;
};

export type CertificateExecutionAdapter = {
  renew(target: string): Promise<void>;
};

export async function executeApprovedRenewal(
  approvals: AsyncApprovalStore,
  audit: AsyncAuditStore,
  adapter: CertificateExecutionAdapter,
  approvalId: string,
  actor: string,
): Promise<CertificateExecutionResult> {
  const request = await approvals.get(approvalId);
  if (!request) return { commandId: crypto.randomUUID(), approvalId, executed: false, reason: 'approval_not_found' };
  if (request.action !== 'certificate.renew') return { commandId: crypto.randomUUID(), approvalId, executed: false, reason: 'approval_action_mismatch' };
  if (!(await canExecuteApproval(approvals, approvalId))) return { commandId: crypto.randomUUID(), approvalId, executed: false, reason: 'approval_not_usable' };

  const commandId = crypto.randomUUID();
  try {
    await adapter.renew(request.target);
    await approvals.put({ ...request, state: 'executed' });
    await recordAudit(audit, { action: 'certificate.renew', actor, target: request.target, requestId: approvalId, outcome: 'executed' });
    return { commandId, approvalId, executed: true, reason: 'renewal_executed' };
  } catch (error) {
    await recordAudit(audit, { action: 'certificate.renew', actor, target: request.target, requestId: approvalId, outcome: 'failed' });
    return { commandId, approvalId, executed: false, reason: error instanceof Error ? error.message : 'renewal_failed' };
  }
}
