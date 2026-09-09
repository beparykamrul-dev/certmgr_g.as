import assert from 'node:assert/strict';
import { configuredCollectorCount, getCollectorStatuses } from '../src/runtime/collector';

const env = { DATABASE_URL: 'postgres://example', ALERTMANAGER_URL: 'http://alertmanager', PROMETHEUS_URL: '' };
assert.equal(configuredCollectorCount(env), 2);
assert.deepEqual(getCollectorStatuses(env).filter(x => x.configured).map(x => x.name), ['postgresql', 'alertmanager']);
console.log('collector-runtime: ok');
