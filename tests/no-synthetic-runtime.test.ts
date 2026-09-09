import assert from 'node:assert/strict';
import { rejectSyntheticSource, syntheticDataDisabled } from '../src/runtime/no-synthetic';
assert.equal(syntheticDataDisabled(), true);
assert.throws(() => rejectSyntheticSource('demo-provider'));
assert.throws(() => rejectSyntheticSource('synthetic-fixture'));
assert.doesNotThrow(() => rejectSyntheticSource('live-adapter'));
console.log('no-synthetic-runtime: ok');
