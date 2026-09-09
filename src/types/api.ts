export type ServiceState = 'healthy' | 'degraded' | 'unavailable' | 'unknown';

export interface HealthCheckResult {
  name: string;
  health: number | null;
  status: ServiceState | string;
  source?: string;
  reason?: string;
}

export interface NetworkStatus {
  connected: boolean;
  liveCollectorsConfigured?: number;
  source?: string;
  reason?: string;
}

export interface SystemStats {
  memory: { rss_mb: number; heap_used_mb: number; heap_total_mb: number };
  cpu_percent: number | null;
  active_connections: number | null;
  source?: string;
}

export interface ApiEnvelope<T> {
  data?: T;
  status?: string;
  configured?: boolean;
  feature?: string;
  reason?: string;
}
