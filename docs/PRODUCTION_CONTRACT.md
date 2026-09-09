# FTN Cert-Control production contract

## Invariants
- Production UI never invents telemetry, certificate counts, traffic, security incidents, latency, signatures, or compliance status.
- Missing adapters render `not configured` or `unknown`; they are never treated as healthy.
- Privileged mutations require authentication, policy evaluation, and operator approval.
- Simulation endpoints are not production control paths.
- Secrets remain in deployment configuration, never source control.

## Adapter boundary
Each provider or subsystem must report its source, observation time, and configuration state. The UI consumes those adapter responses and does not manufacture fallback values.

## Control flow
`FTN-AI -> recommendation -> policy -> approval -> execution -> verification -> audit`
