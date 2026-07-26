# Source-Size Budget Enforcer — AI Toolkit

**Purpose:** Keep committed source files inside the readable/maintainable budget so Brain can always read a file back whole AND modular structure stays the default. MAINTAINABILITY gate first, read-cap backstop second.

**Mode:** Contextual (deterministic) — fires on any repo write.  
**Invocation:** Automatic. ("check the size budget" forces a manual run.)  
**Trigger:** Before committing any source file to `mawizorek/ClickUp_apps`.  
**Decision history:** `hooks/source-size-budget-enforcer.decision-log.md`

---

## ⭐ OPERATING POSTURE (LOCKED 2026-07-04): split automatically, don't narrate it

**Michael's directive:** modular structure is just how Brain builds — not a decision to surface each time. Do NOT ask "should I split this out?" and do NOT report every routine split. Splitting a file by concern when it approaches budget is the DEFAULT WORKFLOW, invisible like indentation. Build modular from the start; when an edit would push a file past budget, split it in the same pass and keep moving.

**The ONLY time size/splitting reaches Michael:** when a clean split is NOT possible — you'd be forced to hack one genuinely coherent unit into arbitrary `fileA`/`fileB`/`fileC` fragments with no real concern boundary (a giant single data table, one indivisible function, a monolithic content blob). THAT signals a design tension only Michael should resolve.

**Restated:** silent auto-split = normal. Flag = "I can only make this fit by chopping one thing into ugly A/B/C pieces; how do you want to handle it?"

---

## ⚠️ THE CEILING — base64 makes it ~22KB, not 30KB (ADDED 2026-07-25)

**The ~30KB cap applies to bytes the read tool RETURNS, not bytes on disk.** The trustworthy read path is the git blob API, which returns **base64**, inflating by **4/3**:

| On disk | Base64 returned | Under ~30KB? |
| --- | --- | --- |
| 12KB | ~16KB | ✅ comfortable |
| 18KB | ~24KB | ✅ ok |
| **22KB** | **~29.3KB** | ⚠️ **at the line** |
| 25KB | ~33KB | ❌ truncates |
| 29KB | ~39KB | ❌ truncates badly |

**So the practical hard ceiling is ~22KB of real bytes.** This is the missing arithmetic behind two same-day failures on 2026-07-25: `roster.json` at ~25KB and `VERSIONS.md` at 16.4KB-and-climbing both became **unreadable-whole and therefore unwriteable**, because a safe write needs the complete body and rewriting from a truncated read is the documented regression class. The roster's failure was worse than cosmetic — **it blocked the agent-registration flow the roster exists to serve** (Dev Dexter shipped built-but-unregistered because of it).

**The 30KB line in the Pass is a TOOL limit, not a design target.** Michael's framing after both incidents: *trim prose, never split the list* — a split index puts the boundary in the wrong place, because it moves with the data.

**The tell that a hand-maintained index is near the wall:** growth is always **prose, not rows.** Both casualties grew because rows became 400-byte-to-5KB essays while the row COUNT stayed small (~32 agents, ~18 apps). Per-item narrative belongs in git history + the PR description + that item's own README/spec. An index cites and stops.

---

## 📐 THE FLOOR RULE — a target below the floor is a freeze (ADDED 2026-07-26)

The section above gives the CEILING and never gave the other half, so every canonical file got the same aspirational **12KB** target regardless of how many rows it carries. That number was set by eyeballing a file on a good day. It is not derivable, and for some files it is not reachable.

**Compute the FLOOR before stating a target.**

> **FLOOR = row count × minimum honest row + fixed header.**

The minimum honest row is the smallest a row can be while still carrying what it exists to carry: for a ledger, its live warnings and security flags; for a roster, its lane and invocation token. **You cannot go below the floor without deleting rows or deleting truth.** Trimming prose buys exactly the gap between current size and floor, and not one byte more.

| | What it is | How it's set |
| --- | --- | --- |
| **Floor** | Irreducible size at today's row count | Computed, never chosen |
| **Target** | Floor + honest headroom for growth | Chosen, must sit ABOVE the floor |
| **Ceiling** | ~22KB base64 wall | Physics |

**🚨 A stated target that has never been met is ROT, not aspiration.** If a file has never once satisfied its own documented target since that target was locked, the defect is in the TARGET, not in the discipline of whoever keeps missing it. Fix the number. Never delete a live warning, security flag, or do-not-do rule to hit a byte count — that trades correctness for tidiness and inverts the reason the budget exists.

**A target equal to the floor is a freeze.** It permits zero growth, so if the file's job IS to grow (a roster registers agents, a ledger indexes apps) the next honest addition breaks the rule, and the agent making it either mangles the file or ships a violation. Both happened.

**When the number isn't yours to pick:** **escalate it in the file, in place** — say the target is unholdable, name the floor, name what a real target would be, keep the ceiling enforced meanwhile, and route the choice to the decision log. A visible escalation beats a silent violation and beats quietly rewriting a locked number.

**Diagnostic, one line:** *is the target above the floor, and has the file ever met it?* No to either = the number is wrong. Sibling to `hooks/doc-rot-sweep.md`: that checks docs against HEAD, this checks a budget against arithmetic.

---

## Pass

1. Measure the outgoing file size.
2. Budget: **~10–12KB target**, **15KB split line**, **~22KB read ceiling**, **~30KB tool cap** (`create_or_update_file` clips/corrupts past ~30KB). For a hand-maintained canonical file the target is **floor + headroom**, not a flat 12KB.
3. **Under target:** pass, silent.
4. **Target–15KB:** split now if a clean concern boundary exists, silently, no question. If none exists (indivisible unit), note it briefly and carry on.
5. **Over 15KB:** split by concern automatically, same commit pass. Not a question. **Exception → flag:** no clean boundary and the only way under is arbitrary fragmentation of one coherent thing → STOP and ask Michael.
6. **Over 22KB on a file that must be read whole and hand-edited** (index / ledger / roster / schema / profile): FAILING, not warning. Trim prose in the same pass. Do not split a list-shaped canonical file — move narrative out of the rows.
7. **Over 30KB:** never round-trip the write tool. Auto-split if cleanly separable; if one indivisible blob, flag for GitHub-UI upload / chunk-set routing.
8. **Floor check before bringing any canonical file back under budget:** compute the floor first. If the stated target sits at or below it, the TARGET is the defect — escalate in-file, don't trim into the truth.
9. Confirm `.nojekyll` at repo root on any new-app commit.

## Monolith-growth gate (build modular by default)

- **Single-file is a size privilege, not an architecture.** Fine only while under target; the moment an edit crosses it, convert to thin shell + `source/*` modules in the same pass, no permission-seeking.
- **Growth check on every edit:** the split happens in the pass that causes it. Never ship the bloat "just this once."
- **Reference implementation:** `world-cup-bracket/` post-v3 (thin shell + 6 JS + 2 CSS, each <12KB).
- **Where clean boundaries usually are:** styles vs logic; render modules by screen; shared state/constants; pure helpers; entry/wiring.
- **Prose-shaped files: same discipline, different remedy.** Trim and re-point, don't fragment. The seam in a document is *narrative vs current state* — push narrative to git/PR/README, keep the state.
- **But prose WITH real concern seams does split** (unlike a list). A constitution, standard, or long profile divides cleanly by section; a roster does not. Ask which shape you have before choosing trim-vs-split.

**Output:** Silent for routine splitting. Brief note at the target–15KB indivisible edge. Real FLAG + question ONLY when forced to fragment one coherent unit, or an indivisible >30KB blob needs upload routing. **Name it out loud** when a canonical hand-edited file crosses 22KB (it is about to stop being editable) **or when a file's stated target sits below its floor** (the rule is broken, not the file).

**Composes with:** runs after Secrets Guard, before the commit. **Size Sally** (`agents/size-sally.md`) is the forecasting counterpart — she seats on the build path with Fold-in Frank and projects the curve ahead; this hook is the reactive per-write gate. Defers to the GitHub MCP Operating Standard for split/chunk mechanics.

**Examples:**
- *Routine (SILENT):* an app's inline `index.html` would hit 16KB on a new feature → split into shell + `source/` modules, commit, keep moving.
- *Edge note:* a module lands 13.5KB but is one cohesive render pipeline with no seam → brief note, ship, revisit if it grows.
- *FLAG:* a 20KB file is one giant lookup table with no logical partition → "splitting means arbitrary part-A/B/C with no real boundary. Keep it whole, move to `data.json`, or chunk?"
- *FLAG:* a generated 41KB blob can't be cleanly divided → GitHub-UI upload / chunk set.
- *The 22KB case (2026-07-25, twice):* `roster.json` ~25KB and `VERSIONS.md` 16.4KB rising, both list-shaped and bloated by per-row prose → trimmed the prose (roster 25→14KB, ledger 16.4→11KB), kept the lists whole, capped both at ~12KB. **Splitting either would have been the wrong fix.**
- *The FLOOR case (2026-07-26) — same two files, one day later:* `VERSIONS.md` 13.7KB and `roster.json` 19.4KB against that ~12KB cap, **neither having met it once since it was locked.** Roster floor ≈ 11-12KB at ~38 agents, so target and floor were the same number: a freeze on the file whose job is registering agents. Ledger floor ≈ 9-10KB at 24 apps, leaving room for ~6 rows with five unindexed folders already waiting. Everything left in both was live warnings, security flags, and lanes, so another trim would have cut truth. **The target was the defect** → escalated in-file, ceiling still enforced, number routed to the decision log.

**Changelog:**
- **v5 (2026-07-26)** — Added the **FLOOR RULE**: target = floor + headroom and must sit ABOVE floor, because floor (rows × minimum honest row) isn't trimmable without deleting truth. Locked the enforceable half: **a target never once met is ROT — fix the number, never delete a live warning to hit a byte count.** Added target-equals-floor-is-a-freeze, the escalate-in-file remedy, Pass step 8, the prose-with-seams-does-split note, and the Sally seam. Trimmed v4 prose to pay for it (this hook briefly exceeded its own target on the first draft, which is the exact defect it now names). Prompted by `VERSIONS.md` + `roster.json` sitting over a 12KB target one day after v4 set it — v4 gave the ceiling and never gave the floor.
- **v4 (2026-07-25)** — Added the **base64 4/3 multiplier**: the ~30KB cap applies to RETURNED bytes, so the practical ceiling is ~22KB on disk. >22KB on a hand-edited canonical file = failing. Added the prose-vs-rows growth tell and trim-don't-split for document-shaped files. Prompted by `roster.json` + `VERSIONS.md` crossing unwriteable the same day.
- **v3 (2026-07-04)** — Operating posture locked: auto-split silently as the default; stop asking, stop narrating. Flag ONLY the pathological case. Per Michael: modular is just how we build, invisible like indentation.
- v2 (2026-07-04) — Teeth: 15KB hard stop (was soft flag) + monolith-growth gate. Learned from wc-bracket drifting to 30.4KB.
- v1 (2026-07-03) — initial. Budget: 10–12KB target / 15KB soft / 30KB hard cap.
