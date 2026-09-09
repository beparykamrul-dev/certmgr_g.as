import assert from 'node:assert/strict';
import { hasLiveCollector, getCollectorStatuses } from '../src/runtime/collector';
const statuses = getCollectorStatuses({ TRAFFIC_COLLECTOR_URL: 'http://collector' } as NodeJS.ProcessEnv);
const healthy = statuses.map(s => s.name === 'traffic' ? { ...s, healthy: true } : s);
assert.equal(hasLiveCollector(healthy), true);
console.log('collector-health: ok');
