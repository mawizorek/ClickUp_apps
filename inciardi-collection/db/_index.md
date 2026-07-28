# `inciardi-collection/db` — the proposed schema set

**Nothing here is applied.** Every file carries `.proposed` on purpose. This directory is a design artifact under review; it becomes a migration when the pre-promotion test below passes and Michael says go.

Design law behind all of it, from decision log **J6**:

> **Don't police disagreement. Make it unrepresentable.**
> 1. Don't store it, derive it · 2. Structurally impossible · 3. Trigger · 4. One write path · 5. Detect and announce.

Nothing in this app is allowed to land on *"the application will be careful."*

---

## The files, and why there are four

One file hit 26KB, over the ~22KB practical ceiling (the blob API returns base64, so 26KB on disk comes back as ~35KB and crosses the 30KB read cap). **A file that cannot be read whole cannot be safely edited** — the exact trap `inciardi-market/worker.js` is stuck in. The seam is by subsystem, which happens to map to the milestones.

| # | File | Holds | Milestone |
| --- | --- | --- | --- |
| ① | `schema.proposed.sql` | **the spine** — `collection`, `artwork`, `artwork_alias`, `edition`, `edition_image`, `copy` | M1 |
| ② | `schema.binder.proposed.sql` | **the binder** — `binder`, `sheet`, `slot` | M1 |
| ③ | `schema.market.proposed.sql` | **the market lens** — `sighting` | M4, deferred |
| ④ | `views.proposed.sql` | **the derived layer** — views + the one trigger | M1 |

---

## Apply order (FK-significant, not a preference)

```
1. schema.proposed.sql          spine first: artwork and edition must exist
2. schema.binder.proposed.sql   slot has FKs into artwork AND edition
3. schema.market.proposed.sql   sighting has FKs into artwork AND edition   (skip for M1)
4. views.proposed.sql           views read every table above
```

`②` before `④` matters: `v_slot` and `v_sheet_fill` read `slot`, and SQLite will happily accept a view over a missing table at creation time, then fail at read time. Silent until you look, which is the failure mode this app exists to avoid.

---

## 🔴 PRE-PROMOTION TEST — run this before anything becomes `schema.sql`

**SQLite enforces foreign keys per connection and has historically defaulted them OFF.** Every composite foreign key in this design is decorative if D1 is not enforcing, and **an unenforced constraint is worse than no constraint, because it looks like protection.** Same failure shape as the three silent caches that cost a full day on 2026-07-25.

So it does not get assumed. Apply `①` and `②` to a scratch D1 database, seed `watermelon` (`edition_type` `open`) and `brooklyn-ginkgo` (`edition_type` `unique`), then run all three. **Every one must be REJECTED.**

```
-- TEST 1 · the Q12 guard. A slot naming artwork A while pointing at an edition of artwork B.
-- MUST FAIL: FOREIGN KEY constraint failed
INSERT INTO slot (slot_id, sheet_id, side, position, artwork_id, edition_id, created_at, updated_at)
VALUES ('t1','sheet-1','A',0,'watermelon','brooklyn-ginkgo:e1','2026-01-01','2026-01-01');

-- TEST 2 · the Q10 guard. Six copies of a one-of-a-kind monoprint.
-- MUST FAIL: CHECK constraint failed
INSERT INTO copy (copy_id, edition_id, edition_type, qty, created_at, updated_at)
VALUES ('t2','brooklyn-ginkgo:e1','unique',6,'2026-01-01','2026-01-01');

-- TEST 3 · an edition_type that contradicts its parent artwork.
-- MUST FAIL: FOREIGN KEY constraint failed
INSERT INTO edition (edition_id, artwork_id, edition_type, implicit, created_at, updated_at)
VALUES ('t3','watermelon','unique',0,'2026-01-01','2026-01-01');
```

**If any test SUCCEEDS, stop.** Foreign keys are not being enforced on that connection and the design has to change: every rung-2 composite FK demotes to a rung-3 trigger and these files get rewritten. Do not proceed on the assumption that the constraint text is doing something.

Then confirm the trigger, the one rule that cannot be a constraint:

```
-- MUST return exactly one row: implicit = 1, label NULL
INSERT INTO artwork (artwork_id, name, edition_type, created_at, updated_at)
VALUES ('trigger-test','Trigger Test','open','2026-01-01','2026-01-01');
SELECT edition_id, implicit, label FROM edition WHERE artwork_id = 'trigger-test';
```

---

## What is deliberately NOT in this schema

| Absent | Why |
| --- | --- |
| `slot.state` | **J3.** Derived in `④`. A stored state is a second source of truth for a fact `copy` already owns — the predecessor's phantom-duplicate disease. |
| `copy.location` | **J4.** No per-object allocation. The shoe-box is derived. Michael cut which-physical-card-is-where as *"minimal singular tracking."* |
| `copy.disposition = 'want'` | A want is a slot with no copies. One way to say it, not two. |
| a shoe-box table | It is `v_shoebox`: owned artworks with zero placements. |
| 18 pre-seeded slot rows per sheet | Slots are **sparse**. Absence is the empty state. Materializing empties makes "empty" a stored fact that can rot. |
| `machine` / `machine_print` / `machine_event` | The location layer. 14 seeded rows in the predecessor, zero UI ever built. Port when a page needs it. |
| `market_point` / `print_point` / `gone_event` | `sighting` replaces all three. |
| `catalog` / `inventory` | Dead names. They described **sources**, not things. |

---

## Known imprecision, recorded so nobody re-files it as a bug

**Own six Watermelons, place one in a slot, and Watermelon disappears from the shoe-box** even though five are physically in the box. Correct under J3/J4: `v_shoebox` answers *"what have I not placed at all?"*, never *"how many of these are in the box?"*

Same root cause, other end: **one owned Watermelon placed in three slots reads `owned` in all three.** Accepted, because the binder is a layout and planning surface. 🔴 **But the card badge must read `own 1 · placed 3`, never a bare `3`.** `v_slot` exposes both numbers precisely so the UI can be honest. The imprecision is only acceptable while it stays legible.

If per-object location ever matters, that is a schema change, not a view tweak.
