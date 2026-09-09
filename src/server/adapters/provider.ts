import type { AdapterStatus, ProviderAdapter } from './types';

export class ProviderTelemetryAdapter implements ProviderAdapter {
  async status(): Promise<AdapterStatus> { return { configured: false, name: 'provider-telemetry', reason: 'Provider API credentials and polling configuration are not installed.' }; }
  async health(_provider: string) { return { health: null, latencyMs: null, source: 'not-configured' }; }
}
