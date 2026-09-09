import type { HealthCheckResult, NetworkStatus, SystemStats } from '../types/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { Accept: 'application/json', ...(init?.headers || {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.reason || body?.error || `HTTP ${response.status}`);
  return body as T;
}

export const certControlApi = {
  health: () => request<{ status: string; service: string }>('/api/health'),
  readiness: () => request<{ ready: boolean; checks: Record<string, boolean> }>('/api/readyz'),
  networkStatus: () => request<NetworkStatus>('/api/network-status'),
  healthChecks: () => request<HealthCheckResult[]>('/api/health-check'),
  systemStats: () => request<SystemStats>('/api/system-stats'),
  metrics: () => fetch('/api/metrics').then(r => r.text()),
};
