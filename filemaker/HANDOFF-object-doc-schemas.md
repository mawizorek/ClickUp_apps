# Handoff — Object Documentation Schemas (scripts, relationships, value lists, layouts, functions)

**Created:** 2026-07-16 · **For:** the next FileMaker-docs session (fresh agent) · **Status:** DESIGN PENDING — do not build object docs until the schema per type is decided.

## Why this session exists

We just brought **tables + fields** and **calculations** up to a "full machine-schema-plus-tooling" grade (self-describing JSON + manifest + renderer + linter, single source of truth, rendered inline, git-canonical). The remaining object types are NOT at that grade. Before documenting real content into them, we want to **decide the documentation structure/schema for each remaining type** so they follow one coherent model instead of being invented ad hoc.

**This session is DESIGN, not data entry.** Decide the schema per object type first. Actual documentation (populating from the live FileMaker file / the current markdown stubs) is the session AFTER this one.

## The reference model to follow (what "full grade" means)

Set by the tables/fields + calc work (see `DOCUMENTATION-STANDARD.md` v1.3.1 + `DECISIONS.md` D-001→D-004):

1. **Self-describing JSON is the source of truth** for structural data (`schema/*.json`), every record carrying enough type/role/status metadata that a passive viewer can render it with zero app-specific logic.
2. **A body that must stay legible as code lives in its own standalone file**, referenced by a pointer (the calc model: `.fmcalc` file + `calcRef`). Verbatim, round-trippable, one definition/one home.
3. **A folder manifest** (`_index.json`) carries render + dependency hints.
4. **The shared viewer** (`_viewer/`, app-agnostic, `?app=<slug>`) renders it; **a linter** validates it.
5. **Markdown does not duplicate** what the JSON owns. Zero drift.

The design question for each type below: **how much of this ladder does it need, and what does its record shape look like?**

## Current-state scorecard (what exists right now, per type)

| Object type | Grade today | What exists | The gap |
|---|---|---|---|
| Tables + Fields | ✅ full | `schema/tables.json` + per-table md + `_index.json` + renderer + linter | reference impl; done |
| Calculations | ✅ full | `calculations/*.fmcalc` + `calcRef` + `_index.json` + renderer + linter | done this session |
| **Relationships** | 🟡 data, no tooling | real `schema/relationships.json` + full edge table in `relationships/README.md` + `_index.json` | no renderer view, no linter, no per-edge decision on format |
| **Scripts** | 🟠 format only | build-ready header format spec'd; `commitRecord.md` is a complete real example; folders mirror FMP script tree | no machine JSON; inventory unenumerated; body-storage question (inline vs `.fmscript` file like calcs?) open |
| **Custom Functions** | 🟠 format only | format spec'd (Signature→Purpose→Params→Returns→Body→Related→Changelog); one stubbed file (`MSG_ValueListErrors`, body pending) | no machine JSON; same body-storage question as scripts (functions ARE calc-like code) |
| **Layouts** | 🔴 role-level only | README role set + design language; per-layout files are role stubs, everything "pending a DDR pass" | no object/part inventory schema; hardest to model (visual, not textual) |
| **Value Lists** | 🔴 design-intent only | README table + `schema/value-lists.json` exists | no `_index.json`; values unconfirmed; thin — may not need the full ladder |

## Key design questions to resolve THIS session

**Cross-cutting (decide once, applies to all):**
- **Body-storage rule for code-bearing types.** Scripts + custom functions both contain FileMaker code that must stay legible. Does the calc model generalize — standalone `.fmscript` / `.fmfn` files + a pointer, rendered inline? Or do scripts stay markdown (they carry lots of prose/sections around the code, unlike a bare calc)? This is the biggest fork; it likely sets the pattern for the other two.
- **JSON-vs-markdown split per type.** For each, what's the structural JSON (renderable/lintable) vs the human narrative (markdown)? Calcs put ~everything in JSON+file; scripts may be narrative-heavy enough to invert that.

**Per type:**
- **Relationships** (cheapest win): the JSON already exists. What's the renderer view (a graph? it's begging for the D3 dependency-graph treatment already built for calcs) and what does a linter check (both endpoints resolve to real table+field, cardinality valid, no orphan edges)?
- **Scripts** (highest value — real logic lives here): confirm/lock the build-ready header as the schema, decide body storage, decide the machine manifest shape (CALLS/CALLED BY is a dependency graph too), decide how folder-mirroring interacts with the manifest.
- **Custom Functions**: likely rides the scripts decision (both are code). Decide if functions get their own `.fmfn` files + dependency edges (function calls function).
- **Layouts**: the odd one out (visual). Decide how deep the schema goes — object/part inventory as JSON? component-family tagging? or stay narrative + screenshots? Don't force the calc model where it doesn't fit.
- **Value Lists**: decide if it even needs the full ladder or stays a thin JSON + README (the standard already says metadata-bearing lists become tables, so true value lists are simple labels).

## Locked — do NOT relitigate

- The calc externalization + inline-lock reversal (D-002→D-004). Settled. Reversing-a-reversal needs Michael's explicit call.
- Repo is git-canonical, 1:1 mirror of the FMP solution, one file per object, edited by PR (D-001).
- The shared `_viewer/` pattern (app-agnostic, register via `apps.json`).
- Naming conventions are per-app in `schema/tables.json` `_meta.conventions`; the URITP-vs-HML convention unification is a SEPARATE open governance item, not this session's job.

## Source-of-truth docs to load first (in order)

1. `filemaker/DOCUMENTATION-STANDARD.md` (v1.3.1) — the mechanical rules + object file formats + Tooling section.
2. `filemaker/DECISIONS.md` — why the model is shaped this way + the reversals.
3. The reference implementations: `filemaker/hml-llc/schema/tables.json`, `filemaker/hml-llc/calculations/` (+ `_index.json`), `filemaker/hml-llc/scripts/utilities/commitRecord.md` (canonical script example), `filemaker/hml-llc/relationships/README.md` + `schema/relationships.json`.
4. `filemaker/_viewer/` — the renderer + linter to extend per type.
5. `brain-config/open-thread.md` — the calc-externalization session entry + its open follow-ups (a–f); items (a) `reads` parser, (b) fold linter into Schema Linter, (c) markdown generation all bear on how new types get tooled.

## Suggested sequence for the build sessions that follow this design session

1. **Relationships first** — cheapest (JSON exists), and its graph renderer + linter are near-copies of the calc dependency-graph + linter already built. Proves the model generalizes beyond calcs with minimal new code.
2. **Scripts** — highest value; the body-storage decision here sets the pattern.
3. **Custom Functions** — rides the scripts decision.
4. **Value Lists** — quick, likely thin.
5. **Layouts** — last; hardest to model, needs a live-file DDR pass regardless.

## Warm-start prompt (paste to open the next session)

> We're designing how to document the remaining FileMaker object types — scripts, relationships, value lists, layouts, and custom functions — so they reach the same "full schema + tooling" grade we already built for tables/fields and calculations. Read `filemaker/HANDOFF-object-doc-schemas.md` first, then the SOT docs it lists. This session is DESIGN ONLY: decide the record shape / JSON-vs-markdown split / body-storage rule / renderer + linter plan per type. Do not populate real object docs yet. Start by walking me through the cross-cutting body-storage question (does the calc `.fmcalc`+pointer model generalize to scripts and functions?), then go type by type. Nothing is committed to a standard until I approve it.
