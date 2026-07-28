-- Inciardi Collection — PROPOSED schema v2 · ① THE SPINE
-- artwork → edition → copy. The three entities everything else hangs off.
--
-- ⚠️ NOT APPLIED. The `.proposed` suffix is load-bearing: a design artifact under review, not a
-- runnable migration. This file is one of four — see `db/_index.md` for the set and the APPLY ORDER,
-- which is FK-significant. Files: ① spine (here) · ② binder · ③ market · ④ views.
--
-- 🔴 PROMOTION IS BLOCKED ON ONE VERIFICATION. SQLite enforces foreign keys PER CONNECTION and has
-- historically defaulted them OFF. Every composite FK here is decorative if D1 is not enforcing, and
-- an unenforced constraint is WORSE than none because it looks like protection — the same failure
-- shape as the silent caches that cost a full day on 2026-07-25. Before promotion: run a deliberate
-- violating INSERT against a live D1 instance and confirm it is REJECTED. If D1 does not enforce,
-- every rung-2 rule demotes to a trigger and these files get rewritten. Do not assume. (J6.)
--
-- ==========================================================================================
-- THE DESIGN LAW (decision log J6):  DON'T POLICE DISAGREEMENT. MAKE IT UNREPRESENTABLE.
--   1. Don't store it — derive it.        (a computed fact cannot disagree with itself)
--   2. Make it structurally impossible.   (composite FK, UNIQUE, NOT NULL, CHECK)
--   3. Trigger.                           (invariants SQL can't express)
--   4. One write path.                    (only as good as never adding a second door)
--   5. Detect and announce.               (backstop, NEVER the plan)
-- Nothing here lands on "the application will be careful." It won't be, at 3am, in the D1 console.
--
-- THE NAMING LAW: every table is named for WHAT IT IS, never for where the data came from. The
-- predecessor had `catalog` (the shop), `market` (eBay) and `inventory` (Michael) — three SOURCE
-- names — which is why a print in two sources got two rows and a print in no source had nowhere to
-- live.
--
-- Decisions implemented here (`Inciardi Collection — Decision Log`):
--   Q1  → a copy ALWAYS attaches to an edition; open artworks get one implicit edition.
--   Q2  → a row that leaves the authored source is FLAGGED orphaned, never silently kept.
--   Q4  → D1 is the source of truth; git JSON is a generated export.
--   Q10 → ownership is `copy` rows carrying `qty`, not one row per physical object.
-- ==========================================================================================

PRAGMA foreign_keys = ON;

-- ============================================================ collection
-- A named grouping ("Spring", "Richard Scarry"). NOT the same thing as a binder sheet: a collection is
-- what the artist released, a sheet is how Michael chose to lay it out. Conflating them would force
-- one sheet per collection forever and break "the same print on two sheets" (J2 ruling 3).
--
-- `roster_size` is load-bearing: the denominator in "SPRING · 11 / 15", the number that makes the
-- binder worth opening on a day when there is nothing to buy.
CREATE TABLE IF NOT EXISTS collection (
  collection_id TEXT PRIMARY KEY,           -- spring | richard-scarry | beach | ...
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
-- artwork_id is HAND-WRITTEN and permanent. No generated slugs: `slug("#1")` collapsing to "1" for
-- every product is the exact bug that made all this necessary.
CREATE TABLE IF NOT EXISTS artwork (
  artwork_id    TEXT PRIMARY KEY,
  name          TEXT NOT NULL,              -- display only; free to change, never identity
  artist        TEXT NOT NULL DEFAULT 'Anastasia Inciardi',  -- Alex · Jana · Jules also appear
  collection_id TEXT REFERENCES collection(collection_id) ON DELETE SET NULL,
  category      TEXT,                       -- mini | big-riso | linocut | pack
  exclusive     TEXT,                       -- nyc | lacma | grand-central | richard-scarry | holiday

  -- Domain Dara's distinction. "#4" and "7/12" are NOT the same kind of number:
  --   unique  = monoprint. Each numbered object genuinely differs. "#7 sold" = gone forever.
  --   limited = run of N near-identical impressions. "#7 sold" = N-1 remain, any one satisfies.
  --   open    = reprinted freely. Owning one = owning the artwork.
  -- Without this the binder cannot answer "is my Watermelon complete?", the single question a binder
  -- exists to answer. It is ALSO what stops six copies of a one-of-a-kind being recorded — see the
  -- denormalization chain on `edition`.
  edition_type  TEXT NOT NULL DEFAULT 'open' CHECK (edition_type IN ('unique','limited','open')),
  edition_of    INTEGER,                    -- known run length; NULL if unknown

  retail        REAL,                       -- DOLLARS. Never cents. A /100 here cost a whole day.
  shop_handle   TEXT,                       -- Shopify handle: the enrichment join. Survives renames.

  -- Provenance is the actual protection against a feed overwriting hand-entered truth. It is NOT the
  -- file's location in git — that conflation is corrected in README §3 (Q4).
  provenance    TEXT NOT NULL DEFAULT 'manual'
                CHECK (provenance IN ('manual','pack-roster','shop-product','owned','market','seed')),

  -- Honest uncertainty, rendered rather than hidden. A registry that conceals its own gaps is how the
  -- harvest earned its distrust. 44 artworks are currently known-to-exist and unnamed.
  confidence    TEXT NOT NULL DEFAULT 'named'
                CHECK (confidence IN ('named','inferred','placeholder')),

  -- Q2 = A. A row that leaves the authored source is flagged for the Adopt queue, never deleted and
  -- never silently kept. Silent-keep is what stranded rows in the predecessor.
  status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','orphaned','archived')),

  notes         TEXT,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_art_coll   ON artwork(collection_id, status);
CREATE INDEX IF NOT EXISTS ix_art_cat    ON artwork(category, status);
CREATE INDEX IF NOT EXISTS ix_art_handle ON artwork(shop_handle);

-- 🔗 FK TARGET, not a uniqueness rule. artwork_id is already the PK so this adds no constraint — it
-- exists so `edition` can composite-FK (artwork_id, edition_type) and INHERIT the value rather than
-- copy it. See the chain note below.
CREATE UNIQUE INDEX IF NOT EXISTS ux_art_edtype ON artwork(artwork_id, edition_type);

-- Alternate names. Drives eBay matching and dedupe-on-add. A rename folds the old name in here, which
-- is why a rename never breaks a market match.
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
-- Every artwork has AT LEAST ONE edition; an open-run print gets exactly one with implicit=1. An
-- edition is the physical-INSTANCE layer, not a numbering scheme — a thing that exists has at least
-- one instance whether or not the artist labelled it. That makes copy.edition_id NOT NULL and always
-- satisfiable: one code path, no polymorphic parent, no nullable dual FK.
--
-- 🔗 THE DENORMALIZATION CHAIN (rung 2). `edition_type` is copied DOWN from artwork here, and again
-- from here to `copy`. That would be duplication except every link is a COMPOSITE FK with ON UPDATE
-- CASCADE — so the value cannot be set to anything the parent doesn't already say, and changing
-- `artwork.edition_type` propagates the whole way down on its own. The payoff is on `copy`: a
-- cross-table rule ("a one-of-a-kind cannot be owned six times") collapses into a plain single-table
-- CHECK. Honest cost: two redundant columns, two extra indexes. Worth it, because the alternative was
-- a trigger — rung 3, invisible unless you read the schema.
CREATE TABLE IF NOT EXISTS edition (
  edition_id   TEXT PRIMARY KEY,
  artwork_id   TEXT NOT NULL,
  edition_type TEXT NOT NULL,               -- INHERITED. Never set independently; see the FK below.

  -- The shop's inventory tag ("#4", "7/12"). NULL when implicit. ⚠️ Beckett B7: labels are
  -- SHOP-ASSIGNED and may be reused across relistings — the object she calls #4 today may not be last
  -- year's #4. Never treat a label as durable identity; that is what edition_id is for.
  label        TEXT,

  -- 1 = structural, not real. Created because the artwork exists, not because it was numbered. The UI
  -- must NEVER render an implicit edition as a badge (no "#1" on Luna Moth). If she numbers an open
  -- print later this flips to 0 and gains a label — no migration.
  implicit     INTEGER NOT NULL DEFAULT 0 CHECK (implicit IN (0,1)),

  seq          INTEGER,                     -- numeric sort key parsed from label; NULL if implicit
  size         TEXT,                        -- "3x4" · "6x6"

  -- ⚠️ HARVEST-OWNED. The authored layer must not write this (Beckett B4). Availability is a live
  -- fact; a snapshot of it from whenever a human last edited a file is worse than no value.
  available    INTEGER,                     -- 1 | 0 | NULL = unknown

  -- The shop DELETES a variant when that edition sells, so a gap in surviving labels IS a sale.
  -- Recording it explicitly beats re-deriving it, and survives the listing disappearing.
  sold_out_at  TEXT,

  -- MANDATORY where an image exists (Beckett B4 precondition). R2 bytes are the only genuinely
  -- unrecoverable asset — exports carry image ROWS, not bytes — so the CDN URL is what keeps the
  -- binder from being blank after any rebuild.
  source_url   TEXT,

  notes        TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,

  -- 🔗 rung 2: edition_type cannot disagree with its artwork, and follows it on update.
  FOREIGN KEY (artwork_id, edition_type)
    REFERENCES artwork (artwork_id, edition_type)
    ON DELETE CASCADE ON UPDATE CASCADE,

  -- An implicit edition has no label. The predecessor's phantom "#1" badges came from exactly this
  -- pair being allowed to contradict each other.
  CHECK (implicit = 0 OR label IS NULL),
  CHECK (seq IS NULL OR seq >= 0)
);
CREATE INDEX IF NOT EXISTS ix_ed_art ON edition(artwork_id, seq);
CREATE UNIQUE INDEX IF NOT EXISTS ux_ed_label ON edition(artwork_id, label) WHERE label IS NOT NULL;
-- At most ONE implicit edition per artwork. The guard that stops a loader bug from quietly minting
-- duplicate structural rows on every run.
CREATE UNIQUE INDEX IF NOT EXISTS ux_ed_implicit ON edition(artwork_id) WHERE implicit = 1;

-- 🔗 FK TARGETS (again: no new uniqueness — edition_id is already the PK). These are what let `slot`
-- and `copy` name a parent PAIR instead of a single id, which is the whole trick.
CREATE UNIQUE INDEX IF NOT EXISTS ux_ed_art_pair    ON edition(edition_id, artwork_id);
CREATE UNIQUE INDEX IF NOT EXISTS ux_ed_edtype_pair ON edition(edition_id, edition_type);

-- ============================================================ edition_image
-- Images attach to the EDITION, not the artwork. The opposite of the predecessor, and it falls
-- straight out of Q1: each Brooklyn Ginkgo edition has its OWN photograph because they are visibly
-- different objects. An open artwork has one implicit edition, so its photo lives there. One rule, no
-- special case: a photograph is of an object, and the object is the edition.
CREATE TABLE IF NOT EXISTS edition_image (
  image_id     TEXT PRIMARY KEY,
  edition_id   TEXT NOT NULL REFERENCES edition(edition_id) ON DELETE CASCADE,
  r2_key       TEXT,                        -- NULL = reference-only, renders via CDN passthrough
  source_url   TEXT,
  kind         TEXT NOT NULL DEFAULT 'upload' CHECK (kind IN ('upload','scrub','reference')),
  content_type TEXT,
  bytes        INTEGER,
  sha256       TEXT,                        -- Q8 = A+C: the export's image manifest reads this.
  width        INTEGER,
  height       INTEGER,
  is_primary   INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0,1)),
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
  sort         INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL,
  archived_at  TEXT,

  -- An image row that is neither in R2 nor pointing at a CDN URL renders nothing. Not a record,
  -- litter.
  CHECK (r2_key IS NOT NULL OR source_url IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS ix_img_ed ON edition_image(edition_id, status, sort);
CREATE UNIQUE INDEX IF NOT EXISTS ux_img_primary
  ON edition_image(edition_id) WHERE is_primary = 1 AND status = 'active';

-- ============================================================ copy  (what Michael owns)
-- The physical thing he holds. The only layer that is a FACT rather than a claim.
--
-- Q10 = A: ONE ROW PER ACQUISITION, carrying `qty`. Six Watermelons is one row with qty=6; Brooklyn
-- Ginkgo #4 is its own row at qty=1 against a specific edition. Quantity and identity coexist and
-- nobody types six rows.
--
-- 🔴 THE COST, STATED WHERE IT CANNOT BE MISSED: every ownership count is SUM(qty), NEVER COUNT(*).
-- A COUNT(*) here silently under-reports the moment any row carries qty > 1, and it will look correct
-- in testing because almost every row is 1. That is why `v_owned` exists in ④ views — nobody
-- hand-writes this count. A comment is not a control; a view is.
--
-- NOTE: `disposition` no longer has a 'want' value (it did in v1). A wanted print is a SLOT with no
-- copies — J3. Two ways to say "want" is a duplicate source of truth, and duplicate sources of truth
-- are the disease this rebuild exists to cure.
CREATE TABLE IF NOT EXISTS copy (
  copy_id        TEXT PRIMARY KEY,
  edition_id     TEXT NOT NULL,
  edition_type   TEXT NOT NULL,             -- INHERITED via composite FK. Never set independently.

  disposition    TEXT NOT NULL DEFAULT 'own' CHECK (disposition IN ('own','sold')),
  condition      TEXT,
  framed         INTEGER NOT NULL DEFAULT 0 CHECK (framed IN (0,1)),
  qty            INTEGER NOT NULL DEFAULT 1 CHECK (qty >= 1),
  acquired_price REAL,
  acquired_where TEXT,                      -- vending machine · trade · shop · eBay · gift
  acquired_at    TEXT,
  sold_price     REAL,
  sold_at        TEXT,
  notes          TEXT,
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL,

  -- 🔗 rung 2, and the reason edition_type is carried here at all.
  FOREIGN KEY (edition_id, edition_type)
    REFERENCES edition (edition_id, edition_type)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  -- ⭐ THE PAYOFF: a one-of-a-kind monoprint cannot be owned six times. Because edition_type is
  -- present and provably matches its parent, this cross-table rule collapses into a plain CHECK.
  CHECK (qty = 1 OR edition_type <> 'unique'),

  -- Per-copy detail (condition, price paid, framed) describes ONE object. On a qty>1 row it is
  -- ambiguous by construction — "I paid $18" for six of them means what, exactly? Enforced rather than
  -- documented, because a documented convention is rung 4 pretending to be rung 2.
  CHECK (qty = 1 OR (condition IS NULL AND acquired_price IS NULL AND framed = 0)),

  -- A sold copy has a sale; an owned one doesn't.
  CHECK ((disposition = 'sold' AND sold_at IS NOT NULL)
      OR (disposition = 'own'  AND sold_at IS NULL AND sold_price IS NULL))
);
CREATE INDEX IF NOT EXISTS ix_copy_ed   ON copy(edition_id);
CREATE INDEX IF NOT EXISTS ix_copy_disp ON copy(disposition);

-- ⚠️ ON DELETE RESTRICT above is the schema's one hard refusal. Beckett's requirement: the binder MUST
-- hold a print no feed has ever heard of (vending-machine finds, trades, museum shops), and RESTRICT
-- means the app can never delete an artwork out from under something Michael owns. To record an
-- unknown print, `Enter` creates a placeholder artwork (confidence='placeholder', provenance='owned')
-- + its implicit edition, then the copy. Ownership never depends on a feed having seen the thing.

-- ============================================================ what is NOT here, on purpose
-- copy.location            — no per-object allocation. The shoe-box is DERIVED (J4), and Michael
--                            explicitly cut which-physical-card-is-where as "minimal singular
--                            tracking."
-- copy.disposition='want'  — a want is a slot with no copies. One way to say it, not two.
-- machine / machine_print / machine_event — the location layer. 14 seeded rows in the predecessor,
--                            zero UI ever built. Out of scope (README §6); port when a page needs it.
-- market_point / print_point / gone_event — the old time-series trio. ③ `sighting` replaces all three.
-- catalog / inventory      — dead names. They described sources, not things.
