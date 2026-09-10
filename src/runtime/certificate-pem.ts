export type PemBundle = { certificatePem: string; privateKeyPem?: string; chainPem?: string };
export function validatePemBundle(bundle: PemBundle): void { if (!bundle.certificatePem.includes('BEGIN CERTIFICATE')) throw new Error('certificate_pem_invalid'); if (bundle.privateKeyPem && !bundle.privateKeyPem.includes('BEGIN')) throw new Error('private_key_pem_invalid'); }
