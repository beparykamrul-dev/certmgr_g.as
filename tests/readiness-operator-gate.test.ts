import assert from 'node:assert/strict';
import { readiness } from '../src/runtime/health';
assert.equal(readiness({ process: true, operatorControl: false, liveCollectors: true }).ready, false);
console.log('readiness-operator-gate: ok');
