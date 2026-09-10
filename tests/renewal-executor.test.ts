import assert from 'node:assert/strict';
import test from 'node:test';
import { executeRenewalPlan } from '../src/runtime/renewal-executor';

test('renewal executor never performs an unapproved renewal', async () => {
  const now = Date.parse('2026-01-01T00:00:00Z');
  const result = await executeRenewalPlan([
    { subject: 'example.com', expiresAt: '2026-01-10T00:00:00Z', source: 'test', status: 'expiring' },
  ], undefined, now);
  assert.equal(result[0].executed, false);
  assert.equal(result[0].reason, 'acme_adapter_not_configured');
});
