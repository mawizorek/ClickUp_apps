-- Inciardi Collection — schema v2 · ④ THE DERIVED LAYER
-- Views (rung 1) and the triggers we actually need (rung 3).
--
-- ✅ CANONICAL. Promoted 2026-07-28. Apply LAST, after ① spine, ② binder, ③ market. `db/_index.md`.
--
-- 🔄 Rewritten 2026-08-01 to match the database after migration 001 (spec §5 step 2). The only
-- structural change is `v_shoebox`, which lost `a.collection_id` when that column was retired.
--
-- 🔴 AND THE REASON THAT ONE COLUMN COST A MIGRATION ATTEMPT: SQLite refuses `ALTER TABLE artwork
-- DROP COLUMN collection_id` while ANY view names the column —
--     error in view v_shoebox after drop column: no such column: collection_id
-- The spec's §4 was authored against `schema.sql` and never cross-read against THIS FILE. It measured
-- every TABLE for emptiness and never asked what else NAMES the column. **A dependency check that
-- only looks at tables is not a dependency check. Before any future DROP COLUMN in this app, grep the
-- views.** 001 handles it by dropping and rebuilding the view inside the same atomic pass.
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
--
-- ⭐ 2026-07-30: THIS IS ALSO THE PAGE NUMBERING. Michael is reclaiming "page" to mean one side, its
-- number derived from sheet order plus A/B — which is precisely `side_index`. Nothing needs building
-- or storing for that, and because POST /sheet/reorder rewrites sheet_order, pages RENUMBER THEMSELVES
-- when the binder is rearranged. Do not add a stored page number; it would be the second claimant on a
-- fact this view already owns.
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
-- ⚠️ 2026-08-01: `a.collection_id` was REMOVED from the select list by migration 001, which dropped
-- the column. Nothing else about the view changed — deliberately not "improved" while it was open,
-- because a rebuild commit is exactly where a quiet behavioural edit hides. If a consumer ever needs
-- collection membership here, it is a JOIN through `artwork_collection`, and a print can now be in
-- more than one set, so it fans the rows out. That is a design decision, not a column swap.
--
-- ============================================================================================
-- ⚠️ NO LONGER THE APP'S SHOE-BOX QUERY, AND THE OLD NOTE HERE WAS WRONG. Corrected 2026-07-30.
--
-- What this note used to say: "own six Watermelons, place one, and Watermelon does NOT appear here —
-- even though five are physically in the box… If the second question ever matters, it is a schema
-- change (per-copy location), not a tweak to this view."
--
-- The first half was an accurate description of a real gap. The second half was WRONG and would have
-- talked a future reader out of a fifteen-minute fix. Michael asked for exactly that second question
-- on 2026-07-30, and the COUNT needed NO schema change at all — it is subtraction over two numbers
-- already stored:
--        spare = qty_owned (this file, v_owned)  -  placed_count (slot rows for that artwork)
-- What genuinely DOES require per-copy location is IDENTITY: WHICH physical copy is in the sleeve
-- versus the box. Nobody has ever needed that. The lesson worth keeping: "needs a schema change" is a
-- claim to verify, not inherit — and a COUNT and an IDENTITY are different questions.
--
-- WHERE IT LIVES NOW: `worker/reads.js` → GET /shoebox carries the full query, returning both box
-- states (`unhoused` = nothing placed at all — the original set this view computes; `spare` = some
-- placed, extras left over). That is a deliberate deviation from rung 1, and the reason is deployment
-- physics rather than taste: applying DDL to D1 needs a terminal or the dashboard console, Michael
-- builds from a phone, and a view migration would leave the app broken in the gap between the code
-- deploy and a hand-run console step. Worker SQL ships atomically with the worker, in one button press.
-- It is still the DATABASE computing it, not JavaScript.
-- ⚠️ Path corrected 2026-08-01: the reads moved out of `worker/worker.js` into `worker/reads.js` at
-- PR #637 and this note still pointed at the old file.
--
-- 🟡 THE DEPLOYMENT-PHYSICS ARGUMENT IS NOW WEAKER THAN IT WAS, and it should be re-examined rather
-- than inherited: as of PR #641 there IS a one-press path for DDL (Actions → Migrate
-- inciardi-collection D1). The reasoning above was written when the only options were a terminal
-- Michael does not have and a phone keyboard he should not be typing DROP TABLE into. Not changing it
-- in this pass — this commit is a truth pass, not a redesign — but the premise moved.
--
-- THIS VIEW IS UNUSED. It is kept, not dropped, because it is correct, it costs nothing, and it is the
-- positive-control fixture the 07-28 verification was built on. ⚠️ It is ALSO the exact thing that
-- blocked the 001 migration — an unused view is invisible to a reader and fully visible to SQLite. If
-- a SECOND consumer ever needs the spare counts, promote the worker's query into this view (DROP +
-- CREATE — `CREATE VIEW IF NOT EXISTS` will NOT replace an existing one) and point the worker back at
-- it. One claimant on one truth.
-- ============================================================================================
CREATE VIEW IF NOT EXISTS v_shoebox AS
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

-- ============================================================ the triggers (rung 3)
-- ⚠️ CORRECTED 2026-08-01: this section was headed "the ONE trigger" and there are TWO. The other is
-- `trg_collection_roster`, in ① `schema.sql`, arrived via migration 000. A file that undercounts its
-- own siblings is how the next dependency check misses something — the same class of miss that made
-- 001's DROP COLUMN fail. Both triggers are listed here so this stays the one place you can count them.
--
--   ① schema.sql · trg_collection_roster        — a personal collection cannot claim a roster_size
--   ④ views.sql  · trg_artwork_implicit_edition — every artwork gets at least one edition (below)
--
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
-- No v_photos / v_unassigned. The Photos surface's "unassigned" default view is `image` LEFT JOIN
-- `edition_image` WHERE the link is NULL — one query in the image routes, and it needs to be
-- parameterised by status and kind, which a view cannot do. Revisit only if a second consumer appears.
--
-- No v_market / v_underpriced yet. Market is M4 (③), and the predecessor's underpriced threshold was
-- unreachable for weeks because of a /100 unit bug nobody could see. When it comes back it gets a test
-- against known values first, not a view.
--
-- No materialized anything. A few hundred rows. If a count is ever slow, that is a surprising and
-- interesting fact worth investigating rather than caching over.
--
-- No v_page. "Page" numbering is `v_binder_spread.side_index` — see the ⭐ note there. A separate page
-- view would be a second name for one calculation.
