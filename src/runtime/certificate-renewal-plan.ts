import type { CertificateRecord } from './certificate-contract';
import { certificateRenewalDecision } from './certificate-policy-decision';
export type RenewalPlan = { subject: string; action: 'renew' | 'hold'; reason: string; approvalRequired: boolean };
export function buildRenewalPlan(records: CertificateRecord[], now = Date.now()): RenewalPlan[] { return records.map(record => { const decision = certificateRenewalDecision(record.expiresAt, now); return { subject: record.subject, ...decision }; }); }
