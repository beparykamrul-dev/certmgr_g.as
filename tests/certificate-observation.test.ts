import assert from 'node:assert/strict';
import test from 'node:test';
import { observeCertificates } from '../src/runtime/certificate-observation';

test('certificate observation computes status from observation time', () => {
  const observedAt = Date.parse('2026-09-10T00:00:00Z');
  const snapshot = observeCertificates([{ subject: 'example.com', expiresAt: '2026-09-20T00:00:00Z', source: 'test' }], observedAt);
  assert.equal(snapshot.certificates[0].status, 'expiring');
  assert.equal(snapshot.observedAt, '2026-09-10T00:00:00.000Z');
});
