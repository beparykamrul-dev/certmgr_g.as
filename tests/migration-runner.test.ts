import assert from 'node:assert/strict';
import { runMigrations } from '../src/runtime/migration-runner';

const calls: string[] = [];
const applied = new Set<string>();
const db = { query: async <T = unknown>(text: string, values?: readonly unknown[]) => { calls.push(text); if (text.includes('SELECT version')) return { rows: applied.has(String(values?.[0])) ? [{ version: String(values?.[0]) }] as T[] : [] as T[] }; if (text.includes('INSERT INTO schema_migrations')) applied.add(String(values?.[0])); return { rows: [] as T[] }; } };

await runMigrations(db, [{ version: '001', sql: 'CREATE TABLE test_one(id INT)' }]);
await runMigrations(db, [{ version: '001', sql: 'CREATE TABLE test_one(id INT)' }]);
assert.equal(calls.filter(c => c === 'BEGIN').length, 1);
await assert.rejects(() => runMigrations(db, [{ version: '002', sql: '   ' }]));
await assert.rejects(() => runMigrations(db, [{ version: '003', sql: 'SELECT 1' }, { version: '003', sql: 'SELECT 2' }]));
console.log('migration-runner: ok');
