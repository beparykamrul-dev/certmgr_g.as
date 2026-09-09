import assert from 'node:assert/strict';
import { createPostgresApprovalStore } from '../src/runtime/postgres-approval-store';

const calls: Array<{ text: string; values?: readonly unknown[] }> = [];
const db = { query: async <T = unknown>(text: string, values?: readonly unknown[]) => { calls.push({ text, values }); if (text.includes('SELECT id')) return { rows: [{ id: '00000000-0000-0000-0000-000000000001', action: 'renew', target: 'example.com', requested_by: 'operator', state: 'pending', created_at: new Date().toISOString(), expires_at: null }] as T[] }; return { rows: [] as T[] }; } };
const store = createPostgresApprovalStore(db);
await store.put({ id: '00000000-0000-0000-0000-000000000001', action: 'renew', target: 'example.com', requestedBy: 'operator', state: 'pending', createdAt: new Date().toISOString() });
const item = await store.get('00000000-0000-0000-0000-000000000001');
assert.equal(item?.target, 'example.com');
assert.match(calls[0].text, /INSERT INTO approval_requests/);
console.log('postgres-approval-store: ok');
