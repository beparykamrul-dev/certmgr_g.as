import assert from 'node:assert/strict';
import type { HealthSnapshot } from '../src/runtime/health-contract';
const snapshot: HealthSnapshot = { state: 'healthy', components: [{ name: 'api', state: 'healthy', observedAt: '2026-01-01T00:00:00Z' }], observedAt: '2026-01-01T00:00:00Z' };
assert.equal(snapshot.state, 'healthy');
assert.equal(snapshot.components[0].state, 'healthy');
console.log('health-contract: ok');
