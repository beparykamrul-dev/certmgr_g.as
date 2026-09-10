import assert from 'node:assert/strict';
import test from 'node:test';
import { createMemoryApprovalStore, createAsyncApprovalStore } from '../src/runtime/approval-store';
import { requestApprovalAsync, approveRequestAsync } from '../src/runtime/approval-service-async';
import { createMemoryAuditStore } from '../src/runtime/audit-store';
import { executeApprovedRenewal } from '../src/runtime/certificate-executor';

test('certificate executor refuses unapproved renewal', async () => {
  const approvals = createAsyncApprovalStore(createMemoryApprovalStore());
  const audit = { append: async () => undefined, list: async () => [] };
  let called = false;
  const result = await executeApprovedRenewal(approvals, audit, { renew: async () => { called = true; } }, 'missing', 'operator');
  assert.equal(result.executed, false);
  assert.equal(called, false);
});

test('certificate executor runs only after approval', async () => {
  const approvals = createAsyncApprovalStore(createMemoryApprovalStore());
  const auditStore = createMemoryAuditStore();
  const audit = { append: async (record: Parameters<typeof auditStore.append>[0]) => auditStore.append(record), list: async (limit?: number) => auditStore.list(limit) };
  let target = '';
  const request = await requestApprovalAsync(approvals, 'certificate.renew', 'example.com', 'operator');
  await approveRequestAsync(approvals, request.id);
  const result = await executeApprovedRenewal(approvals, audit, { renew: async value => { target = value; } }, request.id, 'operator');
  assert.equal(result.executed, true);
  assert.equal(target, 'example.com');
  assert.equal((await approvals.get(request.id))?.state, 'executed');
  assert.equal((await audit.list(10))[0]?.outcome, 'executed');
});
