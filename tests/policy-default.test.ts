import assert from 'node:assert/strict';
import { evaluatePrivilegedAction } from '../src/runtime/policy';
const decision = evaluatePrivilegedAction();
assert.equal(decision.allowed, false);
assert.equal(decision.approvalRequired, true);
console.log('policy-default: ok');
