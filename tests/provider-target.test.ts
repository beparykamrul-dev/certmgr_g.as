import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeProviderTarget } from '../src/runtime/provider-target';

test('provider target is normalized', () => assert.deepEqual(normalizeProviderTarget(' Google '), { provider: 'Google', enabled: true }));
test('empty provider target is rejected', () => assert.throws(() => normalizeProviderTarget(' '), /provider_invalid/));
