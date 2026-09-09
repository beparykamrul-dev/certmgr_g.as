import assert from 'node:assert/strict';
import { evaluatePrivilegedAction } from '../src/runtime/policy';
assert.match(evaluatePrivilegedAction().reason, /approval/i);
console.log('policy-reason: ok');
