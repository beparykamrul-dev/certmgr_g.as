import assert from 'node:assert/strict';
import { probeCollectors } from '../src/runtime/collector-probe';

const env = { PROMETHEUS_URL: 'http://prom.test' } as NodeJS.ProcessEnv;
const statuses = [{ name: 'prometheus', configured: true, healthy: null, source: 'runtime-config' }];
const result = await probeCollectors(statuses, env, 1);
assert.equal(result.length, 1);
assert.equal(result[0].healthy, false);
console.log('collector-probe-unit: ok');
