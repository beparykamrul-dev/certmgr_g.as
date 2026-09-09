export type Decision = 'allow' | 'deny' | 'approval_required';

export interface PolicyContext {
  actor: string;
  role: string;
  action: string;
  resource: string;
  environment: 'development' | 'staging' | 'production';
}

export interface PolicyDecision { decision: Decision; policyId: string; reason: string; }
