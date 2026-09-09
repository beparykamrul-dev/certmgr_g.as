import type { CertificateRecord } from './certificate-contract';
import { evaluateCertificate } from './certificate-evaluator';

export type CertificatePolicy = { expiringWithinMs: number };
export const DEFAULT_CERTIFICATE_POLICY: CertificatePolicy = { expiringWithinMs: 30 * 24 * 60 * 60 * 1000 };

export function applyCertificatePolicy(record: Omit<CertificateRecord, 'status'>, now = Date.now(), policy = DEFAULT_CERTIFICATE_POLICY): CertificateRecord {
  return { ...record, status: evaluateCertificate(record.expiresAt, now, policy.expiringWithinMs) };
}
