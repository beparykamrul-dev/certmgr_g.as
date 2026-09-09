import assert from 'node:assert/strict';
import { requestIdFrom } from '../src/runtime/request-context';
assert.equal(requestIdFrom({ header: () => 'req-123' }), 'req-123');
assert.ok(requestIdFrom({ header: () => undefined }).length > 10);
console.log('request-context: ok');
