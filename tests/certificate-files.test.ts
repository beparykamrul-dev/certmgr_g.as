import assert from 'node:assert/strict';
import { readConfiguredCertificates } from '../src/runtime/certificate-files';

const records = await readConfiguredCertificates({ CERTIFICATE_FILES: '' });
assert.deepEqual(records, []);
console.log('certificate-files: ok');
