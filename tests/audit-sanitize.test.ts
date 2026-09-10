import assert from 'node:assert/strict';
import test from 'node:test';
import { sanitizeAuditMetadata } from '../src/runtime/audit-sanitize';

test('audit sanitizer redacts credential-shaped keys', () => {
  const result = sanitizeAuditMetadata({ operator: 'kamrul', apiKey: 'secret', latencyMs: 12 });
  assert.equal(result.apiKey, '[REDACTED]');
  assert.equal(result.latencyMs, 12);
});
