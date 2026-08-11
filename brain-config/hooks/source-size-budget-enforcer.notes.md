# Source-Size Budget Enforcer — Notes

**Sidecar to [`source-size-budget-enforcer.md`](./source-size-budget-enforcer.md).** Measurements, diagnostics and worked cases. The hook is the procedure; this is why the numbers are what they are.

Split out 2026-08-11 in the same pass that gave the rule a mechanical gate. ⚠️ **The hook was 13.75KB and the amendment would have pushed it past its own 15KB split line** — so it split, by its own rule, which is the only honest way to add teeth to a size tool.

---

## 🔬 THE CEILING — measured, not calculated

**The ~30KB cap applies to bytes the read tool RETURNS, not bytes on disk.** The trustworthy read path is the git blob API, which returns **base64**, inflating by **4/3**:

| On disk | Base64 returned | Under ~30KB? |
| --- | --- | --- |
| 12KB | ~16KB | ✅ comfortable |
| 18KB | ~24KB | ✅ ok |
| **21.7KB** | **~28.9KB** | ✅ **MEASURED — reads whole** |
| **22KB** | **~29.3KB** | ⚠️ **at the line** |
| 25KB | ~33KB | ❌ truncates (observed) |
| 29KB | ~39KB | ❌ truncates badly |
| **34.9KB** | ~46KB | ❌ **clipped SILENTLY, four reads, no error** |

**MEASURED 2026-07-26.** For its first three days this ceiling was **pure arithmetic nobody had tested**, and four decisions were built on it. Test: read `super-agents/_shared/super-agent-base.md` — 21.7KB, the largest hand-maintained file in the fleet — through the normal blob path and check the tail. **It came back WHOLE**, changelog intact through the final line.

**MEASURED AGAIN 2026-08-01, the other direction.** `uritp.css` at 34.9KB clipped on **four reads in one session with no error at all**, so its last ~6KB was being edited blind. Nobody has characterised the range between 21.7 and 25.

> ⭐ **Beckett's rule, which outlived the number: a ceiling asserted repeatedly without ever being measured is a superstition.** Before escalating a size as urgent, ask whether it has been MEASURED or only CALCULATED. If the test is cheap — here it was one file read — run it BEFORE the escalation.

⚠️ **`VERSIONS.md` still asserts 22KB as "physics."** It is a policy line drawn around two data points. It is the oldest un-corrected inherited number in the repo.

**The failure the ceiling actually causes:** a file past it cannot be read whole, and a safe write requires the complete body, so **it becomes unwriteable.** On 2026-07-25 `roster.json` crossed it and **blocked the agent-registration flow it exists to serve** — Dev Dexter shipped built-but-unregistered. That is the real stake, not tidiness.

**The tell that a hand-maintained index is heading there:** growth is always **prose, not rows.** Every casualty grew because rows became 400-byte-to-5KB essays while the row COUNT stayed small. Per-item narrative belongs in git history, the PR description, and that item's own README or spec. **An index cites and stops.**

---

## 📐 THE FLOOR RULE — a SHAPE diagnostic, not a budget formula

**v5 2026-07-26 · DEMOTED v6 2026-07-27.** Michael: *"do we need the floor minimum any more?"* Mostly no, and the honest answer changed what this is for. It was written as *how to pick a target*. It is now *how to tell a file is the wrong shape*. Smaller job, better job.

**Compute the FLOOR when a canonical file feels tight:**

> **FLOOR = row count × minimum honest row + fixed header.**

The minimum honest row is the smallest a row can be while still carrying what it exists to carry. **You cannot go below the floor without deleting rows or deleting truth.**

**🚨 The diagnostic, which is the whole section now:**

> **Project the floor forward at 2× today's rows. If it approaches the ceiling, the file is the WRONG SHAPE — do not go looking for a better target.**

A correctly-shaped index has a floor so small the ceiling is irrelevant forever. **When floor and ceiling are in the same conversation, that is the signal a file is carrying content that belongs somewhere else.** `roster.json` proved it: floor ≈ 11–12KB against a ~12KB target, i.e. **zero permitted growth on the file whose entire job is registering new agents.** The fix was never a number — it was that the file held a lossy duplicate of 38 other files. Thinned to an index, its floor dropped to ~2KB and the size question stopped existing.

**Two clauses survive independently and still bind:**

1. **A stated target that has never been met is ROT, not aspiration.** If a file has never once satisfied its own documented target since that target was locked, **fix the TARGET.** It is not the discipline of whoever keeps missing it.
2. **Never delete a live warning, security flag, or do-not-do rule to hit a byte count.** That trades correctness for tidiness and inverts the reason the budget exists.

**When the number isn't yours to pick:** escalate it **in the file, in place** — say the target is unholdable, name the floor, keep the ceiling enforced, route the choice to the decision log. A visible escalation beats a silent violation and beats quietly rewriting a locked number.

**Where v5 was weak** (Size Sally, conceding in her own lane): it said compute the floor *at today's row count*. **A floor is a function of row count, not a constant**, so a target derived from one snapshot inherits exactly the rot the rule exists to prevent. Forward projection is now the point of the section rather than a footnote.

---

## Worked cases

- **Routine (SILENT):** an app's inline `index.html` would hit 16KB on a new feature → split into shell + `source/` modules, commit, keep moving.
- **Edge note:** a module lands 13.5KB but is one cohesive render pipeline with no seam → brief note, ship, revisit if it grows.
- **FLAG:** a 20KB file is one giant lookup table with no logical partition → *"splitting means arbitrary part-A/B/C with no real boundary. Keep it whole, move to `data.json`, or chunk?"*
- **FLAG:** a generated 41KB blob can't be cleanly divided → GitHub-UI upload / chunk set.
- **The 22KB case (2026-07-25, twice):** `roster.json` ~25KB and `VERSIONS.md` 16.4KB rising, both list-shaped and bloated by per-row prose → trimmed the prose, kept the lists whole. **Splitting either would have been the wrong fix.**
- **The FLOOR case (2026-07-26):** same two files, over a ~12KB target **neither had met once since it was locked.** Everything left in both was live warnings and security flags, so another trim would have cut truth. **The TARGET was the defect** → `VERSIONS.md` reset to ~16KB, paid for by dropping a duplicate column.
- **The SHAPE case (2026-07-27) — why the floor rule got demoted:** `roster.json` was trimmed **three times in three days** and kept coming back. Its floor (~11–12KB at 38 agents) had reached its target, which is a freeze, not a budget. The real defect: it carried `lane`, `seat`, `teams`, `from` — **a lossy duplicate of 38 files that each said it better.** Deleted those (kept `lane` only on the 5 rows with no file, where it is the only description that exists) → **18.4KB → 12.3KB, floor ~2KB, and the file did not come back.** No format change, no new surface, nothing moved. ⭐ ***Trimming a wrong-shaped file is a remedy you have to keep re-applying — which is the definition of a symptom.***
- **The SIDECAR case (2026-08-11), three times in two days:** `trip-triage.md` (PR #793), `session-board.md` 32,393 B → 4,953 B (PR #808), and this hook. All three were prose-shaped files whose overage was **why-history**, not procedure. ⭐ **The seam in a document is narrative vs current state**, and it is now the first thing to look for. ⚠️ **The prose was never the problem and must not be deleted as one** — it is why those failures stopped recurring. It moves; it does not die.

---

## 🔴 The 2026-08-11 finding: the rule was already being outrun

Michael asked whether anything cleans the session board. It did not, and pulling that thread found the larger version of the same fault.

**This hook has been at v6, with measured numbers, since 2026-07-27.** It is a **behavioural** hook: an agent reads it and complies, or does not. Nothing in the repo ever refused a write.

**What that produced, measured on 2026-08-11:**

| File | Size | vs the 22KB ceiling |
|---|---|---|
| `open-memory-requests.md` | **60,133 B** | **2.7×** |
| `hooks/data-refresh.md` | 26,635 B | 1.2× |
| `team-standard.md` | 23,881 B | 1.1× |
| `super-agents/_shared/super-agent-base.md` | 23,444 B | 1.1× |
| `session-board.notes.md` | 23,387 B | 1.1× |
| `hooks/session-close.md` | 22,470 B | at the line |

Six files over a FAILING line, one of them nearly 3× it, under a rule that had been locked and measured for a fortnight. Plus a near-miss the same night: **two 32KB writes to `session-board.md` through a tool locked at ~30KB, both of which happened to succeed.**

⭐ **The generalization, and it is the third instance in one week:** **a rule that lives in prose and appears in no executable step is reached by memory or not at all.** The spine (PR #567) was fixed by becoming numbered step C4. The board clear (PR #808) was fixed by becoming Step 4a. This one is fixed by `.github/workflows/size-budget.yml`. **Behavioural hooks are for judgement; mechanical gates are for numbers. A number in a prose file is a wish.**

### Why the gate only fails on files the PR touched

A gate that failed every PR on day one over debt nobody in that PR created **would be switched off inside a week**, and then the rule would have exactly the teeth it had before: none. Blame belongs to the diff that causes it.

The debt is not hidden to buy that. It is printed as a **standing-debt inventory on every run**, so it stays visible and countable, and any PR that touches one of those files inherits the failure. ⚠️ **This is the one design decision most likely to be mistaken for leniency and quietly "tightened" by a future session. Do not. Read this paragraph first.**

### Deliberate holes

- 🚫 **A data file is not source and is not budgeted.** Nothing hand-edits a 40KB TSV from a partial read. Budgeting content would turn a size gate into an opinion about how much documentation somebody is allowed to have.
- 🚫 **App runtime files are not budgeted.** The GitHub MCP Operating Standard already governs them with an older, locked mechanism: an over-cap app ships a `<app>/source/` chunk set plus `_index.md`. **Two mechanisms aiming at one file contradict each other within a month.**
- ⚠️ **`.html` in `brain-config` is excluded** as renderers and generated pages. `tool-index.html` is 16KB and nobody hand-maintains it prose-wise. If that stops being true, add a `watch` row.
- ⚠️ **The gate cannot see a file that grows on `main` without a PR.** Direct-to-main is already banned (GitHub MCP standard, LOCKED 2026-07-06), so the hole is closed by a different rule — but it is closed by a rule, not by this gate.

---

## Changelog

- **v7 (2026-08-11) — THE RULE GAINED A MECHANICAL GATE, and this sidecar was created to pay for it.** Michael: *"spec it add it and actually build it and send it so it works."* Added `.github/workflows/size-budget.yml` + `.github/scripts/size_budget.py` + `brain-config/size-budget.tsv`, ported from the `uritp-docs` shape (PR #57): **maths in the checker, thresholds in a TSV with a NOTE column so every waiver shows up in a diff.** No new numbers — it enforces v6's. Fails only on files the PR touched; prints standing debt every run. 🔴 **Prompted by finding six brain-config files over the FAILING line, worst at 60,133 B, under a rule locked since 07-27.** Hook split to procedure + this sidecar because the amendment would have pushed it past its own 15KB split line. **Fold-in, not net-new: no second size tool was created** — `rot-sweep` / `doc-rot-sweep` (two v1s of one tool in one day, 07-25) is the precedent for why that matters.
- **v6 (2026-07-27)** — **Floor Rule DEMOTED from budget formula to SHAPE DIAGNOSTIC.** Folds in Sally's conceded miss (a floor is a function of row count, not a constant). Kept as independently-binding: never-met-target-is-rot, and never-cut-a-live-warning-for-bytes. **Ceiling MEASURED for the first time** (21.7KB reads whole); added Beckett's measured-vs-calculated rule. New third remedy for INDEX-shaped files: **give the content back to the records** (Dara's test). New Pass step 8 (shape check before trimming).
- **v5 (2026-07-26)** — Added the FLOOR RULE. Prompted by `VERSIONS.md` + `roster.json` sitting over a 12KB target one day after v4 set it — v4 gave the ceiling and never gave the floor.
- **v4 (2026-07-25)** — Added the base64 4/3 multiplier: the ~30KB cap applies to RETURNED bytes, so the practical ceiling is ~22KB on disk. >22KB on a hand-edited canonical file = failing. Added the prose-vs-rows growth tell and trim-don't-split for document-shaped files.
- **v3 (2026-07-04)** — Operating posture locked: auto-split silently as the default; stop asking, stop narrating. Flag ONLY the pathological case.
- **v2 (2026-07-04)** — Teeth: 15KB hard stop (was soft flag) + monolith-growth gate. Learned from wc-bracket drifting to 30.4KB.
- **v1 (2026-07-03)** — initial. Budget: 10–12KB target / 15KB soft / 30KB hard cap.
