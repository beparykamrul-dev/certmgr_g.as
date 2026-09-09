CREATE TABLE IF NOT EXISTS audit_records (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  actor TEXT NOT NULL,
  outcome TEXT NOT NULL,
  target TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  request_id TEXT
);

CREATE TABLE IF NOT EXISTS approval_requests (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_records(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_approval_state ON approval_requests(state);
