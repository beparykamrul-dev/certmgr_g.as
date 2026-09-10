import assert from 'node:assert/strict';
import test from 'node:test';
import { planCertificateRenewals } from '../src/runtime/renewal-runner';

test('renewal runner counts approval-gated renewals', () => {
  const now = Date.parse('2026-09-10T00:00:00Z');
  const result = planCertificateRenewals([
    { subject: 'a.example', expiresAt: '2026-09-15T00:00:00Z', source: 'test', status: 'expiring' },
    { subject: 'b.example', expiresAt: '2027-01-01T00:00:00Z', source: 'test', status: 'valid' },
  ], now);
  assert.equal(result.planned.length, 2);
  assert.equal(result.approvalRequired, 1);
});
