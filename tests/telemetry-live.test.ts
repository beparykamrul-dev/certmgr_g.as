import assert from 'node:assert/strict';
import { liveTelemetry } from '../src/runtime/telemetry-state';
const state = liveTelemetry('2026-01-01T00:00:00Z');
assert.deepEqual(state, { configured: true, live: true, observedAt: '2026-01-01T00:00:00Z' });
console.log('telemetry-live: ok');
