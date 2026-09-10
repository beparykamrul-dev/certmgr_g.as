import assert from 'node:assert/strict';
import test from 'node:test';
import { probeServiceHealth } from '../src/runtime/service-health';

test('service health reports healthy for successful response', async () => {
  const result = await probeServiceHealth({ service: 'api', url: 'http://test.local' }, async () => new Response('', { status: 200 }));
  assert.equal(result.state, 'healthy');
  assert.equal(result.components[0].state, 'healthy');
});

test('service health reports unhealthy for failed response', async () => {
  const result = await probeServiceHealth({ service: 'api', url: 'http://test.local' }, async () => new Response('', { status: 503 }));
  assert.equal(result.state, 'unhealthy');
});
