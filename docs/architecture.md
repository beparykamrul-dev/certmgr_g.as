# FTN Cert-Control architecture

```text
FTN UI
  -> /api/*
  -> Policy / Approval boundary
  -> Live adapters
      -> ACME / CFSSL
      -> Certificate Transparency
      -> Provider telemetry
      -> GitHub integration
  -> PostgreSQL / audit storage
  -> Prometheus -> Alertmanager
```

Only adapters with real credentials/configuration may publish live telemetry. Privileged actions remain approval-gated.
