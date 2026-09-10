import type { CertificateRecord } from './certificate-contract';
import type { AsyncApprovalStore } from './approval-store';
import { canExecuteApproval } from './approval-service-async';

export type CertificateRenewalAdapter = {
  renew(record: CertificateRecord): Promise<{ subject: string; expiresAt: string }>;
};

export type RenewalExecutionResult = {
  subject: string;
  executed: boolean;
  reason: string;
  expiresAt?: string;
};

export async function executeApprovedRenewal(
  store: AsyncApprovalStore,
  adapter: CertificateRenewalAdapter,
  record: CertificateRecord,
  approvalId: string,
): Promise<RenewalExecutionResult> {
  if (!(await canExecuteApproval(store, approvalId))) {
    return { subject: record.subject, executed: false, reason: 'approval_not_usable' };
  }
  const renewed = await adapter.renew(record);
  return { subject: renewed.subject, executed: true, reason: 'renewed', expiresAt: renewed.expiresAt };
}
