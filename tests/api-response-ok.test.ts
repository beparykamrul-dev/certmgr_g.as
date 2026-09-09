import assert from 'node:assert/strict';
import { ok } from '../src/runtime/api-response';
assert.deepEqual(ok({ live: true }), { ok: true, data: { live: true } });
console.log('api-response-ok: ok');
