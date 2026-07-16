# _viewer — shared FileMaker documentation renderer

App-agnostic viewer for any FileMaker app documented under `filemaker/<slug>/` per the repo-native [`../DOCUMENTATION-STANDARD.md`](../DOCUMENTATION-STANDARD.md). Zero app-specific logic: everything is driven by the app's data files (`schema/tables.json`, `schema/relationships.json`, `calculations/`, `scripts/_index.json` + `scripts/**/*.fmscript`). Point it at a different app with `?app=<slug>` — the views + renderers are global.

## Pages

- **`index.html`** — thin launcher. Reads `apps.json`, lists every registered app with its four lenses. `?app=<slug>` forwards straight to the schema view.
- **`schema.html?app=<slug>`** — schema renderer. Field tables with key-type color coding, per-calc formula (fetched live from the `.fmcalc` file, FileMaker syntax highlighting, copy-to-clipboard), and a D3 dependency graph from each calc's `reads` hint.
- **`relationships.html?app=<slug>`** — relationships renderer. Reads `schema/relationships.json` directly (the single edge surface, per `DECISIONS.md` D-006). D3 TO-graph (nodes = tables, edges = `child.field → parent.PrimaryKey`, label = cardinality, color = status) + an edge table; pick a table on the left to isolate its edges.
- **`scripts.html?app=<slug>`** — scripts renderer. Reads the ONE master `scripts/_index.json`, builds the folder tree + the CALLS/CALLED-BY graph, and **lazy-loads one `.fmscript` body on drill-in** (never bulk-loads the corpus). `calledBy` is DERIVED at render time by inverting every row's `calls[]` — never stored. `#`-comment narrative is highlighted; the body carries a copy button. A `.fmscript` is a **dictation reference**, not a paste-round-trip artifact (see the standard).
- **`linter.html?app=<slug>`** — calc linter. Validates `calculations/` against `schema/tables.json`.

## How it resolves an app

`?app=<slug>` → base path `../<slug>/`. On GitHub Pages the viewer and the app folders are same-origin, so all fetches are live. Live URL: `https://mawizorek.github.io/ClickUp_apps/filemaker/_viewer/?app=hml-llc`.

## Registering a new app

Add a `{ slug, name, desc }` row to `apps.json`. Nothing else. The app must follow the standard's folder shape.

## Status / baseline note

`schema` + `linter` are the mature lenses. `relationships` + `scripts` are a **committed baseline (v1)** — functional and driven entirely by the app's JSON, intentionally left clean for a follow-up agent to extend (a script linter, richer graph layout/zoom, cross-lens deep-links, and eventual convergence into the `z-fm-layout-object-viewer`). See `brain-config/open-thread.md` for the roadmap. They read real data today: point them at `hml-llc` and the relationship graph is fully populated; the scripts lens shows `commitRecord` with its derived call edges.
