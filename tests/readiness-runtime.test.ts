import assert from 'node:assert/strict';
import { readiness } from '../src/runtime/health';
assert.equal(readiness({ process: true, operatorControl: true, liveCollectors: false }).ready, false);
assert.equal(readiness({ process: true, operatorControl: true, liveCollectors: true }).ready, true);
console.log('readiness-runtime: ok');
