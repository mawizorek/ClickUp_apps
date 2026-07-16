# FileMaker Building — Decision Log

Domain-level record of **why** the FileMaker documentation model is shaped the way it is. Cross-app and durable: rulings here govern every FMP app under `filemaker/`, not one app's schema. App-specific rulings live in each app's `meta/design-decisions.md`; the mechanical rules live in [`DOCUMENTATION-STANDARD.md`](./DOCUMENTATION-STANDARD.md). This log captures the reasoning and the reversals so a future agent (or future us) doesn't relitigate a settled call or silently undo one.

**Format:** newest first. Each entry = ID · date · ruling · why · what it superseded (if anything).

---

## D-006 · 2026-07-16 · Relationships: one edge surface (`schema/relationships.json`)

**Ruling:** `schema/relationships.json` is the SINGLE source + render surface for the relationship graph. The `relationships/README.md` edge table is retired (narrative only), and `relationships/_index.json` no longer restates edges (render hints only, pointing at the schema file). The renderer + linter read `schema/relationships.json` directly, the way the schema viewer reads `schema/tables.json`. (Standard v1.4.)

**Why:** the edge list had been living in three places — the schema JSON, the README edge table, and the folder `_index.json` — the exact triplicate-index drift D-004 killed for calcs. One surface, one home. Relationships have no code body, so there is no externalized `.fm*` file: they are pure data. Record shape (`from{table,field}` · `to{table,field}` · `cardinality` · `status` · `notes`) was already right and is unchanged.

**Superseded:** the README-restates-edges and `_index`-duplicates-edges halves of the 2026-07-14 relationships scaffolding.

## D-005 · 2026-07-16 · Scripts ride the calc externalization model as DICTATION references

**Ruling:** every script's body lives in its own lean `scripts/<folder>/<ScriptName>.fmscript` (plain text: the exact steps to dictate into *Manage Scripts*, with narrative carried as native `#` comment lines). ONE master `scripts/_index.json` indexes the whole tree as a flat `scripts[]` array with minimal rows (`name`, `folder`, `calls[]`, `scriptRef`); the renderer builds the folder tree from `folder` and the call graph from `calls[]`, and DERIVES `calledBy` at render time by inverting `calls[]` (never stored). No per-script sidecar, no per-folder index, no indexes-of-indexes, no prose markdown per script. (Standard v1.4.)

**Why:** same single-source-of-truth + thin-renderer baseline as calcs — metadata in JSON, body in a lean legible file, presentation via a renderer that reads the JSON. Michael's constraints drove three specifics: (1) ONE master index, not indexes-of-indexes and not fat sidecars, so the renderer never bulk-loads the corpus and never needs a code change when scripts/folders are added (listing is not loading — the tree + graph read only the small index; a body is fetched lazily on drill-in); (2) minimal rows + render-time `calledBy` so the index stays far under the ~30KB read cap (~90 bytes/row ≈ 300 scripts before it's even a question; shard by top-level folder behind a pointer only if some monster solution ever crosses it, still no renderer change); (3) narrative as `#` comments INSIDE the body so the body is 1:1 with the FileMaker dialog and the index stays lean. `calls[]` may reference a custom function as well as a script; the linter resolves each target against `scripts/_index.json` then `functions/_index.json`.

**The one honest limit (Workshop / Breaker Beckett catch):** unlike a `.fmcalc`, a `.fmscript` does NOT paste back into FileMaker verbatim — FileMaker's script-step clipboard is a proprietary XML snippet, not plain text. So a `.fmscript` is a DICTATION reference (you read/type it into *Manage Scripts*), not a round-trippable paste artifact. Legibility was chosen over round-trip deliberately; the standard must never claim script paste-round-trip. Script names are unique per file, so `name` is a safe graph key (calc fields needed `<Table>__<Field>` because they are not).

**Superseded:** the 2026-07-14 markdown script-file format (build-ready header + Current Build / Design Notes / Candidate Upgrades / Related / Changelog as prose sections). That narrative now lives as `#` comments in the `.fmscript`; the machine fields live in `_index.json`. `commitRecord` was converted to the new form as the reference implementation; its old `.md` is a breadcrumb pointer.

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
