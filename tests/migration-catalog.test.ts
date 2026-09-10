import assert from 'node:assert/strict';
import { MIGRATIONS } from '../src/runtime/migration-catalog';

assert.equal(MIGRATIONS.length >= 3, true);
assert.equal(new Set(MIGRATIONS.map(m => m.version)).size, MIGRATIONS.length);
for (const migration of MIGRATIONS) { assert.ok(migration.version); assert.ok(migration.sql.trim()); }
const auditMigration = MIGRATIONS.find(m => m.version === '003_audit_requested_outcome');
assert.ok(auditMigration);
assert.match(auditMigration.sql, /requested/);
assert.match(auditMigration.sql, /DROP CONSTRAINT/);
console.log('migration-catalog: ok');
