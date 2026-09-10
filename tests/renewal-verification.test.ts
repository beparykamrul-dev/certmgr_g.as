import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyRenewalOutcome } from '../src/runtime/renewal-verification';

test('healthy service confirms renewal verification', () => {
  assert.deepEqual(verifyRenewalOutcome({ healthy: true, status: 'healthy' }), { healthy: true, reason: 'service_healthy_after_renewal' });
});
