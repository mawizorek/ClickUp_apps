# inciardi-collection — NEXT BUILD SPEC

> **Status: LOCKED SCOPE, NOTHING BUILT.** Every decision below is answered and read back. This file is the graduation target that **six decision-log entries promised and none created** (J9, J10, J12, J17, J18, and this one closing it out).
>
> **Decision history:** [Inciardi Collection — Decision Log](https://app.clickup.com/36074068/v/dc/12cwjm-56993/12cwjm-77473) · **Schema:** `db/` (canonical + applied) · **Ledger:** `/VERSIONS.md`

---

## 0. 🔴 READ FIRST — THIS IS ONE PASS, NOT TWO

Two parallel sessions designed two independent schema changes to the same database on 2026-07-31, **each justified by the identical argument: "the table is empty, so the migration is free today."**

| Scope | Authored in | Touches |
|---|---|---|
| **PHOTOS** — image asset/link split | J15 · J16 · J18 · Q17 · Q19 · Q20 | `edition_image`, new `image` |
| **GROUPINGS** — taxonomy + many-to-many collections | J17 · Q21 · Q22 | `collection`, `artwork`, new `artwork_collection` |

Neither session was aware of the other's tables. This is the **PR #602 collision** shape the app already survived once, and on a schema the bad outcome is worse than a merge conflict: **two `db/` rewrites that each look correct in isolation.**

⭐ **Resolution: ONE migration file, authored once, applied once.** §4 below is that file. Do not split it back apart.

⚠️ **A THIRD session is live on source right now.** Between v17.1 and this file being written, `base.css` (12.6→14.7KB), `boot.js` (14.8→15.6KB) and `index.html` (9.8→10.3KB) all moved with no entry on `brain-config/session-board.md`. **Post to the board before touching any file named in §5.**

---

## 1. The free-migration window, and when it shuts

Verified against a **cache-busted** read of the live worker, 2026-07-31 (the plain URL served a 24-hour-stale response — see §7):

- `artwork` — **42 rows**, every one with `collection_id` NULL
- `collection` — **0 rows, never held one**
- `edition_image` — **0 rows** (J16, measured in the D1 console)

**So the entire migration in §4 moves ZERO data.** No create-copy-drop-rename, no back-testing constraints against rows that already violate them.

🔴 **The window shuts the moment either feature is used** — the first collection created, the first photo uploaded. **This is the third time this project has been handed a free structural change by checking the table before designing around its shape** (J4 `pocket`→`slot`, J15 `edition_image`, now this). It is also the last one available.

---

## 2. Locked decisions — photos

| Thing | Locked value | Source |
|---|---|---|
| Model | `image` = ASSET (bytes, exists with zero links) · `edition_image` = LINK | J15 |
| Placement test | *Does this fact change if the same photo is attached to a different edition?* No → asset. Yes → link. | J15 |
| Attach point | The **EDITION**, never the artwork | J9, Q1 |
| Bucket | **`inciardi-images`** (existing, 177 objects), binding `BUCKET`, **private**, prefix `ed/` | Q17a → C |
| Key scheme | `ed/<edition_id>/<sha256>.jpg` — content-addressed | J9 |
| The 177 existing | **Adopt as a FLOOR.** Her scrub renders until you shoot your own; yours becomes primary, hers stays in the carousel | Q17b → D |
| Archive vs unlink | **Two verbs, guard stays STRUCTURAL.** `status` denormalized onto the link behind a composite FK | Q20 → B |
| Derivatives | **Three:** thumb 480 · full 1800 · re-encoded original | Q14 → C |
| Encoding | **Client-side canvas re-encode**, mandatory (kills HEIC, fixes rotation, strips GPS) | J9 |
| 🔴 `shot_at` | Read from EXIF **BEFORE** the strip, or the capture date is destroyed forever | J16 |
| Serving | Worker proxy `GET /image/:image_id`. Never a public bucket | J13 |
| Deletion | **Never hard-delete R2 bytes.** Archive only | J9 |
| Surface | **Photos** (`#photos`), **unassigned as the default view** | Q19 → A, J15 |
| Detail home | `#artwork?id=<artwork_id>`, own module, route-first | Q16 → A+D, J12 |

🔴 **STEP 0, AND IT IS A DEADLINE, NOT A TASK.** Adopting the 177 needs the R2-key → which-print mapping. That mapping is **not** in R2 and **not** in this app's D1 — it lives in **`print_image` inside the `inciardi-market` D1**, the database of the app just declared dead. **Export it before anything about market is torn down**, or 268MB survives as 177 anonymous objects recoverable only by eye (J18).

---

## 3. Locked decisions — groupings

### Q21 → A + B + D · "i think i want it all comfortably"

**Struck: C** (one field, medium lives in notes) and **Other**. Every axis survives. **"Comfortably" is the binding constraint, not a mood** — see the entry rule below.

| Field | Values | Note |
|---|---|---|
| `category` | `mini \| big \| pack` | **FORMAT ONLY.** `linocut` and `big-riso` leave — a size field cannot hold a medium |
| `medium` ⭐NEW | `linocut \| riso \| letterpress \| …` | How it was made. No `CHECK` — the vocabulary will grow |
| `authorship` ⭐NEW | `hers \| licensed \| collab` | Whose drawing. Splits Scarry from her own work on the axis that actually differs |
| `exclusive` | `nyc \| lacma \| grand-central \| holiday` | **SURVIVES, but narrowed to DISTRIBUTION** — *where you can get it* |

🔴 **The `richard-scarry` collision is resolved by removal, not by rule.** It appeared under both `exclusive` and `collection_id`. Now: **Richard Scarry is a COLLECTION** (`kind='collab'`) **plus `authorship='licensed'`** — two facts, two homes. It is **no longer a legal `exclusive` value**, and that is what stops the ambiguity coming back. `exclusive` keeps only the place-and-season values, which is the job B argued it was for.

⭐ **THE "COMFORTABLY" RULE, and it is load-bearing:** three axes only stay comfortable if **none is ever required.** Every one is nullable, none gains a `CHECK`, and **entry never asks for them** — a print is recorded with a name, exactly as today. `category` defaults to `mini`; `medium` and `authorship` default NULL and are filled from the artwork detail when you care. **A taxonomy you must complete is a taxonomy you abandon.** Three optional axes is expressiveness; three required ones is data entry.

### Q22a → A · Both are COLLECTIONS, split by `kind`

**Struck: B** (SET) and **C** (SHELF). **A and D** remained — and **the note kills D**: *"is release its own thing? there are originals and second printing and oops printings."*

<br>

⭐ **Answering that directly: YES, and that is exactly why D loses.** *Release* is needed for something else, so spending it on "a set of prints" would be the Q11/Q19 collision all over again.

<br>

🔴 **And a printing run is already modelled — it is an `edition`.** The schema's own words: an edition is *"a specific impression or unique object… the physical-INSTANCE layer."* A 2026 reprint is a genuinely different object from the 2025 original, and an **"oops" misprint is the clearest case there is** — visibly different, separately collectable, deserves its own photograph. That is the Brooklyn Ginkgo reasoning applied to reprints, and it needs **zero schema change**: `label = '2nd printing'`, `implicit = 0`, its own copies, its own images.

<br>

⚠️ **One real constraint to know:** `ux_ed_implicit` allows **at most one implicit edition per artwork**, so a second printing must be **explicit and labelled**. It cannot be minted by the auto-trigger. Correct, and worth stating before someone tries.

<br>

🚫 **NOT IN SCOPE.** Nothing about reprints is being built here. It is recorded so the word `release` stays free and nobody invents a table for it later.

| | Official | Yours |
|---|---|---|
| Table | `collection` | `collection` — same table |
| `kind` | `release` · `exclusive` · `collab` | `personal` |
| `roster_size` | May be known → **"SPRING · 11/15"** | Always NULL — a pile you invented has no denominator |
| Badge | ✓ official | none |

⭐ **`kind` names a split the table already implied.** `roster_size` is documented as *"how many artworks SHOULD be in the set"* — **an official release has an external truth about its size; a pile you made up does not.** `kind` says out loud what was previously inferable from a NULL.

### Q22b → B now, C parked

**Struck: A** (filter only) and **Other**. Note: *"fine starting with b and just letting collections also sort in the list view and save more creative view for next phase."*

- **BUILD:** filter + a **dimming lens on the binder** — pick a collection, non-members fade on the sheet. Answers *"which of these are Scarry"* at a glance with **no permanent badge**.
- **BUILD:** collections as a **sort option in the Collection list view**.
- 🅿️ **PARKED:** C, collections as a browsable axis (page through *Richard Scarry* as its own spread). Next phase. It reopens the *collection-is-not-a-sheet* line in `schema.sql` and is worth doing deliberately or not at all.

### 🚫 No star badge for medium

⭐ already means **primary image** (`is_primary`, J10). Spending it again is the Q11 collision in icon form. And **a badge on half the collection marks nothing** — nine of eighteen Books cards are Scarry, so medium is a **filter**, not a badge.

⭐ **What DOES earn a permanent binder badge: `edition_type = 'unique'`.** Eleven Ginkgo monoprints against ~200 prints. Irreplaceable, one-of-one, already modelled with a `CHECK`. **Recorded so the badge slot is not spent on the wrong fact.** Not in scope here.

---

## 4. THE MIGRATION — one file, apply in this order

🔴 **FK-significant order. Do not reorder.** Run in the D1 **Console**, or `wrangler d1 execute inciardi-collection --remote --file=…`.

⚠️ **Every `DROP` below is safe ONLY because §1 measured the tables empty. Re-verify before running** — this log has been wrong about applied-vs-authored twice.

```sql
-- ============================================================ ① GROUPINGS

-- collection: name the official/personal split the table already implied.
ALTER TABLE collection ADD COLUMN kind TEXT NOT NULL DEFAULT 'personal'
  CHECK (kind IN ('release','exclusive','collab','personal'));

-- 🔴 A personal set has no external truth about its size, so it cannot claim one.
-- Rung 2: the database refuses the incoherent row rather than the route remembering.
-- (SQLite cannot ADD a table-level CHECK, so this is the index-shaped equivalent.)
CREATE TRIGGER IF NOT EXISTS trg_collection_roster
BEFORE INSERT ON collection
WHEN NEW.kind = 'personal' AND NEW.roster_size IS NOT NULL
BEGIN SELECT RAISE(ABORT, 'a personal collection has no roster_size'); END;

-- artwork: two new OPTIONAL axes. No CHECK on either — the vocabulary will grow,
-- and a CHECK turns every new value into a table rebuild for no correctness gain
-- (identical reasoning to category's own comment).
ALTER TABLE artwork ADD COLUMN medium     TEXT;   -- linocut | riso | letterpress
ALTER TABLE artwork ADD COLUMN authorship TEXT;   -- hers | licensed | collab

-- Retire the singular FK. A print must be able to sit in Richard Scarry AND in
-- your trade pile; a single collection_id makes the whole ask unbuildable.
-- Safe: all 42 rows are NULL (§1).
DROP INDEX IF EXISTS ix_art_coll;
ALTER TABLE artwork DROP COLUMN collection_id;

-- The join. Third instance of a pattern this app already runs (slot, edition_image).
CREATE TABLE IF NOT EXISTS artwork_collection (
  artwork_id    TEXT NOT NULL REFERENCES artwork(artwork_id)       ON DELETE CASCADE,
  collection_id TEXT NOT NULL REFERENCES collection(collection_id) ON DELETE CASCADE,
  sort          INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL,
  PRIMARY KEY (artwork_id, collection_id)   -- same print twice in one set: impossible
);
CREATE INDEX IF NOT EXISTS ix_ac_coll ON artwork_collection(collection_id, sort);

-- ============================================================ ② PHOTOS

-- The ASSET. Exists with ZERO links — that is the whole point (J15).
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
  shot_at      TEXT,     -- 🔴 read from EXIF BEFORE the strip, or it is gone forever

  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
  created_at   TEXT NOT NULL,
  archived_at  TEXT,

  -- An image neither in R2 nor pointing at a CDN renders nothing. Litter, not a record.
  CHECK (r2_key IS NOT NULL OR source_url IS NOT NULL),

  -- 🔗 FK TARGET, not a uniqueness claim (image_id is already the PK). This is what
  --    lets the link inherit status instead of copying it.
  UNIQUE (image_id, status)
);
CREATE INDEX IF NOT EXISTS ix_image_status ON image(status, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS ux_image_sha ON image(sha256) WHERE sha256 IS NOT NULL;

-- The LINK. Same table name on purpose — edition_image was ALWAYS the right name for a
-- join table; it was only ever the asset because nothing forced the question (J15).
-- Safe to DROP: 0 rows, measured (J16).
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

  -- 🔗 Q20 → B, and the whole reason status is duplicated here. J6's trick, reused:
  --    the link's status CANNOT disagree with the asset's, and follows it on update.
  FOREIGN KEY (image_id, status)
    REFERENCES image (image_id, status)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ⭐ THE GUARD, KEPT STRUCTURAL. A partial index can only see its OWN table's columns,
-- so without the denormalized status above, the `active` half of this predicate would
-- silently stop existing and an ARCHIVED photo could remain a print's primary image.
-- Fifth encounter with that defect class in this app; first one refused at design time.
CREATE UNIQUE INDEX ux_img_primary
  ON edition_image(edition_id) WHERE is_primary = 1 AND status = 'active';
CREATE INDEX ix_ei_image ON edition_image(image_id);
CREATE INDEX ix_ei_ed    ON edition_image(edition_id, sort);
```

### Post-apply confirmation — four statements, and one must SUCCEED

🔴 **A suite made only of things that should fail also passes on a schema that rejects everything** (B15). Statement 4 is the positive control.

```sql
-- 1. MUST FAIL — a personal collection cannot claim a roster
INSERT INTO collection (collection_id,name,kind,roster_size,names_known,created_at,updated_at)
  VALUES ('t1','t','personal',15,0,'2026-07-31','2026-07-31');

-- 2. MUST FAIL — grouping a print that does not exist
INSERT INTO artwork_collection (artwork_id,collection_id,created_at)
  VALUES ('no-such-print','t2','2026-07-31');

-- 3. MUST FAIL — the link cannot claim a status its asset disagrees with
--    (create image 'i1' as 'active' first, then:)
INSERT INTO edition_image (edition_id,image_id,status,created_at)
  VALUES ('<a-real-edition>','i1','archived','2026-07-31');

-- 4. MUST SUCCEED — the positive control
INSERT INTO artwork_collection (artwork_id,collection_id,created_at)
  VALUES ('pbr','<a-real-collection>','2026-07-31');
```

**If #4 fails, the migration is broken in a way the first three cannot reveal.**

---

## 5. Build order

Each step is shippable and each names its file. **Every one arrives as a NEW module, never an append** — four files are already over the 15KB split line.

| # | Step | Files | Blocked by |
|---|---|---|---|
| 0 | 🔴 **Export `print_image` ⋈ `catalog` from market D1** | — | **Michael.** Deadline: before market is torn down |
| 1 | Apply §4 | `db/` | **Michael** (D1 console) |
| 2 | Rewrite `db/schema.sql` + `views.sql` to match | `db/*.sql` | step 1 |
| 3 | 🔴 **Split `worker/worker.js`** (29.3KB, 674 bytes under the read cap) | `worker/reads.js` | nothing — **the collision risk is highest here** |
| 4 | Grouping routes | `worker/collections.js` | 3 |
| 5 | Image routes (POST · GET · archive · set-primary) | `worker/images.js` | 1, 3 |
| 6 | `[[r2_buckets]]` block | `wrangler.toml` | nothing |
| 7 | Artwork detail route `#artwork?id=` | `artwork.js` | nothing |
| 8 | Capture (canvas · orientation · 3 derivatives · **`shot_at` before strip** · resumable queue) | `capture.js` | 5, 6 |
| 9 | Photos surface, **unassigned as the default view** | `photos.js` | 5 |
| 10 | Collection editor + membership control | on `artwork.js` + `summary.js` | 4 |
| 11 | Binder dimming lens + list sort | `binder.js`, `summary.js` | 4 |
| 12 | Adopt the 177 as `kind='reference'` rows | one-off | 0, 5 |

**Steps 3 + 7 are blocked by nothing and are the largest visible win** — the worker becomes editable and a print becomes addressable.

---

## 6. What only Michael can do

1. 🔴 **Export the market `print_image` mapping** — deadline-bound (§2)
2. **Apply §4** in the D1 console
3. **Confirm the R2 spend alert** exists on `inciardi-images`
4. **Stand the market worker down** (its write handle is what makes Q17a→C safe)
5. **Test on a phone with no console** — the real acceptance test

---

## 7. Carried warnings

- 🔴 **The worker serves stale reads on bare URLs.** On 07-31 `/artworks` and `/sheets` returned byte-identical 07-30 data (4 artworks, 2 sheets) while the truth was **42 and 4**. A cache-busting query string returned the truth. **An unchanged number is not a confirmation.** Add `?nocache=<ts>` to any read a decision rests on.
- ⚠️ **`worker/worker.js` is 29.3KB** — every edit is a blind full retype. **Split before adding any route.**
- ⚠️ **`README.md` (23KB) and the `worker.js` header still claim the write key is never bundled.** Three versions stale. Same docs pass.
- ⚠️ **PLAN vs APPLY in `backroom.js` has been dodged twice** (v15, v17) on the same real reason. It is now propping up the largest JS file in the app.
- ⚠️ **D1 artwork `notes` are v1 text.** A re-import short-circuits on `already exists`, so note corrections never land. No update route; not worth building one for prose.
- ⚠️ **`ice-cream` batch:** D1 may still hold the pre-correction slot positions. Re-import with the override ticked.

---

## 8. Explicitly OUT of scope

**Sheet-dicing** (J10, killed on merits) · **`#capture` queue-walker** (Q15 D, parked) · **collections as a browsable axis** (Q22b C, next phase) · **a `unique` badge on the binder** (recorded, not built) · **reprints/oops-printings** (§3 — already modelled as editions, nothing to build) · **market ③ schema** · **per-image visibility, crop/rotate, tags, filenames** (J16).

---

*Authored 2026-07-31 from decision-log entries J9–J18 and Q13–Q22, all answered and read back. Supersedes the "graduates to next-build-spec.md" line on J9, J10, J12, J17 and J18.*
