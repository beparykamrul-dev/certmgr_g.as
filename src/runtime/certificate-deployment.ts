import type { PemBundle } from './certificate-pem';
export type CertificateDeployment = { deploy(bundle: PemBundle, target: string): Promise<{ deployed: boolean; target: string }> };
export class UnconfiguredCertificateDeployment implements CertificateDeployment { async deploy(_bundle: PemBundle, _target: string) { throw new Error('certificate_deployment_not_configured'); } }
