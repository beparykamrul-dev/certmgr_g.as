import type { ApprovalRequest } from './approval-contract';
import type { AsyncApprovalStore } from './approval-store';
import { requestApprovalAsync, canExecuteApproval } from './approval-service-async';

export async function requestRenewalApproval(
  store: AsyncApprovalStore,
  subject: string,
  requestedBy: string,
): Promise<ApprovalRequest> {
  return requestApprovalAsync(store, 'certificate.renew', subject, requestedBy);
}

export async function renewalApprovalUsable(store: AsyncApprovalStore, approvalId: string): Promise<boolean> {
  return canExecuteApproval(store, approvalId);
}
