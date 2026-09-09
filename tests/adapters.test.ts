import assert from 'node:assert/strict';
import { adapterRegistry } from '../src/adapters/registry';

const registry = adapterRegistry();
for (const [name, result] of Object.entries(registry)) {
  assert.ok(['configured', 'unavailable', 'error'].includes(result.state), `${name} returned invalid state`);
  assert.equal(result.configured, result.state === 'configured', `${name} configured flag mismatch`);
  assert.ok(result.source, `${name} missing source`);
}

console.log(`adapter contract passed: ${Object.keys(registry).length} adapters`);
