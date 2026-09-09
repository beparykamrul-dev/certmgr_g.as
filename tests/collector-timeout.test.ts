import assert from 'node:assert/strict';
import { probeHttpCollector } from '../src/runtime/collector';

const result = await probeHttpCollector('http://127.0.0.1:9', 100);
assert.equal(result.healthy, false);
assert.equal(typeof result.error, 'string');
console.log('collector-timeout: ok');
