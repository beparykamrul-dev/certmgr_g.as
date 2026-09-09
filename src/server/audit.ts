export interface AuditEvent { action: string; actor: string; requestId?: string; timestamp: string; outcome: 'accepted' | 'rejected' | 'executed'; }

export function createAuditEvent(action: string, actor: string, outcome: AuditEvent['outcome'], requestId?: string): AuditEvent {
  return { action, actor, outcome, requestId, timestamp: new Date().toISOString() };
}
