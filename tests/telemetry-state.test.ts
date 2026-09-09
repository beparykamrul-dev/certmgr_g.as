import assert from 'node:assert/strict';
import { NOT_CONFIGURED, liveTelemetry, unavailableTelemetry } from '../src/runtime/telemetry-state';

assert.equal(NOT_CONFIGURED.configured, false);
assert.equal(liveTelemetry('2026-01-01T00:00:00Z').live, true);
assert.equal(unavailableTelemetry('collector offline').reason, 'collector offline');
console.log('telemetry-state: ok');
