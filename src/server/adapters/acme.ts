import type { AdapterStatus, CertificateAdapter } from './types';

export class AcmeAdapter implements CertificateAdapter {
  async status(): Promise<AdapterStatus> { return { configured: false, name: 'acme', reason: 'ACME account/key material and challenge configuration are not installed.' }; }
  async listCertificates() { return []; }
}
