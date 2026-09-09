import assert from 'node:assert/strict';
import { evaluateCertificate } from '../src/runtime/certificate-evaluator';

const now = Date.parse('2026-01-01T00:00:00Z');
assert.equal(evaluateCertificate('2027-01-01T00:00:00Z', now), 'valid');
assert.equal(evaluateCertificate('2026-01-15T00:00:00Z', now), 'expiring');
assert.equal(evaluateCertificate('2025-12-31T23:59:59Z', now), 'expired');
assert.equal(evaluateCertificate('bad-date', now), 'unknown');
console.log('certificate-evaluator: ok');
