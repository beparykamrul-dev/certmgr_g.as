import assert from 'node:assert/strict';
import http from 'node:http';
import { probeHttpCollector, probeCollectorStatuses } from '../src/runtime/collector';

const server = http.createServer((_req, res) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end('{"ok":true}'); });
await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
assert.ok(address && typeof address === 'object');
const url = `http://127.0.0.1:${address.port}`;
const result = await probeHttpCollector(url);
assert.equal(result.healthy, true);
assert.equal(typeof result.latencyMs, 'number');
const statuses = await probeCollectorStatuses({ PROMETHEUS_URL: url } as NodeJS.ProcessEnv);
assert.equal(statuses.find(s => s.name === 'prometheus')?.healthy, true);
await new Promise<void>(resolve => server.close(() => resolve()));
console.log('collector-probe: ok');
