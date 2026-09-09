import assert from 'node:assert/strict';
import type { TrafficMapPoint } from '../src/runtime/map-contract';
const point: TrafficMapPoint = { id: 'ftn-core', name: 'FTN Core', lng: 90.4, lat: 23.8, observedAt: '2026-01-01T00:00:00Z' };
assert.equal(point.id, 'ftn-core');
assert.ok(Number.isFinite(point.lng) && Number.isFinite(point.lat));
console.log('map-contract: ok');
