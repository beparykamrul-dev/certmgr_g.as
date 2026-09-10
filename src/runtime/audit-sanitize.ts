const SECRET_KEYS = /token|secret|password|authorization|api[-_]?key/i;

export function sanitizeAuditMetadata(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, SECRET_KEYS.test(key) ? '[REDACTED]' : value]));
}
