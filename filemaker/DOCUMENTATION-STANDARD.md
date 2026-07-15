# FileMaker Documentation Standard (repo-native)

**Status:** v1.1 · Locked 2026-07-14, calc-inline rule added 2026-07-15 · **Source of truth:** this repo.
**Supersedes:** the ClickUp "FileMaker Documentation Standards" doc, which becomes a one-line pointer here once the cull runs.

---

## Principle

The repo is a **1:1 mirror of the FileMaker solution**. One file per object. You navigate the docs the way you navigate *Manage Database* / *Manage Scripts* inside FileMaker Pro. Every object is edited by **PR**, with review notes attached to that object's own file (Changelog / Notes section) and the PR thread.

This **replaces the old "11 fixed documentation pages" model.** Those pages decompose:

- **Object pages** (Tables, Relationships, Layouts, Scripts, Value Lists) → mirror **folders**, one file per object.
- **Narrative pages** (Design Decisions, Architecture Notes, Data Standards, Changelog, Database Graph Log, Import/Export Specs) → `meta/`.

## Calcs live inline with what they define (LOCKED 2026-07-15, Michael)

**A calculation field's full FileMaker calc-option text lives in a code block INSIDE the file of the object that owns it** — the table file for a table calc, right beside that field. Never make a reader navigate to a separate file to see a formula they're looking at in a field list. **Do NOT centralize formula bodies in a separate calc file.** A cross-table `meta/calculation-fields.md` may exist ONLY as a thin index (field name + owning table + one-line purpose, linking to the inline definition); it must never hold the formula bodies. One definition, one home, physically next to the field. This generalizes to every FMP app.

## Per-app structure

```
filemaker/<app-slug>/
  README.md              cover / entry (Next Steps + Open Questions on top)
  INDEX.md               rendering manifest — links every object folder
  next-build-spec.md     overwritten each build cycle
  schema/                machine mirror (generated JSON: tables/relationships/value-lists)
  tables/                one file per table  (+ README, _index.json) — calc formulas inline here
  relationships/         graph as data + prose (+ README, _index.json)
  layouts/               one file per layout (+ README, _index.json)
  scripts/               mirrors FMP script folders (+ README, _index.json)
    imports/  navigation/  utilities/  triggers/   ...one file per script
  functions/             one file per custom function (+ README, _index.json)
  value-lists/           value lists (+ README)
  meta/                  narrative docs (design/architecture/data-standards/changelog/graph-log/import-export) + calc INDEX only
  notes/                 per-build / session notes, PR-linked
```

Copy `_template-fmp-app/` to start a new app. Every future FMP app uses this shape; HML_LLC is the reference implementation.

## Rendering manifests (`_index.json`)

Every mirror folder carries an `_index.json` machine manifest so the **Phase 2 viewer skin** can render the folder without app-specific logic. Humans read the markdown; the viewer reads the JSON. **Keep them in sync in the same PR** — a folder's markdown is never "done" until its `_index.json` reflects it.

## Object file formats

### Table file (`tables/<TableName>.md`)

Header line (Role · Status · App) → one-line description → **Fields** table (Field · Type · Key · Category · Status · Notes) → **Calculations** (each calc field's purpose + its FileMaker calc-option text in a code block, INLINE) → **Relationships** (edges touching this table) → **Open Items** → **Changelog**.

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
