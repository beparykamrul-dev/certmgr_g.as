export interface AcmeChallenge { type: 'http-01' | 'dns-01' | 'tls-alpn-01'; identifier: string; token: string; }
export interface AcmeOrder { id: string; identifiers: string[]; status: 'pending' | 'ready' | 'processing' | 'valid' | 'invalid'; }
export interface AcmeAdapter { createOrder(identifiers: string[]): Promise<AcmeOrder>; finalize(orderId: string, csrPem: string): Promise<CertificateRecordLike>; }
export interface CertificateRecordLike { certificatePem: string; chainPem?: string; expiresAt?: string; }
