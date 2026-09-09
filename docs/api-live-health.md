# Live Health API

## `GET /api/health`

Returns runtime state, configured collector count, live collector availability, individual collector probe state, latency, and the last probe timestamp.

## `GET /api/network-status`

Returns `live`, `configured-but-unhealthy`, or `not-configured`. The response includes collector details.

## `GET /api/readyz`

Returns HTTP 200 only when process health, operator control, and at least one live collector are all true. Otherwise it returns HTTP 503.

## `GET /api/metrics`

Exports Prometheus-compatible process and collector state. No synthetic traffic, certificate, latency, or provider measurements are emitted.
