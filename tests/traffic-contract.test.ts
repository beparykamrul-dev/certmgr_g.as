import assert from 'node:assert/strict';
import type { TrafficPoint, TrafficSeries } from '../src/runtime/traffic-contract';
const point: TrafficPoint = { timestamp: '2026-01-01T00:00:00Z', provider: 'Google', context: 'Global', value: 10, unit: 'Gbps' };
const series: TrafficSeries = { provider: 'Google', context: 'Global', points: [point], observedAt: point.timestamp };
assert.equal(series.points.length, 1);
assert.equal(series.points[0].unit, 'Gbps');
console.log('traffic-contract: ok');
