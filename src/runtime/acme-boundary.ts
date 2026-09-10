import type { AcmeAdapter, AcmeOrder, CertificateRecordLike } from '../contracts/acme';

export class UnconfiguredAcmeAdapter implements AcmeAdapter {
  async createOrder(_identifiers: string[]): Promise<AcmeOrder> {
    throw new Error('acme_adapter_not_configured');
  }

  async finalize(_orderId: string, _csrPem: string): Promise<CertificateRecordLike> {
    throw new Error('acme_adapter_not_configured');
  }
}

export function acmeConfigured(directoryUrl?: string): boolean {
  return Boolean(directoryUrl?.trim());
}
