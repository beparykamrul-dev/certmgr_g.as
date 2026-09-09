import assert from 'node:assert/strict';
import { loadRuntimeConfig } from '../src/runtime/config';
const config = loadRuntimeConfig({ PORT: '3000', TRAFFIC_COLLECTOR_URL: ' http://collector ' } as NodeJS.ProcessEnv);
assert.equal(config.trafficCollectorUrl, 'http://collector');
console.log('config-traffic: ok');
