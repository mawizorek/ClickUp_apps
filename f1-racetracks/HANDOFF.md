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

## Architecture decision (RESOLVED by Michael, 2026-07-03)

**The multi-file structure is accepted as the new standard for agent-managed apps.**

The old "single self-contained HTML file" rule was designed for a world where ClickUp artifacts were the delivery mechanism and right-click Save As was the backup. Now that the repo is the source of truth and agents manage it via MCP, the multi-file structure is the better architecture:

- Agents can update individual concerns (CSS, JS, data) without rebuilding a monolith
- Data commits (data.json) don't require touching the engine
- Source files are readable without chunking workarounds (each file stays under the budget)
- GitHub Pages serves the assembled app live

So: you were right to build it this way. You were wrong to not document it, not explain the rationale, and not update the standard. The architecture is fine. The documentation failure is not.

**What this means for this app going forward:**
- `index.html` = lightweight runtime shell (loads source files + data)
- `source/` = semantic source files (CSS, JS, split by concern), served at runtime AND readable by agents
- `data.json` = living dataset, updated via MCP without engine changes
- This is the accepted pattern. Document it properly in the README.

### Source file size budget (LOCKED, 2026-07-03)

You had this mostly right in your migration status doc, but let's make it explicit and permanent:

- **Soft limit: 15KB per source file.** This is your target when splitting concerns.
- **Acceptable headroom: up to 19-20KB.** When a concern doesn't split cleanly (a large CSS file, a data-heavy JS module), pushing to 20KB is fine. Don't force an awkward split just to hit 15KB.
- **Hard ceiling: 30KB.** This is the MCP read cap. A file at or above 30KB cannot be read whole by any agent. Never let a file approach this.
- **Development team watchdog rule:** If any source file drifts past 20KB during a build, flag it and evaluate whether the concern should be decomposed. Don't let files silently grow past budget without an explicit decision.

Your current files are well within budget (largest is ~19KB). Keep it that way. When adding new features (like the schedule panel), check the target file's size BEFORE adding code. If it'll push past 20KB, split proactively.

---

## Workflow alignment (read this carefully)

Michael and I have built a very specific workflow over many sessions. It's documented in the Brain Reference Library and the Apps / HTML Artifacts reference page. You are clearly not following it, and the result is exactly this mess. Here's how the workflow actually works:

### 1. The repo is the source of truth. Not tasks. Not docs. Not chat.

- **Feature requests go in `next-build-spec.md` under a "Planned (future pushes)" section.** Never in task comments, never in task descriptions, never in loose docs. The spec IS the feature queue.
- **Architecture decisions go in the README.** Not in your working memory, not in a migration-status file that nobody checks.
- **The ClickUp task is a pointer and a next-build brief.** It is NOT where history accumulates or architecture gets documented.

### 2. You do not deviate from standards without documenting it.

You changed the app from single-file to multi-file. That turned out to be the right call, and Michael has now approved it as the new standard for agent-managed apps. But you didn't document the decision, explain the rationale, or update any reference to reflect the change. The result: I flagged it as a violation because the docs said otherwise. Don't put other agents in that position. When you make an architecture call, WRITE IT DOWN.

### 3. Documentation is not a follow-up task. It's part of shipping.

The workflow phases are: **brainstorm → document → test/review → build/commit.** Notice "document" comes BEFORE build, and the commit includes doc updates. If you find yourself with shipped code and no docs, you skipped a phase. Go back.

Specifically, every commit that touches this app should ask:
- Does the README still describe what exists? If not, update it.
- Does the spec still describe the next build? If not, update it.
- Is there a new file? Document it in the Infrastructure table.
- Did architecture change? Update the Architecture section.

### 4. The spec file has a specific structure. Follow it.

```
# app-name vN — Build Spec        ← active build at the top
[full spec: source location, problem, target, agent instructions, acceptance criteria]

---
## Planned (future pushes)         ← feature queue at the bottom
### vN+1: Feature Name
[enough detail for sequencing and cold-pickup]
### vN+2: Feature Name
[etc.]
```

When the active build ships, the top item from Planned gets promoted to the active section (overwriting the old build). The filename NEVER changes: it's always `next-build-spec.md`, version lives in the header.

### 5. Brainstorm before building.

On new features, architecture changes, or anything non-trivial: don't just execute. Pause. Surface tradeoffs. Push back if something doesn't make sense. Propose alternatives. The seven-team brainstorm gate (Red, Creative, Professionalism, Development, Scope, Ecosystem, Handoff) exists for a reason. You don't need to run all seven every time, but you DO need to think before you build.

### 6. Cold-pickup is the north star.

Every decision you make about documentation should answer one question: "If a fresh agent with zero context reads this repo folder, can they understand the app, its architecture, its current state, and what to work on next?"

Right now the answer is no. That's the failure.

### 7. Update your working preferences to include:

- Feature requests → `next-build-spec.md` Planned section, never tasks
- Docs update with every code commit, same session
- Architecture decisions get documented in README with rationale
- README Infrastructure table is mandatory and stays current
- Stale files get deleted, not left to confuse future agents
- The spec is overwritten each cycle (one file, current truth at top, queue at bottom)
- Source file budget: 15KB soft, 20KB acceptable, 30KB hard ceiling. Flag at 20KB.
- When in doubt about a standard, load the Apps / HTML Artifacts reference page and follow it

If your current instructions conflict with any of the above, the above wins. These aren't preferences, they're the system Michael built and expects every agent to follow.

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
  source/                 — Semantic source files serving as runtime CSS/JS AND agent-readable source
```

Current source file sizes (for budget reference):
- `02_styles_foundation_and_layout.css.txt` — ~10KB ✅
- `03_styles_panels_tables_footer.css.txt` — ~6KB ✅
- `03b_styles_results_and_mobile.css.txt` — ~8KB ✅
- `03c_live_session_panel.css.txt` — ~4KB ✅
- `05_track_data_rounds_01_03.js` — ~14KB ✅
- `06_track_data_rounds_06_09.js` — ~19KB ⚠️ (at headroom ceiling, watch this one)
- `07_track_data_rounds_10_13.js` — ~19KB ⚠️ (at headroom ceiling, watch this one)
- `08_track_data_rounds_14_24.js` — ~16KB ✅
- `09_app_bootstrap_and_home.js` — ~8KB ✅
- `10_track_views_and_profile.js` — ~18KB ⚠️ (approaching ceiling)
- `11_weather_and_footer_exports.js` — ~6KB ✅
- `13_live_session_panel.js` — ~11KB ✅

Three files are in the headroom zone. If the schedule panel feature adds significant code to any of these, evaluate splitting before committing.

---

## Action items (fix these, in order, before ANY new feature work)

### 1. Update README.md

- Remove the "⚠️ Migration note" (it's done, stop advertising it as in-progress).
- Add the mandatory Infrastructure table:
  ```
  ## Infrastructure
  | File | Role | Update frequency |
  |------|------|------------------|
  | `index.html` | App shell (runtime loader) | Version bumps only |
  | `data.json` | Living dataset (track data + schedule) | Weekly via MCP |
  | `live-tracker.html` | Live session companion app | Version bumps |
  | `source/` | Semantic source (CSS/JS, served at runtime + agent-readable) | Version bumps |
  ```
- Add the source file size budget to Architecture: 15KB soft / 20KB acceptable / 30KB hard ceiling.
- Update Architecture to describe the multi-file pattern with rationale (Michael approved it 2026-07-03; rationale: agents manage the repo via MCP, individual-file updates are cheaper than monolith rebuilds, and all files stay under 30KB read cap).
- Document `live-tracker.html`: what it does, how to use it, what data it consumes.
- Update Version history to reflect what actually shipped.
- Update Roadmap to match the Planned section in next-build-spec.md.

### 2. Rewrite next-build-spec.md

- The v5 responsive fix content is stale. Determine what the actual next build target is.
- Re-add the Planned section:
  - **Race Weekend Schedule Panel** (spec below)
  - Any other queued features
- The spec is the feature queue. Keep it current.

### 3. Delete stale files

- **`semantic-source-migration-status.md`** — Delete it. It's wrong and it's confusing.

### 4. Update the ClickUp task

The task description still describes v4 single-file architecture. Fix it to match the current multi-file reality.

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

**Size budget note:** The schedule data lives in `data.json`, not in the source files. But if the schedule panel UI requires new JS, check which file it'll land in and whether it pushes past 20KB. If so, create a new `12_schedule_panel.js` (or similar) rather than bloating an existing file.

---

## The rule, one more time, crystal clear

**You do not ship code without shipping docs. Period.**

Every commit that adds a file, changes architecture, or lands a feature gets a corresponding documentation update. README, spec, task. Same session, same commit if possible, immediately following at worst. If you find yourself thinking "I'll come back and document this later," stop. You won't. This handoff is proof.

The documentation standard exists so that any agent (including you, three weeks from now with zero context) can read the README and understand the app without tribal knowledge. You broke that contract. Fix it, and don't break it again.

---

## Delete this file when done

Once every item above is addressed and verified, delete `HANDOFF.md`. It's a one-time correction, not permanent documentation.
