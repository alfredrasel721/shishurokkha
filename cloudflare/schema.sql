PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS pairing_codes (
  code_hash TEXT PRIMARY KEY,
  parent_uid TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  consumed_at INTEGER,
  consumed_by_child_uid TEXT,
  consumed_request_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_pairing_codes_parent
  ON pairing_codes(parent_uid, created_at);

CREATE TABLE IF NOT EXISTS family_links (
  child_uid TEXT PRIMARY KEY,
  parent_uid TEXT NOT NULL,
  linked_at INTEGER NOT NULL,
  revoked_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_family_links_parent_active
  ON family_links(parent_uid, revoked_at);

CREATE TABLE IF NOT EXISTS rate_limits (
  rate_key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_expiry
  ON rate_limits(expires_at);
