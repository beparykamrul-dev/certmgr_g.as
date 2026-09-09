import assert from 'node:assert/strict';
import { persistCertificateInventory, readCertificateInventory } from '../src/runtime/certificate-service';

const calls: string[] = [];
const db = { query: async <T = unknown>(text: string) => { calls.push(text); return { rows: [] as T[] }; } };
await persistCertificateInventory(db, [{ subject: 'example.com', expiresAt: '2026-12-01T00:00:00.000Z', source: 'test' }]);
assert.ok(calls.includes('BEGIN') && calls.includes('COMMIT'));
assert.deepEqual(await readCertificateInventory(db), []);
console.log('certificate-service: ok');
