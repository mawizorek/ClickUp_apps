# Semantic Source (template-app)

This folder is the **editable source companion** for `template-app`.

The shipped runtime still lives in `../index.html`, but the working source is split into small semantic files so Patch Penelope can update structure, logic, and team theming without editing the compiled runtime blob first.

## Files

- `source_index.md` — composition order, size guardrails, and rebuild notes
- `01_structure.html` — canonical shell/layout with insertion markers
- `02_base.css.txt` — shared layout + component styling
- `03_theme_team.css.txt` — the team-specific visual system (current proof = Red Bull)
- `04_app.js` — runtime behavior (GitHub API fetch, caching, rendering)

## Why this exists

This app is the proof-of-concept for a better source model than arbitrary byte chunks:

- the runtime remains a single-file app for GitHub Pages
- the editable source becomes small, semantic, and reviewable
- team-theme swaps become mostly a one-file operation

## Guardrails

1. Keep every source file comfortably under ~15 KB.
2. Change the theme in `03_theme_team.css.txt` before touching other files.
3. When structure or logic changes, regenerate `../index.html` by re-inlining the source files in the order listed in `source_index.md`.
4. Preserve the app's dual role: working repo index + future app template.
