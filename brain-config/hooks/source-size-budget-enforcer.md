# Source-Size Budget Enforcer — AI Toolkit

**Purpose:** Keep committed source files inside the readable/maintainable budget so Brain can always read a file back whole AND modular structure stays the default. This is a MAINTAINABILITY gate first, a read-cap backstop second.

**Mode:** Contextual (deterministic) — fires on any repo write.

**Invocation:** Automatic. ("check the size budget" forces a manual run.)

**Trigger:** Before committing any source file to `mawizorek/ClickUp_apps`.

**⚠️ WHY THIS HAS TEETH (learned 2026-07-04):** the earlier version treated 15–30KB as a soft "pass with a flag." That flag was toothless: `world-cup-bracket/index.html` drifted from ~22KB (v1) to **30.4KB (v2.1)** one feature at a time, and the flag never stopped it because (a) 15–30KB didn't halt, and (b) it was a single-file app so the "split into modules" nudge was read as optional. Both holes are now closed. The budget is a GATE, not a suggestion.

**Pass:**
1. Measure the outgoing file size.
2. Compare against the budget: **~10–12KB target**, **15KB HARD STOP (maintainability)**, **~30KB hard read-cap (corruption backstop)**.
3. **Under 12KB:** pass, silent.
4. **12–15KB:** pass **with a mandatory flag** — "approaching the 15KB cap, name the split now." Not optional wording; the next edit likely trips the stop.
5. **Over 15KB:** **HALT.** Do NOT commit as-is. A source file over 15KB must be split by concern into modules UNLESS Michael has *explicitly, this session* approved this specific file as a single genuine concern (rare; e.g. a generated data blob). "It's simpler as one file" is NOT a waiver. Present the proposed split (which concerns → which files, each projected under 12KB) and proceed on the split, or on Michael's explicit override.
6. **Over 30KB:** HALT harder — this ALSO cannot round-trip the read path (`create_or_update_file` clips/corrupts past ~30KB). Never push it through the MCP write tool. Split or GitHub-UI upload only.
7. Confirm `.nojekyll` is present at repo root on any new-app commit.

**Monolith-growth gate (the hole that let wc-bracket drift):**
- A **single-file app is only acceptable while it stays under 12KB.** The moment a single-file app's `index.html` would cross 12KB on an edit, that edit MUST convert it to the multi-file pattern (thin shell + `source/*` modules), not grow the monolith. "Single-file" is a size privilege, not a permanent architecture.
- **Growth check on EVERY edit to an existing file:** if the edit pushes the file over its target, the split proposal fires in the SAME pass. Don't ship the bloat "just this once" and defer the split. That deferral is the failure mode.
- **Reference implementation:** `world-cup-bracket/` post-v3 (thin shell + 6 JS modules + 2 CSS, each <12KB). New/refactored apps mirror it.

**Output:** Silent pass under 12KB. Mandatory flag 12–15KB. HALT + named split proposal over 15KB. HALT + split/upload-only over 30KB.

**Composes with / overrides:** Runs after Secrets Guard, before the commit. Development team (Persistent Review) watchdogs the same threshold during builds and should flag drift BEFORE the write reaches this gate. Defers to the GitHub MCP Operating Standard for split/chunk mechanics.

**Examples:**
- *Before:* editing a 13KB module adds a feature → would land 16KB. → HALT: "16KB, over the 15KB cap. Split proposal: pull the render helpers into `render.js` (~7KB) and keep state+wiring in the current file (~9KB). Shipping the split."
- *Before:* a single-file app's `index.html` is 11.5KB and an edit would make it 12.6KB. → HALT (monolith-growth): "this app is still single-file; 12.6KB crosses the line. Converting to thin shell + `source/` modules now instead of growing the monolith."
- *Before:* new `index.html` measures 41KB. → HALT: "41KB, over the read cap AND the maintainability cap. Split into `/source` modules or upload via the GitHub UI."
- *Before:* a module measures 13.5KB. → PASS + mandatory flag: "13.5KB, approaching the 15KB stop. Name the next split now so the following edit doesn't trip the halt."

**Changelog:**
- **v2 (2026-07-04)** — Teeth. **15KB is now a HARD STOP** (was a soft 15–30KB flag). Added the **monolith-growth gate**: single-file apps must convert to multi-file the moment they'd cross 12KB, and a growth check fires the split proposal on the same edit that would bloat a file (no "defer the split" escape). 12–15KB flag is now mandatory wording, not optional. Learned from `world-cup-bracket` drifting to 30.4KB under the old soft flag. Reference implementation: wc-bracket v3 modular split.
- v1 (2026-07-03) — initial. Budget: 10–12KB target / 15KB soft / 30KB hard cap.
