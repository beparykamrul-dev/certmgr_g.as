import migration001 from '../../migrations/001_approval_audit.sql?raw';
import migration002 from '../../migrations/002_certificate_inventory.sql?raw';

export type Migration = { version: string; sql: string };
export const MIGRATIONS: readonly Migration[] = [
  { version: '001_approval_audit', sql: migration001 },
  { version: '002_certificate_inventory', sql: migration002 },
];
