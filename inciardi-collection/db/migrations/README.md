# `inciardi-collection/db/migrations`

DDL that has been applied to the live `inciardi-collection` D1, one file per pass, in
numbered order. **Applied by button:** Actions → *Migrate inciardi-collection D1* → Run
workflow → pick the file → set confirm to `apply`.

<br>

## 🔴 A migration is not the schema

`db/schema.sql` + `db/views.sql` describe the **destination**. These files describe
**transitions** from one specific state to another, and several of them are only correct
against the exact state they were written for.

**Never rebuild a fresh database by replaying this folder.** Rebuild from the canonical
schema. `000` cannot even be run — it would fail on a duplicate column.

<br>

## The guard, and why it is structural

`applied.log` is written **by the workflow**, after a successful run, and the workflow
**hard-refuses** any file already listed. This is rung 2 of the app's own design law
(*make disagreement unrepresentable*) rather than rung 5 (*hope someone reads the
warning*).

It matters concretely: `001` carries `DROP TABLE IF EXISTS edition_image`. That is free
against 0 rows and destroys the entire photo library against a populated one. **A second
button press is exactly the shape of that accident**, so a second press is refused rather
than discouraged.

⚠️ The log is machine-written on purpose. A hand-maintained ledger drifts from reality —
see `session-board.md`, where a stale row claimed two files for four days.

<br>

## Writing a new one

1. **Read the views, not just the tables.** `001` had to be corrected because `§4` of the
   spec ordered a `DROP COLUMN` that SQLite refuses while a view names that column. The
   spec measured every table for emptiness and never asked what else *referenced* the
   column. A dependency check that only looks at tables is not a dependency check.
2. **Measure, do not assume.** Every `DROP` in `001` is safe only because three
   `SELECT COUNT(*)` results were 0 minutes beforehand.
3. **State the cost of the destructive statements in the file**, next to them.
4. **One pass, not two.** Two sessions designed two migrations for this same empty
   database on 2026-07-31, neither aware of the other. They were merged before either ran.
5. ⚠️ **Triggers contain semicolons in their bodies.** `CREATE TRIGGER … BEGIN … ; END;`
   can confuse a naive statement splitter. `000` is a trigger migration and was applied by
   hand, so **the button has never been tested against a trigger body** — if you write one,
   verify the whole trigger arrived rather than assuming.

<br>

## Log

| # | File | Applied | How |
|---|---|---|---|
| 000 | `000-collection-kind.sql` | 2026-07-31 23:33 ET | by hand, D1 console (pre-dates the button) |
| 001 | `001-photos-and-groupings.sql` | pending | button |
