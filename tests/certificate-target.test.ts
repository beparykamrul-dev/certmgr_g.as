import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeCertificateTarget } from '../src/runtime/certificate-target';

test('certificate target is normalized', () => {
  assert.deepEqual(normalizeCertificateTarget('  Example.COM  ', 'acme'), { subject: 'example.com', source: 'acme' });
});

test('empty certificate target is rejected', () => {
  assert.throws(() => normalizeCertificateTarget('   '), /certificate_subject_invalid/);
});
