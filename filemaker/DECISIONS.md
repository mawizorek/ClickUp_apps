# FileMaker Building — Decision Log

Domain-level record of **why** the FileMaker documentation model is shaped the way it is. Cross-app and durable: rulings here govern every FMP app under `filemaker/`, not one app's schema. App-specific rulings live in each app's `meta/design-decisions.md`; the mechanical rules live in [`DOCUMENTATION-STANDARD.md`](./DOCUMENTATION-STANDARD.md). This log captures the reasoning and the reversals so a future agent (or future us) doesn't relitigate a settled call or silently undo one.

**Format:** newest first. Each entry = ID · date · ruling · why · what it superseded (if anything).

---

## D-004 · 2026-07-16 · Table markdown carries no calc content at all

**Ruling:** the per-table markdown `Calculations` section is retired entirely — not even a pointer list. Calc fields still appear as rows in the Fields table; their bodies live only in `calculations/`. (Standard v1.3.)

**Why:** once the body is in `calculations/*.fmcalc` and the renderer surfaces it, a markdown pointer list is just a second index to drift against — the exact duplication this whole model removes. We briefly kept a pointer list in D-003 and cut it the same day. One prose line pointing at the folder is the maximum a table file should say about calcs.

**Superseded:** the pointer-list half of D-003.

## D-003 · 2026-07-16 · Calc bodies externalized to standalone files, referenced by pointer

**Ruling:** every calc field's formula body lives in its own `calculations/<Table>__<FieldName>.fmcalc` file (verbatim FileMaker text, round-trippable), referenced from `schema/tables.json` by a `calcRef` pointer. A `calculations/_index.json` manifest carries return type, stored flag, purpose, and a `reads` dependency hint. (Standard v1.2.)

**Why:** single source of truth for each formula, with a clean per-calc git diff, while keeping the formula **legible as a calculation** (not flattened into a JSON string). Storage and presentation decouple: files centralized, the renderer shows each one inline beside its field, so the human never navigates. Filename uses the `__` namespace separator because calc field names are NOT globally unique across tables.

**Superseded:** D-002.

## D-002 · 2026-07-15 · (SUPERSEDED) Calcs live inline in the owning table's markdown

**Ruling (no longer in force):** a calc field's full formula text lived in a code block inside the owning table's markdown file; centralizing formula bodies in a separate calc file was explicitly forbidden.

**Why it made sense then:** markdown was the only surface a human read, so "inline, next to the field" was the most legible option, and a separate file would have meant navigating away to read a formula.

**Why it was reversed (2026-07-16):** the arrival of the JSON-driven renderer changed the premise. With a renderer, centralized files + inline rendering deliver the same legibility AND a single source of truth AND clean diffs. The rule was correct for its world; the world changed. Reversed deliberately with Michael's explicit go, not silently.

## D-001 · 2026-07-14 · Repo is a 1:1 mirror of the FileMaker solution

**Ruling:** one file per object, folders mirroring *Manage Database* / *Manage Scripts*; narrative docs in `meta/`; machine mirror in `schema/`. Replaced the legacy "11 fixed documentation pages" model. Git is content-canonical; ClickUp docs become pointers after one full build cycle proves the flow.

**Why:** the fixed-pages model didn't scale per-object or diff cleanly. A mirror navigable the way FileMaker itself is navigable, edited by PR, gives per-object history and a deterministic render target.

---

## How this log relates to the others

- **`DOCUMENTATION-STANDARD.md`** = the current mechanical rules (what to do). Its changelog tracks version bumps.
- **This file (`DECISIONS.md`)** = why the rules are what they are, including reversals (what NOT to relitigate).
- **`<app>/meta/design-decisions.md`** = app-specific schema/architecture rulings (e.g. HML_LLC's loan-first schema).
