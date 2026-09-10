# Observability

`/api/livez` reports process liveness. `/api/readyz` reports readiness. `/api/health` exposes collector and storage state. `/api/metrics` exposes Prometheus-compatible gauges.

Operational dashboards must treat unavailable data as unavailable. The UI must never infer live latency, traffic, certificate, or security values from placeholders.

Audit records are persistent when PostgreSQL is configured and should not contain credentials or bearer tokens.
