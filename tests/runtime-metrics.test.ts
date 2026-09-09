import assert from 'node:assert/strict';
import { prometheusGauge } from '../src/runtime/metrics';
assert.match(prometheusGauge('ftn_test', 'test gauge', 1), /ftn_test 1/);
assert.equal(prometheusGauge('ftn_test', 'test gauge', null), '');
console.log('runtime-metrics: ok');
