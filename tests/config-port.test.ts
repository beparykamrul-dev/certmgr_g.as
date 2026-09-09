import assert from 'node:assert/strict';
import { loadRuntimeConfig } from '../src/runtime/config';
assert.equal(loadRuntimeConfig({ PORT: '65535' } as NodeJS.ProcessEnv).port, 65535);
assert.throws(() => loadRuntimeConfig({ PORT: '0' } as NodeJS.ProcessEnv), /Invalid PORT/);
console.log('config-port: ok');
