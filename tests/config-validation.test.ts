import assert from 'node:assert/strict';
import { configured, parseBoolean, requiredEnv } from '../src/runtime/config-validation';

const env = { A: ' value ', B: '1', C: '' } as NodeJS.ProcessEnv;
assert.equal(requiredEnv('A', env), 'value');
assert.equal(requiredEnv('C', env), undefined);
assert.equal(configured(['A', 'B'], env), true);
assert.equal(configured(['A', 'C'], env), false);
assert.equal(parseBoolean('true'), true);
assert.equal(parseBoolean('false', true), false);
console.log('config-validation: ok');
