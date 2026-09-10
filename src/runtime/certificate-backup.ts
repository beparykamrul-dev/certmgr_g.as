import type { PemBundle } from './certificate-pem';
export type CertificateBackupStore = { save(subject: string, bundle: PemBundle): Promise<void> };
export class UnconfiguredCertificateBackup implements CertificateBackupStore { async save(_subject: string, _bundle: PemBundle): Promise<void> { throw new Error('certificate_backup_not_configured'); } }
