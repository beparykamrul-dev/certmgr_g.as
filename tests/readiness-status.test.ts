import assert from 'node:assert/strict';
import { readiness } from '../src/runtime/health';
const ready = readiness({ process: true, operatorControl: true, liveCollectors: true });
const blocked = readiness({ process: true, operatorControl: false, liveCollectors: true });
assert.equal(ready.status, 'ready');
assert.equal(blocked.status, 'not_ready');
console.log('readiness-status: ok');
