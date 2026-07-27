# Source-Size Budget Enforcer — AI Toolkit

**Purpose:** Keep committed source files inside the readable/maintainable budget so Brain can always read a file back whole AND modular structure stays the default. MAINTAINABILITY gate first, read-cap backstop second.

**Mode:** Contextual (deterministic) — fires on any repo write.  
**Invocation:** Automatic. ("check the size budget" forces a manual run.)  
**Trigger:** Before committing any source file to `mawizorek/ClickUp_apps`.  
**Decision history:** ClickUp ▸ Brain Reference Library ▸ AI Toolkit ▸ 🎯 Triggers ▸ *Source-Size Budget Enforcer — Decision Log*. (Decision logs are ClickUp docs, never repo files — the repo path is a stub.)

---

## ⭐ OPERATING POSTURE (LOCKED 2026-07-04): split automatically, don't narrate it

**Michael's directive:** modular structure is just how Brain builds — not a decision to surface each time. Do NOT ask "should I split this out?" and do NOT report every routine split. Splitting a file by concern when it approaches budget is the DEFAULT WORKFLOW, invisible like indentation. Build modular from the start; when an edit would push a file past budget, split it in the same pass and keep moving.

**The ONLY time size/splitting reaches Michael:** when a clean split is NOT possible — you'd be forced to hack one genuinely coherent unit into arbitrary `fileA`/`fileB`/`fileC` fragments with no real concern boundary (a giant single data table, one indivisible function, a monolithic content blob). THAT signals a design tension only Michael should resolve.

**Restated:** silent auto-split = normal. Flag = "I can only make this fit by chopping one thing into ugly A/B/C pieces; how do you want to handle it?"

---

## ⚠️ THE CEILING — ~22KB, and it is now MEASURED (not just calculated)

**The ~30KB cap applies to bytes the read tool RETURNS, not bytes on disk.** The trustworthy read path is the git blob API, which returns **base64**, inflating by **4/3**:

| On disk | Base64 returned | Under ~30KB? |
| --- | --- | --- |
| 12KB | ~16KB | ✅ comfortable |
| 18KB | ~24KB | ✅ ok |
| **21.7KB** | **~28.9KB** | ✅ **MEASURED — reads whole** |
| **22KB** | **~29.3KB** | ⚠️ **at the line** |
| 25KB | ~33KB | ❌ truncates (observed) |
| 29KB | ~39KB | ❌ truncates badly |

**🔬 MEASURED 2026-07-26.** For its first three days this ceiling was **pure arithmetic that nobody had ever tested**, and four decisions were built on it. Test: read `super-agents/_shared/super-agent-base.md` — **21.7KB, the largest hand-maintained file in the fleet** — through the normal blob path and check the tail. **It came back WHOLE**, changelog intact through the final line.

So: **≥21.7KB reads fine, ~25KB truncates** (the 2026-07-25 casualty). The true break is somewhere in between and the 4/3 arithmetic is consistent with it. **~22KB stands as the working ceiling — now with one real data point under it instead of zero.**

**The lesson that outlived the number** (Breaker Beckett): *a ceiling asserted repeatedly without ever being measured is a superstition.* Before escalating a size as urgent, ask whether it has been MEASURED or only CALCULATED. If the test is cheap — here it was one file read — run it BEFORE the escalation.

**The failure this ceiling actually causes:** a file past it cannot be read whole, and a safe write requires the complete body, so **it becomes unwriteable.** On 2026-07-25 `roster.json` crossed it and **blocked the agent-registration flow it exists to serve** (Dev Dexter shipped built-but-unregistered). That is the real stake, not tidiness.

**The tell that a hand-maintained index is heading there:** growth is always **prose, not rows.** Every casualty grew because rows became 400-byte-to-5KB essays while the row COUNT stayed small. Per-item narrative belongs in git history + the PR description + that item's own README/spec. An index cites and stops.

---

## 📐 THE FLOOR RULE — a SHAPE diagnostic, not a budget formula (v5 2026-07-26 · DEMOTED v6 2026-07-27)

> **Michael, 2026-07-27: "do we need the floor minimum any more?"** Mostly no, and the honest answer changed what this section is for. It was written as *how to pick a target*. It is now *how to tell a file is the wrong shape*. Smaller job, better job.

**Compute the FLOOR when a canonical file feels tight:**

> **FLOOR = row count × minimum honest row + fixed header.**

The minimum honest row is the smallest a row can be while still carrying what it exists to carry. **You cannot go below the floor without deleting rows or deleting truth.**

**🚨 The floor's real job — the diagnostic, and this is the whole section now:**

> **Project the floor forward at 2× today's rows. If it approaches the ceiling, the file is the WRONG SHAPE — do not go looking for a better target.**

A correctly-shaped index has a floor so small the ceiling is irrelevant forever. When floor and ceiling are in the same conversation, that is the signal that a file is carrying content that belongs somewhere else. **`roster.json` proved it:** floor ≈ 11-12KB against a ~12KB target, i.e. zero permitted growth on the file whose entire job is registering new agents. The fix was never a number — it was that the file held a lossy duplicate of 38 other files. **Thinned to an index, its floor dropped to ~2KB and the size question stopped existing.**

**Two clauses survive independently and still bind:**

1. **A stated target that has never been met is ROT, not aspiration.** If a file has never once satisfied its own documented target since that target was locked, fix the TARGET. It is not the discipline of whoever keeps missing it.
2. **Never delete a live warning, security flag, or do-not-do rule to hit a byte count.** That trades correctness for tidiness and inverts the reason the budget exists.

**A target must still sit above the floor** — but if you are picking targets close enough to the floor for that to be tricky, re-read the diagnostic above; the target is not your problem.

**When the number isn't yours to pick:** escalate it **in the file, in place** — say the target is unholdable, name the floor, keep the ceiling enforced, route the choice to the decision log. A visible escalation beats a silent violation and beats quietly rewriting a locked number.

**Where this was weak (Size Sally, conceding in her own lane):** v5 said compute the floor *at today's row count*. **A floor is a function of row count, not a constant**, so a target derived from one snapshot inherits exactly the rot the rule exists to prevent. Forward projection is now the point of the whole section rather than a footnote.

---

## Pass

1. Measure the outgoing file size.
2. Budget: **~10–12KB target**, **15KB split line**, **~22KB read ceiling** (measured ≥21.7KB), **~30KB tool cap** (`create_or_update_file` clips/corrupts past ~30KB).
3. **Under target:** pass, silent.
4. **Target–15KB:** split now if a clean concern boundary exists, silently, no question. If none exists (indivisible unit), note it briefly and carry on.
5. **Over 15KB:** split by concern automatically, same commit pass. Not a question. **Exception → flag:** no clean boundary and the only way under is arbitrary fragmentation of one coherent thing → STOP and ask Michael.
6. **Over 22KB on a file that must be read whole and hand-edited** (index / ledger / roster / schema / profile): FAILING, not warning. Trim prose in the same pass. Do not split a list-shaped canonical file — move narrative out of the rows.
7. **Over 30KB:** never round-trip the write tool. Auto-split if cleanly separable; if one indivisible blob, flag for GitHub-UI upload / chunk-set routing.
8. **Shape check before trimming any canonical file:** project the floor at 2× rows. If it nears the ceiling, **stop trimming and fix the shape** — the file is carrying content that belongs in the records it indexes.
9. Confirm `.nojekyll` at repo root on any new-app commit.

## Monolith-growth gate (build modular by default)

- **Single-file is a size privilege, not an architecture.** Fine only while under target; the moment an edit crosses it, convert to thin shell + `source/*` modules in the same pass, no permission-seeking.
- **Growth check on every edit:** the split happens in the pass that causes it. Never ship the bloat "just this once."
- **Reference implementation:** `world-cup-bracket/` post-v3 (thin shell + 6 JS + 2 CSS, each <12KB).
- **Where clean boundaries usually are:** styles vs logic; render modules by screen; shared state/constants; pure helpers; entry/wiring.
- **Prose-shaped files: same discipline, different remedy.** Trim and re-point, don't fragment. The seam in a document is *narrative vs current state*.
- **But prose WITH real concern seams does split** (unlike a list). A constitution or long profile divides cleanly by section; a roster does not. Ask which shape you have before choosing trim-vs-split.
- **An INDEX has a third remedy the other two shapes don't: give the content back.** Not trim, not split — **delete it from the index because a record already holds it.** Test (Domain Dara): *a field belongs in an index only if you need it to decide WHICH RECORD TO OPEN.* Everything else is a duplicate wearing an index's clothes. This is the cheapest fix in the whole hook when it applies, because nothing moves and nothing is lost.

**Output:** Silent for routine splitting. Brief note at the target–15KB indivisible edge. Real FLAG + question ONLY when forced to fragment one coherent unit, or an indivisible >30KB blob needs upload routing. **Name it out loud** when a canonical hand-edited file crosses 22KB, **when a file's stated target sits below its floor**, or **when a projected floor nears the ceiling** (that one is a shape problem, and it is worth saying so plainly).

**Composes with:** runs after Secrets Guard, before the commit. **Size Sally** (`agents/size-sally.md`) is the forecasting counterpart — she seats on the build path with Fold-in Frank and projects the curve ahead; this hook is the reactive per-write gate. Defers to the GitHub MCP Operating Standard for split/chunk mechanics.

**Examples:**
- *Routine (SILENT):* an app's inline `index.html` would hit 16KB on a new feature → split into shell + `source/` modules, commit, keep moving.
- *Edge note:* a module lands 13.5KB but is one cohesive render pipeline with no seam → brief note, ship, revisit if it grows.
- *FLAG:* a 20KB file is one giant lookup table with no logical partition → "splitting means arbitrary part-A/B/C with no real boundary. Keep it whole, move to `data.json`, or chunk?"
- *FLAG:* a generated 41KB blob can't be cleanly divided → GitHub-UI upload / chunk set.
- *The 22KB case (2026-07-25, twice):* `roster.json` ~25KB and `VERSIONS.md` 16.4KB rising, both list-shaped and bloated by per-row prose → trimmed the prose, kept the lists whole. **Splitting either would have been the wrong fix.**
- *The FLOOR case (2026-07-26):* same two files, over a ~12KB target **neither had met once since it was locked**. Everything left in both was live warnings and security flags, so another trim would have cut truth. The TARGET was the defect → `VERSIONS.md` reset to ~16KB, paid for by dropping a duplicate column.
- *The SHAPE case (2026-07-27) — why the floor rule got demoted:* `roster.json` was trimmed **three times in three days** and kept coming back. Its floor (~11-12KB at 38 agents) had reached its target, which is a freeze, not a budget. The real defect: it carried `lane`, `seat`, `teams`, `from` — **a lossy duplicate of 38 files that each said it better.** Deleted those (kept `lane` only on the 5 rows with no file, where it is the only description that exists) → **18.4KB → 12.3KB, floor ~2KB, and the file will not be back.** No format change, no new surface, nothing moved. *Trimming a wrong-shaped file is a remedy you have to keep re-applying — which is the definition of a symptom.*

**Changelog:**
- **v6 (2026-07-27)** — **Floor Rule DEMOTED from budget formula to SHAPE DIAGNOSTIC** (Michael: "do we need the floor minimum any more?"). Its job is now *project the floor at 2× rows; if it nears the ceiling, the file is the wrong shape* — not *how to pick a target*. Folds in Sally's conceded miss (a floor is a function of row count, not a constant). Kept as independently-binding: never-met-target-is-rot, and never-cut-a-live-warning-for-bytes. **Ceiling MEASURED for the first time** (21.7KB reads whole) and the table + Pass updated to say so; added Beckett's measured-vs-calculated rule. New third remedy for INDEX-shaped files: **give the content back to the records** (Dara's test), distinct from trim and split. New Pass step 8 (shape check before trimming).
- **v5 (2026-07-26)** — Added the FLOOR RULE (floor = rows × minimum honest row; a target must sit above it; a never-met target is rot; never delete a live warning to hit a byte count). Prompted by `VERSIONS.md` + `roster.json` sitting over a 12KB target one day after v4 set it — v4 gave the ceiling and never gave the floor.
- **v4 (2026-07-25)** — Added the base64 4/3 multiplier: the ~30KB cap applies to RETURNED bytes, so the practical ceiling is ~22KB on disk. >22KB on a hand-edited canonical file = failing. Added the prose-vs-rows growth tell and trim-don't-split for document-shaped files.
- **v3 (2026-07-04)** — Operating posture locked: auto-split silently as the default; stop asking, stop narrating. Flag ONLY the pathological case.
- v2 (2026-07-04) — Teeth: 15KB hard stop (was soft flag) + monolith-growth gate. Learned from wc-bracket drifting to 30.4KB.
- v1 (2026-07-03) — initial. Budget: 10–12KB target / 15KB soft / 30KB hard cap.
