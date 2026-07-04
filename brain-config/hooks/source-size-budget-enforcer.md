# Source-Size Budget Enforcer — AI Toolkit

**Purpose:** Keep committed source files inside the readable/maintainable budget so Brain can always read a file back whole AND modular structure stays the default. This is a MAINTAINABILITY gate first, a read-cap backstop second.

**Mode:** Contextual (deterministic) — fires on any repo write.

**Invocation:** Automatic. ("check the size budget" forces a manual run.)

**Trigger:** Before committing any source file to `mawizorek/ClickUp_apps`.

---

## ⭐ OPERATING POSTURE (LOCKED 2026-07-04): split automatically, don't narrate it

**Michael's directive:** modular structure is just how Brain builds — not a decision to surface each time. Do NOT ask "should I split this out?" and do NOT report every routine split. Splitting a file by concern when it approaches the budget is the DEFAULT WORKFLOW, invisible like indentation. Build modular from the start; when an edit would push a file past budget, split it in the same pass and keep moving.

**The ONLY time size/splitting reaches Michael's attention:** when a clean split is NOT possible — i.e. you'd be forced to hack one genuinely coherent unit of information into arbitrary `fileA` / `fileB` / `fileC` fragments with no real concern boundary between them (a giant single data table, one indivisible function, a monolithic content blob). THAT is the exception worth a flag, because it signals a design tension only Michael should resolve. Routine "this got big, split by concern" never gets narrated.

**Restated:** silent auto-split = normal. Flag = "I can only make this fit by chopping one thing into ugly A/B/C pieces; how do you want to handle it?"

---

## Pass

1. Measure the outgoing file size.
2. Budget: **~10–12KB target**, **15KB split line**, **~30KB read-cap backstop** (`create_or_update_file` clips/corrupts past ~30KB).
3. **Under 12KB:** pass, silent.
4. **12–15KB:** if a clean concern boundary exists, split now, silently. No flag, no question. If none exists (indivisible unit), note it briefly and carry on — it's not yet at the hard cap.
5. **Over 15KB:** split by concern into modules, automatically, as part of the same commit pass. This is not a question. **Exception → flag:** if no clean boundary exists and the only way under budget is arbitrary fragmentation of one coherent thing, STOP and ask Michael how to handle (this is the pathological case he wants surfaced).
6. **Over 30KB:** must also never round-trip the write tool. Auto-split if cleanly separable; if it's one indivisible over-cap blob, flag for GitHub-UI upload / chunk-set routing.
7. Confirm `.nojekyll` at repo root on any new-app commit.

## Monolith-growth gate (build modular by default)

- **Single-file is a size privilege, not an architecture.** A single-file app is fine only while under 12KB. The moment an edit would cross it, convert to the multi-file pattern (thin shell + `source/*` modules) in the same pass — automatically, no permission-seeking.
- **Growth check on every edit:** if an edit pushes a file past target, the split happens in that pass. Never ship the bloat "just this once" and defer.
- **Reference implementation:** `world-cup-bracket/` post-v3 (thin shell + 6 JS modules + 2 CSS, each <12KB). New/refactored apps mirror it.
- **Where clean boundaries usually are** (so splits stay natural, not arbitrary): styles vs logic; view/render modules by screen (schedule vs bracket); shared state/constants; pure helpers/util; entry/wiring. Split along these seams and the pieces are coherent, never A/B/C hacks.

**Output:** Silent for all routine splitting (this is the norm). A brief note only at the 12–15KB indivisible edge. A real FLAG + question ONLY when forced to fragment one coherent unit with no clean seam, or an indivisible >30KB blob needs upload routing.

**Composes with / overrides:** Runs after Secrets Guard, before the commit. Development team (Persistent Review) watchdogs drift during builds and splits proactively. Defers to the GitHub MCP Operating Standard for split/chunk mechanics.

**Examples:**
- *Routine (SILENT):* a bracket app's inline `index.html` would hit 16KB on a new feature. → Split into shell + `source/` modules by concern, commit, keep moving. No question, no narration beyond the normal build summary.
- *Edge note:* a module lands 13.5KB but is one cohesive render pipeline with no clean seam. → Brief note, ship it, revisit if it grows.
- *FLAG (the exception Michael wants):* a 20KB file is one giant lookup table with no logical partition. → "This is over budget but it's a single coherent table — splitting it would mean arbitrary `part-A/B/C` chunks with no real boundary. Want it kept whole (accept the size), moved to `data.json`, or chunked?"
- *FLAG:* a generated 41KB blob can't be cleanly divided. → route to GitHub-UI upload / chunk set; don't push through the write tool.

**Changelog:**
- **v3 (2026-07-04)** — Operating posture locked: **auto-split silently as the default**, stop asking "should I split this?", stop narrating routine splits. Flag ONLY the pathological case — being forced to fragment one coherent unit into arbitrary A/B/C pieces with no clean concern boundary (or an indivisible >30KB blob). Per Michael: modular is just how we build, invisible like indentation.
- v2 (2026-07-04) — Teeth: 15KB hard stop (was soft flag) + monolith-growth gate. Learned from wc-bracket drifting to 30.4KB.
- v1 (2026-07-03) — initial. Budget: 10–12KB target / 15KB soft / 30KB hard cap.
