import type { CertificateRecord } from './certificate-contract';
import { buildCertificateSnapshot } from './certificate-inventory';

export function observeCertificates(records: Array<Omit<CertificateRecord, 'status'>>, observedAt = Date.now()) {
  return buildCertificateSnapshot(records, observedAt);
}
