export type AuditOutcome = 'requested' | 'approved' | 'denied' | 'executed' | 'failed';
export type AuditRecord = { id: string; action: string; actor: string; outcome: AuditOutcome; target?: string; timestamp: string; requestId?: string };
