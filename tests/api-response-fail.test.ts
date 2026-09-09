import assert from 'node:assert/strict';
import { fail } from '../src/runtime/api-response';
const response = fail('CONFIG_REQUIRED', 'collector is not configured', 'req-1');
assert.equal(response.ok, false);
if (!response.ok) assert.equal(response.error.code, 'CONFIG_REQUIRED');
console.log('api-response-fail: ok');
