/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  token TEXT NOT NULL,
  fingerprint TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens ON refresh_tokens(
  user_id, token, fingerprint
);