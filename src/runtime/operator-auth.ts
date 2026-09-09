import crypto from 'node:crypto';
export function bearerMatches(supplied: string | undefined, expected: string | undefined): boolean { if (!supplied || !expected || supplied.length !== expected.length) return false; return crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected)); }
