import type { AsyncApprovalStore } from './approval-store';
import { canExecuteApproval } from './approval-service-async';

export async function requireApprovedExecution(store: AsyncApprovalStore, approvalId: string): Promise<void> {
  if (!(await canExecuteApproval(store, approvalId))) throw new Error('approval_not_usable');
}
