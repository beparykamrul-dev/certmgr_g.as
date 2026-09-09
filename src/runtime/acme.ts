export type AcmeStatus = { configured: boolean; directoryUrl: string | null; source: string };
export function acmeStatus(env: NodeJS.ProcessEnv = process.env): AcmeStatus { const directoryUrl = env.ACME_DIRECTORY_URL?.trim() || null; return { configured: Boolean(directoryUrl), directoryUrl, source: 'runtime-config' }; }
