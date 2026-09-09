import assert from 'node:assert/strict';
import { unavailableTelemetry } from '../src/runtime/telemetry-state';
const state = unavailableTelemetry('collector offline');
assert.equal(state.configured, false);
assert.equal(state.live, false);
assert.equal(state.reason, 'collector offline');
console.log('telemetry-unavailable: ok');
