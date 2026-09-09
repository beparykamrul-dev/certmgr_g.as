import assert from 'node:assert/strict';
import { unavailable } from '../src/runtime/api';
assert.equal(unavailable('ct', 'ACME adapter missing').reason, 'ACME adapter missing');
console.log('api-unavailable-reason: ok');
