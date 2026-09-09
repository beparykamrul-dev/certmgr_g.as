export function env(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function envNumber(name: string, fallback: number): number {
  const value = Number(env(name));
  return Number.isFinite(value) ? value : fallback;
}
