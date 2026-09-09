import assert from 'node:assert/strict';
import type { AnomalyPoint } from '../src/runtime/anomaly-contract';
const point: AnomalyPoint = { provider: 'Meta', time: '2026-01-01T00:00:00Z', deviationPct: 12, baselineGbps: 10, currentGbps: 11.2, status: 'spike' };
assert.equal(point.status, 'spike');
assert.ok(point.currentGbps > point.baselineGbps);
console.log('anomaly-contract: ok');
