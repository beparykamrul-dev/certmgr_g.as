import assert from 'node:assert/strict';
import { createPostgresAuditStore } from '../src/runtime/postgres-audit-store';

const calls: string[] = [];
const db = { query: async <T = unknown>(text: string) => { calls.push(text); return { rows: [] as T[] }; } };
const store = createPostgresAuditStore(db);
await store.append({ id: '00000000-0000-0000-0000-000000000002', action: 'renew', actor: 'operator', outcome: 'approved', timestamp: new Date().toISOString() });
const rows = await store.list(50);
assert.deepEqual(rows, []);
assert.match(calls[0], /INSERT INTO audit_records/);
assert.match(calls[1], /LIMIT \$1/);
console.log('postgres-audit-store: ok');
