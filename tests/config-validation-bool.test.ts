import assert from 'node:assert/strict';
import { parseBoolean } from '../src/runtime/config-validation';
assert.equal(parseBoolean('TRUE'), true);
assert.equal(parseBoolean('false', true), false);
assert.equal(parseBoolean(undefined, true), true);
console.log('config-validation-bool: ok');
