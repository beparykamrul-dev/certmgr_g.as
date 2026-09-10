import assert from 'node:assert/strict';
import test from 'node:test';
import { healthState } from '../src/runtime/health-state';

test('health state distinguishes missing configuration', () => {
  assert.equal(healthState(false, false), 'not_configured');
  assert.equal(healthState(true, true), 'healthy');
  assert.equal(healthState(true, false), 'unhealthy');
});
