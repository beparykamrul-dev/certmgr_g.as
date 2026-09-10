const SECRET_KEYS = /token|secret|password|private.?key|api.?key|authorization/i;

export function redactEnv(env: NodeJS.ProcessEnv): Record<string, string | undefined> {
  return Object.fromEntries(Object.entries(env).map(([key, value]) => [key, SECRET_KEYS.test(key) ? '[REDACTED]' : value]));
}

export function redactSecrets<T extends Record<string, unknown>>(input: T): T {
  const output = { ...input } as T;
  for (const key of Object.keys(output)) {
    if (SECRET_KEYS.test(key)) output[key as keyof T] = '[REDACTED]' as T[keyof T];
  }
  return output;
}
