const SECRET_KEYS = /token|secret|password|private.?key|api.?key/i;

export function redactEnv(env: NodeJS.ProcessEnv): Record<string, string | undefined> {
  return Object.fromEntries(Object.entries(env).map(([key, value]) => [key, SECRET_KEYS.test(key) ? '[REDACTED]' : value]));
}
