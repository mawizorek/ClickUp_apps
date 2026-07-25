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

## ⚠️ THE BASE64 MULTIPLIER — why the real ceiling is ~22KB, not 30KB (ADDED 2026-07-25)

**The ~30KB cap applies to the bytes the read tool RETURNS, not the bytes on disk.** The trustworthy read path is the git blob API, which returns the file **base64-encoded**, and base64 inflates by **4/3**. So:

| File on disk | Base64 returned | Fits under ~30KB? |
| --- | --- | --- |
| 12KB | ~16KB | ✅ comfortable |
| 18KB | ~24KB | ✅ ok |
| **22KB** | **~29.3KB** | ⚠️ **right at the line** |
| 25KB | ~33KB | ❌ truncates |
| 29KB | ~39KB | ❌ truncates badly |

**Consequence: the practical hard ceiling is ~22KB of real bytes.** This is the missing arithmetic behind two same-day failures on 2026-07-25 — `super-agents/roster.json` at ~25KB and `VERSIONS.md` at 16.4KB-and-climbing both became **unreadable-whole and therefore unwriteable**, because a safe write requires the complete body and rewriting from a truncated read is the documented regression class. The roster's failure was worse than cosmetic: **it blocked the agent-registration flow the roster exists to serve** (Dev Dexter shipped built-but-unregistered because of it).

**So the 30KB line in the Pass below is a TOOL limit, not a design target.** Anything expected to be read back whole and hand-edited — a roster, a ledger, an index, a schema, an agent profile — should be held at **12KB and treated as hard-failing at 22KB.** Michael's own framing after both incidents: *trim prose, never split the list*, because a split index puts the boundary in the wrong place (it moves with the data).

**The tell that a hand-maintained index is about to hit this wall:** the growth is always **prose, not rows.** Both casualties grew because individual rows became 400-byte-to-5KB essays, while the row COUNT stayed small (~32 agents, ~18 apps). Per-item narrative belongs in git history + the PR description + that item's own README/spec. An index cites and stops.

---

## Pass

1. Measure the outgoing file size.
2. Budget: **~10–12KB target**, **15KB split line**, **~22KB practical read ceiling** (base64, see above), **~30KB tool cap** (`create_or_update_file` clips/corrupts past ~30KB).
3. **Under 12KB:** pass, silent.
4. **12–15KB:** if a clean concern boundary exists, split now, silently. No flag, no question. If none exists (indivisible unit), note it briefly and carry on — it's not yet at the hard cap.
5. **Over 15KB:** split by concern into modules, automatically, as part of the same commit pass. This is not a question. **Exception → flag:** if no clean boundary exists and the only way under budget is arbitrary fragmentation of one coherent thing, STOP and ask Michael how to handle (this is the pathological case he wants surfaced).
6. **Over 22KB on a file that must be read back whole and hand-edited** (index / ledger / roster / schema / profile): treat as FAILING, not warning. Trim prose in the same pass. Do not split a list-shaped canonical file — move narrative out of the rows instead.
7. **Over 30KB:** must also never round-trip the write tool. Auto-split if cleanly separable; if it's one indivisible over-cap blob, flag for GitHub-UI upload / chunk-set routing.
8. Confirm `.nojekyll` at repo root on any new-app commit.

## Monolith-growth gate (build modular by default)

- **Single-file is a size privilege, not an architecture.** A single-file app is fine only while under 12KB. The moment an edit would cross it, convert to the multi-file pattern (thin shell + `source/*` modules) in the same pass — automatically, no permission-seeking.
- **Growth check on every edit:** if an edit pushes a file past target, the split happens in that pass. Never ship the bloat "just this once" and defer.
- **Reference implementation:** `world-cup-bracket/` post-v3 (thin shell + 6 JS modules + 2 CSS, each <12KB).
- **Where clean boundaries usually are** (so splits stay natural, not arbitrary): styles vs logic; view/render modules by screen (schedule vs bracket); shared state/constants; pure helpers/util; entry/wiring. Split along these seams and the pieces are coherent, never A/B/C hacks.
- **Prose-shaped files get the same discipline, different remedy:** a doc/index/ledger over budget is trimmed and re-pointed, not fragmented. The seam in a document is *narrative vs. current state* — push the narrative to git/PR/README and keep the state.

**Output:** Silent for all routine splitting (this is the norm). A brief note only at the 12–15KB indivisible edge. A real FLAG + question ONLY when forced to fragment one coherent unit with no clean seam, or an indivisible >30KB blob needs upload routing. **A canonical hand-edited file crossing 22KB is worth naming out loud** — it is about to stop being editable.

**Composes with / overrides:** Runs after Secrets Guard, before the commit. Development team (Persistent Review) watchdogs drift during builds and splits proactively. Defers to the GitHub MCP Operating Standard for split/chunk mechanics.

**Examples:**
- *Routine (SILENT):* a bracket app's inline `index.html` would hit 16KB on a new feature. → Split into shell + `source/` modules by concern, commit, keep moving. No question, no narration beyond the normal build summary.
- *Edge note:* a module lands 13.5KB but is one cohesive render pipeline with no clean seam. → Brief note, ship it, revisit if it grows.
- *FLAG (the exception Michael wants):* a 20KB file is one giant lookup table with no logical partition. → "This is over budget but it's a single coherent table — splitting it would mean arbitrary `part-A/B/C` chunks with no real boundary. Want it kept whole (accept the size), moved to `data.json`, or chunked?"
- *FLAG:* a generated 41KB blob can't be cleanly divided. → route to GitHub-UI upload / chunk set; don't push through the write tool.
- *The 22KB case (2026-07-25, twice):* `roster.json` at ~25KB and `VERSIONS.md` at 16.4KB rising. Both were list-shaped canonical files bloated by per-row prose. → Trimmed the prose (roster 25→14KB, ledger 16.4→11KB), kept the lists whole, capped both at ~12KB. **Splitting either would have been the wrong fix.**

**Changelog:**
- **v4 (2026-07-25)** — Added the **base64 4/3 multiplier**: the ~30KB cap applies to RETURNED bytes, so the practical ceiling is ~22KB on disk. New step 6 treats >22KB on a hand-edited canonical file as failing. Added the prose-vs-rows growth tell and the trim-don't-split remedy for document-shaped files. Prompted by `roster.json` + `VERSIONS.md` both crossing unwriteable on the same day — the roster's blocking its own registration flow.
- **v3 (2026-07-04)** — Operating posture locked: **auto-split silently as the default**, stop asking "should I split this?", stop narrating routine splits. Flag ONLY the pathological case — being forced to fragment one coherent unit into arbitrary A/B/C pieces with no clean concern boundary (or an indivisible >30KB blob). Per Michael: modular is just how we build, invisible like indentation.
- v2 (2026-07-04) — Teeth: 15KB hard stop (was soft flag) + monolith-growth gate. Learned from wc-bracket drifting to 30.4KB.
- v1 (2026-07-03) — initial. Budget: 10–12KB target / 15KB soft / 30KB hard cap.
