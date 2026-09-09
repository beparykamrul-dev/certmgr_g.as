import assert from 'node:assert/strict';
import { fail } from '../src/runtime/api-response';
const response = fail('ERROR', 'x', 'request-42');
if (!response.ok) assert.equal(response.error.requestId, 'request-42');
console.log('api-response-request-id: ok');
