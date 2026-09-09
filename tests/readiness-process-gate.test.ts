import assert from 'node:assert/strict';
import { readiness } from '../src/runtime/health';
assert.equal(readiness({ process: false, operatorControl: true, liveCollectors: true }).status, 'not_ready');
console.log('readiness-process-gate: ok');
