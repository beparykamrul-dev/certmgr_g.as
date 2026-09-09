import assert from 'node:assert/strict';
import { createMemoryAuditStore } from '../src/runtime/audit-store';
import { recordOperatorDecision } from '../src/runtime/operator-audit';

const store = createMemoryAuditStore();
const record = recordOperatorDecision(store, 'operator-1', 'req-1', 'example.test', true);
assert.equal(record.action, 'approval.approve');
assert.equal(record.outcome, 'approved');
assert.equal(store.list(1)[0]?.requestId, 'req-1');
console.log('operator-audit: ok');
