import assert from 'node:assert/strict';
import { approvalRequired } from '../src/runtime/approval';
import { evaluatePrivilegedAction } from '../src/runtime/policy';
assert.deepEqual(approvalRequired(), { required: true, state: 'pending' });
assert.equal(evaluatePrivilegedAction().allowed, false);
assert.equal(evaluatePrivilegedAction().approvalRequired, true);
console.log('approval-runtime: ok');
