-- Inciardi Collection — migration 001 · PHOTOS + GROUPINGS, one pass
--
-- Source: `inciardi-collection/next-build-spec.md` §4, with one CORRECTION (below).
-- Decisions: J15 · J17 · J18 · J19 · Q17 · Q19 · Q20 · Q21 · Q22.
-- Prerequisite: 000 (applied by hand 2026-07-31 23:33 ET).
--
-- ============================================================================
-- 🔴 THIS IS ONE PASS ON PURPOSE. DO NOT SPLIT IT BACK APART.
--
-- Two parallel sessions designed two independent schema changes to this same empty
-- database on 2026-07-31, each justified by the identical argument: "the table is
-- empty, so the migration is free today." Neither knew about the other's tables.
-- Merged here before either was applied. Splitting them again recreates the exact
-- collision — two db/ rewrites that each look correct in isolation.
-- ============================================================================
--
-- ============================================================================
-- ⚠️ CORRECTION TO THE SPEC — the migration as published COULD NOT RUN.
--
-- §4 orders `ALTER TABLE artwork DROP COLUMN collection_id` with no mention of the
-- views. SQLite refuses it:
--     error in view v_shoebox after drop column: no such column: collection_id
-- Confirmed live in the D1 console, 2026-07-31 ~21:41 ET.
--
-- ROOT CAUSE, worth more than the fix: §4 was authored against `db/schema.sql` and
-- never cross-read against `db/views.sql`. The spec's own §1 carefully measured the
-- TABLES for emptiness and never asked what else NAMES the column. A dependency check
-- that only looks at tables is not a dependency check.
--
-- WHY THE FIX IS CHEAP, and it is luck rather than design: `v_shoebox` has been
-- documented UNUSED since 2026-07-30 — the worker's `GET /shoebox` carries the live
-- query, because a view migration would break the app in the gap between a code
-- deploy and a hand-run console step. The view survives only as the positive-control
-- fixture from the 07-28 verification. Had it still been load-bearing, dropping it
-- mid-migration would have taken the binder down.
--
-- It is dropped and rebuilt WITHOUT the retired column, inside this same atomic pass,
-- so there is no window where the fixture is missing.
--
-- ⚠️ AND THE GENERALIZABLE BIT: `v_shoebox` was verified to be the ONLY claimant by
-- reading `db/schema.sql` and `db/views.sql` in full at HEAD. The sole other reference
-- to the column is `ix_art_coll`, dropped below. Any future DROP COLUMN in this app
-- must grep the views first.
-- ============================================================================
--
-- ⚠️ EVERY DROP HERE IS SAFE ONLY BECAUSE THE TABLES WERE MEASURED EMPTY.
-- Verified in the D1 console 2026-07-31 23:23 ET, immediately before this pass:
--     collections 0 · artworks_with_collection 0 · edition_images 0
-- The window shuts the moment either feature is USED — the first collection created,
-- the first photo uploaded. If you are reading this later, re-measure before running.
-- The workflow's applied.log guard should make that impossible, but a guard you have
-- not personally seen fire is a guard you are trusting, not one you have tested.


-- ============================================================ ① GROUPINGS

-- Dropped FIRST because it holds a reference to the column removed below. Rebuilt at
-- the end of this section. See the CORRECTION block above.
DROP VIEW IF EXISTS v_shoebox;

-- Two new OPTIONAL axes. Q21 → A + B + D, on Michael's note "i think i want it all
-- comfortably?"
--
-- ⭐ "COMFORTABLY" IS READ AS A BINDING CONSTRAINT, NOT A MOOD, and it is the reason
-- there is no CHECK and no NOT NULL on either of these. Three axes only stay
-- comfortable if NONE is ever required: all nullable, no CHECK on any, and entry never
-- asks for them. A print is still recorded with a name, exactly as today.
-- A taxonomy you must complete is a taxonomy you abandon — three required axes would
-- have delivered the precise opposite of what was asked for.
--
-- No CHECK for a second reason too, identical to `category`'s own comment: the
-- vocabulary will grow, and a CHECK turns every new value into a table rebuild for no
-- correctness gain.
ALTER TABLE artwork ADD COLUMN medium     TEXT;   -- linocut | riso | letterpress | ...
ALTER TABLE artwork ADD COLUMN authorship TEXT;   -- hers | licensed | collab

-- Retire the singular FK. A print must be able to sit in Richard Scarry AND in your
-- own trade pile; one `collection_id` makes the entire ask unbuildable. Safe because
-- every row is NULL.
DROP INDEX IF EXISTS ix_art_coll;
ALTER TABLE artwork DROP COLUMN collection_id;

-- The join. THIRD instance of a pattern this app already runs twice — `slot` is the
-- many-to-many between sheets and artworks (J2 ruling 3 explicitly protects "the same
-- print on two sheets"), and `edition_image` below is the same move for images. This
-- is a fold-in of an established shape, not a net-new concept.
CREATE TABLE IF NOT EXISTS artwork_collection (
  artwork_id    TEXT NOT NULL REFERENCES artwork(artwork_id)       ON DELETE CASCADE,
  collection_id TEXT NOT NULL REFERENCES collection(collection_id) ON DELETE CASCADE,
  sort          INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL,
  PRIMARY KEY (artwork_id, collection_id)   -- the same print twice in one set: impossible
);
CREATE INDEX IF NOT EXISTS ix_ac_coll ON artwork_collection(collection_id, sort);

-- Rebuilt identically MINUS `a.collection_id`. Nothing else changed — deliberately not
-- "improved" while it is open, because a rebuild commit is exactly where a quiet
-- behavioural edit hides.
--
-- ⚠️ Plain CREATE VIEW, not CREATE VIEW IF NOT EXISTS: the DROP above guarantees it is
-- gone, and IF NOT EXISTS would silently no-op if it somehow were not — leaving the OLD
-- definition, naming a column that no longer exists, and failing at read time instead
-- of here.
CREATE VIEW v_shoebox AS
SELECT
  a.artwork_id,
  a.name,
  a.category,
  a.confidence,
  o.qty_owned,
  o.editions_owned
FROM artwork a
JOIN v_owned o ON o.artwork_id = a.artwork_id
WHERE o.qty_owned > 0
  AND a.status = 'active'
  AND NOT EXISTS (SELECT 1 FROM slot s WHERE s.artwork_id = a.artwork_id);


-- ============================================================ ② PHOTOS

-- The ASSET. Exists with ZERO links — that is the entire point of J15.
-- Placement test: does this fact change if the same photo is attached to a different
-- edition? No → it belongs here. Yes → it belongs on the link.
CREATE TABLE IF NOT EXISTS image (
  image_id     TEXT PRIMARY KEY,
  r2_key       TEXT,
  source_url   TEXT,
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
  -- 🔴 READ FROM EXIF **BEFORE** THE CANVAS RE-ENCODE. The re-encode kills HEIC, fixes
  -- rotation and strips GPS — and destroys the capture date permanently on the way past.
  shot_at      TEXT,

  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
  created_at   TEXT NOT NULL,
  archived_at  TEXT,

  -- An image neither in R2 nor pointing at a CDN renders nothing. Litter, not a record.
  CHECK (r2_key IS NOT NULL OR source_url IS NOT NULL),

  -- 🔗 FK TARGET, not a uniqueness claim — image_id is already the PK, so this adds no
  -- constraint. It exists so the link below can INHERIT status instead of copying it.
  UNIQUE (image_id, status)
);
CREATE INDEX IF NOT EXISTS ix_image_status ON image(status, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS ux_image_sha ON image(sha256) WHERE sha256 IS NOT NULL;

-- The LINK. Same table name on purpose: `edition_image` was ALWAYS the right name for a
-- join table; it was only ever the asset because nothing had forced the question.
--
-- 🔴 DROP TABLE IS FREE TODAY AND CATASTROPHIC LATER. 0 rows, measured. This single
-- statement is why `applied.log` refuses a second run of this file.
DROP INDEX IF EXISTS ux_img_primary;
DROP INDEX IF EXISTS ix_img_ed;
DROP TABLE IF EXISTS edition_image;

CREATE TABLE edition_image (
  edition_id TEXT NOT NULL REFERENCES edition(edition_id) ON DELETE CASCADE,
  image_id   TEXT NOT NULL,
  status     TEXT NOT NULL,               -- INHERITED. Never set independently.
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0,1)),
  sort       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  PRIMARY KEY (edition_id, image_id),

  -- 🔗 Q20 → B, and the whole reason status is duplicated onto the link. The same trick
  -- the schema already runs on edition_type: the link's status CANNOT disagree with the
  -- asset's, and follows it on update.
  FOREIGN KEY (image_id, status)
    REFERENCES image (image_id, status)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ⭐ THE GUARD, KEPT STRUCTURAL. A partial index can only see its OWN table's columns —
-- so without the denormalized `status` above, the `active` half of this predicate would
-- silently stop existing, and an ARCHIVED photo could remain a print's primary image.
-- Fifth encounter with that defect class in this app; the first one refused at design
-- time rather than patched afterwards.
CREATE UNIQUE INDEX ux_img_primary
  ON edition_image(edition_id) WHERE is_primary = 1 AND status = 'active';
CREATE INDEX ix_ei_image ON edition_image(image_id);
CREATE INDEX ix_ei_ed    ON edition_image(edition_id, sort);
