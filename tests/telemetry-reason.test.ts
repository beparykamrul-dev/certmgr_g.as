import assert from 'node:assert/strict';
import { unavailableTelemetry } from '../src/runtime/telemetry-state';
assert.ok(unavailableTelemetry('x').reason);
console.log('telemetry-reason: ok');
