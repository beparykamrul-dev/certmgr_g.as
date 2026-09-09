import assert from 'node:assert/strict';
import { approvalRequired } from '../src/runtime/approval';
assert.deepEqual(approvalRequired(), { required: true, state: 'pending' });
console.log('approval-default: ok');
