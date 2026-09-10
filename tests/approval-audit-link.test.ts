import assert from 'node:assert/strict';
import test from 'node:test';
import { linksApprovalAudit } from '../src/runtime/approval-audit-link';

test('approval and audit records correlate by request and target', () => {
  assert.equal(linksApprovalAudit(
    { id: 'a1', action: 'certificate.renew', target: 'example.com', requestedBy: 'operator', state: 'approved', createdAt: '2026-09-10T00:00:00Z' },
    { id: 'e1', action: 'certificate.renew', actor: 'operator', target: 'example.com', outcome: 'approved', timestamp: '2026-09-10T00:01:00Z', requestId: 'a1' },
  ), true);
});
