import assert from 'node:assert/strict';
import { storageStatus } from '../src/runtime/storage';
assert.equal(storageStatus({ DATABASE_URL: 'postgres://db' }).configured, true);
assert.equal(storageStatus({}).configured, false);
console.log('runtime-storage: ok');
