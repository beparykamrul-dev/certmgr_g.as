# API contract

## Health
- `GET /api/livez` — process liveness only.
- `GET /api/health` — service metadata and uptime.
- `GET /api/readyz` — deployment readiness; operator control must be configured.

## Telemetry
- `GET /api/health-check` — provider states; unknown until a live adapter reports data.
- `GET /api/system-stats` — process memory and sampled CPU.
- `GET /api/metrics` — Prometheus exposition.

## Mutations
`POST /api/bulk-action` and other privileged endpoints require bearer authentication and remain approval-gated.
