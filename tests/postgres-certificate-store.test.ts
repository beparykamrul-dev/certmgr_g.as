import assert from 'node:assert/strict';
import { replaceCertificateInventory, listCertificateInventory } from '../src/runtime/postgres-certificate-store';
const calls: string[] = [];
const db = { query: async <T = unknown>(text: string) => { calls.push(text); return { rows: [] as T[] }; } };
await replaceCertificateInventory(db, [{ subject: 'example.com', expiresAt: new Date(Date.now() + 86400000).toISOString(), source: 'test' }]);
assert.ok(calls.includes('BEGIN') && calls.includes('COMMIT'));
const rows = await listCertificateInventory(db);
assert.deepEqual(rows, []);
console.log('postgres-certificate-store: ok');
