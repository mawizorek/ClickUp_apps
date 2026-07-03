# F1 Racetracks — Documentation Handoff

**Date:** 2026-07-03
**From:** Brain (Michael's session)
**To:** Penelope
**Priority:** STOP. Fix this before touching any feature work.

---

## What happened here

You shipped a major architectural rework (multi-file runtime, data separation, live tracker) and left the documentation describing an app that no longer exists. The README is wrong. The spec is stale. The task description is fiction. There's an entire `live-tracker.html` with zero documentation anywhere. A migration status file still says "blocked" when the migration is clearly done.

This is not a minor drift. This is a full disconnect between what the repo contains and what every document says it contains. Any agent picking this up cold would be completely misled. That's the whole point of the documentation standard: cold-pickup readability. You broke it.

The rules are clear and they've been clear since the standard was locked:

> **Every commit that changes architecture, adds files, or ships features MUST include a documentation update in the same commit or immediately following.**

That's not a suggestion. It's not "do it when you get around to it." It's the deal. Code without docs is unfinished work. You shipped unfinished work multiple times in a row.

If I had built what you built, the README would have been updated in the same session. The spec would reflect the actual next target. The Infrastructure table would exist. `live-tracker.html` would be documented. The stale migration file would be gone. That's not extra credit, that's baseline professionalism.

---

## Current repo state (what you left behind)

```
f1-racetracks/
  index.html              — 4KB thin shell (fetches CSS from ./source/ at runtime)
  data.json               — 10KB track data (already separated from engine)
  live-tracker.html       — 24KB live session tracker (UNDOCUMENTED)
  next-build-spec.md      — Still describes v5 responsive fix as the active build (stale)
  semantic-source-migration-status.md — Says "blocked" (wrong, migration is done)
  README.md               — Has a migration warning for something that's finished
  source/                 — Doing double duty as runtime CSS AND agent-readable source
```

## What the standard requires

1. **`index.html` = the entire self-contained app.** CSS + JS inline, offline-first, double-click and it runs. Your 4KB loader violates this.
2. **`source/` = Brain's readable rendition only.** Not a runtime dependency. You made it both without documenting why.
3. **README must have:** Infrastructure table (❌ missing), accurate architecture (❌ wrong), current version history (❌ stale).
4. **`next-build-spec.md`** must describe the NEXT build, not a completed one, plus Planned features.
5. **No undocumented files.** `live-tracker.html` exists with zero explanation anywhere. That's unacceptable.

---

## Action items (fix these, in order, before ANY new feature work)

### 1. Resolve the architecture question (ask Michael)

You changed the app from single-file to multi-file without documenting the decision or getting explicit approval for the standard deviation. Two paths:

- **A. Restore single-file:** rebuild `index.html` as a full inline app, keep `source/` as read-only.
- **B. Adopt multi-file with documented rationale:** explain WHY in the README Architecture section. Note that this breaks offline `file://` use, which was a hard requirement.

Don't guess. Ask Michael.

### 2. Update README.md

- Remove the "⚠️ Migration note" (it's done, stop advertising it as in-progress).
- Add the mandatory Infrastructure table:
  ```
  ## Infrastructure
  | File | Role | Update frequency |
  |------|------|------------------|
  | `index.html` | App shell (runtime loader) | Version bumps only |
  | `data.json` | Living dataset (track data + schedule) | Weekly via MCP |
  | `live-tracker.html` | Live session companion app | Version bumps |
  | `source/` | Semantic source (CSS/JS, fetched at runtime) | Version bumps |
  ```
- Update Architecture to describe what ACTUALLY exists now.
- Document `live-tracker.html`: what it does, how to use it, what data it consumes.
- Update Version history to reflect what actually shipped.
- Update Roadmap to match the Planned section in next-build-spec.md.

### 3. Rewrite next-build-spec.md

- The v5 responsive fix content is stale. Determine what the actual next build target is.
- Re-add the Planned section:
  - **Race Weekend Schedule Panel** (spec below)
  - Any other queued features
- The spec is the feature queue. Keep it current.

### 4. Delete stale files

- **`semantic-source-migration-status.md`** — Delete it. It's wrong and it's confusing.

### 5. Update the ClickUp task

The task description still describes v4 single-file architecture. Fix it to match reality.

---

## Race Weekend Schedule Panel (feature spec to preserve)

When you rewrite the spec, include this in Planned:

**Theme:** Each circuit page shows the full race weekend timetable (all series, all sessions).

**What it adds:**
- Schedule panel on each circuit detail view: F1, F2, Porsche Supercup, F1 Academy, Sprint
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

## The rule, one more time, crystal clear

**You do not ship code without shipping docs. Period.**

Every commit that adds a file, changes architecture, or lands a feature gets a corresponding documentation update. README, spec, task. Same session, same commit if possible, immediately following at worst. If you find yourself thinking "I'll come back and document this later," stop. You won't. This handoff is proof.

The documentation standard exists so that any agent (including you, three weeks from now with zero context) can read the README and understand the app without tribal knowledge. You broke that contract. Fix it, and don't break it again.

---

## Delete this file when done

Once every item above is addressed and verified, delete `HANDOFF.md`. It's a one-time correction, not permanent documentation.
