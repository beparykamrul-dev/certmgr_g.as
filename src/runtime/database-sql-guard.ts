const MUTATING = /\b(INSERT|UPDATE|DELETE|MERGE|UPSERT|CREATE|ALTER|DROP|TRUNCATE|GRANT|REVOKE|VACUUM|REINDEX|CLUSTER|COPY|CALL|DO|REFRESH)\b/i;
const MULTI = /;[^;]*\S/;

export function validateDatabaseSql(sql: string, readOnly = true): { allowed: boolean; reason?: string } {
  const text = sql.trim();
  if (!text) return { allowed: false, reason: 'sql_required' };
  if (text.length > 100_000) return { allowed: false, reason: 'sql_too_large' };
  if (readOnly && MUTATING.test(text)) return { allowed: false, reason: 'read_only_query_required' };
  if (MULTI.test(text)) return { allowed: false, reason: 'multiple_statements_not_allowed' };
  if (/\b(pg_read_file|pg_write_file|lo_import|lo_export)\b/i.test(text)) return { allowed: false, reason: 'filesystem_access_blocked' };
  return { allowed: true };
}
