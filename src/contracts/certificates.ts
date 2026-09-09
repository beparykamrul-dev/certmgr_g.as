export type CertificateState = 'unknown' | 'valid' | 'expiring' | 'expired' | 'error';

export interface CertificateRecord {
  id: string;
  subject: string;
  issuer?: string;
  serialNumber?: string;
  notBefore?: string;
  notAfter?: string;
  state: CertificateState;
  source: 'acme' | 'cfssl' | 'imported' | 'unknown';
}
