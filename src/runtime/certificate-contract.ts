export type CertificateRecord = { subject: string; issuer?: string; expiresAt: string; status: 'valid' | 'expiring' | 'expired' | 'unknown'; source: string };
export type CertificateSnapshot = { certificates: CertificateRecord[]; observedAt: string };
