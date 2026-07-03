# F1 Racetracks — Documentation Handoff

**Date:** 2026-07-03
**From:** Brain (Michael's session)
**To:** Penelope
**Priority:** Do this before any further feature work.

---

## Summary

You shipped a major architectural rework (multi-file runtime, data.json separation, live tracker) but the docs still describe an app that no longer exists in that form. The README, spec, task, and several repo files are stale or contradictory. This handoff lists exactly what needs reconciling.

---

## Current repo state (what actually exists)

```
f1-racetracks/
  index.html              — 4KB thin shell (fetches CSS from ./source/ at runtime)
  data.json               — 10KB track data (already separated from engine)
  live-tracker.html       — 24KB live session tracker (undocumented)
  next-build-spec.md      — Still describes v5 responsive fix as active build
  semantic-source-migration-status.md — Says "blocked" but migration is complete
  README.md               — Stale (migration warning, no Infrastructure table, no data.json mention)
  source/                 — Semantic source files serving DUAL purpose:
                            1. Runtime CSS delivery (fetched by index.html)
                            2. Agent-readable source for cold-pickup
```

## What the standard requires (from Apps / HTML Artifacts reference)

1. **`index.html` = the entire self-contained app.** CSS + JS inline, offline-first, double-click and it runs. The current 4KB loader violates this.
2. **`source/` = Brain's readable rendition only.** Not a runtime dependency. Currently it's both.
3. **README must have:** launch button (✅ exists), Infrastructure table (❌ missing), accurate architecture section (❌ stale), version history reflecting actual state (❌ stale).
4. **`next-build-spec.md`** must describe the NEXT build, not a completed one, plus a Planned section for queued features.
5. **No undocumented files.** `live-tracker.html` exists with zero documentation anywhere.

---

## Action items (ordered by priority)

### 1. Resolve the architecture question (needs Michael's input)

The multi-file runtime (shell + fetched source files) breaks the self-contained single-file standard. Two paths:

- **A. Restore single-file:** rebuild `index.html` as a full inline app (~126KB), keep `source/` as read-only Brain companion.
- **B. Adopt multi-file as the new standard for this app:** document the deviation explicitly in the README Architecture section with rationale (e.g. "Pages-hosted, fetch-based for maintainability"). Note: this breaks offline `file://` use.

Ask Michael which direction before proceeding.

### 2. Update README.md

- Remove the "⚠️ Migration note" (migration is done).
- Add the mandatory **Infrastructure table**:
  ```
  ## Infrastructure
  | File | Role | Update frequency |
  |------|------|------------------|
  | `index.html` | App shell (runtime loader) | Version bumps only |
  | `data.json` | Living dataset (track data + schedule) | Weekly via MCP |
  | `live-tracker.html` | Live session companion app | Version bumps |
  | `source/` | Semantic source (CSS/JS, fetched at runtime) | Version bumps |
  ```
- Update Architecture section to describe the ACTUAL current structure (multi-file, fetch-based, data.json).
- Document `live-tracker.html`: what it does, how to launch it, what data it uses.
- Update Version history to include v5 (what actually shipped, not the old spec description).
- Update Roadmap to reflect the actual planned features (now in next-build-spec.md Planned section).

### 3. Update next-build-spec.md

- The v5 responsive fix section is stale (that work appears to have been done as part of the rework).
- Determine what the ACTUAL next build target is and write the active spec for it.
- Re-add the Planned section with:
  - **Race Weekend Schedule Panel** (full spec was written, see below)
  - Any other queued features

### 4. Clean up stale files

- **`semantic-source-migration-status.md`** — Delete or archive. It says "blocked" but the migration is clearly complete. This file creates confusion.

### 5. Update the ClickUp task description

The [F1 Racetracks task](https://app.clickup.com/t/86aj9wgx0) description still describes v4 architecture (single self-contained file, TRACKS array inline, etc.). It needs to reflect the current multi-file structure.

---

## Race Weekend Schedule Panel (feature spec, preserve this)

This was planned during this session. When you rewrite `next-build-spec.md`, include this in the Planned section:

**Theme:** Each circuit page shows the full race weekend timetable (all series, all sessions).

**What it adds:**
- Schedule panel on each circuit detail view: F1, F2, Porsche Supercup, F1 Academy, Sprint sessions
- Sessions grouped by day, series badge + session name + local time
- Visual status: `done` (muted), `upcoming` (normal), `live` (highlighted)

**Data schema** (in data.json, per track):
```json
"schedule": [
  { "series": "F1", "session": "FP1", "datetime": "2026-07-04T13:30:00+01:00", "status": "upcoming" }
]
```

**Population:** Bulk seed full 2026 calendar at launch. Pre-weekend verification pass (~Tue/Wed). Post-weekend flip to `done`. Ad-hoc "update the schedule" = data.json commit only.

**Data sources:** FIA event calendar, formula1.com, fiaformula2.com, fiaformula3.com, porsche.com/motorsport.

---

## Standing rule going forward

**Every commit that changes architecture, adds files, or ships features MUST include a documentation update in the same commit (or immediately following).** README, spec, and task stay current. No exceptions. Shipping code without updating docs creates exactly this mess.

---

## Delete this file when done

Once all items above are addressed, delete `HANDOFF.md` from the repo. It's a one-time action list, not permanent documentation.
