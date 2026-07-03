# F1 Racetracks — Semantic Source Migration Status

**Date:** 2026-07-02
**Status:** blocked pending exact v4 source handoff
**App folder:** `f1-racetracks/`

## Goal

Convert the app's editable source representation from the current long-form / legacy chunk setup into **semantic source files under 30 KB each**, split by concern and suitable for safe future edits and review.

## What exists now

- Runtime artifact: `index.html` (125,661 bytes)
- Repo-readable companion: legacy `source/` chunk set (`f1-racetracks_partNN_of_9.txt`)
- Current next-build focus in `next-build-spec.md`: v5 data separation (`data.json`) and new race-history UI work

## Why the migration is blocked

The currently available read paths are not yet giving Patch Penelope a trusted, full-fidelity copy of the exact v4 HTML body suitable for a structural rewrite.

Known issues observed during this run:

- raw fetch attempts did not yield a trustworthy byte-exact body
- attachment/doc loading still truncates large-source retrieval in agent context
- the existing legacy chunk set is useful for targeted reading, but not yet sufficient as a safe base for a full semantic-source rebuild without risk of silent drift

## Required handoff to unblock

Use the prepared ClickUp doc:

- `Paste full F1 Racetracks v4 HTML source`

Paste the exact current full HTML body there with no commentary before or after the source.

## Planned migration once unblocked

1. Read the exact v4 source from the pasted doc body
2. Keep shipped `index.html` intact as the runtime artifact until the semantic source is verified
3. Create a semantic source set under `f1-racetracks/source/` with concern-based files kept below the working budget
4. Rebuild / verify the runtime artifact from that structured source
5. Open the full implementation PR to Michael for approval

## Suggested target split

- `source/00_notes.md` — reconstruction notes + invariants
- `source/01_shell.html` — document shell / static markup
- `source/02_tokens_and_base.css.txt` — design tokens, resets, layout primitives
- `source/03_home_and_cards.css.txt` — home/index view styling
- `source/04_track_view.css.txt` — track/detail view styling
- `source/05_data_contract.js` — app constants + data-loading contract
- `source/06_renderers.js` — renderHome/renderTrack/renderSoon
- `source/07_chart_and_weather.js` — profile chart + weather loader
- `source/08_router_and_exports.js` — router, footer export tools, boot

## Budget rule

- soft target: ~10–12 KB per semantic source file
- hard split threshold: ~15 KB unless explicitly approved otherwise

## Purpose of this file

This file exists to make the blocker explicit in the repo and to document the exact next move needed before the real semantic-source conversion PR can be authored safely.
