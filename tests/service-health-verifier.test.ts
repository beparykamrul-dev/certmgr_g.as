import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyServiceHealth } from '../src/runtime/service-health-verifier';

test('service health verifier reports healthy probe', async () => {
  const result = await verifyServiceHealth({ check: async () => ({ healthy: true, status: 'healthy', latencyMs: 2 }) }, 'nginx');
  assert.equal(result.healthy, true);
});

test('service health verifier contains probe failures', async () => {
  const result = await verifyServiceHealth({ check: async () => { throw new Error('probe_failed'); } }, 'nginx');
  assert.equal(result.healthy, false);
  assert.equal(result.reason, 'probe_failed');
});
