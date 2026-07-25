-- Inciardi Collection — PROPOSED schema v1
-- ⚠️ NOT APPLIED. Filename says `.proposed` on purpose: this is a design artifact under
-- review, not a runnable migration. It becomes `schema.sql` when §7 of the README is signed off.
--
-- Everything here derives from decisions logged in `Inciardi Market — Rebuild Decision Log`:
--   Q1 → a copy ALWAYS attaches to an edition; open artworks get one implicit edition.
--   Q2 → a row that leaves the authored source is FLAGGED orphaned, never silently kept.
--   Q3 → soft; superseded by the manual-input-first reframe (README §3, sign-off item 1).
--
-- THE ONE RULE THAT EXPLAINS THE REST: every table is named for WHAT IT IS, never for where
-- the data came from. The predecessor had `catalog` (= the shop), `market` (= eBay) and
-- `inventory` (= Michael) — three SOURCE names — which is why a print in two sources got two
-- rows and a print in no source had nowhere to live.

PRAGMA foreign_keys = ON;

-- ============================================================ collection
-- A named grouping that maps 1:1 to a BINDER SHEET. `roster_size` is load-bearing: it is the
-- denominator in "SPRING · 11 / 15", which is the number that makes the binder worth opening on
-- a day when there is nothing to buy. Without it the app cannot say a set is incomplete.
CREATE TABLE IF NOT EXISTS collection (
  collection_id TEXT PRIMARY KEY,          -- spring | richard-scarry | beach | ...
  name          TEXT NOT NULL,
  roster_size   INTEGER,                    -- how many artworks SHOULD be in the set; NULL if unknown
  names_known   INTEGER NOT NULL DEFAULT 0, -- how many we can actually name (honesty counter)
  sort          INTEGER NOT NULL DEFAULT 0,
  notes         TEXT,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

-- ============================================================ artwork
-- The creative work. ONE row forever, regardless of how many exist or who is selling one.
-- artwork_id is HAND-WRITTEN and permanent. No generated slugs: `slug("#1")` collapsing to "1"
-- for every product is the exact bug that made all this necessary.
CREATE TABLE IF NOT EXISTS artwork (
  artwork_id    TEXT PRIMARY KEY,
  name          TEXT NOT NULL,             -- display only; free to change, never identity
  artist        TEXT NOT NULL DEFAULT 'Anastasia Inciardi',  -- Alex · Jana · Jules also appear
  collection_id TEXT REFERENCES collection(collection_id) ON DELETE SET NULL,
  category      TEXT,                       -- mini | big-riso | linocut | pack
  exclusive     TEXT,                       -- nyc | lacma | grand-central | richard-scarry | holiday

  -- Domain Dara's distinction. A "#4" and a "7/12" are NOT the same kind of number and must not
  -- be rendered or scored the same way:
  --   unique  = monoprint. Each numbered object genuinely differs. "#7 sold" = gone forever.
  --   limited = run of N near-identical impressions. "#7 sold" = N-1 remain, any one satisfies.
  --   open    = reprinted freely. Owning one = owning the artwork.
  -- Without this the binder cannot answer "is my Watermelon complete?", which is the single
  -- question a binder exists to answer.
  edition_type  TEXT NOT NULL DEFAULT 'open' CHECK (edition_type IN ('unique','limited','open')),
  edition_of    INTEGER,                    -- known run length; NULL if unknown

  retail        REAL,                       -- DOLLARS. Never cents. A /100 here cost a whole day.
  shop_handle   TEXT,                       -- Shopify handle: the enrichment join. Survives renames.

  -- Provenance is the actual protection against a feed overwriting hand-entered truth. It is NOT
  -- the file's location in git — that conflation is corrected in README §3.
  provenance    TEXT NOT NULL DEFAULT 'manual'
                CHECK (provenance IN ('manual','pack-roster','shop-product','owned','market','seed')),

  -- Honest uncertainty, rendered rather than hidden. A registry that conceals its own gaps is how
  -- the harvest earned its distrust. 44 artworks are currently known-to-exist and unnamed.
  confidence    TEXT NOT NULL DEFAULT 'named'
                CHECK (confidence IN ('named','inferred','placeholder')),

  -- Q2 = A. A row that leaves the authored source is flagged for the Adopt queue, never deleted
  -- and never silently kept. Silent-keep is what stranded rows in the predecessor.
  status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','orphaned','archived')),

  notes         TEXT,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_art_coll   ON artwork(collection_id, status);
CREATE INDEX IF NOT EXISTS ix_art_cat    ON artwork(category, status);
CREATE INDEX IF NOT EXISTS ix_art_handle ON artwork(shop_handle);

-- Alternate names. Drives eBay matching and dedupe-on-add. A rename folds the old name in here,
-- which is why a rename never breaks a market match.
CREATE TABLE IF NOT EXISTS artwork_alias (
  artwork_id TEXT NOT NULL REFERENCES artwork(artwork_id) ON DELETE CASCADE,
  alias      TEXT NOT NULL,
  norm       TEXT NOT NULL,                 -- lowercased, alnum-collapsed
  PRIMARY KEY (artwork_id, norm)
);
CREATE INDEX IF NOT EXISTS ix_alias_norm ON artwork_alias(norm);

-- ============================================================ edition
-- A specific impression or unique object. THE LAYER THAT NEVER EXISTED BEFORE.
--
-- Q1, in Michael's words: "an artwork can't exist without an edition, regardless of it's named or
-- numbered by Anna as an edition. we have to know it's the only edition and create it then."
--
-- So: every artwork has AT LEAST ONE edition. An open-run print gets exactly one with implicit=1.
-- An edition is the physical-INSTANCE layer, not a numbering scheme — a thing that exists has at
-- least one instance whether or not the artist labelled it. That makes copy.edition_id NOT NULL and
-- always satisfiable: one code path, no polymorphic parent, no nullable dual FK.
CREATE TABLE IF NOT EXISTS edition (
  edition_id TEXT PRIMARY KEY,
  artwork_id TEXT NOT NULL REFERENCES artwork(artwork_id) ON DELETE CASCADE,

  -- The shop's inventory tag ("#4", "7/12"). NULL when implicit. ⚠️ Beckett B7: labels are
  -- SHOP-ASSIGNED and may be reused across relistings — the object she calls #4 today may not be
  -- last year's #4. Never treat a label as durable identity; that is what edition_id is for.
  label      TEXT,

  -- 1 = structural, not real. Created because the artwork exists, not because it was numbered.
  -- The UI must NEVER render an implicit edition as a badge. If she numbers an open print later,
  -- this flips to 0 and gains a label — no migration.
  implicit   INTEGER NOT NULL DEFAULT 0,

  seq        INTEGER,                       -- numeric sort key parsed from label; NULL if implicit
  size       TEXT,                          -- "3x4" · "6x6"

  -- ⚠️ HARVEST-OWNED. The authored layer must not write this (Beckett B4). Availability is a live
  -- fact; a snapshot of it from whenever a human last edited a file is worse than no value.
  available  INTEGER,                        -- 1 | 0 | NULL = unknown

  -- The shop DELETES a variant when that edition sells, so a gap in surviving labels IS a sale.
  -- Recording it explicitly beats re-deriving it, and survives the listing disappearing.
  sold_out_at TEXT,

  -- MANDATORY where an image exists (Beckett B4 precondition). R2 bytes are the only genuinely
  -- unrecoverable asset in the system — snapshots carry image ROWS, not bytes — so the CDN URL is
  -- what keeps the binder from being blank for ~15 hours after any rebuild.
  source_url TEXT,

  notes      TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_ed_art ON edition(artwork_id, seq);
CREATE UNIQUE INDEX IF NOT EXISTS ux_ed_label ON edition(artwork_id, label) WHERE label IS NOT NULL;
-- At most ONE implicit edition per artwork. This is the guard that stops a loader bug from
-- quietly minting duplicate structural rows on every run.
CREATE UNIQUE INDEX IF NOT EXISTS ux_ed_implicit ON edition(artwork_id) WHERE implicit = 1;

-- ============================================================ edition_image
-- Images attach to the EDITION, not the artwork. This is the opposite of the predecessor and it
-- falls straight out of Q1: each Brooklyn Ginkgo edition has its OWN photograph because they are
-- visibly different objects. An open artwork has one implicit edition, so its photo lives there.
-- One rule, no special case: a photograph is of an object, and the object is the edition.
CREATE TABLE IF NOT EXISTS edition_image (
  image_id     TEXT PRIMARY KEY,
  edition_id   TEXT NOT NULL REFERENCES edition(edition_id) ON DELETE CASCADE,
  r2_key       TEXT,                        -- NULL = reference-only, renders via CDN passthrough
  source_url   TEXT,
  kind         TEXT NOT NULL DEFAULT 'upload' CHECK (kind IN ('upload','scrub','reference')),
  content_type TEXT,
  bytes        INTEGER,
  width        INTEGER,
  height       INTEGER,
  is_primary   INTEGER NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
  sort         INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL,
  archived_at  TEXT
);
CREATE INDEX IF NOT EXISTS ix_img_ed ON edition_image(edition_id, status, sort);
CREATE UNIQUE INDEX IF NOT EXISTS ux_img_primary
  ON edition_image(edition_id) WHERE is_primary = 1 AND status = 'active';

-- ============================================================ copy  (the binder)
-- The physical thing Michael holds. The only layer that is a FACT rather than a claim.
--
-- edition_id is NOT NULL — guaranteed satisfiable by the implicit-edition rule above. That is the
-- entire payoff of Q1: no polymorphic parent, no nullable dual FK, no per-query special case.
CREATE TABLE IF NOT EXISTS copy (
  copy_id        TEXT PRIMARY KEY,
  edition_id     TEXT NOT NULL REFERENCES edition(edition_id) ON DELETE RESTRICT,

  disposition    TEXT NOT NULL DEFAULT 'own' CHECK (disposition IN ('own','want','sold')),
  condition      TEXT,
  framed         INTEGER NOT NULL DEFAULT 0,
  qty            INTEGER NOT NULL DEFAULT 1,
  acquired_price REAL,
  acquired_where TEXT,                       -- vending machine · trade · shop · eBay · gift
  acquired_at    TEXT,
  sold_price     REAL,
  sold_at        TEXT,
  notes          TEXT,
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_copy_ed   ON copy(edition_id);
CREATE INDEX IF NOT EXISTS ix_copy_disp ON copy(disposition);

-- ⚠️ ON DELETE RESTRICT above is deliberate and is the schema's one hard refusal.
-- Beckett's requirement: the binder MUST be able to hold a print no feed has ever heard of
-- (vending-machine finds, trades, museum shops), and RESTRICT means the app can never delete an
-- artwork out from under something Michael owns. To record an unknown print, `Enter` creates a
-- placeholder artwork (confidence='placeholder', provenance='owned') + its implicit edition, then
-- the copy. Ownership therefore never depends on a feed having seen the thing.

-- ============================================================ sighting  (deferred to P3)
-- "I saw this listed at this price at this moment." Immutable, APPEND-ON-CHANGE.
--
-- Replaces the predecessor's `market` snapshot, which held only "what is listed right now" and
-- discarded its own history every six hours — backwards for a buy/sell tool.
--
-- Beckett B5: append-ONLY with no dedupe is a landfill (one unsold listing × 6h cron × 30 days =
-- 120 identical rows). So: store a sighting only when price or status DIFFERS from the last one
-- for that listing.
--
-- Beckett B6: artwork_id is nullable so an observation matching nothing we know is still
-- recordable — the predecessor silently discarded those. But nullable means artwork-scoped queries
-- skip them forever, so this REQUIRES a triage surface in Adopt. Recordable without triage is a
-- slower way of throwing the data away.
CREATE TABLE IF NOT EXISTS sighting (
  sighting_id INTEGER PRIMARY KEY AUTOINCREMENT,
  artwork_id  TEXT REFERENCES artwork(artwork_id) ON DELETE SET NULL,
  edition_id  TEXT REFERENCES edition(edition_id) ON DELETE SET NULL,
  listing_id  TEXT,                          -- eBay itemId
  source      TEXT NOT NULL DEFAULT 'ebay',
  title_seen  TEXT,                          -- the raw listing title, for later re-matching
  landed      REAL,                          -- price + shipping
  currency    TEXT NOT NULL DEFAULT 'USD',
  status      TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live','gone')),
  url         TEXT,
  seen_at     TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_sight_art  ON sighting(artwork_id, seen_at);
CREATE INDEX IF NOT EXISTS ix_sight_list ON sighting(listing_id, seen_at);
CREATE INDEX IF NOT EXISTS ix_sight_open ON sighting(seen_at) WHERE artwork_id IS NULL;

-- ============================================================ what is NOT here, on purpose
-- machine / machine_print / machine_event — the location layer. 14 seeded rows in the predecessor,
--   zero UI ever built against them. Out of scope (README §6); port when there is a page for it.
-- market_point / print_point / gone_event — the old time-series trio. `sighting` replaces all three:
--   the aggregates are queries over it, and gone_event is just status='gone'.
-- catalog / inventory — dead names. They described sources, not things.
