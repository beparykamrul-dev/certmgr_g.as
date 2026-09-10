import type { CertificateRecord } from './certificate-contract';
import type { CertificateRenewalAdapter } from './certificate-renewal-executor';

export class UnconfiguredRenewalAdapter implements CertificateRenewalAdapter {
  async renew(_record: CertificateRecord): Promise<{ subject: string; expiresAt: string }> {
    throw new Error('certificate_renewal_adapter_not_configured');
  }
}

export function renewalAdapterConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.ACME_DIRECTORY_URL?.trim() && (env.ACME_ACCOUNT_ID?.trim() || env.CFSSL_CA_URL?.trim()));
}
