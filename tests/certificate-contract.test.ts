import assert from 'node:assert/strict';
import type { CertificateRecord } from '../src/runtime/certificate-contract';
const certificate: CertificateRecord = { subject: 'example.com', expiresAt: '2027-01-01T00:00:00Z', status: 'valid', source: 'acme' };
assert.equal(certificate.status, 'valid');
assert.equal(certificate.source, 'acme');
console.log('certificate-contract: ok');
