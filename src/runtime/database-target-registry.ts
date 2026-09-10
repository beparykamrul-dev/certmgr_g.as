import type { DatabaseTarget } from '../contracts/database-control';

export type DatabaseTargetRegistry = { list(): DatabaseTarget[]; get(id: string): DatabaseTarget | undefined };

export function createDatabaseTargetRegistry(env: NodeJS.ProcessEnv = process.env): DatabaseTargetRegistry {
  const targets: DatabaseTarget[] = [
    { id: 'postgresql', name: 'FTN PostgreSQL', engine: 'postgresql', endpoint: env.DATABASE_URL ? 'configured' : undefined, configured: Boolean(env.DATABASE_URL?.trim()) },
    { id: 'duckdb', name: 'FTN DuckDB', engine: 'duckdb', endpoint: env.DUCKDB_PATH, configured: Boolean(env.DUCKDB_PATH?.trim()) },
    { id: 'lmdb', name: 'FTN LMDB', engine: 'lmdb', endpoint: env.LMDB_PATH, configured: Boolean(env.LMDB_PATH?.trim()) },
    { id: 'lmdbpp', name: 'FTN LMDB++', engine: 'lmdbpp', endpoint: env.LMDBPP_PATH, configured: Boolean(env.LMDBPP_PATH?.trim()) },
    { id: 'mdbx', name: 'FTN MDBX', engine: 'mdbx', endpoint: env.MDBX_PATH, configured: Boolean(env.MDBX_PATH?.trim()) },
    { id: 'nuraft', name: 'FTN NuRaft', engine: 'nuraft', endpoint: env.NURAFT_ENDPOINT, configured: Boolean(env.NURAFT_ENDPOINT?.trim()) },
    { id: 'seastar', name: 'FTN Seastar', engine: 'seastar', endpoint: env.SEASTAR_ENDPOINT, configured: Boolean(env.SEASTAR_ENDPOINT?.trim()) },
  ];
  return { list: () => [...targets], get: id => targets.find(target => target.id === id) };
}
