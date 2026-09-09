import assert from 'node:assert/strict';
import { createMemoryApprovalStore } from '../src/runtime/approval-store';

const store = createMemoryApprovalStore();
const request = { id: 'req-1', action: 'renew', target: 'example.test', requestedBy: 'operator', state: 'pending' as const, createdAt: '2026-01-01T00:00:00Z' };
store.put(request);
assert.deepEqual(store.get('req-1'), request);
assert.equal(store.list().length, 1);
console.log('approval-store: ok');
