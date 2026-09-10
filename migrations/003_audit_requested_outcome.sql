ALTER TABLE audit_records
  DROP CONSTRAINT IF EXISTS audit_records_outcome_check;

ALTER TABLE audit_records
  ADD CONSTRAINT audit_records_outcome_check
  CHECK (outcome IN ('requested', 'approved', 'denied', 'executed', 'failed'));
