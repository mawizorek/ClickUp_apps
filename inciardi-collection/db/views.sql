-- Inciardi Collection — schema v2 · ④ THE DERIVED LAYER
-- Views (rung 1) and the one trigger we actually need (rung 3).
--
-- ✅ CANONICAL. Promoted 2026-07-28. Apply LAST, after ① spine, ② binder, ③ market. `db/_index.md`.
--
-- ==========================================================================================
-- WHY THIS FILE IS THE MOST IMPORTANT ONE.
--
-- J3 and J4 are implemented HERE, not in the tables. owned / wanted / empty / shoe-box are all
-- DERIVED, which is rung 1 of the ladder: a computed fact cannot disagree with itself. Every one of
-- these could have been a stored column, and every one of them would eventually have drifted from
-- `copy` — which is exactly how the predecessor produced phantom duplicates.
--
-- If a future pass is tempted to "just add a state column for speed": the whole dataset is a few
-- hundred rows. There is no performance argument. There is only the correctness one.
-- ==========================================================================================

-- ============================================================ v_owned
-- 🔴 THE REASON THIS VIEW EXISTS. Q10 = A gave `copy` a `qty` column, which means every ownership
-- count is SUM(qty) and NEVER COUNT(*). A COUNT(*) silently under-reports the moment any row carries
-- qty > 1, and it looks correct in testing because almost every row is 1 — a bug that passes review,
-- passes QA, and is wrong in production.
--
-- The rule was going to be a DDL comment. Comments do not execute. So: nobody hand-writes this count.
-- Every surface that needs "how many do I own" reads this view. That moves the rule from rung 5 (hope
-- someone read the comment) to rung 1 (the correct query is the only convenient one).
CREATE VIEW IF NOT EXISTS v_owned AS
SELECT
  e.artwork_id                                        AS artwork_id,
  COALESCE(SUM(CASE WHEN c.disposition = 'own' THEN c.qty END), 0) AS qty_owned,
  COUNT(CASE WHEN c.disposition = 'own' THEN 1 END)    AS acquisition_rows,
  COUNT(DISTINCT CASE WHEN c.disposition = 'own' THEN c.edition_id END) AS editions_owned,
  COALESCE(SUM(CASE WHEN c.disposition = 'sold' THEN c.qty END), 0)     AS qty_sold
FROM edition e
LEFT JOIN copy c ON c.edition_id = e.edition_id
GROUP BY e.artwork_id;

-- `acquisition_rows` is deliberately exposed next to `qty_owned` so the difference between "6 prints"
-- and "6 separate acquisitions" is visible rather than guessable. They are different facts and the UI
-- should never conflate them.

-- ============================================================ v_slot
-- J3 made concrete. A slot row carries no state; this is where state comes from.
--
--   note    → no artwork, just a comment
--   owned   → artwork placed, and at least one copy exists
--   wanted  → artwork placed, zero copies. THE GHOSTED SLOT. This is the visible-gap feature.
--
-- EMPTY is absent on purpose: an empty slot has NO ROW, so it cannot appear in a view over rows. The
-- UI renders nine positions per side and fills from this view; whatever is missing is empty. That
-- asymmetry is the design, not an oversight.
CREATE VIEW IF NOT EXISTS v_slot AS
SELECT
  s.slot_id,
  s.sheet_id,
  s.side,
  s.position,
  s.artwork_id,
  s.edition_id,
  s.note,
  a.name          AS artwork_name,
  a.edition_type,
  a.confidence,
  ed.label        AS edition_label,
  ed.implicit     AS edition_implicit,
  CASE
    WHEN s.artwork_id IS NULL                THEN 'note'
    WHEN COALESCE(o.qty_owned, 0) > 0        THEN 'owned'
    ELSE                                          'wanted'
  END             AS state,
  COALESCE(o.qty_owned, 0) AS qty_owned,
  -- J2 ruling 2 + Beckett's accepted imprecision: the UI needs BOTH numbers so the badge can read
  -- "own 1 · placed 3" instead of a bare "3". Placing one owned print in three slots is allowed;
  -- pretending you own three is not.
  (SELECT COUNT(*) FROM slot s2 WHERE s2.artwork_id = s.artwork_id) AS placed_count
FROM slot s
LEFT JOIN artwork a  ON a.artwork_id  = s.artwork_id
LEFT JOIN edition ed ON ed.edition_id = s.edition_id
LEFT JOIN v_owned o  ON o.artwork_id  = s.artwork_id;

-- ============================================================ v_binder_spread
-- Style Stu's requirement, and it is a READ-MODEL shape rather than a CSS problem: "a real binder opens
-- to a SPREAD — the back of one sheet facing the front of the next. An app that shows one side at a
-- time is a grid with pagination, not a binder."
--
-- So sides are enumerated as a single ordered sequence across the whole binder: sheet 0 side A, sheet 0
-- side B, sheet 1 side A… `spread_index` pairs them the way the physical object does — B of sheet N
-- faces A of sheet N+1. Traversable in both directions, stable under reordering.
CREATE VIEW IF NOT EXISTS v_binder_spread AS
SELECT
  sh.binder_id,
  sh.sheet_id,
  sh.title,
  sh.sheet_order,
  sd.side,
  (sh.sheet_order * 2) + CASE sd.side WHEN 'A' THEN 0 ELSE 1 END AS side_index,
  -- side 0 (sheet 0 side A) sits alone on the right, like the first page of a book. After that, every
  -- spread is an odd side on the left facing the next even side on the right.
  ((sh.sheet_order * 2) + CASE sd.side WHEN 'A' THEN 0 ELSE 1 END + 1) / 2 AS spread_index
FROM sheet sh
CROSS JOIN (SELECT 'A' AS side UNION ALL SELECT 'B') sd;

-- ============================================================ v_shoebox
-- J4. Michael: "we need an unhoused shoe-box of prints (this exists in real-life too)."
--
-- This is not a tray invented to catch orphans — it is a REAL PLACE he owns, which is what makes the
-- binder the CURATED part of the collection rather than all of it. A print lives in the box until it
-- earns a slot.
--
-- Derived, like everything else: owned artworks with zero placements. No `location` column, nothing
-- written twice. VERIFIED 2026-07-28 with a POSITIVE control — an owned-but-unplaced artwork must
-- appear by name. (Its first test returned zero rows, which proves nothing: zero rows is also what a
-- broken view returns.)
--
-- ⚠️ INHERITED IMPRECISION, NAMED SO NOBODY REDISCOVERS IT AS A BUG: own six Watermelons, place one,
-- and Watermelon does NOT appear here — even though five are physically in the box. That is correct
-- under J3/J4: allocation is exactly what Michael cut. This view answers "what have I not placed AT
-- ALL?", never "how many of these are in the box?" If the second question ever matters, it is a schema
-- change (per-copy location), not a tweak to this view.
CREATE VIEW IF NOT EXISTS v_shoebox AS
SELECT
  a.artwork_id,
  a.name,
  a.collection_id,
  a.category,
  a.confidence,
  o.qty_owned,
  o.editions_owned
FROM artwork a
JOIN v_owned o ON o.artwork_id = a.artwork_id
WHERE o.qty_owned > 0
  AND a.status = 'active'
  AND NOT EXISTS (SELECT 1 FROM slot s WHERE s.artwork_id = a.artwork_id);

-- ============================================================ v_sheet_fill
-- The "SPRING · 11 / 15" header. Two different denominators, deliberately both exposed:
--   slots_used / 18    → how full the physical sheet is
--   n_owned / n_wanted → how much of what is laid out he actually has
-- The second is the one that makes a binder worth opening on a day with nothing to buy.
CREATE VIEW IF NOT EXISTS v_sheet_fill AS
SELECT
  sh.sheet_id,
  sh.binder_id,
  sh.title,
  sh.sheet_order,
  COUNT(v.slot_id)                                          AS slots_used,
  18 - COUNT(v.slot_id)                                     AS slots_empty,
  SUM(CASE WHEN v.state = 'owned'  THEN 1 ELSE 0 END)        AS n_owned,
  SUM(CASE WHEN v.state = 'wanted' THEN 1 ELSE 0 END)        AS n_wanted,
  SUM(CASE WHEN v.state = 'note'   THEN 1 ELSE 0 END)        AS n_notes
FROM sheet sh
LEFT JOIN v_slot v ON v.sheet_id = sh.sheet_id
GROUP BY sh.sheet_id;

-- ============================================================ the ONE trigger (rung 3)
-- Q1 is an invariant no SQL constraint can express: an artwork must never exist without at least one
-- edition. A CHECK cannot see another table, and a FK points the wrong direction.
--
-- Doing this in the app would mean TWO writes — insert artwork, then insert edition — and a crash
-- between them leaves an artwork that violates Q1 permanently, with no error anywhere. A trigger fires
-- inside the same transaction as the INSERT, so the pair is atomic. That is the whole argument.
--
-- ⚠️ It fires only when no edition is supplied for the new artwork, so the seed and the manual path
-- both work: entry can create artwork + explicit edition in one transaction and this stays out of the
-- way; anything else gets the implicit edition automatically.
--
-- VERIFIED 2026-07-28: inserting an artwork produced exactly one edition, implicit=1, label NULL,
-- edition_type inherited.
CREATE TRIGGER IF NOT EXISTS trg_artwork_implicit_edition
AFTER INSERT ON artwork
FOR EACH ROW
BEGIN
  INSERT INTO edition (
    edition_id, artwork_id, edition_type, label, implicit, seq, created_at, updated_at
  )
  SELECT
    NEW.artwork_id || ':e1',
    NEW.artwork_id,
    NEW.edition_type,
    NULL,
    1,
    NULL,
    NEW.created_at,
    NEW.updated_at
  WHERE NOT EXISTS (SELECT 1 FROM edition WHERE artwork_id = NEW.artwork_id);
END;

-- NOTE ON THE ID SHAPE: `<artwork_id>:e1` is deterministic on purpose — re-running the seed cannot mint
-- a second implicit edition, and `ux_ed_implicit` backs that up at rung 2 even if the trigger is ever
-- changed. Belt and braces, because this is the row every `copy` depends on.

-- ============================================================ what is NOT a view, on purpose
-- No v_market / v_underpriced yet. Market is M4 (③), and the predecessor's underpriced threshold was
-- unreachable for weeks because of a /100 unit bug nobody could see. When it comes back it gets a test
-- against known values first, not a view.
--
-- No materialized anything. A few hundred rows. If a count is ever slow, that is a surprising and
-- interesting fact worth investigating rather than caching over.
