export type ApprovalState = 'pending' | 'approved' | 'rejected' | 'expired';

export interface ApprovalRequest {
  id: string;
  action: string;
  resource: string;
  requestedBy: string;
  state: ApprovalState;
  createdAt: string;
  expiresAt?: string;
  reason?: string;
}
