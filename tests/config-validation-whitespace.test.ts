import assert from 'node:assert/strict';
import { requiredEnv } from '../src/runtime/config-validation';
assert.equal(requiredEnv('A', { A: '  value  ' } as NodeJS.ProcessEnv), 'value');
console.log('config-validation-whitespace: ok');
