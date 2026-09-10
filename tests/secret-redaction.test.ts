import assert from 'node:assert/strict';
import test from 'node:test';
import { redactEnv, redactSecrets } from '../src/runtime/secret-redaction';

test('environment secrets are redacted', () => {
  const result = redactEnv({ FTN_API_TOKEN: 'secret-value', DATABASE_URL: 'postgres://safe-host/db', GEMINI_API_KEY: 'key-value' });
  assert.equal(result.FTN_API_TOKEN, '[REDACTED]');
  assert.equal(result.GEMINI_API_KEY, '[REDACTED]');
  assert.equal(result.DATABASE_URL, 'postgres://safe-host/db');
});

test('audit metadata secrets are redacted', () => {
  const result = redactSecrets({ token: 'secret-value', subject: 'example.com' });
  assert.equal(result.token, '[REDACTED]');
  assert.equal(result.subject, 'example.com');
});
