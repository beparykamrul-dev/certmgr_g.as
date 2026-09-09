import assert from 'node:assert/strict';
import { getCollectorStatuses, hasLiveCollector } from '../src/runtime/collector';
const statuses = getCollectorStatuses({ TRAFFIC_COLLECTOR_URL: 'http://collector' } as NodeJS.ProcessEnv);
const traffic = statuses.find(s => s.name === 'traffic');
assert.equal(traffic?.configured, true);
assert.equal(traffic?.healthy, null);
assert.equal(hasLiveCollector(statuses), false);
console.log('collector-configured-not-live: ok');
