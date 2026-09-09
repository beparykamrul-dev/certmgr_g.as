# PostgreSQL persistence

Apply `schema.sql` to the FTN certificate-control PostgreSQL database before enabling `DATABASE_URL` in production.

The schema contains only audit and approval records. Certificate material and private keys are intentionally not stored by this migration.
