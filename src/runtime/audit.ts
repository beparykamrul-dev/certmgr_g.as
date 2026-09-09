import crypto from 'node:crypto';

export type AuditEvent = { id: string; action: string; actor: string; target?: string; outcome: string; timestamp: string; requestId?: string };

export function createAuditEvent(input: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
  return { ...input, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
}
