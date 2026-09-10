import crypto from 'node:crypto';
export function certificateFingerprint(pem: string): string { return crypto.createHash('sha256').update(pem).digest('hex'); }
