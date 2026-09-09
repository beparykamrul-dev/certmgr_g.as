import assert from 'node:assert/strict';
import { unavailable } from '../src/runtime/provider-status';
const state = unavailable('Akamai');
assert.equal(state.provider, 'Akamai');
assert.equal(state.configured, false);
assert.equal(state.available, false);
assert.equal(state.message, 'Not configured');
console.log('provider-status: ok');
