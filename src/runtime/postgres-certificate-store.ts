import type { CertificateRecord } from './certificate-contract';
import type { SqlClient } from './postgres-client';
import { buildCertificateSnapshot } from './certificate-inventory';

 type Row = { subject: string; issuer: string | null; expires_at: string; source: string; observed_at: string };

export async function replaceCertificateInventory(db: SqlClient, records: Array<Omit<CertificateRecord, 'status'>>): Promise<void> {
  const snapshot = buildCertificateSnapshot(records);
  await db.query('BEGIN');
  try {
    await db.query('DELETE FROM certificate_inventory');
    for (const cert of snapshot.certificates) {
      await db.query(
        'INSERT INTO certificate_inventory (subject, issuer, expires_at, source, observed_at, updated_at) VALUES ($1,$2,$3,$4,$5,NOW())',
        [cert.subject, cert.issuer ?? null, cert.expiresAt, cert.source, snapshot.observedAt],
      );
    }
    await db.query('COMMIT');
  } catch (error) {
    try { await db.query('ROLLBACK'); } catch { /* preserve original error */ }
    throw error;
  }
}

export async function listCertificateInventory(db: SqlClient, now = Date.now()): Promise<CertificateRecord[]> {
  const result = await db.query<Row>('SELECT subject, issuer, expires_at, source, observed_at FROM certificate_inventory ORDER BY expires_at ASC');
  return result.rows.map(row => ({
    subject: row.subject,
    issuer: row.issuer ?? undefined,
    expiresAt: row.expires_at,
    source: row.source,
    status: buildCertificateSnapshot([{
      subject: row.subject,
      issuer: row.issuer ?? undefined,
      expiresAt: row.expires_at,
      source: row.source,
    }], now).certificates[0].status,
  }));
}
