export function isValidHostname(value: string): boolean {
  if (!value || value.length > 253 || value.includes('..')) return false;
  return /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/.test(value);
}

export function requireNonEmpty(value: string, field: string): string {
  const v = value.trim();
  if (!v) throw new Error(`${field} is required`);
  return v;
}
