export type ProviderTarget = { provider: string; enabled: boolean };

export function normalizeProviderTarget(provider: string): ProviderTarget {
  const value = provider.trim();
  if (!value || value.length > 128) throw new Error('provider_invalid');
  return { provider: value, enabled: true };
}
