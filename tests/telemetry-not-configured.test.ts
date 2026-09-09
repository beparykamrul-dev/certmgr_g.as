import assert from 'node:assert/strict';
import { NOT_CONFIGURED } from '../src/runtime/telemetry-state';
assert.equal(NOT_CONFIGURED.live, false);
assert.equal(NOT_CONFIGURED.configured, false);
console.log('telemetry-not-configured: ok');
