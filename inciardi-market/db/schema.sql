-- Inciardi Mini Print Market Tracker — Cloudflare D1 schema (v1)
--
-- Three data planes, one join key (print_id):
--   1. catalog    — the universe: every print that exists (grows via confirms)
--   2. inventory  — what Michael owns (mutable, edited in-app via the Worker)
--   3. trend store — market_point / print_point / gone_event (written by cron)
--
-- The market SNAPSHOT (current live eBay listings) stays in Cloudflare KV,
-- rebuilt every run. Only the DISTILLED trend points land here so history
-- stays small and chartable. Raw listings are never archived row-by-row.
--
-- Apply:  wrangler d1 execute inciardi-market --file=./db/schema.sql
-- (add --remote to run against the deployed DB, omit for a local test DB)

PRAGMA foreign_keys = ON;

----------------------------------------------------------------------
-- PLANE 1 — CATALOG (the universe)
----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS catalog (
  print_id     TEXT PRIMARY KEY,          -- permanent slug, the join key everywhere
  title        TEXT NOT NULL,
  series       TEXT,                       -- nyc | lacma | grand-central | holiday | standard | ...
  year         INTEGER,
  exclusive    INTEGER NOT NULL DEFAULT 0, -- 0/1 bool
  retail       REAL,                       -- fixed MSRP baseline (distinct from market price)
  status       TEXT NOT NULL DEFAULT 'unknown', -- in-print | sold-out | unknown
  image        TEXT,
  source_url   TEXT,
  source       TEXT,                       -- provenance: shop | miniprint | ebay-confirm | manual
  notes        TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_catalog_series ON catalog(series);
CREATE INDEX IF NOT EXISTS idx_catalog_status ON catalog(status);

-- Title variants sellers actually use. Every resolved eBay listing feeds a
-- new alias here, so the fuzzy matcher gets smarter over time instead of
-- re-guessing forever.
CREATE TABLE IF NOT EXISTS catalog_alias (
  alias_id   INTEGER PRIMARY KEY AUTOINCREMENT,
  print_id   TEXT NOT NULL REFERENCES catalog(print_id) ON DELETE CASCADE,
  alias      TEXT NOT NULL,
  added_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(print_id, alias)
);

CREATE INDEX IF NOT EXISTS idx_alias_print ON catalog_alias(print_id);

----------------------------------------------------------------------
-- PLANE 2 — INVENTORY (what we own; edited in-app)
----------------------------------------------------------------------
-- print_id is nullable: a print you own that isn't in the catalog yet gets a
-- provisional_label and is reconciled to a real print_id later. Inventory must
-- never reject an unknown print.

CREATE TABLE IF NOT EXISTS inventory (
  inv_id            INTEGER PRIMARY KEY AUTOINCREMENT,
  print_id          TEXT REFERENCES catalog(print_id) ON DELETE SET NULL,
  provisional_label TEXT,                  -- set when print_id is NULL (not yet in catalog)
  disposition       TEXT NOT NULL DEFAULT 'own', -- own | want | dupe
  qty               INTEGER NOT NULL DEFAULT 1,
  condition         TEXT,                  -- new | good | worn | ...
  acquired_price    REAL,
  acquired_where    TEXT,
  acquired_at       TEXT,
  notes             TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_inventory_print       ON inventory(print_id);
CREATE INDEX IF NOT EXISTS idx_inventory_disposition ON inventory(disposition);

----------------------------------------------------------------------
-- PLANE 3 — TREND STORE (written by the cron each run)
----------------------------------------------------------------------

-- General market: ONE roll-up row per cron run.
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

-- Per-print: ONE roll-up row per print per cron run. This is what scoring v2
-- averages against (rolling market price), NOT the hard-coded retail default.
CREATE TABLE IF NOT EXISTS print_point (
  point_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  print_id      TEXT NOT NULL REFERENCES catalog(print_id) ON DELETE CASCADE,
  captured_at   TEXT NOT NULL DEFAULT (datetime('now')),
  active_count  INTEGER NOT NULL,          -- live listings for this print this run
  min_landed    REAL,
  median_landed REAL,
  max_landed    REAL
);

CREATE INDEX IF NOT EXISTS idx_print_point_print ON print_point(print_id);
CREATE INDEX IF NOT EXISTS idx_print_point_time  ON print_point(print_id, captured_at);

-- gone events = a listing present last run, absent now. Free sold-price proxy
-- (Marketplace Insights sold comps stay locked). last_landed is the last price
-- we saw before it vanished.
CREATE TABLE IF NOT EXISTS gone_event (
  event_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  print_id     TEXT REFERENCES catalog(print_id) ON DELETE SET NULL,
  item_id      TEXT,                       -- eBay itemId (ephemeral, for de-dup only)
  last_landed  REAL,
  gone_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_gone_print ON gone_event(print_id);

----------------------------------------------------------------------
-- EXAMPLE READS (the questions this whole thing exists to answer)
----------------------------------------------------------------------
-- Prints I don't own that are listed under retail right now would join
-- catalog LEFT JOIN inventory (print_id IS NULL on the inventory side) against
-- the live KV snapshot in the Worker. Kept in app/Worker code, not as a view,
-- since the live listings live in KV, not D1.
--
-- Rolling market price for a print (scoring v2 baseline):
--   SELECT median_landed FROM print_point
--   WHERE print_id = ?1 AND captured_at >= datetime('now','-30 days')
--   ORDER BY captured_at;
--
-- Catalog coverage on the market this run:
--   SELECT COUNT(DISTINCT print_id) FROM print_point
--   WHERE captured_at = (SELECT MAX(captured_at) FROM print_point);
