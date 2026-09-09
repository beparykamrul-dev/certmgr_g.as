import assert from 'node:assert/strict';
import { readinessFromCollectors } from '../src/runtime/readiness';

assert.equal(readinessFromCollectors(true, true, true).ready, true);
assert.equal(readinessFromCollectors(true, true, false).status, 'not_ready');
assert.equal(readinessFromCollectors(false, true, true).ready, false);
console.log('readiness-contract: ok');
