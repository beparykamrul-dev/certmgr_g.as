import type { AsyncAuditStore } from './audit-store';
import { recordAudit } from './audit-service-async';
export async function auditRenewal(store: AsyncAuditStore, actor: string, subject: string, outcome: 'approved' | 'denied' | 'executed' | 'failed', approvalId: string) { return recordAudit(store, { action: 'certificate.renew', actor, target: subject, outcome, requestId: approvalId }); }
