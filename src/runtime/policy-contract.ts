export type PolicyDecision = 'allow' | 'deny' | 'approval_required';
export type PolicyResult = { decision: PolicyDecision; policyId: string; reason: string };
