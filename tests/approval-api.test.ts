import assert from 'node:assert/strict';
import { createMemoryApprovalStore } from '../src/runtime/approval-store';
import { createApproval, approveApproval } from '../src/runtime/approval-api';

const store = createMemoryApprovalStore();
const request = createApproval(store, 'certificate.renew', 'example.test', 'operator');
assert.equal(request.state, 'pending');
const approved = approveApproval(store, request.id);
assert.equal(approved?.state, 'approved');
console.log('approval-api: ok');
