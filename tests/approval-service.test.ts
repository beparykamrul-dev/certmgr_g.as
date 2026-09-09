import assert from 'node:assert/strict';
import { createMemoryApprovalStore } from '../src/runtime/approval-store';
import { approveRequest, requestApproval } from '../src/runtime/approval-service';

const store = createMemoryApprovalStore();
const request = requestApproval(store, 'renew', 'example.test', 'operator');
assert.equal(request.state, 'pending');
const approved = approveRequest(store, request.id);
assert.equal(approved?.state, 'approved');
assert.equal(store.get(request.id)?.state, 'approved');
console.log('approval-service: ok');
