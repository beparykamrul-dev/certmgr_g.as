# Security baseline

- Never commit `.env`, API tokens, provider credentials, or private keys.
- Privileged endpoints require a bearer token and explicit approval semantics.
- Production responses must not fabricate certificate, provider, traffic, or security telemetry.
- TLS termination belongs at the deployment edge; the application should remain bound to its private network.
- Preserve `X-Request-ID` for audit correlation.
