export type StorageStatus = { configured: boolean; driver: 'postgresql' | 'none'; source: string };
export function storageStatus(env: NodeJS.ProcessEnv = process.env): StorageStatus { return env.DATABASE_URL ? { configured: true, driver: 'postgresql', source: 'DATABASE_URL' } : { configured: false, driver: 'none', source: 'runtime-config' }; }
