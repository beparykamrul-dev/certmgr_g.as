export type ApprovalState = 'pending' | 'approved' | 'rejected' | 'expired' | 'executed';
export type ApprovalRequest = { id: string; action: string; target: string; requestedBy: string; state: ApprovalState; createdAt: string; expiresAt?: string };
