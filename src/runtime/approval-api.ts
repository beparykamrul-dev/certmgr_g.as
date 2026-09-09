import type { ApprovalRequest } from './approval-contract';
import { approveRequest, requestApproval } from './approval-service';
import type { ApprovalStore } from './approval-store';

export function createApproval(store: ApprovalStore, action: string, target: string, requestedBy: string): ApprovalRequest {
  return requestApproval(store, action, target, requestedBy);
}
export function approveApproval(store: ApprovalStore, id: string): ApprovalRequest | undefined {
  return approveRequest(store, id);
}
