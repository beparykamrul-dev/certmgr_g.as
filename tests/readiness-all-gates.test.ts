import assert from 'node:assert/strict';
import { readiness } from '../src/runtime/health';
for (const checks of [
  { process: false, operatorControl: true, liveCollectors: true },
  { process: true, operatorControl: false, liveCollectors: true },
  { process: true, operatorControl: true, liveCollectors: false },
]) assert.equal(readiness(checks).ready, false);
console.log('readiness-all-gates: ok');
