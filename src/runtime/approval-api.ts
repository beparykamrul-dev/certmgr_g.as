import type { ApprovalRequest } from './approval-contract';
import { approveRequestAsync, requestApprovalAsync } from './approval-service-async';
import type { AsyncApprovalStore } from './approval-store';

export function createApproval(store: AsyncApprovalStore, action: string, target: string, requestedBy: string): Promise<ApprovalRequest> {
  return requestApprovalAsync(store, action, target, requestedBy);
}

export function approveApproval(store: AsyncApprovalStore, id: string): Promise<ApprovalRequest | undefined> {
  return approveRequestAsync(store, id);
}
