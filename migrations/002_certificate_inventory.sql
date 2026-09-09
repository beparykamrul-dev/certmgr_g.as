CREATE TABLE IF NOT EXISTS certificate_inventory (
  subject TEXT PRIMARY KEY,
  issuer TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  source TEXT NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS certificate_inventory_expires_idx ON certificate_inventory(expires_at);
