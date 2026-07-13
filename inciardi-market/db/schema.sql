-- Inciardi Market — D1 relational schema (v1, 2026-07-13)
-- Source of truth for the catalog, the owned collection, image storage, and market history.
-- Apply:  wrangler d1 execute inciardi-market --file=inciardi-market/db/schema.sql
-- Idempotent: safe to re-run (CREATE ... IF NOT EXISTS).
--
-- Design principles
--   * catalog = the master print universe (one row per distinct print).
--   * inventory = the prints Michael OWNS, one row per physical copy, FK'd to catalog.
--     (This is the catalog-vs-collection distinction: the catalog is what EXISTS,
--      inventory is what he HAS. A print can be catalogued and un-owned, owned and
--      un-catalogued (provisional), or both.)
--   * print_image = many images per print, versioned. R2 holds the bytes; this table
--     holds the metadata + which one is primary + active/archived (archived = restorable).
--   * provenance + locked: a manual/owner-entered row is locked so the harvest/enrichment
--     pass can fill blanks but NEVER clobber a hand-entered value.

PRAGMA foreign_keys = ON;

-- ============================================================ catalog
CREATE TABLE IF NOT EXISTS catalog (
  print_id     TEXT PRIMARY KEY,             -- kebab slug, stable join key
  title        TEXT NOT NULL,
  category     TEXT,                          -- mini | big-riso | linocut | exclusive | pack
  exclusive    TEXT,                          -- nyc | lacma | grand-central | richard-scarry | holiday | NULL
  retail       REAL,                          -- fixed fact (what Anastasia charges new); NULL if unknown
  in_print     INTEGER NOT NULL DEFAULT 0,    -- 0/1, currently available new
  pack_of      INTEGER,                        -- pack size (prints per pack), NULL if not a pack
  pack_from    INTEGER,                        -- pool size the pack draws from
  source       TEXT NOT NULL DEFAULT 'manual',-- manual | shop-harvest | ebay-confirm | seed | press | vending
  locked       INTEGER NOT NULL DEFAULT 0,    -- 1 = hand-entered; enrichment must not clobber populated fields
  notes        TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_catalog_cat  ON catalog(category);
CREATE INDEX IF NOT EXISTS ix_catalog_excl ON catalog(exclusive);

-- Alternate names a print is listed under (drives fuzzy market matching + dedupe-on-add).
CREATE TABLE IF NOT EXISTS catalog_alias (
  print_id TEXT NOT NULL REFERENCES catalog(print_id) ON DELETE CASCADE,
  alias    TEXT NOT NULL,
  norm     TEXT NOT NULL,                      -- normalized (lower, alnum-collapsed) for matching
  PRIMARY KEY (print_id, norm)
);
CREATE INDEX IF NOT EXISTS ix_alias_norm ON catalog_alias(norm);

-- ============================================================ print_image
-- Many images per print. R2 holds bytes at r2_key; this row is the metadata.
-- overwrite  = insert new row (is_primary=1) + archive the old primary.
-- restore    = flip an archived row back to active (its R2 blob was never deleted).
-- multiple   = many active rows for one print_id; exactly one is_primary among active.
CREATE TABLE IF NOT EXISTS print_image (
  image_id     TEXT PRIMARY KEY,              -- uuid
  print_id     TEXT NOT NULL REFERENCES catalog(print_id) ON DELETE CASCADE,
  r2_key       TEXT,                          -- prints/<print_id>/<image_id>.<ext>; NULL if reference-only
  source_url   TEXT,                          -- original CDN url (scrubbed or referenced)
  kind         TEXT NOT NULL DEFAULT 'upload',-- upload | scrub | reference
  content_type TEXT,
  bytes        INTEGER,
  width        INTEGER,
  height       INTEGER,
  is_primary   INTEGER NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'active',-- active | archived
  sort         INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL,
  archived_at  TEXT
);
CREATE INDEX IF NOT EXISTS ix_img_print ON print_image(print_id, status, sort);
-- At most one active primary per print (safety net; code also clears the old primary on write).
CREATE UNIQUE INDEX IF NOT EXISTS ux_img_primary
  ON print_image(print_id) WHERE is_primary = 1 AND status = 'active';

-- ============================================================ inventory (owned copies)
-- One row per PHYSICAL print owned. print_id NULL until matched to the catalog (provisional).
CREATE TABLE IF NOT EXISTS inventory (
  inv_id            TEXT PRIMARY KEY,          -- uuid
  print_id          TEXT REFERENCES catalog(print_id) ON DELETE SET NULL,
  provisional_label TEXT,                      -- free-text name when not yet catalog-matched
  disposition       TEXT NOT NULL DEFAULT 'own',-- own | want | sold
  condition         TEXT,                       -- new | used | sealed
  framed            INTEGER NOT NULL DEFAULT 0,
  qty               INTEGER NOT NULL DEFAULT 1,
  acquired_price    REAL,
  acquired_where    TEXT,
  acquired_at       TEXT,
  sold_price        REAL,
  sold_at           TEXT,
  notes             TEXT,
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_inv_print ON inventory(print_id);
CREATE INDEX IF NOT EXISTS ix_inv_disp  ON inventory(disposition);

-- ============================================================ market history (time series)
-- Banked by the worker cron each scan. Feeds scoring v2 + per-print trend charts.
CREATE TABLE IF NOT EXISTS market_point (
  point_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  captured_at     TEXT NOT NULL,
  total_listings  INTEGER,
  median_landed   REAL,
  avg_landed      REAL,
  min_landed      REAL,
  max_landed      REAL,
  singles_count   INTEGER,
  packs_count     INTEGER,
  exclusives_count INTEGER
);
CREATE INDEX IF NOT EXISTS ix_mp_at ON market_point(captured_at);

CREATE TABLE IF NOT EXISTS print_point (
  point_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  print_id      TEXT,
  captured_at   TEXT NOT NULL,
  active_count  INTEGER,
  min_landed    REAL,
  median_landed REAL,
  max_landed    REAL
);
CREATE INDEX IF NOT EXISTS ix_pp_print ON print_point(print_id, captured_at);

-- Sold-proxy: when a listing disappears, log its last price. The distribution of
-- "prices that vanished" over time is the closest thing to a sold curve without the
-- locked Marketplace Insights API.
CREATE TABLE IF NOT EXISTS gone_event (
  event_id    INTEGER PRIMARY KEY AUTOINCREMENT,
  print_id    TEXT,
  item_id     TEXT,
  last_landed REAL,
  gone_at     TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_gone_print ON gone_event(print_id, gone_at);
