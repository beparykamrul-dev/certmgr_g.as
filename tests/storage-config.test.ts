import assert from 'node:assert/strict';
import { loadStorageConfig } from '../src/runtime/storage-config';

assert.equal(loadStorageConfig({} as NodeJS.ProcessEnv).backend, 'memory');
assert.equal(loadStorageConfig({ DATABASE_URL: 'postgres://db' } as NodeJS.ProcessEnv).backend, 'postgresql');
assert.equal(loadStorageConfig({ DATABASE_URL: 'postgres://db' } as NodeJS.ProcessEnv).configured, true);
console.log('storage-config: ok');
