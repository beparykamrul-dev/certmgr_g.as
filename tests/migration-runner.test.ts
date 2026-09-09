import assert from 'node:assert/strict';
import { runMigrations } from '../src/runtime/migration-runner';
const calls: string[] = [];
const applied = new Set<string>();
const db = { query: async <T = unknown>(text: string, values?: readonly unknown[]) => { calls.push(text); if (text.includes('SELECT version')) return { rows: applied.has(String(values?.[0])) ? [{ version: String(values?.[0]) }] as T[] : [] as T[] }; if (text.includes('INSERT INTO schema_migrations')) applied.add(String(values?.[0])); return { rows: [] as T[] }; } };
await runMigrations(db, ['001']);
await runMigrations(db, ['001']);
assert.equal(calls.filter(c => c === 'BEGIN').length, 1);
console.log('migration-runner: ok');
