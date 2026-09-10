import assert from 'node:assert/strict';
import test from 'node:test';
import { UnconfiguredCfsslAdapter, cfsslConfigured } from '../src/runtime/cfssl-boundary';

test('CFSSL boundary remains disabled without configuration', async () => {
  assert.equal(cfsslConfigured({}), false);
  await assert.rejects(() => new UnconfiguredCfsslAdapter().issue({ commonName: 'example.com', hosts: ['example.com'] }), /cfssl_adapter_not_configured/);
});
