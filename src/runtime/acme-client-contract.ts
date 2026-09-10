export type AcmeIdentifier = { type: 'dns'; value: string };
export type AcmeOrderStatus = 'pending' | 'ready' | 'valid' | 'invalid';
export type AcmeOrder = { id: string; status: AcmeOrderStatus; identifiers: AcmeIdentifier[]; finalizeUrl?: string };
export type AcmeClient = { createOrder(ids: AcmeIdentifier[]): Promise<AcmeOrder>; finalize(orderId: string, csrPem: string): Promise<{ certificatePem: string; expiresAt?: string }> };
