import assert from 'node:assert/strict';
import { getCollectorStatuses } from '../src/runtime/collector';
const statuses = getCollectorStatuses({ PROMETHEUS_URL: 'http://prometheus' } as NodeJS.ProcessEnv);
const prometheus = statuses.find(s => s.name === 'prometheus');
assert.equal(prometheus?.source, 'runtime-config-awaiting-healthcheck');
console.log('collector-source: ok');
