export type DatabaseEngine = 'postgresql' | 'duckdb' | 'lmdb' | 'lmdbpp' | 'mdbx' | 'nuraft' | 'seastar';
export type DatabaseCapability = 'catalog' | 'query' | 'transactions' | 'indexes' | 'locks' | 'metrics' | 'replication' | 'backup' | 'admin';
export type DatabaseTarget = { id: string; name: string; engine: DatabaseEngine; endpoint?: string; configured: boolean };
export type DatabaseSummary = { target: DatabaseTarget; healthy: boolean; latencyMs?: number; sizeBytes?: number; version?: string; capabilities: DatabaseCapability[] };
export type DatabaseObject = { schema?: string; name: string; kind: 'table' | 'view' | 'materialized_view' | 'index' | 'sequence' | 'function' | 'trigger' | 'extension' | 'role' | 'unknown'; sizeBytes?: number; metadata?: Record<string, unknown> };
export type DatabaseQueryRequest = { targetId: string; sql: string; parameters?: unknown[]; readOnly: boolean };
export type DatabaseQueryResult = { columns: string[]; rows: Record<string, unknown>[]; rowCount: number; durationMs: number; readOnly: boolean };
export type DatabaseControlAction = 'backup' | 'restore' | 'checkpoint' | 'vacuum' | 'reload' | 'rotate' | 'replication-sync';
