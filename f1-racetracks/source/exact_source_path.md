# F1 Racetracks — Exact Source Path

This page documents the **trustworthy exact-source path** for the current v5 runtime and source companion.

## Purpose

Some read paths can still distort or summarize file bodies when Patch Penelope tries to read them directly. When that happens, this hierarchy defines the fallback order for recovering the current source safely.

## Exact-source hierarchy

### 1. Preferred working surfaces

Use these surfaces by concern:

- **Shell / styles / logic:** `f1-racetracks/source/`
- **Runtime data:** `f1-racetracks/data.json`
- **Shipped runtime artifact:** `f1-racetracks/index.html`
- **Standalone live companion:** `f1-racetracks/live-tracker.html`

Within `source/`, read in this order:

- `01_runtime_head.html`
- `02_styles_foundation_and_layout.css.txt`
- `03_styles_panels_tables_footer.css.txt`
- `03b_styles_results_and_mobile.css.txt`
- `03c_live_session_panel.css.txt`
- `04_runtime_shell.html`
- `09_app_bootstrap_and_home.js`
- `10_track_views_and_profile.js`
- `11_weather_and_footer_exports.js`
- `13_live_session_panel.js`

Primary body-read attempt remains the raw GitHub URL for each file.

### 2. Exact fallback: commit-patch reconstruction

If a file body is distorted or truncated through the normal read path, recover the exact lines from the Git commit patches that introduced or last materially rewrote that file.

Use `githubmcp_get_commit(detail: "full_patch")` on the relevant source-establishing or source-sync commit for the specific file you are repairing.

### 3. Runtime role

- `index.html` remains the shipped runtime artifact for GitHub Pages.
- `data.json` remains the authoritative runtime data surface.
- `source/` remains the canonical shell/style/logic companion.

## Important note

The old semantic-source migration blocker note is retired. The active exact-source path is now:

**source shell/style/logic files first → data.json for runtime data → commit-patch reconstruction if needed → runtime artifact last**

## Why this matters

This keeps Patch Penelope on the current, trustworthy surfaces and prevents future work from falling back to stale migration notes or retired duplicated data bundles.