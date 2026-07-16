# _viewer — shared FileMaker documentation renderer

App-agnostic viewer for any FileMaker app documented under `filemaker/<slug>/` per the repo-native [`../DOCUMENTATION-STANDARD.md`](../DOCUMENTATION-STANDARD.md). Zero app-specific logic: everything is driven by the app's `schema/tables.json` + `calculations/_index.json` + `calculations/*.fmcalc`.

## Pages

- **`index.html`** — thin launcher. Reads `apps.json`, lists every registered app, links each to the two lenses. If opened with `?app=<slug>` it forwards straight to the schema view.
- **`schema.html?app=<slug>`** — schema renderer. Field tables with key-type color coding, per-calc formula (fetched live from the `.fmcalc` file, FileMaker syntax highlighting, copy-to-clipboard), and a D3 dependency graph built from each calc's `reads` hint.
- **`linter.html?app=<slug>`** — calc linter. Validates `calculations/` against `schema/tables.json`: orphan/missing `calcRef`, balanced parens/brackets/quotes, unused `Let` vars, same-table + cross-table `reads` resolution, manifest↔schema coverage, header match.

## How it resolves an app

`?app=<slug>` → base path `../<slug>/`. On GitHub Pages the viewer and the app folders are same-origin, so all fetches are live and immutable-free (no embedded snapshots). Live URL: `https://mawizorek.github.io/ClickUp_apps/filemaker/_viewer/?app=hml-llc`.

## Registering a new app

Add a `{ slug, name, desc }` row to `apps.json`. Nothing else. The app must follow the standard's folder shape (`schema/`, `calculations/`, `tables/`).
