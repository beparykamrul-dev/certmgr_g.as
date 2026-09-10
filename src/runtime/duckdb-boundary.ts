export type DuckDbAdapter = { query(sql: string, parameters?: unknown[]): Promise<{ columns: string[]; rows: Record<string, unknown>[] }> };
export class UnconfiguredDuckDbAdapter implements DuckDbAdapter { async query() { throw new Error('duckdb_adapter_not_configured'); } }
export function duckDbConfigured(env = process.env) { return Boolean(env.DUCKDB_PATH?.trim()); }
