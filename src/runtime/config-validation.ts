export function requiredEnv(name: string, env: NodeJS.ProcessEnv = process.env): string | undefined {
  const value = env[name]?.trim();
  return value || undefined;
}

export function configured(names: string[], env: NodeJS.ProcessEnv = process.env): boolean {
  return names.every(name => Boolean(requiredEnv(name, env)));
}

export function parseBoolean(value: string | undefined, fallback = false): boolean {
  if (value === undefined) return fallback;
  return value.trim().toLowerCase() === 'true';
}
