# `inciardi-collection/db` — the schema, and how to apply it

✅ **CANONICAL as of 2026-07-28.** Promoted from `.proposed` on Michael's go after the constraint gauntlet returned **22/22**.

🟢 **AND IT IS LIVE.** ⚠️ *This page said "no database has been created yet" until 2026-08-01. It had been wrong for days.* The `inciardi-collection` D1 database exists, is deployed, and last measured **59 artworks · 59 editions · 58 owned · 5 sheets · 61 slots** (cache-busted `/health`, 2026-08-01 16:52Z, immediately after migration 001).

Design law behind all of it, from decision log **J6**:

> **Don't police disagreement. Make it unrepresentable.**
> 1. Don't store it, derive it · 2. Structurally impossible · 3. Trigger · 4. One write path · 5. Detect and announce.

Nothing in this app is allowed to land on *"the application will be careful."*

---

## 🔴 Two kinds of file in here, and confusing them will cost you a database

| | `schema*.sql` + `views.sql` | `migrations/*.sql` |
| --- | --- | --- |
| Describes | **the DESTINATION** — what the database looks like now | **a TRANSITION** between two specific states |
| Build a fresh DB from | ✅ these | 🚫 **never these** |
| Re-runnable | yes (`IF NOT EXISTS` throughout) | **no** — `000` hard-fails on a second run |
| Contains `DROP` | no | yes, and `001` drops a table |

**A fresh database is built from the canonical files, never by replaying the migrations folder.** `000` cannot even execute twice (SQLite has no `ADD COLUMN IF NOT EXISTS`), and a D1 batch is atomic, so one duplicate-column error takes the whole file down.

### Migration ledger

The machine-written record is `migrations/applied.log`; this table is the human summary. **Do not hand-edit the log** — the workflow writes it, which is why it cannot drift.

| # | File | Applied | How |
| --- | --- | --- | --- |
| 000 | `000-collection-kind.sql` | 2026-07-31 23:33 ET | by hand, D1 console (before the button existed) |
| 001 | `001-photos-and-groupings.sql` | 2026-08-01 16:51:55Z | **Actions → Migrate inciardi-collection D1** |

**To apply 002:** commit the file, then make **three** edits in `.github/workflows/migrate-inciardi-collection.yml` — an `options` line, a `case` arm, and a `default` decision. The friction is deliberate. The workflow reads `applied.log` and **REFUSES** a file that already ran; that guard is structural, not a warning, because `001` carries `DROP TABLE edition_image`.

🔴 **Runs on `CLOUDFLARE_D1_TOKEN`** (Account · D1 · Edit), **not** `CLOUDFLARE_API_TOKEN`. Never merge the two: the deploy workflow depends on the Workers token as-is, and a shared credential makes every permission change a change to every consumer. There is no fallback, on purpose.

---

## The files, and why there are four

One file hit 26KB, over the ~22KB practical ceiling (the blob API returns base64, so 26KB on disk comes back as ~35KB and crosses the 30KB read cap). **A file that cannot be read whole cannot be safely edited** — the exact trap `inciardi-market/worker.js` is stuck in. The seam is by subsystem, which happens to map to the milestones.

| # | File | Holds | Milestone |
| --- | --- | --- | --- |
| ① | `schema.sql` | **the spine** — `collection`, `artwork`, `artwork_alias`, `artwork_collection`, `edition`, `image`, `edition_image`, `copy` | M1 |
| ② | `schema.binder.sql` | **the binder** — `binder`, `sheet`, `slot` | M1 |
| ③ | `schema.market.sql` | **the market lens** — `sighting` | M4, **skip for M1** |
| ④ | `views.sql` | **the derived layer** — 5 views + `trg_artwork_implicit_edition` | M1 |

**Triggers, both of them, in one place so they can be counted:** `trg_collection_roster` (① — a personal collection cannot claim a `roster_size`) and `trg_artwork_implicit_edition` (④ — every artwork gets at least one edition).

### What 001 changed in ①

- `artwork.collection_id` **is gone**, and so is `ix_art_coll`. Membership is now `artwork_collection`, many-to-many, because a print can be in an official release *and* in a personal pile.
- `artwork` gained `medium` and `authorship`. ⭐ **Both nullable, neither carries a `CHECK`, and entry never asks for them** — the "comfortably" rule. Three axes only stay comfortable if none is ever required.
- `image` is **new**: the asset, which exists with zero links by design. `edition_image` is now the **LINK**, rebuilt from scratch, with `status` denormalized onto it behind a composite FK so an archived photo cannot be a print's primary.
- `collection.kind` (from 000) names the official-vs-personal split.

---

## Apply (a FRESH database only)

**Order is FK-significant, not a preference.** `slot` has foreign keys into `artwork` and `edition`, `edition_image` has one into `image`, and `④` builds views over every table before it.

```
npx wrangler d1 create inciardi-collection

npx wrangler d1 execute inciardi-collection --remote --file=inciardi-collection/db/schema.sql
npx wrangler d1 execute inciardi-collection --remote --file=inciardi-collection/db/schema.binder.sql
npx wrangler d1 execute inciardi-collection --remote --file=inciardi-collection/db/views.sql
```

⚠️ **This is the disaster-recovery path, not a thing to run casually.** The live database already exists; these commands are for standing up a replacement.

Skip `schema.market.sql` — it is M4, and applying it now would put a deferred table in front of you while you build M1.

`②` before `④` matters: `v_slot` and `v_sheet_fill` read `slot`, and SQLite accepts a view over a missing table at creation time, then fails at read time. Silent until you look, which is the failure mode this app exists to avoid.

### If a bulk import ever fights the order

D1 runs every statement in an implicit transaction with foreign keys on, so a forward reference fails immediately rather than resolving at commit. Cloudflare's own `d1 export` hits this and emits `PRAGMA defer_foreign_keys = TRUE` to survive its own dump ordering. That is the escape hatch for a seed that must insert children before parents. **The schema apply above does not need it.**

---

## Verification — run 2026-07-28

⚠️ **STAMPED PRE-MIGRATION.** This gauntlet ran against the schema as it stood on 2026-07-28, **before** 000 and 001. Every assertion below still describes a live rule *except* that `edition_image` has since been rebuilt as a link table, so its constraints were not among the 22. **The photos and groupings layer has not been attacked yet** — the four post-apply statements in `next-build-spec.md` §4 are the owed test and have **not** been run.

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

### 🔴 Still owed: the post-001 gauntlet

Four statements, in `next-build-spec.md` §4. Three must FAIL, and **statement 4 must SUCCEED** — a suite made only of things that should fail also passes on a schema that rejects everything.

1. a `personal` collection claiming a `roster_size` → must fail (`trg_collection_roster`)
2. grouping a print that does not exist → must fail (FK)
3. a link claiming a status its asset disagrees with → must fail (composite FK)
4. **positive control** — group a real print into a real collection → must **succeed**

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

## What is deliberately NOT in this schema

| Absent | Why |
| --- | --- |
| `artwork.collection_id` | **Removed by 001.** A singular FK cannot express "in an official release AND in my trade pile." Membership is `artwork_collection`. |
| a `release` table | A printing run — including an *"oops"* misprint — is already an `edition`. Zero schema change. The word `release` belongs to `collection.kind`; do not spend it twice. |
| `slot.state` | **J3.** Derived in `④`. A stored state is a second source of truth for a fact `copy` already owns — the predecessor's phantom-duplicate disease. |
| `copy.location` | **J4.** No per-object allocation. The shoe-box is derived. Michael cut which-physical-card-is-where as *"minimal singular tracking."* |
| `copy.disposition = 'want'` | A want is a slot with no copies. One way to say it, not two. |
| a shoe-box table | It is `v_shoebox`: owned artworks with zero placements. |
| 18 pre-seeded slot rows per sheet | Slots are **sparse**. Absence is the empty state. Materializing empties makes "empty" a stored fact that can rot. |
| image tags / crop / per-image visibility / filenames | **J16.** Out of scope. |
| `machine` / `machine_print` / `machine_event` | The location layer. 14 seeded rows in the predecessor, zero UI ever built. Port when a page needs it. |
| `market_point` / `print_point` / `gone_event` | `sighting` replaces all three. |
| `catalog` / `inventory` | Dead names. They described **sources**, not things. |

---

## Known imprecision, recorded so nobody re-files it as a bug

**Own six Watermelons, place one in a slot, and Watermelon disappears from the shoe-box** even though five are physically in the box. Correct under J3/J4: `v_shoebox` answers *"what have I not placed at all?"*, never *"how many of these are in the box?"* — and the app's live `GET /shoebox` (in `worker/reads.js`) answers both, which is why the view is currently unused.

Same root cause, other end: **one owned Watermelon placed in two slots reads `owned` in both.** Accepted, because the binder is a layout and planning surface. 🔴 **But the card badge must read `own 2 · placed 2`, never a bare number** — `v_slot` returns `qty_owned` and `placed_count` separately, verified, precisely so the UI can be honest. The imprecision is only acceptable while it stays legible.

If per-object **identity** (which physical copy is in the sleeve) ever matters, *that* is a schema change. The **count** was not, and this page used to claim otherwise.
