import type { CertificateRecord } from './certificate-contract';
import type { SqlClient } from './postgres-client';
import { replaceCertificateInventory, listCertificateInventory } from './postgres-certificate-store';

export async function persistCertificateInventory(db: SqlClient, records: Array<Omit<CertificateRecord, 'status'>>): Promise<void> {
  await replaceCertificateInventory(db, records);
}

export async function readCertificateInventory(db: SqlClient): Promise<CertificateRecord[]> {
  return listCertificateInventory(db);
}
