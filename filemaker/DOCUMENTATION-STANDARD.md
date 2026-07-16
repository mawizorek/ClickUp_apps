# FileMaker Documentation Standard (repo-native)

**Status:** v1.3 · Locked 2026-07-14; calc-inline rule added 2026-07-15; calc-externalize rule replaced it 2026-07-16; **markdown calc sections retired 2026-07-16 (v1.3)** · **Source of truth:** this repo.
**Supersedes:** the ClickUp "FileMaker Documentation Standards" doc, which becomes a one-line pointer here once the cull runs.
**Why (decision log):** [`DECISIONS.md`](./DECISIONS.md) records the reasoning + reversals behind these rules.

---

## Principle

The repo is a **1:1 mirror of the FileMaker solution**. One file per object. You navigate the docs the way you navigate *Manage Database* / *Manage Scripts* inside FileMaker Pro. Every object is edited by **PR**, with review notes attached to that object's own file (Changelog / Notes section) and the PR thread.

This **replaces the old "11 fixed documentation pages" model.** Those pages decompose:

- **Object pages** (Tables, Relationships, Layouts, Scripts, Value Lists) → mirror **folders**, one file per object.
- **Narrative pages** (Design Decisions, Architecture Notes, Data Standards, Changelog, Database Graph Log, Import/Export Specs) → `meta/`.

## Calc bodies live ONLY in standalone files, referenced by pointer (LOCKED 2026-07-16, Michael)

**Every calculation field's formula body lives in its own file under `calculations/`, verbatim FileMaker calc text, referenced from the field by a `calcRef` pointer.** One calc, one file, one source of truth. Nothing else restates OR indexes the formula body — not the table markdown, not a pointer list.

- **Folder:** `<app-slug>/calculations/` — mirrors how `functions/` already works.
- **Filename:** `<Table>__<FieldName>.fmcalc`. The `__` matches the existing namespace-separator convention and kills collisions, since calc field names are NOT globally unique across tables. Extension `.fmcalc` (plain text; the renderer applies its own highlighting).
- **File body:** two `//` header comment lines (owner + return type / stored / one-line purpose), a blank line, then the raw formula exactly as it reads in the FileMaker calc dialog. FileMaker ignores the comment lines, so the whole file is round-trippable: copy the file into the calc dialog, paste it back out unchanged.
- **The pointer:** each calc field in `schema/tables.json` carries `calcRef` (path to the file), plus `returns` and `stored`. The field's structural metadata lives in the JSON; the formula body lives ONLY in the file.
- **Manifest:** `calculations/_index.json` lists every calc with owning table, return type, stored/unstored, purpose, and a `reads` dependency hint (fields + tables the formula touches). The viewer reads the manifest to render the computation layer and draw the dependency graph.
- **Rendered inline, stored centralized.** The JSON-driven viewer fetches each `calcRef` file and shows the formula inline beside its field, so the human never navigates to read it. Storage location and presentation are decoupled: files centralized, presentation inline.
- **The table markdown carries NO calc content (v1.3).** No formula bodies, no pointer list, no per-calc index. The most a table file does is a single prose line noting calcs exist and pointing at the `calculations/` folder. The JSON + manifest + renderer are the calc surface; a markdown pointer list would just be a second index to drift against, which is the exact duplication this model removes.

**Supersession history.** The 2026-07-15 rule "calcs live inline in the owning table's markdown / do NOT centralize" was correct for a markdown-only world where inline was the only way a human saw the formula. 2026-07-16 externalized bodies to `calculations/` and briefly kept a markdown pointer list; v1.3 (same day) retired even the pointer list once the renderer proved out. A cross-table `meta/calculation-fields.md` is not used; the manifest replaces it. Full reasoning: [`DECISIONS.md`](./DECISIONS.md) D-002 → D-003 → D-004.

## Tooling — the shared viewer (`_viewer/`)

The docs are meant to be **rendered**, not just read as raw markdown. `filemaker/_viewer/` is an app-agnostic viewer that renders any app documented to this standard, driven entirely by that app's `schema/tables.json` + `calculations/`:

- **`_viewer/schema.html?app=<slug>`** — field tables with key-type color coding + per-calc formula (fetched live from the `.fmcalc` file, FileMaker syntax highlighting, copy-to-clipboard) + a dependency graph from each calc's `reads` hint.
- **`_viewer/linter.html?app=<slug>`** — validates `calculations/` against the schema (orphan/missing `calcRef`, balanced parens/brackets/quotes, unused `Let` vars, same- and cross-table `reads` resolution, manifest↔schema coverage, header match). Run it before opening a calc PR.
- **`_viewer/index.html`** — launcher; reads `_viewer/apps.json`. **Register a new app by adding one row to `apps.json`** — no viewer code changes. Live: `https://mawizorek.github.io/ClickUp_apps/filemaker/_viewer/?app=<slug>`.

The viewer is live-only (same-origin fetch on Pages); it holds no app data of its own. An app becomes fully viewable the moment its `schema/` + `calculations/` exist and it's registered in `apps.json`.

## Per-app structure

```
filemaker/<app-slug>/
  README.md              cover / entry (Next Steps + Open Questions on top)
  INDEX.md               rendering manifest — links every object folder
  next-build-spec.md     overwritten each build cycle
  schema/                machine mirror (generated JSON: tables/relationships/value-lists)
  tables/                one file per table  (+ README, _index.json) — NO calc bodies
  calculations/          one .fmcalc file per calc field (+ README, _index.json) — canonical formula bodies
  relationships/         graph as data + prose (+ README, _index.json)
  layouts/               one file per layout (+ README, _index.json)
  scripts/               mirrors FMP script folders (+ README, _index.json)
    imports/  navigation/  utilities/  triggers/   ...one file per script
  functions/             one file per custom function (+ README, _index.json)
  value-lists/           value lists (+ README)
  meta/                  narrative docs (design/architecture/data-standards/changelog/graph-log/import-export)
  notes/                 per-build / session notes, PR-linked
```

Copy `_template-fmp-app/` to start a new app. Every future FMP app uses this shape; HML_LLC is the reference implementation. (`_viewer/` and `_template-fmp-app/` are infra, not apps.)

## Rendering manifests (`_index.json`)

Every mirror folder carries an `_index.json` machine manifest so the **viewer** can render the folder without app-specific logic. Humans read the markdown; the viewer reads the JSON. **Keep them in sync in the same PR** — a folder's markdown is never "done" until its `_index.json` reflects it.

## Object file formats

### Table file (`tables/<TableName>.md`)

Header line (Role · Status · App) → one-line description → **Fields** table (Field · Type · Key · Category · Status · Notes) → **Relationships** (edges touching this table) → **Open Items** → **Changelog**. **No Calculations section** (v1.3): calc fields still appear as rows in the Fields table, but their formula bodies live only in `calculations/`. A single prose line pointing at `../calculations/` is allowed, nothing more.

### Calculation file (`calculations/<Table>__<FieldName>.fmcalc`)

Two `//` header comment lines (owner + return/stored/purpose) → blank line → raw FileMaker formula. Verbatim and round-trippable. This file is the single source of truth for the formula body.

### Script file (`scripts/<folder>/<ScriptName>.md`)

Uses the **build-ready header** from the FMP Coding Gate: SCRIPT · ROLE · CALLED BY · CALLS · INPUTS (param, req/opt, type) · GLOBALS IN · RETURNS · GLOBALS OUT · SIDE EFFECTS, then `# --- SECTION ---` dividers → **Current Build** (code block) → **Design Notes** → **Candidate Upgrades** → **Related** → **Changelog**. `commitRecord.md` is the canonical example of this format.

### Function file (`functions/<FunctionName>.md`)

Signature → Purpose → Parameters → Returns → Body (code block, inline) → Related → Changelog.

## Script folders mirror FileMaker

`scripts/` subfolders match the solution's **actual** script-folder names (imports, navigation, utilities, triggers, …). A script's file path equals where it lives in *Manage Scripts*. Do not invent groupings; mirror the file.

## Naming conventions (per-app, recorded in `schema/tables.json` `_meta.conventions`)

Conventions are **declared per app** in that app's `schema/tables.json` `_meta.conventions` and expanded in `meta/data-standards.md`. Two live patterns exist in the workspace and are **NOT yet unified** (flagged for a decision, do not silently merge):

- **URITP pattern:** `pk_`/`fk_` prefixes, `g_` globals, ALLCAPS orchestrators, `__` namespace separator.
- **HML_LLC pattern:** `PrimaryKey` (bare) + `fk<Parent>` (e.g. `fkProperty`), `g_` globals, `calc_` calcs, audit quad (`CreationTimestamp`/`CreatedBy`/`ModificationTimestamp`/`ModifiedBy`).

Use the app's own declared convention. Reconciling the two into one house style is an open governance item.

## PR workflow

Every object edit = branch → PR → self-merge (per GitHub MCP Operating Standard). Review notes live in the PR thread and, durably, in the object file's Changelog. No direct-to-main.

## Culling ClickUp (sequence)

1. Repo becomes canonical (this standard).
2. ClickUp FMP doc bodies get a one-line "source of truth: repo" pointer at top.
3. After **one full build cycle** proves the repo flow end to end, cull the ClickUp doc bodies down to pointers. Do not delete ClickUp content before that cycle completes.

## Changelog

- **2026-07-16 (v1.3.1):** Added the **Tooling** section — promoted the schema renderer + calc linter into `_viewer/` (app-agnostic, `?app=<slug>`, registered via `apps.json`). Added domain decision log `DECISIONS.md` and cross-linked it. Retired the stale `hml-llc/meta/calculation-fields.md` to a breadcrumb.
- **2026-07-16 (v1.3):** Retired the table-markdown `Calculations` section entirely (not even a pointer list). `calculations/` + `calcRef` + the manifest + the renderer are the sole calc surface. Stripped the inline blocks from Loans, ExpectedTransactions, GLOBAL_USE_VARIABLES.
- **2026-07-16 (v1.2):** Calc bodies externalized to `calculations/` (one `.fmcalc` per field, verbatim + round-trippable), referenced by `calcRef` in `schema/tables.json`. Added `calculations/_index.json` manifest with dependency hints. Supersedes the 2026-07-15 inline-calc lock. HML_LLC migrated as the reference implementation.
- **2026-07-15 (v1.1):** Added the (now-superseded) calc-inline rule.
- **2026-07-14 (v1.0):** Repo-native per-object model locked; replaced the 11-fixed-pages model.
