import assert from 'node:assert/strict';
import { PROVIDERS } from '../src/runtime/provider-registry';
assert.ok(PROVIDERS.includes('Cloudflare'));
assert.ok(PROVIDERS.includes('Microsoft Azure'));
assert.equal(new Set(PROVIDERS).size, PROVIDERS.length);
console.log('provider-registry: ok');
