import assert from 'node:assert/strict';
import { createPersistentStores } from '../src/runtime/persistence';
const db = { query: async <T = unknown>() => ({ rows: [] as T[] }) };
const stores = createPersistentStores(db);
assert.ok(stores.approvals && stores.audit);
console.log('persistence: ok');
