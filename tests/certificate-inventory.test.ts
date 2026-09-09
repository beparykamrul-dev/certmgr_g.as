import assert from 'node:assert/strict';
import { buildCertificateSnapshot } from '../src/runtime/certificate-inventory';

const snapshot = buildCertificateSnapshot([{ subject: 'api.example.test', issuer: 'FTN ACME', expiresAt: '2026-01-15T00:00:00Z', source: 'acme' }], Date.parse('2026-01-01T00:00:00Z'));
assert.equal(snapshot.certificates.length, 1);
assert.equal(snapshot.certificates[0].status, 'expiring');
assert.equal(snapshot.certificates[0].subject, 'api.example.test');
console.log('certificate-inventory: ok');
