import assert from 'node:assert/strict';
import { loadRuntimeConfig, operatorControlConfigured } from '../src/runtime/config';
assert.equal(operatorControlConfigured(loadRuntimeConfig({ FTN_API_TOKEN: 'short' } as NodeJS.ProcessEnv)), false);
assert.equal(operatorControlConfigured(loadRuntimeConfig({ FTN_API_TOKEN: 'x'.repeat(32) } as NodeJS.ProcessEnv)), true);
console.log('config-operator: ok');
