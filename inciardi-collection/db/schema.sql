-- Inciardi Collection — schema v2 · ① THE SPINE
-- artwork → edition → copy. The three entities everything else hangs off.
--
-- ✅ CANONICAL. Promoted from `.proposed` 2026-07-28 on Michael's go, after the constraint
-- gauntlet returned 22/22 (8 positive controls, 13 violating writes rejected, the trigger, the
-- cascade). This file is one of four — see `db/_index.md` for the set, the APPLY ORDER (which is
-- FK-significant), and the re-runnable test. Files: ① spine (here) · ② binder · ③ market · ④ views.
--
-- ==========================================================================================
-- 🔄 SCHEMA STATE — this file describes the database AFTER both migrations. Rewritten 2026-08-01.
--
--   000-collection-kind.sql        applied by hand      2026-07-31 23:33 ET
--   001-photos-and-groupings.sql   applied by workflow  2026-08-01 16:51:55Z  (sha256 in applied.log)
--
-- ⚠️ THIS FILE IS THE DESTINATION, NOT THE JOURNEY. Build a fresh database from here; NEVER by
-- replaying `db/migrations/`. A migration describes a TRANSITION between two specific states and
-- 000 cannot even be re-run (SQLite has no ADD COLUMN IF NOT EXISTS).
--
-- 🔴 WHY THIS REWRITE EXISTS, kept because the failure will recur: between 16:51 and this commit,
-- this file described a shape the database no longer had. Nothing errored. Nobody was warned. A
-- canonical file does not announce that it has gone stale — it just keeps answering confidently.
-- The migration is the only thing that knew the truth, and a migration is not a place you look.
-- ==========================================================================================
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
--   Q21 → three grouping axes (category · medium · authorship), NONE of them ever required.
--   Q22 → official and personal sets are the same table, split by `collection.kind`.
--   J15 → `image` is the ASSET, `edition_image` is the LINK. Two tables, one name reused correctly.
--   Q20 → an archived photo cannot be a print's primary. Structural, via a composite FK.
-- ==========================================================================================

-- ⚠️ READ BEFORE "CLEANING THIS UP": in D1 the next line is a NO-OP — D1 enforces foreign keys on
-- every query and a user statement CANNOT disable it, because every query runs inside an implicit
-- transaction (see the Cloudflare docs link in `_index.md`). It is kept anyway because it is NOT a
-- no-op in plain sqlite3, where it is the only thing standing between the verification suite and
-- silent non-enforcement. Measured 2026-07-28: with this OFF, 4 of 4 FK-backed rules in this schema
-- evaporate without error — a slot can point at a nonexistent artwork, and an artwork can be deleted
-- out from under a copy. CHECK constraints survive; FOREIGN KEY rules do not. Keep the line.
PRAGMA foreign_keys = ON;

-- ============================================================ collection
-- A named grouping ("Spring", "Richard Scarry", or a pile you invented). NOT the same thing as a
-- binder sheet: a collection is a SET, a sheet is how Michael chose to lay one out. Conflating them
-- would force one sheet per collection forever and break "the same print on two sheets" (J2 ruling 3).
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
  updated_at    TEXT NOT NULL,

  -- Q22a. The official-vs-personal split the table already implied but never named. `roster_size`
  -- was documented as "how many artworks SHOULD be in the set" — an external truth an official
  -- release HAS and a pile you invented does NOT. `kind` says that out loud instead of leaving it
  -- inferred from a NULL.
  --   release | exclusive | collab  → official. May carry a roster_size. Earns the ✓ badge.
  --   personal                      → yours. roster_size is meaningless and refused below.
  kind          TEXT NOT NULL DEFAULT 'personal'
                CHECK (kind IN ('release','exclusive','collab','personal'))
);

-- 🔴 A personal collection has no external truth about its size, so it must not be able to claim
-- one. SQLite cannot ADD a table-level CHECK to an existing table, so this is the trigger-shaped
-- equivalent — rung 3, used exactly where rung 2 is unavailable rather than as a first resort.
--
-- ⚠️ On a FRESH build this could be a plain table-level CHECK, since nothing is being altered. It is
-- deliberately kept as a trigger so this file and the live database (where it arrived via 000 as a
-- trigger) describe the SAME OBJECT. A canonical file that is "cleaner" than production is a
-- canonical file that is wrong.
CREATE TRIGGER IF NOT EXISTS trg_collection_roster
BEFORE INSERT ON collection
WHEN NEW.kind = 'personal' AND NEW.roster_size IS NOT NULL
BEGIN SELECT RAISE(ABORT, 'a personal collection has no roster_size'); END;

-- ============================================================ artwork
-- The creative work. ONE row forever, regardless of how many exist or who is selling one.
-- artwork_id is HAND-WRITTEN and permanent. No generated slugs: `slug("#1")` collapsing to "1" for
-- every product is the exact bug that made all this necessary.
--
-- 🔴 THERE IS NO `collection_id` HERE ANY MORE (001). A print must be able to sit in Richard Scarry
-- AND in your own trade pile at the same time; a singular FK made the entire ask unbuildable.
-- Membership lives in `artwork_collection` below.
CREATE TABLE IF NOT EXISTS artwork (
  artwork_id    TEXT PRIMARY KEY,
  name          TEXT NOT NULL,              -- display only; free to change, never identity
  artist        TEXT NOT NULL DEFAULT 'Anastasia Inciardi',  -- Alex · Jana · Jules also appear

  -- ⭐ THREE AXES, AND THE RULE THAT KEEPS THEM COMFORTABLE (Q21 → A+B+D, Michael: "i think i want
  -- it all comfortably"). `category` · `medium` · `authorship` are three DIFFERENT questions that
  -- were previously fighting over one field. They only stay comfortable if NONE is ever required:
  -- all nullable, no CHECK on any of them, and ENTRY NEVER ASKS FOR THEM. A print is recorded with
  -- a name, exactly as it always was. A taxonomy you must complete is a taxonomy you abandon.

  -- FORMAT ONLY — how big is it. DEFAULTS TO 'mini' (Michael, 2026-07-29): v1 scope is mini prints,
  -- so recording a print he just picked up must never require saying that it is one. Left NULLABLE
  -- rather than NOT NULL: a placeholder artwork born from a market sighting may genuinely not know
  -- its category, and stamping 'mini' on it would be the schema asserting something nobody verified.
  --
  -- ⚠️ VOCABULARY, NOT ENFORCEMENT. Q21 narrowed this to `mini | big | pack` and moved `linocut` /
  -- `big-riso` out to `medium` — but there is no CHECK here (deliberately; the vocabulary will grow
  -- and a CHECK turns every new value into a table rebuild for no correctness gain), and 001 did NOT
  -- rewrite any rows. Existing rows may still carry retired values. UNVERIFIED against live data as
  -- of 2026-08-01; a data pass is owed, and until it runs do not read this comment as a guarantee.
  category      TEXT DEFAULT 'mini',        -- mini | big | pack

  -- ⭐NEW (001). HOW IT WAS MADE. This is the field `category` was being asked to hold and could not:
  -- a size field cannot carry a medium. No CHECK — riso, linocut, letterpress, and whatever she tries
  -- next.
  medium        TEXT,                       -- linocut | riso | letterpress | ...

  -- ⭐NEW (001). WHOSE DRAWING. Splits the Richard Scarry work from her own on the axis that actually
  -- differs, which is what stopped `richard-scarry` needing to live in two fields at once.
  authorship    TEXT,                       -- hers | licensed | collab

  -- DISTRIBUTION — where you can get it. Narrowed by Q21 from the grab-bag it had become.
  -- 🔴 `richard-scarry` IS NO LONGER A LEGAL VALUE HERE. It appeared under both `exclusive` and the
  -- old `collection_id`, and the collision is resolved by REMOVAL, not by a rule: Scarry is a
  -- COLLECTION (kind='collab') plus authorship='licensed'. Two facts, two homes. A rule saying
  -- "don't put it there" is rung 4; deleting the value from the vocabulary is rung 2.
  -- ⚠️ Same honesty flag as `category`: no CHECK, no row rewrite in 001, so a legacy row may still
  -- carry it. Unverified against live data.
  exclusive     TEXT,                       -- nyc | lacma | grand-central | holiday

  -- Domain Dara's distinction. "#4" and "7/12" are NOT the same kind of number:
  --   unique  = monoprint. Each numbered object genuinely differs. "#7 sold" = gone forever.
  --   limited = run of N near-identical impressions. "#7 sold" = N-1 remain, any one satisfies.
  --   open    = reprinted freely. Owning one = owning the artwork.
  -- Without this the binder cannot answer "is my Watermelon complete?", the single question a binder
  -- exists to answer. It is ALSO what stops six copies of a one-of-a-kind being recorded — see the
  -- denormalization chain on `edition`.
  --
  -- ⚠️ NOT the same field as `category`. A mini print is a SIZE/FORMAT; open vs limited vs unique is
  -- how many objects exist. Most minis are 'open', but Brooklyn Ginkgo is a mini AND 'unique'. Keeping
  -- the default 'open' is right for the common case and does not follow from category.
  edition_type  TEXT NOT NULL DEFAULT 'open' CHECK (edition_type IN ('unique','limited','open')),
  edition_of    INTEGER,                    -- known run length; NULL if unknown

  retail        REAL,                       -- DOLLARS. Never cents. A /100 here cost a whole day.
  shop_handle   TEXT,                       -- Shopify handle: the enrichment join. Survives renames.

  -- Provenance is the actual protection against a feed overwriting hand-entered truth. It is NOT the
  -- file's location in git — that conflation is corrected in README §3 (Q4).
  provenance    TEXT NOT NULL DEFAULT 'manual'
                CHECK (provenance IN ('manual','pack-roster','shop-product','owned','market','seed')),

  -- Honest uncertainty, rendered rather than hidden. A registry that conceals its own gaps is how the
  -- harvest earned its distrust.
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
-- ⚠️ `ix_art_coll ON artwork(collection_id, status)` was DROPPED by 001 along with the column.
-- Its replacement is `ix_ac_coll` on the join table below. Do not resurrect it.
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

-- ============================================================ artwork_collection  (001)
-- Set membership. THE THIRD INSTANCE of a pattern this app already runs twice — `slot` is the
-- many-to-many between sheets and artworks, and `edition_image` below is the same move for images.
-- A fold-in of an established shape, not a net-new concept.
--
-- Replaces the singular `artwork.collection_id`, which could not express the actual requirement:
-- one print in an official release AND in a personal trade pile at the same time.
CREATE TABLE IF NOT EXISTS artwork_collection (
  artwork_id    TEXT NOT NULL REFERENCES artwork(artwork_id)       ON DELETE CASCADE,
  collection_id TEXT NOT NULL REFERENCES collection(collection_id) ON DELETE CASCADE,
  sort          INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL,
  PRIMARY KEY (artwork_id, collection_id)   -- the same print twice in one set: impossible
);
CREATE INDEX IF NOT EXISTS ix_ac_coll ON artwork_collection(collection_id, sort);

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
-- ⭐ THIS IS ALSO WHERE A REPRINT LIVES. A 2026 second printing, or an "oops" misprint, is a
-- genuinely different object from the original — so it is an `edition` with `label = '2nd printing'`
-- and `implicit = 0`. Zero schema change. ⚠️ `ux_ed_implicit` allows at most ONE implicit edition per
-- artwork, so a second printing MUST be explicit and labelled; the auto-trigger cannot mint it.
-- 🚫 The word `release` is reserved for `collection.kind` and must never be spent on this.
--
-- 🔗 THE DENORMALIZATION CHAIN (rung 2). `edition_type` is copied DOWN from artwork here, and again
-- from here to `copy`. That would be duplication except every link is a COMPOSITE FK with ON UPDATE
-- CASCADE — so the value cannot be set to anything the parent doesn't already say, and changing
-- `artwork.edition_type` propagates the whole way down on its own. VERIFIED 2026-07-28: one UPDATE at
-- the top reached both children. The payoff is on `copy`: a cross-table rule ("a one-of-a-kind cannot
-- be owned six times") collapses into a plain single-table CHECK. Honest cost: two redundant columns,
-- two extra indexes. Worth it, because the alternative was a trigger — rung 3, invisible unless you
-- read the schema.
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

-- ============================================================ image  (001) — THE ASSET
-- J15. A photograph is a THING. It exists the moment it is uploaded, with ZERO links, and that is
-- the entire point: capture and assignment are decoupled, so 200 prints can be photographed in one
-- sitting and sorted later.
--
-- THE PLACEMENT TEST, and it decides every future field on either table:
--   does this fact change if the same photo is attached to a DIFFERENT edition?
--     No  → it belongs here, on the asset.   (bytes, dimensions, caption, who shot it, when)
--     Yes → it belongs on the link below.    (is it the primary FOR THIS PRINT, sort order)
--
-- ⚠️ MUST BE DEFINED ABOVE `edition_image`: the link composite-FKs into it, and this file's order is
-- FK-significant.
CREATE TABLE IF NOT EXISTS image (
  image_id     TEXT PRIMARY KEY,
  r2_key       TEXT,                        -- ed/<edition_id>/<sha256>.jpg — content-addressed
  source_url   TEXT,                        -- NULL r2_key = reference-only, renders via CDN passthrough
  kind         TEXT NOT NULL DEFAULT 'upload' CHECK (kind IN ('upload','scrub','reference')),
  content_type TEXT,
  bytes        INTEGER,
  sha256       TEXT,
  width        INTEGER,
  height       INTEGER,

  -- yours to edit
  caption      TEXT,
  subject      TEXT,     -- single | pack | detail | packaging | in-situ | reference. No CHECK.
  credit       TEXT,     -- you | anastasia | other
  -- 🔴 READ FROM EXIF **BEFORE** THE CANVAS RE-ENCODE. The re-encode kills HEIC, fixes rotation and
  -- strips GPS — and destroys the capture date permanently on the way past. There is no second
  -- chance at this value and no way to detect afterwards that it was lost.
  shot_at      TEXT,

  -- 🔴 ARCHIVE, NEVER DELETE. R2 bytes are not covered by D1 Time Travel, so a hard delete is the one
  -- genuinely unrecoverable action in this app.
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
  created_at   TEXT NOT NULL,
  archived_at  TEXT,

  -- An image neither in R2 nor pointing at a CDN renders nothing. Litter, not a record.
  CHECK (r2_key IS NOT NULL OR source_url IS NOT NULL),

  -- 🔗 FK TARGET, not a uniqueness claim — image_id is already the PK, so this adds no constraint.
  -- It exists so the link below can INHERIT status instead of copying it.
  UNIQUE (image_id, status)
);
CREATE INDEX IF NOT EXISTS ix_image_status ON image(status, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS ux_image_sha ON image(sha256) WHERE sha256 IS NOT NULL;

-- ============================================================ edition_image  (001) — THE LINK
-- Images attach to the EDITION, not the artwork. It falls straight out of Q1: each Brooklyn Ginkgo
-- edition has its OWN photograph because they are visibly different objects. An open artwork has one
-- implicit edition, so its photo lives there. One rule, no special case: a photograph is of an
-- object, and the object is the edition.
--
-- ⚠️ THE NAME IS REUSED ON PURPOSE, AND THIS TABLE IS NOT WHAT IT USED TO BE. Before 001 this WAS the
-- asset (bytes, dimensions, sha256, all of it). `edition_image` was always the right name for a join
-- table; it was only ever the asset because nothing had forced the question. Anything written against
-- the pre-001 shape — a route, an export, a query in a notebook — is broken and will not say so.
CREATE TABLE IF NOT EXISTS edition_image (
  edition_id TEXT NOT NULL REFERENCES edition(edition_id) ON DELETE CASCADE,
  image_id   TEXT NOT NULL,
  status     TEXT NOT NULL,               -- INHERITED. Never set independently.
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0,1)),
  sort       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  PRIMARY KEY (edition_id, image_id),

  -- 🔗 Q20 → B, and the whole reason status is duplicated onto the link. The same trick the schema
  -- already runs on edition_type: the link's status CANNOT disagree with the asset's, and follows it
  -- on update.
  FOREIGN KEY (image_id, status)
    REFERENCES image (image_id, status)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ⭐ THE GUARD, KEPT STRUCTURAL. A partial index can only see its OWN table's columns — so without
-- the denormalized `status` above, the `active` half of this predicate would silently stop existing,
-- and an ARCHIVED photo could remain a print's primary image. Fifth encounter with that defect class
-- in this app; the first one refused at design time rather than patched afterwards.
CREATE UNIQUE INDEX IF NOT EXISTS ux_img_primary
  ON edition_image(edition_id) WHERE is_primary = 1 AND status = 'active';
CREATE INDEX IF NOT EXISTS ix_ei_image ON edition_image(image_id);
CREATE INDEX IF NOT EXISTS ix_ei_ed    ON edition_image(edition_id, sort);

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
-- NOTE: `disposition` has no 'want' value. A wanted print is a SLOT with no copies — J3. Two ways to
-- say "want" is a duplicate source of truth, and duplicate sources of truth are the disease this
-- rebuild exists to cure.
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
  -- VERIFIED 2026-07-28: rejected.
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
-- unknown print, entry creates a placeholder artwork (confidence='placeholder', provenance='owned')
-- + its implicit edition, then the copy. Ownership never depends on a feed having seen the thing.

-- ============================================================ what is NOT here, on purpose
-- artwork.collection_id    — REMOVED by 001. Membership is `artwork_collection`, many-to-many, because
--                            a print can be in an official release and a personal pile at once.
-- copy.location            — no per-object allocation. The shoe-box is DERIVED (J4), and Michael
--                            explicitly cut which-physical-card-is-where as "minimal singular
--                            tracking."
-- copy.disposition='want'  — a want is a slot with no copies. One way to say it, not two.
-- a `release` table        — a printing run is already an `edition` (see the ⭐ note there). The word
--                            `release` belongs to `collection.kind` and is deliberately not spent here.
-- image tags / crop / per-image visibility / filenames — J16, out of scope.
-- machine / machine_print / machine_event — the location layer. 14 seeded rows in the predecessor,
--                            zero UI ever built. Out of scope (README §7); port when a page needs it.
-- market_point / print_point / gone_event — the old time-series trio. ③ `sighting` replaces all three.
-- catalog / inventory      — dead names. They described sources, not things.
