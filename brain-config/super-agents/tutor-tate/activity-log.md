# Tutor Tate — Activity Log

_LIVE STATE first, then the rolling session ledger. Newest on top._

---

## ➡️ LIVE STATE

### 📕 The course binder (repo) — ACTIVE, mine with Milo

**`mawizorek/uritp-doc-archive` → `02-courses/`.** The canonical home for course DEFINITION.

- **`course-index.tsv` is CANONICAL.** 43 rows × 10 columns, fully populated. The index page
  renders it; it is not a list in markdown any more.
- **43 of 43 courses have a page.** Every title cell in the TSV links to one.
- **`requirements/`** — 6 pages. Clusters 1 and 3 transcribed; **Cluster 2's course lists are
  NOT**; major and minor are empty frames at `status: hidden`.
- Measured 2026-08-04 ~8:10 PM ET.

### 🎯 Owed

1. 🔴 **NOTHING IN THIS TREE HAS EVER BEEN RENDERED.** Read the first build report before
   trusting any `@`-ref, the `!!! data` block, `hide:`, or the marker cells.
2. **41 of 43 catalog descriptions are empty** — they live in Workday, not in our systems.
3. **22 pages carry `<!-- Cluster placement not confirmed. -->`** — Cluster 2's list did not
   migrate readably.
4. **Re-diff against a FEBRUARY 2026 numbering sheet if one exists.** Newest held is 2026-01-20.
5. **The F26 roll-forward build list** (Courses log J10): populate `Topic Type` + `Seq` on
   `Curriculum`, slim the `Decks` status set, give `Sessions` a schema. ⚠️ Phase-2 gated.

### 🅿️ Parked

- The ARCHIVE verb — nothing moves an offering from ClickUp-current to FileMaker-history.
  Named, unowned, deferred by Michael.
- Prism v4 (`prism/next-build-spec.md`) — scoped, NOT greenlit.

---

## 2026-08-04 — FIRST REAL SESSION. The course binder, end to end.

Session task: `86ajw170r`. Handoffs cut: `↪️ HANDOFF · 02-courses` and
`↪️ HANDOFF · Transcribe requirements`.

- Seated ~3:05pm. **Ledger C was empty and I said so** rather than inventing a pattern.
- Found the ENGL→THTR renumber and the digit collisions in `Course List`.
- Found Michael's own `🟡 THTR Cluster Requirements` pages and **extracted his line schema
  instead of designing one.**
- Located Nigel's source of truth (URITP-7024) — credits and course families are now canonical.
- Scaffolded the remaining 38 course pages in four commits.
- Scaffolded 6 requirement pages, then **stripped my own prose off them one turn later.**
- PRs: uritp-doc-archive #17–#36 · doc-render-engine #53, #56 · template-docs #23 ·
  ClickUp_apps #737, #739, #741.

**What I got wrong, in order:** quoted an inherited Ledger A line before reading the catalog ·
said "46 courses" twice from a glance instead of a count (**it is 43**) · **misused `{.conf}`
all session** believing it meant *conflict* when it means *confirmed* · struck the current
title instead of the superseded one with `{.was}` · took a crosswalk from the spreadsheet tab
I had myself flagged as misaligned · **wrote explanatory prose onto reader-facing pages twice,
the second time after writing the rule against it into a handoff.**
