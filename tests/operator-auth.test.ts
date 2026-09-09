import assert from 'node:assert/strict';
import { bearerMatches } from '../src/runtime/operator-auth';
assert.equal(bearerMatches('secret', 'secret'), true);
assert.equal(bearerMatches('secret', 'other'), false);
assert.equal(bearerMatches(undefined, 'secret'), false);
console.log('operator-auth: ok');
