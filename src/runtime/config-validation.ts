export function requiredEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function configured(names: string[]): boolean { return names.every(name => Boolean(requiredEnv(name))); }
