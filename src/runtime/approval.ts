export type ApprovalState = 'pending' | 'approved' | 'rejected' | 'executed' | 'expired';

export type ApprovalRequest = {
  id: string;
  action: string;
  target: string;
  state: ApprovalState;
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
};

export function approvalRequired(): { required: true; state: 'pending' } {
  return { required: true, state: 'pending' };
}
