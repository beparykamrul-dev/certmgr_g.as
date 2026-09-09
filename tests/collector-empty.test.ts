import assert from 'node:assert/strict';
import { configuredCollectorCount, getCollectorStatuses, hasLiveCollector } from '../src/runtime/collector';
const statuses = getCollectorStatuses({} as NodeJS.ProcessEnv);
assert.equal(configuredCollectorCount({} as NodeJS.ProcessEnv), 0);
assert.equal(statuses.every(s => !s.configured), true);
assert.equal(hasLiveCollector(statuses), false);
console.log('collector-empty: ok');
