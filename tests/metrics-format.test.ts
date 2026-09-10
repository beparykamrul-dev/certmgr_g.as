import assert from 'node:assert/strict';
import test from 'node:test';
import { prometheusGauge } from '../src/runtime/metrics-format';

test('Prometheus gauge output is valid and deterministic', () => {
  assert.equal(prometheusGauge('ftn.test', 'A\nmetric', 1), '# HELP ftn_test A metric\n# TYPE ftn_test gauge\nftn_test 1\n');
});

test('invalid Prometheus values are rejected', () => {
  assert.throws(() => prometheusGauge('x', 'x', Number.NaN), /metric_value_invalid/);
});
