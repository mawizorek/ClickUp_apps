-- Inciardi Collection — schema v2 · ② THE BINDER
-- binder → sheet → slot. The digital twin of the physical object.
--
-- ✅ CANONICAL. Promoted 2026-07-28. Apply AFTER ① spine (`schema.sql`) — slot has foreign keys into
-- artwork and edition. Full set and order: `db/_index.md`.
--
-- WHAT THIS IS, in Michael's words:
--   "I have an existing physical binder of card sheets — 3x3 cards with double sided pages for a real
--    flip through experience. v1 of the app could be a faithful recreation of the physical binder
--    using real sorted catalog data, and serves as the real planning and positioning interface of the
--    binder. I can tack a slot as a print I have, one I know I want, or even just comment on a page.
--    And we then begin to title and order pages."
--
-- VOCABULARY (Q11 = A, locked): the binder holds SHEETS · each sheet has two SIDES · each side has
-- nine SLOTS. "Sheet 3, side B, slot 5." The word "page" is reserved for app routes (`pages/*.html`)
-- and is never used for binder structure — a binder page and an app page in one codebase is a
-- collision that costs real confusion later.
--
-- AND THE REFRAME THAT MADE THIS TABLE EXIST AT ALL (J2): the binder is not a view over the catalog,
-- it IS the catalog entry surface. A slot card is a gridded "enter or edit one print." Michael: "why
-- are they so different tho?" They aren't.

-- ⚠️ No-op in D1 (enforcement is on and unswitchable); load-bearing in local sqlite3. See the long
-- note at the top of `schema.sql` before removing it.
PRAGMA foreign_keys = ON;

-- ============================================================ binder
-- More than one binder is plausible (minis vs bigs), so this is a real table rather than an implied
-- singleton. Cheap now, awkward to retrofit.
CREATE TABLE IF NOT EXISTS binder (
  binder_id  TEXT PRIMARY KEY,
  name       TEXT NOT NULL,                 -- "Mini Prints"
  notes      TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- ============================================================ sheet
-- One physical sheet protector. Titled and ordered BY MICHAEL — he named both explicitly as v1 work:
-- "we then begin to title and order pages."
--
-- `title` is free text and `collection_id` is an optional HINT, not a rule. A sheet may mix sets, hold
-- a theme, or be titled "trades" and mean it. Binding a sheet to a collection would quietly forbid
-- the way Michael actually arranges a binder.
CREATE TABLE IF NOT EXISTS sheet (
  sheet_id      TEXT PRIMARY KEY,
  binder_id     TEXT NOT NULL REFERENCES binder(binder_id) ON DELETE CASCADE,
  title         TEXT,
  collection_id TEXT REFERENCES collection(collection_id) ON DELETE SET NULL,
  sheet_order   INTEGER NOT NULL,           -- position in the binder, 0-based
  notes         TEXT,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL,

  -- rung 2: two sheets cannot claim the same position in one binder. Reordering is a transaction of
  -- updates, not a hope. ⚠️ BUILD NOTE: reordering needs a temporary negative-offset pass, because a
  -- naive "shift everything down" collides with this constraint mid-flight.
  UNIQUE (binder_id, sheet_order),
  CHECK (sheet_order >= 0)
);
CREATE INDEX IF NOT EXISTS ix_sheet_binder ON sheet(binder_id, sheet_order);

-- ============================================================ slot
-- ONE POCKET ON ONE SIDE OF ONE SHEET. Nine per side, two sides per sheet, eighteen per sheet.
--
-- 🔴 J3, THE LOAD-BEARING RULE: A SLOT STORES PLACEMENT AND NOTHING ELSE. There is no `state` column
-- and there must never be one. owned / wanted / empty are DERIVED at read time (rung 1) from whether
-- the placed artwork has any copies. A slot storing state='owned' would be a second source of truth
-- for a fact `copy` already owns, and two surfaces claiming one fact is precisely the disease that
-- produced the predecessor's phantom duplicates.
--
--   EMPTY  = NO ROW. The UI renders nine positions; absence is the empty slot. Rows are SPARSE —
--            never pre-seed 18 rows per sheet. Absence is legal and meaningful.
--   OWNED  = derived: slot has an artwork AND that artwork has >=1 copy.
--   WANTED = derived: slot has an artwork and ZERO copies. The ghosted slot. This IS the visible-gap
--            feature, and it costs no storage. VERIFIED 2026-07-28.
--   NOTE   = STORED: artwork_id NULL + note text. The only reason artwork_id is nullable.
--
-- Marking a slot owned is an INPUT, not a state change: tapping "I have this" writes a `copy` row and
-- the slot fills as a consequence. Minimal singular tracking, nothing recorded twice. This is J2
-- ruling 4 (a card is an input surface) applied to ownership.
CREATE TABLE IF NOT EXISTS slot (
  slot_id    TEXT PRIMARY KEY,
  sheet_id   TEXT NOT NULL REFERENCES sheet(sheet_id) ON DELETE CASCADE,
  side       TEXT NOT NULL CHECK (side IN ('A','B')),
  position   INTEGER NOT NULL CHECK (position BETWEEN 0 AND 8),   -- 3x3, reading order

  -- Q12 = B. The artwork is what the card renders and what makes the slot placeable. `edition_id` is
  -- set ONLY when Michael cares which impression is physically in the sleeve — so a Watermelon slot
  -- stays generic while the Ginkgo slot can read "#4". NULL is the NORMAL case, not a degraded one.
  -- This is what keeps "place a print I haven't identified yet" possible; edition-always would have
  -- broken it.
  artwork_id TEXT,
  edition_id TEXT,

  note       TEXT,                          -- a slot may be note-only: no artwork, just a comment
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  -- rung 2: two prints cannot occupy one slot. The most basic lie a binder app could tell.
  UNIQUE (sheet_id, side, position),

  FOREIGN KEY (artwork_id) REFERENCES artwork(artwork_id) ON DELETE RESTRICT,

  -- ⭐ THE COMPOSITE FK THAT SOLVES Q12. The risk: a slot naming Watermelon while pointing at a Ginkgo
  -- edition — two pointers, free to disagree. It LOOKS like it needs a cross-table CHECK, which SQLite
  -- cannot express. It doesn't. By naming the PAIR, an edition belonging to a different artwork is not
  -- a validation failure, it is an UNWRITEABLE ROW. No trigger, no application discipline, no
  -- integrity sweep. Cost: one redundant unique index on the parent. VERIFIED 2026-07-28: rejected.
  FOREIGN KEY (edition_id, artwork_id)
    REFERENCES edition (edition_id, artwork_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  -- An edition without its artwork is a half-named slot.
  CHECK (edition_id IS NULL OR artwork_id IS NOT NULL),
  -- A row naming nothing and saying nothing is an EMPTY slot, which is represented by having no row.
  CHECK (artwork_id IS NOT NULL OR note IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS ix_slot_sheet ON slot(sheet_id, side, position);
-- The reverse lookup that makes J2 ruling 2 free: "where else does this artwork appear in the binder?"
CREATE INDEX IF NOT EXISTS ix_slot_art   ON slot(artwork_id);

-- ============================================================ two deliberate non-constraints
--
-- 1. DUPLICATE PLACEMENT IS ALLOWED. The same artwork MAY sit in several slots (J2 ruling 3), so there
--    is intentionally no UNIQUE on artwork_id. Beckett's objection — own one Watermelon, place it
--    three times, all three read OWNED — is ACCEPTED as known imprecision, not a bug: the binder is a
--    layout and planning surface, and per-object allocation is exactly what Michael cut. The truth
--    stays one tap away because the card shows owned count AND every placement.
--    🔴 REQUIREMENT THAT FALLS OUT AND MUST REACH THE UI: that badge reads "own 1 · placed 3", never a
--    bare "3". The imprecision is only acceptable while it is legible. `v_slot` returns qty_owned and
--    placed_count separately for exactly this reason — verified 2026-07-28.
--
-- 2. NO CONSTRAINT SAYS A SHEET HAS 18 SLOTS. Sparse rows mean a brand-new sheet has zero rows and is
--    still a valid nine-up sheet on both sides. The 3x3 grid is a RENDERING fact, enforced by
--    `position BETWEEN 0 AND 8` and nothing else. Do not add a trigger that materializes 18 empty
--    rows; absence is the empty state.
