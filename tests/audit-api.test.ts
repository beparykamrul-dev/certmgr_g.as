import assert from 'node:assert/strict';
import { createMemoryAuditStore } from '../src/runtime/audit-store';
import { appendAudit } from '../src/runtime/audit-api';

const store = createMemoryAuditStore();
const record = appendAudit(store, { action: 'test.action', actor: 'operator', outcome: 'executed', target: 'test' });
assert.equal(store.list().length, 1);
assert.equal(store.list()[0]?.id, record.id);
console.log('audit-api: ok');
