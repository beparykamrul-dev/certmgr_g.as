import assert from 'node:assert/strict';
import { loadRuntimeConfig, operatorControlConfigured } from '../src/runtime/config';

const cfg = loadRuntimeConfig({ PORT: '3100', NODE_ENV: 'test', FTN_API_TOKEN: 'x'.repeat(32), TRUST_PROXY: 'true' });
assert.equal(cfg.port, 3100);
assert.equal(cfg.trustProxy, true);
assert.equal(operatorControlConfigured(cfg), true);
console.log('runtime-config: ok');
