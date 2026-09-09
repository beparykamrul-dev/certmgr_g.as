CREATE TABLE IF NOT EXISTS approval_requests (
  id UUID PRIMARY KEY,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending','approved','rejected','expired','executed')),
  created_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS approval_requests_state_idx ON approval_requests(state);
CREATE INDEX IF NOT EXISTS approval_requests_created_at_idx ON approval_requests(created_at DESC);

CREATE TABLE IF NOT EXISTS audit_records (
  id UUID PRIMARY KEY,
  action TEXT NOT NULL,
  actor TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('approved','denied','executed','failed')),
  target TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  request_id UUID
);
CREATE INDEX IF NOT EXISTS audit_records_timestamp_idx ON audit_records(timestamp DESC);
CREATE INDEX IF NOT EXISTS audit_records_request_id_idx ON audit_records(request_id);
