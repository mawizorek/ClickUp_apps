# Doc-Rot Sweep — AI Toolkit

**Purpose:** Find documentation that has quietly stopped being true. Not "is the repo shaped right" (that's Recon Renata) — **"does what our docs SAY still match what HEAD actually is."** Specifically hunts **prescriptive rot**: instructions, guardrails, and remediation notes that have decayed into being wrong, or into the exact opposite of the rule they were written to enforce.

**Mode:** On-demand routine (any agent can run it). Also fires as a recommended pass after any session that edited standards docs.

**Invocation:** `/doc-rot-sweep`, "sweep the repo for stale docs," "is our documentation still true," "check for rotted guardrails." Skill front door: **DOC-ROT-SWEEP** (trigger + shape only; these are the steps).

**Established 2026-07-25** by Dev Dexter, after finding **four** rotted instructions in a single day.

---

## Why this exists (the founding evidence)

On 2026-07-25, one session found four separate pieces of documentation that were confidently wrong:

1. **`app-index.md`** carried *"app-dashboard regressed; restore via revert of PR #59 + #57 pending"* — dated 07-07. Both reverts had landed 07-08 and the feature was rebuilt cleanly afterward. The note was **32 PRs stale**, and an agent sent to "restore the dashboard" nearly executed it. **Following the documentation would have destroyed 18 days of working code.**
2. **`next-build-spec.md`** instructed agents to read file bodies from `raw.githubusercontent` — **the exact path the GitHub MCP Operating Standard forbids**, and which demonstrably served a file at v10.1/PR #174 while `main` was on v15/PR #455 (~280 PRs of drift from one read).
3. **Same file** warned *"registry.json is a generated manifest, do NOT hand-edit"* — registry had been retired hours earlier, and the roster replacing it is hand-edited **by design**. The caution had inverted.
4. **`brain-config/README.md`** carried a *"Verified read path (LOCKED 2026-07-04)"* naming the same forbidden raw path — contradicted by a **newer** lock (07-09) and by live evidence.

**The pattern in all four: they were PRESCRIPTIVE, not descriptive.** Nobody re-verifies a rule. A version number gets corrected the next time someone reads it; an instruction just sits there sounding authoritative while the world moves. And a stale *instruction* is far more dangerous than a stale *fact*, because an agent will act on it.

**One-line law:** *a guardrail can decay into the exact opposite of the rule it was written to enforce, and it looks just as authoritative on the way down.*

---

## Lane boundary (do NOT duplicate these)

| Tool | Asks |
| --- | --- |
| **Recon Renata** (`agents/recon-renata.md`) | Is the repo SHAPED right? Folder structure, file sizes, template conformance, stragglers, commit format. |
| **Audit Anna** (`super-agents/audit-anna/`) | Leads a formal audit of a SUBJECT, names its true purpose, drives Know/Touch/Do to completeness. |
| **`code-review-standard.md`** | Is this CODE good? Severity-graded review of a built artifact. |
| **THIS sweep** | Is what our docs CLAIM still TRUE at HEAD? Prescriptive rot, contradictions, phantom instructions. |

Renata reads the repo and checks it against the standard. **This sweep reads the standard and checks it against the repo** — the same comparison run in the opposite direction. Run both; they catch different things. If a finding is "this app's folder is wrong," it's Renata's. If it's "this doc is lying," it's this sweep's.

---

## Pass

### 0. Read path discipline (non-negotiable, and it's the whole game)

This sweep is worthless if run on stale reads — you would be comparing one cached copy to another. **Blob API, base64-decoded, re-fetched.** Never a branch raw URL. If a body comes back truncated, say so and stop; do not infer the rest. See the GitHub MCP Operating Standard's read-body ladder.

### 1. Inventory the claim surfaces

Sweep the docs that tell agents what to DO — these are where rot hurts:

- `brain-config/README.md`, `CHANGELOG.md`, `metadata-schema.md`, `team-standard.md`
- `brain-config/hooks/*`, `gates/*`, `teams/*`, `orchestration.md`, `council.md`, `skills-integration.md`, `code-review-standard.md`
- `brain-config/next-build-spec.md` + every app's own `next-build-spec.md`
- `VERSIONS.md` (the app ledger) + `super-agents/roster.json` (the agent roster) + `super-agents/index.md`
- `template-app/CONFORMANCE.md`, `shared/themes/THEME-SYSTEM.md`
- Agent + super-agent profiles and their `memory.md` files
- The ClickUp side: the AI Toolkit index trigger table and the Brain Reference Library domain pages

### 2. The six rot tests (run each against HEAD)

**A. Phantom remediation.** Any doc containing an instruction to FIX something ("revert X," "restore Y," "pending," "needs repointing," "still broken," "TODO," a bare warning emoji). **Verify the problem still exists at HEAD before believing it.** A remediation note with a date older than a few days is a suspect, not a fact. This is the highest-severity test — these are the ones that cause damage when followed.

**B. Contradiction between locked rules.** Two docs asserting incompatible rules. **A lock date is not a freshness guarantee.** On conflict: the NEWER lock plus live evidence wins, and the older one gets corrected, not just noted. Look for the same subject stated twice (read paths, size caps, file shapes, close procedures).

**C. Pointers into retired or renamed things.** File paths, doc links, agent names, list IDs, or slugs that no longer resolve. Cheapest test, run it mechanically. Retired things should be loud stubs, not silence — **and every stub's "repoint anything aimed here" instruction is itself a work item**, not decoration.

**D. Two claimants on one truth.** Any two surfaces both declaring themselves canonical for the same fact. Classify each as **CANONICAL / GENERATED / PROJECTION** (see `brain-config/README.md`'s surface map). **The duplicate is always the one that rots.** Verdict: collapse to one, or declare one a projection carrying a one-line summary + pointer.

**E. Undocumented arithmetic.** Rules stating a threshold without the math that makes it real. The founding example: the ~30KB read cap is on the bytes the tool RETURNS, and the blob API returns base64 (4/3 inflation), so the practical ceiling is **~22KB on disk** — undocumented, and it silently ate two canonical files in one day. **A number without its derivation is a number nobody can apply correctly.**

**F. Size-vs-editability.** Any hand-maintained canonical file (index, ledger, roster, schema, profile) approaching **~22KB**. It is about to stop being readable-whole and therefore stop being safely editable — and **the file's own maintenance flow is what breaks first.** The tell: growth is **prose, not rows.** Remedy: trim the narrative to git/PR/per-item README. **Never split a list-shaped canonical file** — the boundary moves with the data.

### 3. Verify before you report (both directions)

A sweep that cries wolf trains people to ignore it. For every candidate finding, confirm against the live source before writing it down — **including your own prior claims.** If a doc says a thing is broken, check HEAD. If HEAD looks broken, check twice: on 2026-07-25 a live-URL fetch returned a cache-frozen layout that does not exist in the repo, one sentence away from a false regression report. **Two independent reads before reporting anything about a live URL.**

### 4. Fix in the same pass (do not park)

**Correcting a rotted doc is part of the sweep, not a follow-up.** A found miss that is not acted on in the same turn is a second, worse miss (Missed-Gate / Drift Protocol). Rules:

- **Correct to the REALIZED state.** The doc must describe reality; if reality is wrong, fix the system, but never leave the doc describing a fiction.
- **Preserve the reversal, visibly.** When a rule had inverted, keep the old text struck-through with a dated correction rather than silently deleting it. *What a stale rule used to say* is the useful artifact — it teaches the next reader that authoritative-sounding text can be wrong.
- **Additive on conflict.** If a write is rejected on a stale SHA, re-read HEAD and go additive. Never re-apply your original body — a parallel pass may have found something you missed.
- **Structural changes still ask.** Collapsing two surfaces, retiring a file, or changing a locked convention goes to Michael. Correcting a factually-wrong sentence does not.

### 5. Report

Reuse the severity grammar from `code-review-standard.md` — same shape, doc-flavored. Every finding carries the **file + the quoted claim + what is actually true at HEAD**:

```
## Doc-Rot Sweep
[what was swept + overall trustworthiness]

## Dangerous (an agent following this would break something)
- `path/file` - claims "<quote>" - reality at HEAD: <fact> - <fix, or FIXED in this pass>

## Wrong (stale/contradicted, not yet harmful)
- `path/file` - claims "<quote>" - reality: <fact> - <fix>

## Soft (unversioned, unowned, undocumented math, approaching a cap)
- `path/file` - <gap> - <suggestion>

## Verified still true
- <what was checked and holds - name it, so the sweep is auditable>

## For Michael (structural)
- <two claimants, conflicting locks, architecture forks - flagged not decided>
```

**Clean bill → say what was checked.** Never invent findings to look thorough. "I verified these nine claims and they hold" is a real result.

---

**Output:** the report above. Corrections shipped in the same PR as the sweep, structural items flagged.

**Composes with:** Recon Renata (shape) · `code-review-standard.md` (severity grammar) · Missed-Gate / Drift Protocol (same-turn fix rule) · `hooks/source-size-budget-enforcer.md` (test F's numbers + the base64 math) · GitHub MCP Operating Standard (read ladder) · Size Sally (forecasts test F before it bites).

**Examples:**
- *Dangerous:* a doc says "restore via revert of PR #59" and both reverts landed 17 days ago. → Verify at HEAD, delete the instruction, record why, keep a do-NOT-revert warning in its place.
- *Wrong:* a guardrail recommends the read path a newer locked standard forbids. → Correct it, keep the old line struck-through with the reversal dated.
- *Soft:* four apps in the ledger carry "live" instead of a version stamp. → Note them; a version the app declares (`APP_VERSION` / `?v=`) is checkable, a PR number ages into meaninglessness.
- *Structural:* CONFORMANCE says a conformant app has no `source/` folder, but the modular reference app uses one. Two blessed shapes. → Flag; do not pick a side.

**Changelog:**
- **v1 (2026-07-25)** — Created by Dev Dexter after four rotted instructions surfaced in one session (a 32-PR-stale destructive revert note, a forbidden read path recommended in two places, an inverted registry caution). Codifies the six rot tests, the prescriptive-rot thesis, and the fix-in-the-same-pass rule. Lane-separated from Recon Renata: she checks the repo against the standard, this checks the standard against the repo.
