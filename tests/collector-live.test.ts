import assert from 'node:assert/strict';
import { configuredCollectorCount, getCollectorStatuses, hasLiveCollector } from '../src/runtime/collector';

const env = { DATABASE_URL: 'postgres://local', TRAFFIC_COLLECTOR_URL: 'http://collector' } as NodeJS.ProcessEnv;
const statuses = getCollectorStatuses(env);
assert.equal(configuredCollectorCount(env), 2);
assert.equal(hasLiveCollector(statuses), false);
assert.equal(hasLiveCollector(statuses.map(s => s.name === 'traffic' ? { ...s, healthy: true } : s)), true);
console.log('collector-live: ok');
