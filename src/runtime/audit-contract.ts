export type AuditRecord = { id: string; action: string; actor: string; outcome: 'approved' | 'denied' | 'executed' | 'failed'; target?: string; timestamp: string; requestId?: string };
