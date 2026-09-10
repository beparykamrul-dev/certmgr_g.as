# Production persistence

FTN Cert Control uses PostgreSQL when `DATABASE_URL` is configured.

- Approval requests are stored in `approval_requests`.
- Audit records are stored in `audit_records`.
- Certificate inventory is stored in `certificate_inventory`.
- Startup applies ordered migrations from `src/runtime/migration-catalog.ts`.
- A PostgreSQL failure is not converted into synthetic data.
- Memory storage remains only as a development fallback.

Production readiness requires a real PostgreSQL connection, operator authentication, and live collector health.
