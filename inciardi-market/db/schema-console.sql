PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS catalog (
  print_id     TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  series       TEXT,
  year         INTEGER,
  exclusive    INTEGER NOT NULL DEFAULT 0,
  retail       REAL,
  status       TEXT NOT NULL DEFAULT 'unknown',
  image        TEXT,
  source_url   TEXT,
  source       TEXT,
  notes        TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_catalog_series ON catalog(series);

CREATE INDEX IF NOT EXISTS idx_catalog_status ON catalog(status);

CREATE TABLE IF NOT EXISTS catalog_alias (
  alias_id   INTEGER PRIMARY KEY AUTOINCREMENT,
  print_id   TEXT NOT NULL REFERENCES catalog(print_id) ON DELETE CASCADE,
  alias      TEXT NOT NULL,
  added_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(print_id, alias)
);

CREATE INDEX IF NOT EXISTS idx_alias_print ON catalog_alias(print_id);

CREATE TABLE IF NOT EXISTS inventory (
  inv_id            INTEGER PRIMARY KEY AUTOINCREMENT,
  print_id          TEXT REFERENCES catalog(print_id) ON DELETE SET NULL,
  provisional_label TEXT,
  disposition       TEXT NOT NULL DEFAULT 'own',
  qty               INTEGER NOT NULL DEFAULT 1,
  condition         TEXT,
  acquired_price    REAL,
  acquired_where    TEXT,
  acquired_at       TEXT,
  notes             TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_inventory_print ON inventory(print_id);

CREATE INDEX IF NOT EXISTS idx_inventory_disposition ON inventory(disposition);

CREATE TABLE IF NOT EXISTS market_point (
  point_id         INTEGER PRIMARY KEY AUTOINCREMENT,
  captured_at      TEXT NOT NULL DEFAULT (datetime('now')),
  total_listings   INTEGER NOT NULL,
  median_landed    REAL,
  avg_landed       REAL,
  min_landed       REAL,
  max_landed       REAL,
  singles_count    INTEGER,
  packs_count      INTEGER,
  exclusives_count INTEGER
);

CREATE INDEX IF NOT EXISTS idx_market_point_time ON market_point(captured_at);

CREATE TABLE IF NOT EXISTS print_point (
  point_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  print_id      TEXT NOT NULL REFERENCES catalog(print_id) ON DELETE CASCADE,
  captured_at   TEXT NOT NULL DEFAULT (datetime('now')),
  active_count  INTEGER NOT NULL,
  min_landed    REAL,
  median_landed REAL,
  max_landed    REAL
);

CREATE INDEX IF NOT EXISTS idx_print_point_print ON print_point(print_id);

CREATE INDEX IF NOT EXISTS idx_print_point_time ON print_point(print_id, captured_at);

CREATE TABLE IF NOT EXISTS gone_event (
  event_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  print_id     TEXT REFERENCES catalog(print_id) ON DELETE SET NULL,
  item_id      TEXT,
  last_landed  REAL,
  gone_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_gone_print ON gone_event(print_id);
