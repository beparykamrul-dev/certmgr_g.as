import assert from 'node:assert/strict';
import { checkDatabaseHealth } from '../src/runtime/database-health';

assert.deepEqual(await checkDatabaseHealth(undefined), { configured: false, healthy: false, message: 'Database client is not configured' });
const healthy = await checkDatabaseHealth({ query: async () => ({ rows: [] }) });
assert.equal(healthy.configured, true);
assert.equal(healthy.healthy, true);
const failed = await checkDatabaseHealth({ query: async () => { throw new Error('db down'); } });
assert.equal(failed.healthy, false);
assert.equal(failed.message, 'db down');
console.log('database-health: ok');
