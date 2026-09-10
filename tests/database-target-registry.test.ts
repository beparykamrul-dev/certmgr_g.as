import { describe, expect, it } from 'vitest';
import { createDatabaseTargetRegistry } from '../src/runtime/database-target-registry';

describe('database target registry', () => {
  it('reports only explicitly configured external engines', () => {
    const registry = createDatabaseTargetRegistry({ DATABASE_URL: 'postgresql://db' });
    expect(registry.get('postgresql')?.configured).toBe(true);
    expect(registry.get('duckdb')?.configured).toBe(false);
    expect(registry.get('lmdbpp')?.configured).toBe(false);
    expect(registry.get('mdbx')?.configured).toBe(false);
    expect(registry.get('nuraft')?.configured).toBe(false);
    expect(registry.get('seastar')?.configured).toBe(false);
  });
});
