import assert from 'node:assert/strict';
import { createMemoryStorage } from '../src/runtime/storage-memory';

const store = createMemoryStorage();
store.append({ kind: 'audit', record: { id: 'a1', action: 'test', actor: 'system', outcome: 'executed', timestamp: '2026-01-01T00:00:00Z' } });
store.append({ kind: 'audit', record: { id: 'a2', action: 'test2', actor: 'system', outcome: 'approved', timestamp: '2026-01-01T00:01:00Z' } });
assert.equal(store.list().length, 2);
assert.equal(store.list('audit').length, 2);
console.log('storage-memory: ok');
