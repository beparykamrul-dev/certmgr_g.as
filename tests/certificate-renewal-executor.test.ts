import assert from 'node:assert/strict';
import test from 'node:test';
import { createMemoryApprovalStore } from '../src/runtime/approval-store';
import { requestApprovalAsync, approveRequestAsync } from '../src/runtime/approval-service-async';
import { executeApprovedRenewal } from '../src/runtime/certificate-renewal-executor';

test('renewal executor rejects unapproved requests', async () => {
  const store = createMemoryApprovalStore();
  const result = await executeApprovedRenewal(store as any, { renew: async () => ({ subject: 'x', expiresAt: 'future' }) }, { subject: 'x', expiresAt: 'future', status: 'valid', source: 'test' }, 'missing');
  assert.equal(result.executed, false);
});

test('renewal executor runs after approval', async () => {
  const store = createMemoryApprovalStore();
  const request = await requestApprovalAsync(store as any, 'certificate.renew', 'example.com', 'operator');
  await approveRequestAsync(store as any, request.id);
  const result = await executeApprovedRenewal(store as any, { renew: async record => ({ subject: record.subject, expiresAt: '2030-01-01T00:00:00Z' }) }, { subject: 'example.com', expiresAt: '2020-01-01T00:00:00Z', status: 'expired', source: 'test' }, request.id);
  assert.equal(result.executed, true);
});
