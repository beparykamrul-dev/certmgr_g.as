# Adapter readiness matrix

| Adapter | API surface | Required for production claim |
|---|---|---|
| ACME | certificate issuance/renewal | Yes |
| CFSSL | CA/signing | Yes when selected |
| Certificate Transparency | CT log ingestion | Yes for CT claims |
| PostgreSQL | durable state/audit | Yes for durable control state |
| Prometheus | metrics collection | Yes for live metrics claims |
| Alertmanager | alert delivery | Yes for alerting claims |
| EdgeOne | security telemetry/control | Yes for EdgeOne claims |
| Provider telemetry | latency/traffic/health | Yes for provider claims |
| GitHub | repository changes | Yes for GitHub automation |
