export type ProviderStatus = { provider: string; configured: boolean; available: boolean; checkedAt: string; message?: string };

export function unavailable(provider: string, message = 'Not configured'): ProviderStatus {
  return { provider, configured: false, available: false, checkedAt: new Date().toISOString(), message };
}
