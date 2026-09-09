import assert from 'node:assert/strict';
import { requiredText, boundedInteger } from '../src/runtime/input-validation';
assert.equal(requiredText(' example ' , 'target'), 'example');
assert.throws(() => requiredText('', 'target'));
assert.equal(boundedInteger(3, 'limit', 1, 10), 3);
assert.throws(() => boundedInteger(11, 'limit', 1, 10));
console.log('input-validation: ok');
