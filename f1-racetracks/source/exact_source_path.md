# F1 Racetracks — Exact Source Path

This page documents the **trustworthy exact-source path** for the post-conversion runtime and source companion.

## Purpose

Some read paths can still distort or summarize file bodies when Patch Penelope tries to read them directly. When that happens, this hierarchy defines the fallback order for recovering the exact source safely.

## Exact-source hierarchy

### 1. Preferred working surface

Use the semantic source files in `f1-racetracks/source/` as the canonical edit surface:

- `01_runtime_head.html`
- `02_styles_foundation_and_layout.css.txt`
- `03_styles_panels_tables_footer.css.txt`
- `04_runtime_shell.html`
- `05_track_data_rounds_01_03.js`
- `06_track_data_rounds_06_09.js`
- `07_track_data_rounds_10_13.js`
- `08_track_data_rounds_14_24.js`
- `09_app_bootstrap_and_home.js`
- `10_track_views_and_profile.js`
- `11_weather_and_footer_exports.js`

Primary body-read attempt remains the raw GitHub URL for each file.

### 2. Exact fallback: commit-patch reconstruction

If a file body is distorted or truncated through the normal read path, reconstruct it from the Git commit patches that introduced the semantic source files.

These are the authoritative source-establishing commits:

- **`0119394a8d66e082f438ed2b73542bc1c1730af0`**
  - semantic source scaffold
  - head / shell / split styles / logic files introduced
- **`cd7d0b8cfe49baec8a3398ee7a54420f8bd9bfc6`**
  - grouped later-season data source promotion began
- **`08dfa257c2e2db082218fb9cfdcb6bdb21267936`**
  - grouped early-season data source promotion
  - source docs/bootstrap references updated to the full grouped-data model

Use `githubmcp_get_commit(detail: "full_patch")` on those SHAs to recover the exact added lines when the normal file-body path is not trustworthy.

### 3. Runtime artifact role

- `../index.html` remains the shipped runtime artifact for GitHub Pages.
- `source/` remains the canonical backend/source surface.
- If exact runtime reconstruction is needed, rebuild from the semantic source files above, not from old chunk sets.

## Important note

The old repo chunk-set workflow is no longer the canonical source path.

From Patch Penelope's perspective, the exact-source fallback is now:

**semantic source files first → commit-patch reconstruction second → monolith last**

## Why this matters

This gives Patch Penelope one more trustworthy exact-source path for future runtime work such as the `data.json` split and other v5 changes, without depending on lossy file-body retrieval.