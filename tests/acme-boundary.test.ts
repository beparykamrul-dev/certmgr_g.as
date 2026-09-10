import assert from 'node:assert/strict';
import test from 'node:test';
import { UnconfiguredAcmeAdapter, acmeConfigured } from '../src/runtime/acme-boundary';

test('ACME remains explicitly unconfigured without a directory', () => {
  assert.equal(acmeConfigured(undefined), false);
  assert.equal(acmeConfigured(' https://acme.example/directory '), true);
});

test('unconfigured ACME adapter refuses execution', async () => {
  const adapter = new UnconfiguredAcmeAdapter();
  await assert.rejects(() => adapter.createOrder(['example.com']), /acme_adapter_not_configured/);
});
