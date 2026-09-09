export type AlertingStatus = { configured: boolean; url: string | null; source: string };
export function alertingStatus(env: NodeJS.ProcessEnv = process.env): AlertingStatus { const url = env.ALERTMANAGER_URL?.trim() || null; return { configured: Boolean(url), url, source: 'runtime-config' }; }
