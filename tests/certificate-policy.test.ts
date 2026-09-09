import assert from 'node:assert/strict';
import { applyCertificatePolicy } from '../src/runtime/certificate-policy';

const now = Date.parse('2026-01-01T00:00:00.000Z');
assert.equal(applyCertificatePolicy({ subject: 'expired.test', expiresAt: '2025-12-31T00:00:00.000Z', source: 'test' }, now).status, 'expired');
assert.equal(applyCertificatePolicy({ subject: 'soon.test', expiresAt: '2026-01-15T00:00:00.000Z', source: 'test' }, now).status, 'expiring');
assert.equal(applyCertificatePolicy({ subject: 'valid.test', expiresAt: '2026-06-01T00:00:00.000Z', source: 'test' }, now).status, 'valid');
assert.equal(applyCertificatePolicy({ subject: 'bad.test', expiresAt: 'invalid', source: 'test' }, now).status, 'unknown');
console.log('certificate-policy: ok');
