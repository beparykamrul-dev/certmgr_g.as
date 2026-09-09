import type { AdapterStatus, CertificateAdapter, ProviderAdapter } from './types';

const disabled = (name: string): AdapterStatus => ({ configured: false, name, reason: 'Adapter credentials/configuration are not present' });

export const nullCertificateAdapter: CertificateAdapter = {
  async status() { return disabled('certificate'); },
  async listCertificates() { return []; },
};

export const nullProviderAdapter: ProviderAdapter = {
  async status() { return disabled('provider'); },
  async health() { return { health: null, latencyMs: null, source: 'not-configured' }; },
};
