import assert from 'node:assert/strict';
import { requestApprovalAsync, approveRequestAsync } from '../src/runtime/approval-service';
import { createMemoryApprovalStore } from '../src/runtime/approval-store';

const records = createMemoryApprovalStore();
const store = {
  put: async (request: Parameters<typeof records.put>[0]) => records.put(request),
  get: async (id: string) => records.get(id),
  list: async () => records.list(),
};
const request = await requestApprovalAsync(store, 'renew', 'example.com', 'operator');
assert.equal(request.state, 'pending');
const approved = await approveRequestAsync(store, request.id);
assert.equal(approved?.state, 'approved');
const again = await approveRequestAsync(store, request.id);
assert.equal(again, undefined);
console.log('approval-service-async: ok');
