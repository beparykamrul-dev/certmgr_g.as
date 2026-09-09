# FTN Cert-Control deployment

Production modes are either Docker Compose or systemd. Keep `.env` outside Git and provide `FTN_API_TOKEN` as a secret of at least 32 characters for privileged operator endpoints.

The service intentionally reports `not-configured` until real certificate/provider collectors are installed. Do not replace null values with synthetic telemetry.
