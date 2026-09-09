import assert from 'node:assert/strict';
import type { ApprovalState } from '../src/runtime/approval';
const states: ApprovalState[] = ['pending', 'approved', 'rejected', 'executed', 'expired'];
assert.equal(new Set(states).size, 5);
console.log('approval-state: ok');
