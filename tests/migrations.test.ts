import assert from 'node:assert/strict';
import { RUNTIME_MIGRATIONS } from '../src/runtime/migrations';

assert.deepEqual(RUNTIME_MIGRATIONS.map(m => m.version), ['001_approval_audit', '002_certificate_inventory']);
for (const migration of RUNTIME_MIGRATIONS) {
  assert.ok(migration.version.length > 0);
  assert.ok(migration.sql.includes('CREATE TABLE'));
}
console.log('migrations: ok');
