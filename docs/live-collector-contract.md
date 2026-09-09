# Live Collector Contract

FTN Cert Control treats configured endpoints and confirmed live health as separate states.

## States

- `not-configured`: no endpoint is configured.
- `configured-but-unhealthy`: an endpoint is configured but the latest probe is not healthy.
- `live`: at least one configured collector has a successful health probe.

HTTP collectors are probed with a bounded timeout. A failed probe never becomes synthetic telemetry.

## Environment

- `PROMETHEUS_URL`
- `ALERTMANAGER_URL`
- `ACME_DIRECTORY_URL`
- `TRAFFIC_COLLECTOR_URL`
- `DATABASE_URL` is configuration-only until a database health adapter is installed.

Readiness requires process health, operator control, and at least one confirmed live collector.
