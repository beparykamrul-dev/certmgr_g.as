import assert from 'node:assert/strict';
import { unavailable } from '../src/runtime/api';
assert.deepEqual(unavailable('traffic'), { status: 'unavailable', configured: false, feature: 'traffic', reason: 'No live collector/provider connector is configured' });
console.log('api-unavailable: ok');
