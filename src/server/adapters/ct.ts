import type { AdapterStatus, CertificateAdapter } from './types';

export class CertificateTransparencyAdapter implements CertificateAdapter {
  async status(): Promise<AdapterStatus> { return { configured: false, name: 'certificate-transparency', reason: 'CT log endpoints and verification storage are not configured.' }; }
  async listCertificates() { return []; }
}
