import type { CertificateRecord } from './certificate-contract';

export function evaluateCertificate(expiresAt: string, now = Date.now(), expiringWithinMs = 30 * 24 * 60 * 60 * 1000): CertificateRecord['status'] {
  const expiry = Date.parse(expiresAt);
  if (!Number.isFinite(expiry)) return 'unknown';
  if (expiry <= now) return 'expired';
  if (expiry - now <= expiringWithinMs) return 'expiring';
  return 'valid';
}
