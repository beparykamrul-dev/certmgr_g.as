import type { CertificateRecord } from './certificate-contract';
export function rotationRequired(record: CertificateRecord, now = Date.now()): boolean { const expiry = Date.parse(record.expiresAt); return Number.isFinite(expiry) && expiry <= now + 30 * 24 * 60 * 60 * 1000; }
