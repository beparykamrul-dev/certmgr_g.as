import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeRenewalTarget } from '../src/runtime/renewal-target';

test('renewal target trims supported fields', () => {
  assert.deepEqual(normalizeRenewalTarget({ subject: ' example.com ', service: ' nginx ' }), { subject: 'example.com', service: 'nginx' });
});
