import assert from 'node:assert/strict';
import { createMemoryAuditStore } from '../src/runtime/audit-store';

const store = createMemoryAuditStore();
store.append({ id: 'a1', action: 'renew', actor: 'operator', outcome: 'approved', timestamp: '2026-01-01T00:00:00Z' });
store.append({ id: 'a2', action: 'deploy', actor: 'operator', outcome: 'executed', timestamp: '2026-01-01T00:01:00Z' });
assert.equal(store.list().length, 2);
assert.equal(store.list(1)[0].id, 'a2');
console.log('audit-store: ok');
