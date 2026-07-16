# _viewer — shared FileMaker documentation renderer

App-agnostic viewer for any FileMaker app documented under `filemaker/<slug>/` per the repo-native [`../DOCUMENTATION-STANDARD.md`](../DOCUMENTATION-STANDARD.md). Zero app-specific logic: everything is driven by the app's data files (`schema/tables.json`, `schema/relationships.json`, `calculations/`, `scripts/_index.json` + `scripts/**/*.fmscript`, `meta/verification.json`). Point it at a different app with `?app=<slug>` — the views + renderers are global.

## Pages

- **`index.html`** — thin launcher. Reads `apps.json`, lists every registered app with its four lenses. `?app=<slug>` forwards straight to the schema view.
- **`schema.html?app=<slug>`** — schema renderer. Field tables with key-type color coding, per-calc formula (fetched live from the `.fmcalc` file, FileMaker syntax highlighting, copy-to-clipboard), and a D3 dependency graph from each calc's `reads` hint.
- **`relationships.html?app=<slug>`** — relationships renderer. Reads `schema/relationships.json` directly (the single edge surface, per `DECISIONS.md` D-006). D3 TO-graph + edge table; carries the D-007 verification badge for the edge surface.
- **`scripts.html?app=<slug>`** — scripts renderer. Reads the ONE master `scripts/_index.json`, builds the folder tree + CALLS/CALLED-BY graph, and **lazy-loads one `.fmscript` body on drill-in**. `calledBy` is DERIVED at render time. Carries the D-007 verification badge per script. A `.fmscript` is a **dictation reference**, not a paste-round-trip artifact.
- **`linter.html?app=<slug>`** — calc linter + the **authoritative** home for the D-007 SHA/verification check. Run it before opening a PR.

## Verification badge (D-007)

When you open a script or the relationship surface, a badge tells you whether what you're reading is current + trustworthy, built from four signals: **status**, **index↔body agreement** (derived), **blob identity / current** (derived from the git blob SHA), and **live-file verification** (the one stored signal). The only stored data is a self-invalidating `verified:{date,sha,by}` stamp in the per-app **`meta/verification.json`** ledger; everything else is computed at read time.

- 🟢 **green** — internally consistent AND `verified.sha` == the current blob SHA.
- 🟡 **yellow** — consistent but unverified, or edited since last verified (SHA moved), or the live-SHA check was unavailable. Trust the structure, re-confirm against FileMaker.
- 🔴 **red** — index↔body mismatch or a `scriptRef` that doesn't resolve.

The stamp is **self-invalidating**: a content change moves the blob SHA, so a stale stamp auto-flips to yellow. A forgotten update fails safe, never a false green. Absence of a ledger entry = unverified (the safe default). The renderer badge is the glance; the **linter is authoritative** and blocks PRs on red. Full contract: `DOCUMENTATION-STANDARD.md` → Object verification & audit trail + `DECISIONS.md` D-007.

## How it resolves an app

`?app=<slug>` → base path `../<slug>/`. On GitHub Pages the viewer and the app folders are same-origin, so all fetches are live. The badge's current-SHA check uses the public GitHub contents API (unauthenticated, rate-limited); if it's unavailable the badge degrades to yellow with a reason. Live URL: `https://mawizorek.github.io/ClickUp_apps/filemaker/_viewer/?app=hml-llc`.

## Registering a new app

Add a `{ slug, name, desc }` row to `apps.json`. Nothing else. The app must follow the standard's folder shape.

## Status / baseline note

`schema` + `linter` are the mature lenses. `relationships` + `scripts` are a **committed baseline (v1)** — functional and driven entirely by the app's JSON, with the D-007 badge wired in. Intentionally left clean for a follow-up agent to extend (a script linter, the authoritative SHA check folded into `linter.html`, richer graph layout/zoom, cross-lens deep-links, and convergence into the `z-fm-layout-object-viewer`). See `brain-config/open-thread.md`. `schema.html` will get the same badge on the next pass. They read real data today: point them at `hml-llc`.
