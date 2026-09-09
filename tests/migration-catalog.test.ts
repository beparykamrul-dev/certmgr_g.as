import assert from 'node:assert/strict';
import { MIGRATIONS } from '../src/runtime/migration-catalog';
assert.equal(MIGRATIONS.length >= 2, true);
assert.equal(new Set(MIGRATIONS.map(m => m.version)).size, MIGRATIONS.length);
for (const migration of MIGRATIONS) { assert.ok(migration.version); assert.ok(migration.sql.trim()); }
console.log('migration-catalog: ok');
