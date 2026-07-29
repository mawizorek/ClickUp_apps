# `inciardi-collection/db` — the schema, and how to apply it

✅ **CANONICAL as of 2026-07-28.** Promoted from `.proposed` on Michael's go after the constraint gauntlet returned **22/22**. These four files are the schema.

⚠️ **Canonical is not applied.** No database has been created yet. §Apply is the runbook.

Design law behind all of it, from decision log **J6**:

> **Don't police disagreement. Make it unrepresentable.**
> 1. Don't store it, derive it · 2. Structurally impossible · 3. Trigger · 4. One write path · 5. Detect and announce.

Nothing in this app is allowed to land on *"the application will be careful."*

---

## The files, and why there are four

One file hit 26KB, over the ~22KB practical ceiling (the blob API returns base64, so 26KB on disk comes back as ~35KB and crosses the 30KB read cap). **A file that cannot be read whole cannot be safely edited** — the exact trap `inciardi-market/worker.js` is stuck in. The seam is by subsystem, which happens to map to the milestones.

| # | File | Holds | Milestone |
| --- | --- | --- | --- |
| ① | `schema.sql` | **the spine** — `collection`, `artwork`, `artwork_alias`, `edition`, `edition_image`, `copy` | M1 |
| ② | `schema.binder.sql` | **the binder** — `binder`, `sheet`, `slot` | M1 |
| ③ | `schema.market.sql` | **the market lens** — `sighting` | M4, **skip for M1** |
| ④ | `views.sql` | **the derived layer** — 5 views + the one trigger | M1 |

---

## Apply

**Order is FK-significant, not a preference.** `slot` has foreign keys into `artwork` and `edition`, and `④` builds views over every table before it.

```
npx wrangler d1 create inciardi-collection

npx wrangler d1 execute inciardi-collection --remote --file=inciardi-collection/db/schema.sql
npx wrangler d1 execute inciardi-collection --remote --file=inciardi-collection/db/schema.binder.sql
npx wrangler d1 execute inciardi-collection --remote --file=inciardi-collection/db/views.sql
```

Skip `schema.market.sql` — it is M4, and applying it now would put a deferred table in front of you while you build M1.

Drop the `database_id` that `create` prints into the worker's `wrangler.toml` binding when the worker exists. **A new database.** `inciardi-market` keeps its own, untouched, per Q7.

`②` before `④` matters: `v_slot` and `v_sheet_fill` read `slot`, and SQLite accepts a view over a missing table at creation time, then fails at read time. Silent until you look, which is the failure mode this app exists to avoid.

> **What I could not do:** I have no network access and no wrangler, so I cannot create the database or run these commands. The DDL is written, tested and canonical; standing the database up is a step only Michael can take.

### If a bulk import ever fights the order

D1 runs every statement in an implicit transaction with foreign keys on, so a forward reference fails immediately rather than resolving at commit. Cloudflare's own `d1 export` hits this and emits `PRAGMA defer_foreign_keys = TRUE` to survive its own dump ordering. That is the escape hatch for a seed that must insert children before parents. **The schema apply above does not need it.**

---

## Verification — run 2026-07-28

The full DDL was applied to a real SQLite database and attacked with **22 assertions**. All 22 behaved as designed.

**8 positive controls** — because *a schema that rejects everything also passes a test made only of things that should fail.* A slot with `edition_id` NULL (the normal case), a slot naming its own edition, a note-only slot, six copies of an open print, one copy of a monoprint: all accepted. The derived layer was checked with data that makes it **return rows**, not just data that makes it return nothing.

**13 violating writes, all rejected:**

| # | Attack | Caught by |
| --- | --- | --- |
| 1 | Slot names Watermelon, points at a Ginkgo edition | composite FK ⭐ |
| 2 | Six copies of a one-of-a-kind | `CHECK (qty = 1 OR edition_type <> 'unique')` ⭐ |
| 3 | `edition_type` contradicting its parent artwork | composite FK |
| 4 | Two prints in one slot | `UNIQUE (sheet_id, side, position)` |
| 5 | Slot position 11 on a nine-slot side | `CHECK (position BETWEEN 0 AND 8)` |
| 6 | Side `'C'` | `CHECK (side IN ('A','B'))` |
| 7 | Two sheets claiming binder position 0 | `UNIQUE (binder_id, sheet_order)` |
| 8 | Slot pointing at an artwork that does not exist | FK |
| 9 | Per-copy price on a `qty > 1` row | `CHECK` |
| 10 | Implicit edition carrying a label | `CHECK` |
| 11 | A second implicit edition for one artwork | `ux_ed_implicit` partial index |
| 12 | Deleting an artwork out from under a copy | `ON DELETE RESTRICT` |
| 13 | A slot row with no artwork and no note | `CHECK` |

**The trigger:** inserting an artwork auto-created exactly one edition, `implicit = 1`, `label` NULL, `edition_type` inherited. **The cascade:** changing `artwork.edition_type` propagated to `edition` *and* `copy` in one statement.

**The derived layer:** `v_shoebox` named an owned-but-unplaced artwork and correctly omitted a placed one · a slot with no copies read `wanted` · `v_slot` returned `qty_owned` and `placed_count` separately, so the badge can say `own 2 · placed 2`.

### The measurement that justified the gate

The same suite was re-run with **`PRAGMA foreign_keys = OFF`**, to measure the stakes rather than assert them:

> **4 of 4 FK-backed rules silently evaporated.** A slot pointing at a nonexistent artwork: accepted. Deleting an artwork out from under a copy: accepted. Every `CHECK` still fired; every `FOREIGN KEY` rule did not.

No error either time — just wrong data. So the concern was real, and the split between what survives and what doesn't is now known instead of guessed.

### 🟢 D1's answer is better than default-on

> *"By default, D1 enforces that foreign key constraints are valid within all queries and migrations. This is identical to the behaviour you would observe when setting `PRAGMA foreign_keys = on` in SQLite for every transaction."*
> — [Cloudflare D1 docs, Define foreign keys](https://developers.cloudflare.com/d1/sql-api/foreign-keys/)

And it is **not switchable**: every D1 query runs inside an implicit transaction, so a user query cannot turn enforcement off mid-flight. It was made the default in [workerd #794](https://github.com/cloudflare/workerd/pull/794), on the reasoning that SQLite's off-by-default is surprising.

### Why `PRAGMA foreign_keys = ON;` is still at the top of every file

It is a **no-op in D1**, for exactly the reason above. The plan was to demote it to a comment — **that was the wrong call and it was reversed while writing the promotion.** The line is *not* a no-op in plain `sqlite3`, where it is the only thing standing between the verification suite and the 4-of-4 evaporation measured above. Removing it would make the files correct for D1 and quietly wrong everywhere else. The complaint was that the line looked like it was doing something it wasn't, so each file now carries a comment saying which half is which. **Annotate, don't delete.**

---

## 🔴 Post-apply confirmation — paste this once the database exists

Documentation plus a local run is strong evidence, not an observation. This turns it into one, and costs four statements. Seed `watermelon` (`edition_type` `open`) and `brooklyn-ginkgo` (`edition_type` `unique`), plus a `binder` and a `sheet`, then run these. **The first three must be REJECTED.**

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

-- TEST 4 · POSITIVE control, because a database that rejects everything passes the three above.
-- MUST SUCCEED: edition_id NULL is the normal case for a slot.
INSERT INTO slot (slot_id, sheet_id, side, position, artwork_id, created_at, updated_at)
VALUES ('ok1','sheet-1','A',3,'watermelon','2026-01-01','2026-01-01');
```

And the trigger, the one rule that cannot be a constraint:

```
-- MUST return exactly one row: implicit = 1, label NULL
INSERT INTO artwork (artwork_id, name, edition_type, created_at, updated_at)
VALUES ('trigger-test','Trigger Test','open','2026-01-01','2026-01-01');
SELECT edition_id, implicit, label FROM edition WHERE artwork_id = 'trigger-test';
```

Delete the test rows afterwards — `trigger-test` cascades, the `slot` row does not.

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

**Own six Watermelons, place one in a slot, and Watermelon disappears from the shoe-box** even though five are physically in the box. Correct under J3/J4: `v_shoebox` answers *"what have I not placed at all?"*, never *"how many of these are in the box?"* Verified behaving as designed.

Same root cause, other end: **one owned Watermelon placed in two slots reads `owned` in both.** Accepted, because the binder is a layout and planning surface. 🔴 **But the card badge must read `own 2 · placed 2`, never a bare number** — `v_slot` returns `qty_owned` and `placed_count` separately, verified, precisely so the UI can be honest. The imprecision is only acceptable while it stays legible.

If per-object location ever matters, that is a schema change, not a view tweak.
