# F1 Racetracks

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)

![Launch](https://img.shields.io/badge/Launch-F1_Racetracks-red?style=for-the-badge)

**Status:** v5 data split in review · backend source conversion complete

**Source of truth:** this repo folder

**ClickUp task:** F1 Racetracks — circuit breakdown app (APPS list)

---

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | App engine (UI, routing, render logic, styling) | Version bumps only |
| `data.json` | Manifest + app data entry point for the externalized track dataset | Weekly / after each race via MCP |
| `source/` | Semantic source scaffold (shell, styles, grouped data, logic) | Maintained with engine changes |
| `next-build-spec.md` | Current build spec for the next version | Overwritten each version cycle |

**What "update the app" means here:**

- Updating race results, standings, or track data → commit `data.json` and any backing grouped data source updates. No UI version bump required.
- Adding features, changing layout, fixing bugs → update `index.html` via PR. Version bump.
- Editing the agent-readable source structure → update `source/` in the same PR as the related engine change when possible.

> **Note:** this PR focuses on the safe data split only. Podium, pole, and winners-history UI are still separate next steps.

---

## What it does

A single HTML app holding every 2026 F1 circuit breakdown in one place. The index is the home screen (grid of all 24 rounds); each track is a hash-routed view inside the same app. One shared render engine + externalized track dataset, so layout changes and data changes can now be managed separately.

---

## Architecture

- **Runtime:** `index.html` now fetches `data.json` on load, caches the manifest in `localStorage`, and loads the grouped track data sources declared there.
- **Footer fix:** home-state footer metadata now reports the current full round count from loaded data instead of stale hardcoded text.
- **Source scaffold:** `source/` remains the canonical backend edit surface.
- **Next UI features still pending:** podium block, pole breakdown, historic winners.

---

## Version history

- **v5 data split** (in review) — externalized track dataset entry via `data.json`, manifest caching, and footer fix
- **v4.2** — backend source conversion cleanup
- **v4.1** — semantic source scaffold added under `source/`
- **v4** — standalone offline-first build; footer source-export trio + Export data (.json), sandbox-safe
- v3 — +4 circuits (Hungary, Netherlands, Italy, Spain/Madrid); 14 of 24 built
- v2 — fixed four wrong Wikimedia map filenames
- v1 — initial single-file app: 10 breakdowns, index + hash-routed track views