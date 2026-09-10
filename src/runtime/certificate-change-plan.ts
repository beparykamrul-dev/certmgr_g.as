import type { CertificateRecord } from './certificate-contract';
export type CertificateChangePlan = { subject: string; previousExpiresAt: string; reason: string };
export function buildCertificateChangePlan(before: CertificateRecord, afterExpiresAt: string, reason = 'renewal'): CertificateChangePlan { return { subject: before.subject, previousExpiresAt: before.expiresAt, reason: `${reason}:${afterExpiresAt}` }; }
