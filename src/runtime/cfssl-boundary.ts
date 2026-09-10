export type CfsslCertificateRequest = { commonName: string; hosts: string[]; profile?: string };
export type CfsslCertificateResult = { certificatePem: string; privateKeyPem: string; expiresAt?: string };
export type CfsslAdapter = { issue(request: CfsslCertificateRequest): Promise<CfsslCertificateResult> };

export class UnconfiguredCfsslAdapter implements CfsslAdapter {
  async issue(_request: CfsslCertificateRequest): Promise<CfsslCertificateResult> {
    throw new Error('cfssl_adapter_not_configured');
  }
}

export function cfsslConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.CFSSL_CA_URL?.trim() && env.CFSSL_PROFILE?.trim());
}
