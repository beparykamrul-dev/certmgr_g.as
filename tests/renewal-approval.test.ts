import assert from 'node:assert/strict';
import test from 'node:test';
import { createMemoryApprovalStore, createAsyncApprovalStore } from '../src/runtime/approval-store';
import { requestRenewalApproval, renewalApprovalUsable } from '../src/runtime/renewal-approval';

test('renewal approval starts pending and is not executable', async () => {
  const store = createAsyncApprovalStore(createMemoryApprovalStore());
  const request = await requestRenewalApproval(store, 'example.com', 'operator-1');
  assert.equal(request.action, 'certificate.renew');
  assert.equal(request.state, 'pending');
  assert.equal(await renewalApprovalUsable(store, request.id), false);
});
