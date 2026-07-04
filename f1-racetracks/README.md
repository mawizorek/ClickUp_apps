# F1 Racetracks

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)

![Launch](https://img.shields.io/badge/Launch-F1_Racetracks-red?style=for-the-badge)

**Status:** V1.7e split live · temp rescue/polish source files retired · weekend surfaces moved into permanent modules

**Source of truth:** this repo folder

---

## What it does

A browser-based 2026 F1 circuit guide with one home grid, one hash-routed circuit view per round, externalized runtime data in `data.json`, and modular runtime logic loaded directly from `source/`.

**Per-circuit breakdown includes:**

- official outline map
- lap profile + sector timing character
- tyre strategy + overtaking notes
- race-weekend weather
- completed-race podium / pole / winners history
- current-round shortcut card on home
- Weekend Center on circuit pages with schedule / live / replay surfaces
- standalone live tracker companion for the wider OpenF1 view

---

## How to use it

- Open the app → home grid shows all tracked rounds
- Tap a circuit card → full circuit breakdown view
- Use the home current-round card to jump directly into the active weekend
- Use Weekend Center on the track page for schedule / live / replay context
- Use the footer tools for source copy, download prep, new-tab source, and JSON export
- Use [**Live Tracker**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html) for the broader companion view

---

## Architecture

- **Runtime model:** `index.html` is a slim Pages entrypoint. It loads runtime styles plus JS modules from `source/`, and runtime data from `data.json`.
- **Source model:** `source/` is the canonical editable surface. Normal app edits should begin there, not by reverse-engineering the shipped entrypoint.
- **Weekend surface ownership:**
  - `14_weekend_state_and_data.js` — shared weekend state, schedule seeds, replay seeds, live aliases/helpers
  - `15_weekend_surface_render.js` — home current-round card, weekend-center renderers, shared style/footer layer
  - `16_weekend_live_mode.js` — weekend-center OpenF1 live mode hydration
  - `17_weekend_mount.js` — lifecycle / mount / re-render bindings
  - `18_home_and_mobile_polish.js` — compact home/mobile polish and table/podium fixes
- **Retired pattern:** the former `14_surface_rescue.js` and `15_compact_polish.js` temp-fix buckets were removed. Future feature or bug-fix work should land in permanent concern-based modules instead of creating new junk-drawer files.
- **Routing:** `#/` = home. `#/slug` = circuit view. Existing router flow still drives the app.
- **Live data:** `data.json` remains the canonical runtime data payload. Weekend live mode and the companion tracker use OpenF1 as a live enrichment layer.

---

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Slim shipped Pages entrypoint | Rare structural changes only |
| `data.json` | Runtime data for rounds, results, winners, freshness metadata | Weekly / after each race |
| `live-tracker.html` | Standalone OpenF1 companion surface | When the companion evolves |
| `source/` | Canonical editable source surface | Primary edit surface |
| `next-build-spec.md` | Forward-looking queue / continuity brief | Updated during active work |

---

## Version history

- **V1.7e split** — retired the temp rescue/polish source files and replaced them with permanent weekend modules by concern
- **V1.7d polish** — synced home and track schedule language, hard-bound the home CTA, tightened footer repetition and mobile polish
- **V1.7c polish** — synced home card and track schedule rhythm, fixed footer repeat behavior, tightened podium mobile typography
- **V1.7b compact** — compacted the current-round card and simplified mobile spacing
- **V1.7a** — tightened the current-round card and localized weekend schedule times
- **V1.7 full** — shipped the fuller Weekend Center experience
- **V1.5 PR22** — added the first main-app Weekend Center shell and current-round highlight card
- **v5** — demonolithized runtime structure, moved track data into `data.json`, and introduced live-session integration / companion tracking
- **v4** — full standalone circuit breakdown baseline

---

## Related

- [APPS task](https://app.clickup.com/t/36074068/86aj9wgx0)
- [Repo folder](https://github.com/mawizorek/ClickUp_apps/tree/main/f1-racetracks)
- [Live Tracker](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/live-tracker.html)

---

## Roadmap

- split `source/10_track_views_and_profile.js` into smaller concern-based modules
- rebalance grouped round-data files that are still over the 15 KB working threshold
- harden the standalone `live-tracker.html` fetch/error path
- move more seeded weekend timing / replay content into canonical runtime data where it belongs
