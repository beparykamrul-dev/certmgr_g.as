import assert from 'node:assert/strict';
import { fail, ok } from '../src/runtime/api-response';

assert.deepEqual(ok({ live: true }), { ok: true, data: { live: true } });
const error = fail('CONFIG_REQUIRED', 'collector is not configured', 'req-1');
assert.equal(error.ok, false);
if (!error.ok) assert.equal(error.error.requestId, 'req-1');
console.log('api-response: ok');
