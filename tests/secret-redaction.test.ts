import assert from 'node:assert/strict';
import { redactEnv } from '../src/runtime/secret-redaction';

const result = redactEnv({ FTN_API_TOKEN: 'secret-value', DATABASE_URL: 'postgres://safe-host/db', GEMINI_API_KEY: 'key-value' });
assert.equal(result.FTN_API_TOKEN, '[REDACTED]');
assert.equal(result.GEMINI_API_KEY, '[REDACTED]');
assert.equal(result.DATABASE_URL, 'postgres://safe-host/db');
console.log('secret-redaction: ok');
