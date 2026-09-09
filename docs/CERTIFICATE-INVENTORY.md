# Certificate inventory

Set `CERTIFICATE_FILES` to a comma-separated list of PEM certificate files on the control host.

The API parses each configured certificate with Node.js `X509Certificate` and derives `valid`, `expiring`, `expired`, or `unknown` from the observed `validTo` timestamp. Missing or invalid files are reported as `unknown`; no synthetic certificate is generated.

Endpoints:

- `GET /api/cert-inventory`
- `GET /api/cert-status`

Private keys are never read by the inventory adapter.
