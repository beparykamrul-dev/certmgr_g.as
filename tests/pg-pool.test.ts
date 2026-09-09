import assert from 'node:assert/strict';
import { createPostgresPool } from '../src/runtime/pg-pool';
assert.throws(() => createPostgresPool('postgres://invalid', 1), /PostgreSQL driver is not installed/);
console.log('pg-pool: ok');
