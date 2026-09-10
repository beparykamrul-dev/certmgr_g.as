export type RenewalState = 'planned' | 'approval_pending' | 'approved' | 'executing' | 'verified' | 'failed';
export function isTerminalRenewalState(state: RenewalState): boolean { return state === 'verified' || state === 'failed'; }
