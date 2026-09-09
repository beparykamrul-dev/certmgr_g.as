import assert from 'node:assert/strict';
import { createMemoryAuditStore } from '../src/runtime/audit-store';
import { recordAudit, recordAuditAsync } from '../src/runtime/audit-service';

const store = createMemoryAuditStore();
const record = recordAudit(store, { action: 'renew', actor: 'operator', outcome: 'approved', target: 'example.com' });
assert.equal(store.list(1)[0]?.id, record.id);
const asyncStore = { append: async (value: typeof record) => store.append(value), list: async () => store.list() };
const second = await recordAuditAsync(asyncStore, { action: 'reload', actor: 'operator', outcome: 'executed', target: 'nginx' });
assert.equal(store.list().at(-1)?.id, second.id);
console.log('audit-service: ok');
