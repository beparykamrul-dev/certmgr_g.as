import type { DatabaseSummary } from '../contracts/database-control';

export function databaseMetrics(summary: DatabaseSummary): string {
  const labels = `target="${summary.target.id}",engine="${summary.target.engine}"`;
  const configured = summary.target.configured ? 1 : 0;
  const healthy = summary.healthy ? 1 : 0;
  const latency = summary.latencyMs ?? 0;
  const size = summary.sizeBytes ?? 0;
  return [
    '# HELP ftn_database_configured Whether a database target is configured',
    '# TYPE ftn_database_configured gauge',
    `ftn_database_configured{${labels}} ${configured}`,
    '# HELP ftn_database_healthy Whether the database target is healthy',
    '# TYPE ftn_database_healthy gauge',
    `ftn_database_healthy{${labels}} ${healthy}`,
    '# HELP ftn_database_probe_latency_ms Database health probe latency',
    '# TYPE ftn_database_probe_latency_ms gauge',
    `ftn_database_probe_latency_ms{${labels}} ${latency}`,
    '# HELP ftn_database_size_bytes Current database size when available',
    '# TYPE ftn_database_size_bytes gauge',
    `ftn_database_size_bytes{${labels}} ${size}`,
  ].join('\n') + '\n';
}
