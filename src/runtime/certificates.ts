export type CertificateLifecycleStatus = { configured: boolean; source: string };
export function certificateLifecycleStatus(env: NodeJS.ProcessEnv = process.env): CertificateLifecycleStatus { return { configured: Boolean(env.ACME_DIRECTORY_URL?.trim()), source: env.ACME_DIRECTORY_URL ? 'acme-config' : 'not-configured' }; }
