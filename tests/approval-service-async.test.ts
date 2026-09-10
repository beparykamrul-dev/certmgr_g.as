import assert from 'node:assert/strict';
import { requestApprovalAsync, approveRequestAsync } from '../src/runtime/approval-service-async';
import { createMemoryApprovalStore, type AsyncApprovalStore } from '../src/runtime/approval-store';

const records = createMemoryApprovalStore();
const store: AsyncApprovalStore = {
  put: async request => records.put(request),
  get: async id => records.get(id),
  list: async () => records.list(),
};

const request = await requestApprovalAsync(store, 'renew', 'example.com', 'operator');
assert.equal(request.state, 'pending');
const approved = await approveRequestAsync(store, request.id);
assert.equal(approved?.state, 'approved');
const again = await approveRequestAsync(store, request.id);
assert.equal(again, undefined);
console.log('approval-service-async: ok');
