# Budget Code Mapper

<!--
  App header page. Launch block stays at the very top and points at the CURRENT
  live version. Overwrite its URL each release. Authoritative standard lives in
  Brain Reference → "Apps / HTML Artifacts" → New-App Documentation Standard.

  Consolidation note: this app previously lived in the repo as the legacy folder
  `budget-code-authority-builder-v5_2026-07-01-1110/` (timestamped dump + chunk
  scaffolding). Canonical folder is `budget-code-mapper/` per the app task's
  GitHub Folder Name field. The legacy folder is being retired.
-->

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/budget-code-mapper/)

[![Launch](https://img.shields.io/badge/▶%20Launch%20Budget%20Code%20Mapper-Open%20in%20browser-ff8000?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/budget-code-mapper/)

> Opens the live app in your default browser (GitHub Pages). Nothing uploads; all processing is local.
> GitHub renders README markdown statically, so the app can't run *inside* this page — the launch link is the supported "docs → running app" path.

**Status:** Migrating (v5 shipped as artifact; repo `index.html` pending manual upload) · **Live:** https://mawizorek.github.io/ClickUp_apps/budget-code-mapper/ · **Source of truth:** [`index.html`](./index.html) on `main` (commit history = version history)

> ⚠︎ **Scaffold state:** `index.html` is currently a placeholder. The real v5 build (~222KB) lives in the legacy folder as `budget-code-authority-builder-v5.html` and is over the ~30KB commit-read cap, so it must be moved in manually via the GitHub UI. See "Migration finish" below.

---

## What it does

Builds/maps budget code authority: takes source budget data and produces a structured, validated mapping of codes to their authorities/owners. (Fill in the specifics from the app task on next pass.)

---

## How to use it

1. **[Launch the app](https://mawizorek.github.io/ClickUp_apps/budget-code-mapper/)** (opens in your browser).
2. Load your source data.
3. Review the generated mapping and export.

---

## Architecture (critical infrastructure notes)

Permanent record of the non-obvious technical decisions.

### Self-contained, offline-first

Single `index.html`, all CSS + JS inline. Works double-clicked from disk. `index.html` IS the app AND the folder's GitHub Pages entry point — never chunk it, never add a manifest.

### Over-cap app (~222KB)

The built app is well over the ~30KB commit-read cap, so it cannot be committed or read back byte-safe through the API write path (that path has corrupted large files before). It is uploaded manually via the GitHub UI. If Brain needs to read it back, generate a `source/` chunk set (File Chunker) per the GitHub MCP Operating Standard.

---

## Migration finish (manual, one-time)

The app source already exists in the repo under the legacy folder. To finish consolidation byte-safe:

1. Download the raw legacy app: [`budget-code-authority-builder-v5.html`](https://raw.githubusercontent.com/mawizorek/ClickUp_apps/main/budget-code-authority-builder-v5_2026-07-01-1110/budget-code-authority-builder-v5.html).
2. In the GitHub UI, upload it into `budget-code-mapper/` **renamed to `index.html`** (overwrite the placeholder).
3. Delete the entire legacy folder `budget-code-authority-builder-v5_2026-07-01-1110/` (app + 15 chunk parts + `_index.txt` + `README.txt` — all retired machinery).
4. Remove the legacy folder from the index `SKIP` set (once it's gone it no longer matters, but keep the set clean).

---

## Version history

Commit history on `main` is the authoritative changelog. Highlights:

- **v5** — current build (in the legacy folder pending manual move).

---

## Related

- **ClickUp task (APPS list):** [Budget Code Mapper](https://app.clickup.com/t/86aj6xb0e) — living spec + next-build brief.
- **Brain tools:** When Building Apps, HTML Artifact Regeneration.

---

## Roadmap

- Finish the manual migration (steps above), then retire the legacy folder + skip entry.
