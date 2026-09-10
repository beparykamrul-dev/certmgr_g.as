# Certificate renewal pipeline

1. Observe certificates from a configured source.
2. Evaluate expiry against the renewal policy.
3. Create an approval request for due certificates.
4. Require an operator approval before execution.
5. Invoke an injected ACME/CFSSL-backed execution adapter.
6. Persist the resulting inventory and audit event.
7. Verify service health before reporting success.

The core runtime does not fabricate certificate state and does not invoke shell commands directly. Provider-specific and service-specific execution belongs behind explicit adapters.
