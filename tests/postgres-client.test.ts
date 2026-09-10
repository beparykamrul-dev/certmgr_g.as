import assert from 'node:assert/strict';
import { withTransaction } from '../src/runtime/postgres-client';

const calls: string[] = [];
const db = { query: async (sql: string) => { calls.push(sql); return { rows: [] }; } };
const result = await withTransaction(db, async () => 'ok');
assert.equal(result, 'ok');
assert.deepEqual(calls, ['BEGIN', 'COMMIT']);

calls.length = 0;
await assert.rejects(() => withTransaction(db, async () => { throw new Error('boom'); }), /boom/);
assert.deepEqual(calls, ['BEGIN', 'ROLLBACK']);
console.log('postgres-client: ok');
