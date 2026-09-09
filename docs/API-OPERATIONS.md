# Operator API contract

Privileged certificate and service operations remain approval-first.

- `POST /api/bulk-action` authenticates the operator and returns an approval-required response.
- Approval records use the runtime approval store abstraction.
- Audit records are appended for operator decisions.
- No endpoint fabricates certificate, traffic, provider, or security telemetry.
- Certificate inventory is populated only from configured certificate sources.
- Persistence is intentionally separate from the HTTP layer; PostgreSQL is the production persistence target.
