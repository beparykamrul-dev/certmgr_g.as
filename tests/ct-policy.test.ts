import assert from 'node:assert/strict';
import test from 'node:test';
import { ctRequired } from '../src/runtime/ct-policy';

test('CT is required for configured public certificate sources', () => {
  assert.equal(ctRequired('acme'), true);
  assert.equal(ctRequired(''), false);
});
