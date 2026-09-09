import assert from 'node:assert/strict';
import { expirePendingApprovals, isApprovalUsable } from '../src/runtime/approval-expiry';
import { createMemoryApprovalStore, createAsyncApprovalStore } from '../src/runtime/approval-store';
const sync = createMemoryApprovalStore();
sync.put({ id: 'x', action: 'renew', target: 'example', requestedBy: 'op', state: 'pending', createdAt: '2026-01-01T00:00:00Z', expiresAt: '2026-01-01T00:01:00Z' });
const changed = await expirePendingApprovals(createAsyncApprovalStore(sync), Date.parse('2026-01-01T00:02:00Z'));
assert.equal(changed, 1);
assert.equal(sync.get('x')?.state, 'expired');
console.log('approval-expiry: ok');
