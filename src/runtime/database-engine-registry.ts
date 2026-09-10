import type { DatabaseEngine, DatabaseCapability } from '../contracts/database-control';

export type DatabaseEngineDefinition = { engine: DatabaseEngine; label: string; native: boolean; capabilities: DatabaseCapability[] };

export const DATABASE_ENGINES: DatabaseEngineDefinition[] = [
  { engine: 'postgresql', label: 'PostgreSQL', native: false, capabilities: ['catalog','query','transactions','indexes','locks','metrics','replication','backup','admin'] },
  { engine: 'duckdb', label: 'DuckDB', native: true, capabilities: ['catalog','query','transactions','indexes','metrics','backup'] },
  { engine: 'lmdb', label: 'LMDB', native: true, capabilities: ['catalog','transactions','metrics','backup'] },
  { engine: 'lmdbpp', label: 'LMDB++', native: true, capabilities: ['catalog','transactions','metrics','backup'] },
  { engine: 'mdbx', label: 'MDBX', native: true, capabilities: ['catalog','transactions','metrics','backup','replication'] },
  { engine: 'nuraft', label: 'NuRaft', native: true, capabilities: ['catalog','replication','metrics'] },
  { engine: 'seastar', label: 'Seastar', native: true, capabilities: ['catalog','query','metrics','replication'] },
];

export function databaseEngineDefinition(engine: DatabaseEngine) {
  return DATABASE_ENGINES.find(item => item.engine === engine);
}
