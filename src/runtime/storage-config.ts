export type StorageConfig = { configured: boolean; databaseUrl?: string; backend: 'postgresql' | 'memory' };

export function loadStorageConfig(env: NodeJS.ProcessEnv = process.env): StorageConfig {
  const databaseUrl = env.DATABASE_URL?.trim() || undefined;
  return { configured: Boolean(databaseUrl), databaseUrl, backend: databaseUrl ? 'postgresql' : 'memory' };
}
