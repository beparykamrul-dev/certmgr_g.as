import assert from 'node:assert/strict';
import { httpProbe } from '../src/runtime/http-probe';

const ok = await httpProbe('http://example.test', 100, async () => new Response('ok', { status: 200 }));
assert.equal(ok.ok, true);
assert.equal(ok.status, 200);
const bad = await httpProbe('http://example.test', 100, async () => new Response('bad', { status: 503 }));
assert.equal(bad.ok, false);
assert.equal(bad.status, 503);
console.log('http-probe: ok');
