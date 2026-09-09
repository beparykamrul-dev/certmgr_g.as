import type { CertificateRecord, CertificateSnapshot } from './certificate-contract';
import { evaluateCertificate } from './certificate-evaluator';

export function buildCertificateSnapshot(records: Array<Omit<CertificateRecord, 'status'>>, now = Date.now()): CertificateSnapshot {
  const certificates = records.map(record => ({ ...record, status: evaluateCertificate(record.expiresAt, now) }));
  return { certificates, observedAt: new Date(now).toISOString() };
}
