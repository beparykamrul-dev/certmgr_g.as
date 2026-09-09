import assert from 'node:assert/strict';
import { createPostgresApprovalStore } from '../src/runtime/postgres-approval-store';
const calls: Array<{ text: string; values?: readonly unknown[] }> = [];
const db = { query: async <T = unknown>(text: string, values?: readonly unknown[]) => { calls.push({ text, values }); return { rows: [] as T[] }; } };
const store = createPostgresApprovalStore(db);
await store.put({ id: '00000000-0000-0000-0000-000000000001', action: 'renew', target: 'example.com', requestedBy: 'operator', state: 'pending', createdAt: new Date().toISOString() });
assert.match(calls[0].text, /INSERT INTO approval_requests/);
console.log('postgres-approval-store: ok');
