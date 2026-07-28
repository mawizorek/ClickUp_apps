-- Inciardi Collection — PROPOSED schema v2 · ③ THE MARKET LENS
-- One table. DEFERRED TO M4 — do not apply this while building M1.
--
-- ⚠️ NOT APPLIED, and further from being applied than the rest. Apply order: `db/_index.md`.
--
-- WHY THIS IS ITS OWN FILE: precisely because it is deferred. Keeping a P3 table inside the M1 spine
-- file is how a deferred concern quietly gets built early — if it is not in the apply set for M1, it
-- should not be in the file you have open while building M1. The predecessor's whole shape came from
-- the market defining the catalog; Michael inverted that ("it becomes catalog searching the market for
-- existence and logging itself, rather than the market defining what's in the catalog"), and the file
-- layout should make the inversion hard to forget.

PRAGMA foreign_keys = ON;

-- ============================================================ sighting
-- "I saw this listed at this price at this moment." Immutable, APPEND-ON-CHANGE.
--
-- Replaces FOUR predecessor tables — `market`, `market_point`, `print_point`, `gone_event`. The old
-- `market` held only "what is listed right now" and discarded its own history every six hours, which is
-- backwards for a buy/sell tool: the interesting question is what a thing USED to cost. The aggregates
-- are queries over this, and `gone_event` is just status='gone'.
--
-- Beckett B5: append-ONLY with no dedupe is a landfill (one unsold listing x 6h cron x 30 days = 120
-- identical rows). So a sighting is stored ONLY when price or status DIFFERS from the last one for that
-- listing. That is a write-path rule (rung 4) and it is stated here because it cannot be a constraint —
-- "differs from the previous row" is not something a CHECK can see.
--
-- Beckett B6: `artwork_id` is nullable so an observation matching nothing we know is still recordable —
-- the predecessor silently discarded those, which is why we have no history for prints that were never
-- catalogued. But nullable means artwork-scoped queries skip them forever, so this REQUIRES a triage
-- surface in Adopt. 🔴 Recordable without triage is just a slower way of throwing the data away.
CREATE TABLE IF NOT EXISTS sighting (
  sighting_id INTEGER PRIMARY KEY AUTOINCREMENT,
  artwork_id  TEXT REFERENCES artwork(artwork_id) ON DELETE SET NULL,
  edition_id  TEXT REFERENCES edition(edition_id) ON DELETE SET NULL,
  listing_id  TEXT,                          -- eBay itemId
  source      TEXT NOT NULL DEFAULT 'ebay',
  title_seen  TEXT,                          -- the raw listing title, for later re-matching
  landed      REAL,                          -- price + shipping, DOLLARS (never cents — see the /100 scar)
  currency    TEXT NOT NULL DEFAULT 'USD',
  status      TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live','gone')),
  url         TEXT,
  seen_at     TEXT NOT NULL,

  -- A sighting with no price and no status change records nothing.
  CHECK (landed IS NOT NULL OR status = 'gone')
);
CREATE INDEX IF NOT EXISTS ix_sight_art  ON sighting(artwork_id, seen_at);
CREATE INDEX IF NOT EXISTS ix_sight_list ON sighting(listing_id, seen_at);
-- The triage queue Beckett demanded: unmatched observations, findable rather than lost.
CREATE INDEX IF NOT EXISTS ix_sight_open ON sighting(seen_at) WHERE artwork_id IS NULL;

-- ============================================================ deliberately absent
-- No `underpriced` flag, no threshold column, no view. In the predecessor that feature was
-- mathematically unreachable for weeks — `retailFrom()` divided by 100 assuming cents while the
-- storefront returned dollars, so every one of 177 rows read 1/100th of its real price and the
-- threshold could never fire. No error anywhere. When this comes back it gets a test against known
-- values FIRST, not a view.
