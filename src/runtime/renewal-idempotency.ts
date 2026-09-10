import crypto from 'node:crypto';
export function renewalOperationId(subject: string, approvalId: string): string { return crypto.createHash('sha256').update(`${subject.trim().toLowerCase()}:${approvalId}`).digest('hex'); }
