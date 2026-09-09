import assert from 'node:assert/strict';
import { configured } from '../src/runtime/config-validation';
assert.equal(configured(['A', 'B'], { A: '1', B: '2' } as NodeJS.ProcessEnv), true);
assert.equal(configured(['A', 'B'], { A: '1' } as NodeJS.ProcessEnv), false);
console.log('config-required: ok');
