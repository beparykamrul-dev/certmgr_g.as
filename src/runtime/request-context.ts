import crypto from 'node:crypto';
export function requestIdFrom(req: { header(name: string): string | undefined }): string { return req.header('x-request-id')?.trim() || crypto.randomUUID(); }
