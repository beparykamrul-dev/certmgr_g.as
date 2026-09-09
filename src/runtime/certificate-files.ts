import { readFile } from 'node:fs/promises';
import { X509Certificate } from 'node:crypto';
import { evaluateCertificate } from './certificate-evaluator';
import type { CertificateRecord } from './certificate-contract';

export async function readCertificateFile(filePath: string): Promise<CertificateRecord> {
  try {
    const cert = new X509Certificate(await readFile(filePath, 'utf8'));
    return { subject: cert.subject, issuer: cert.issuer, expiresAt: cert.validTo, status: evaluateCertificate(cert.validTo), source: filePath };
  } catch {
    return { subject: filePath, expiresAt: new Date(0).toISOString(), status: 'unknown', source: filePath };
  }
}

export async function readConfiguredCertificates(env: NodeJS.ProcessEnv = process.env): Promise<CertificateRecord[]> {
  const files = (env.CERTIFICATE_FILES || '').split(',').map(v => v.trim()).filter(Boolean);
  return Promise.all(files.map(readCertificateFile));
}
