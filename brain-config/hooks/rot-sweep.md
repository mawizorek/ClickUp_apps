# Rot Sweep — AI Toolkit

**Purpose:** Verify what our documentation **CLAIMS** against what the repo **IS**. Catches stale state, and more importantly **rotted instructions** — a rule that has decayed into the opposite of the rule it was written to enforce, while still reading as authoritative.

**Mode:** On-demand (any agent). Not always-on — this is a deliberate pass.

**Invocation:** `/rot-sweep` · "run a rot sweep" · "sweep the repo for stale docs" · "is our documentation still true?" · "check for rotted guardrails" · "doc rot." Scopable: *"rot sweep the theme docs."*

**Trigger:** Michael asks what's stale · a phantom instruction is caught in the wild · after a structural collapse (retiring a duplicate leaves pointers dangling) · before trusting an unfamiliar standards doc · **before executing any documented instruction that would fix, revert, restore, or delete something.**

**Trigger instance:** `brain-config/hooks/rot-sweep.metadata.json` (`type: trigger`, `status: active`). **Git is this tool's only home.** It has no ClickUp Skill front door and must never be given one — see the suspension banner in `brain-config/skills-integration.md`.

**Established 2026-07-25** by Dev Dexter, generalized from a live session that found **four rotted instructions in one day**.

---

## ⭐ The premise

**A document is a claim about reality, not reality.** Every standards doc, index, ledger, spec, and profile is a *snapshot of a belief* that was true when written. Code gets exercised and fails loudly when wrong. **Prose is never executed, so it rots silently and keeps its authority the whole way down.**

**The core asymmetry (the reason this tool exists):**

> **Prescriptive text rots faster than descriptive text, because nobody re-verifies a rule.**

A stale *version number* is noise. A stale *instruction* is a live weapon — someone will follow it. On 2026-07-25 a doc said *"restore via revert of PR #59 + #57"*; both reverts had landed 18 days earlier and executing it would have destroyed 18 days of working code. **Sweep instructions first, always.**

**One-line law:** *a guardrail can decay into the exact opposite of the rule it was written to enforce, and it looks just as authoritative on the way down.*

---

## Lane boundary (do NOT duplicate these)

| Tool | Asks |
| --- | --- |
| **Recon Renata** (`agents/recon-renata.md`) | Is the repo SHAPED right? Folder structure, file sizes, template conformance, stragglers, commit format. |
| **Audit Anna** (`super-agents/audit-anna/`) | Leads a formal audit of a SUBJECT, names its true purpose, drives Know/Touch/Do to completeness. |
| **`code-review-standard.md`** | Is this CODE good? Severity-graded review of a built artifact. |
| **THIS sweep** | Is what our docs CLAIM still TRUE at HEAD? Prescriptive rot, contradictions, phantom instructions. |

Renata reads the repo and checks it against the standard. **This sweep reads the standard and checks it against the repo** — the same comparison run in the opposite direction. Run both; they catch different things. "This app's folder is wrong" is Renata's. "This doc is lying" is this sweep's. Renata's checklist §8 points here. **Audit Anna** may seat this inside a larger audit; it does not replace her lead.

---

## Pass

### 0. Read-path discipline (non-negotiable, and it's the whole game)

This sweep is worthless if run on stale reads — you would be comparing one cached copy to another.

- **Blob API, base64-decoded, re-fetched.** Never a branch raw URL (verified: served a file **~280 PRs stale**).
- **Two independent reads before reporting anything about a LIVE URL.** A cache-frozen fetch will hand you a layout that does not exist in the repo. *This exact trap is how phantom notes get written in the first place* — the failure is recursive, and the sweep is not exempt from it.
- **Never rewrite from a truncated read.** Over ~22KB on disk the blob API truncates (base64 inflates 4/3 — see `hooks/source-size-budget-enforcer.md`). If the body didn't come back whole, STOP and say so.
- **Date-check the claim, not just the content.** A note dated weeks ago that describes a *pending action* is guilty until proven innocent.

### 1. Scope + inventory the claim surfaces

Name the surfaces in scope before reading any. An unbounded "sweep everything" produces a shallow pass. **Bound it and go deep.** Sweep the docs that tell agents what to DO first — that's where rot hurts:

- `brain-config/README.md`, `CHANGELOG.md`, `metadata-schema.md`, `team-standard.md`
- `brain-config/hooks/*`, `gates/*`, `teams/*`, `orchestration.md`, `council.md`, `skills-integration.md`, `code-review-standard.md`
- `brain-config/next-build-spec.md` + every app's own `next-build-spec.md`
- `VERSIONS.md` (app ledger) · `super-agents/roster.json` (agent roster) · `super-agents/index.md`
- `template-app/CONFORMANCE.md`, `shared/themes/THEME-SYSTEM.md`
- Agent + super-agent profiles and their `memory.md` files
- The ClickUp side: the AI Toolkit index trigger table and the Brain Reference Library domain pages

### 2. Classify every claim before checking it

| Class | Looks like | Risk |
| --- | --- | --- |
| **PRESCRIPTIVE** | "read X via Y" · "never Z" · "restore via revert of…" · "do NOT hand-edit" | 🔴 **Someone will follow it. Sweep these FIRST.** |
| **DESCRIPTIVE** | "app X is at v4" · "this file holds…" | 🟠 Misleads, rarely destroys. |
| **STRUCTURAL** | "THE source of truth for…" · "canonical" | 🟠 Two claimants = guaranteed drift. |
| **POINTER** | a path, a link, a filename | 🟡 Cheap to check, breaks silently. |

### 3. The six rot tests (run each against HEAD)

**A. Phantom remediation.** Any doc containing an instruction to FIX something ("revert X," "restore Y," "pending," "needs repointing," "still broken," "TODO," a bare warning emoji). **Verify the problem still exists at HEAD before believing it.** A remediation note dated older than a few days is a suspect, not a fact. Highest-severity test — these are the ones that cause damage when followed.

**B. Contradiction between locked rules.** Two docs asserting incompatible rules. **A lock date is not a freshness guarantee.** On conflict: the NEWER lock plus live evidence wins, and the older one gets *corrected*, not just noted. Look for the same subject stated twice (read paths, size caps, file shapes, close procedures).

**C. Pointers into retired or renamed things.** File paths, doc links, agent names, list IDs, or slugs that no longer resolve. Cheapest test — run it mechanically. Retired things should be loud stubs, not silence, **and every stub's "repoint anything aimed here" instruction is itself a work item**, not decoration.

**D. Two claimants on one truth.** Any two surfaces both declaring themselves canonical for the same fact. Classify each as **CANONICAL / GENERATED / PROJECTION** (see the surface map in `brain-config/README.md`). **The duplicate is always the one that rotted.** Verdict: collapse to one, or declare one a projection carrying a one-line summary + pointer. Author once; everything else points or is generated.

**E. Undocumented arithmetic.** Rules stating a threshold without the math that makes it real. The founding example: the ~30KB read cap is on the bytes the tool RETURNS, and the blob API returns base64 (4/3 inflation), so the practical ceiling is **~22KB on disk** — undocumented, and it silently ate two canonical files in one day. **A number without its derivation is a number nobody can apply correctly.**

**F. Size-vs-editability.** Any hand-maintained canonical file (index, ledger, roster, schema, profile) approaching **~22KB**. It is about to stop being readable-whole and therefore stop being safely editable — and **the file's own maintenance flow is what breaks first.** The tell: growth is **prose, not rows.** Remedy: trim the narrative to git/PR/per-item README. **Never split a list-shaped canonical file** — the boundary moves with the data.

### 4. Verify before you report (both directions)

A sweep that cries wolf trains people to ignore it. For every candidate finding, confirm against the live source before writing it down — **including your own prior claims.** If a doc says a thing is broken, check HEAD. If HEAD looks broken, check twice.

### 5. Triage what you find

- 🔴 **ROTTED INSTRUCTION** — contradicts a newer LOCKED standard, or would cause harm if followed. *Fix in the same pass.*
- 🔴 **PHANTOM REMEDIATION** — an instruction to fix something already fixed. **Never execute a documented remediation, especially a destructive one, without re-verifying the problem exists.**
- 🟠 **DUELING CANONICAL** — two surfaces both claiming source of truth.
- 🟠 **STALE STATE** — version, status, or count no longer matches HEAD.
- 🟡 **DANGLING POINTER** — path/file/link that moved or was retired.
- 🟡 **ORPHAN** — real thing indexed nowhere. *An item nobody indexes is an item nobody verifies.*
- ⚪ **VERIFIED CURRENT** — say so. A sweep that reports only problems is not trustworthy.

### 6. Fix in the same pass, additively

- **Same-turn.** Naming a miss is not acting on it; a found-and-parked miss is a second, worse miss (Missed-Gate / Drift Protocol).
- **Correct to the REALIZED state.** The doc must describe reality. If reality is wrong, fix the system — but the doc still can't describe a fiction.
- **When a rotted rule was dangerous, keep the old text visible** (struck through, dated, with the reversal named). *What a stale rule used to say* is the artifact: it teaches that authority survives decay. Silent deletion loses the lesson.
- **Retire, don't delete, a superseded doc.** Leave a loud stub naming its replacement, so a stale pointer fails visibly instead of quietly serving an old worldview.
- **Additive on conflict.** If the file moved under you (stale-SHA rejection), re-read HEAD and layer your findings onto the newer version. **Never re-apply your original body.** A rejected write is information.
- **Structural changes get flagged, not made.** Collapsing two canonical surfaces, renaming a convention, or picking between two blessed patterns is Michael's call. Correcting a factually-wrong sentence is not.

### 7. Report

Reuse the severity + evidence discipline from `brain-config/code-review-standard.md` — **do not invent a second format.** Every finding carries `path/file`-grade evidence, the date the claim was made, and what HEAD actually says.

```
## Rot Sweep — <scope> · <date>

**Surfaces read:** <n> · **Findings:** <n> (🔴 n / 🟠 n / 🟡 n)

### 🔴 Rotted instructions (would cause harm if followed)
- `path/file` — claims "<quote>" (dated <when>) — HEAD says <reality> — FIXED in this pass / FLAGGED

### 🟠 Stale state + dueling canonical
### 🟡 Dangling pointers + orphans
### ⚪ Verified current
- <what was checked and found true>

### Flagged for Michael (structural, not fixed)
```

**Clean bill → say what was checked.** Never invent findings to look thorough. "I verified these nine claims and they hold" is a real result.

---

## The tells (where rot hides — learned, not theoretical)

1. **A dated warning describing pending work.** "Restore pending," "needs fixing," "regressed." The fix usually shipped and nobody came back.
2. **Two docs opening with "this is the source of truth."** Guaranteed one is a corpse.
3. **A read-path or tooling instruction.** Tooling changes underneath prose constantly; these were 3 of 4 finds.
4. **"Do NOT hand-edit X"** where X was later retired or restructured — the caution inverts.
5. **A LOCKED date.** A lock is not a freshness guarantee. **On two conflicting locks, the NEWER one plus live evidence wins.**
6. **Anything an audit was supposed to backfill.** "Verify on next touch" that nobody touched.
7. **A file that grew past readable-whole.** It stopped being editable, so it stopped being corrected. Size is a rot accelerant.
8. **Index growth in PROSE, not rows.** Both files that went unwriteable had tiny row counts and essay-length rows.

---

**Output:** the report above. Fixes land as a PR (branch → commit → PR → self-merge) with the reversals named in the PR body. Never a prose-only list of things someone else should fix.

**Composes with:** `code-review-standard.md` (severity + evidence format — reused, never re-invented) · `hooks/source-size-budget-enforcer.md` (test E/F numbers + the base64 math) · `agents/recon-renata.md` (shape audit; this is the claims audit) · GitHub MCP Operating Standard (read ladder) · the Missed-Gate / Drift Protocol (same-turn, non-deferrable) · `brain-config/README.md` (canonical/generated/projection model) · Size Sally (forecasts test F before it bites).

**Guardrails:** read-only until a finding is confirmed against HEAD · fix documentation freely, flag structural calls · never execute a documented remediation without re-verifying the problem exists · never claim "verified" off a single cached read.

**Examples:**

- *🔴 Phantom remediation (the founding case):* `app-index.md` said "restore via revert of PR #59 + #57 pending," dated 07-07. Both reverts landed 07-08; the feature was rebuilt cleanly after. Note was **32 PRs stale** and executing it would have destroyed 18 days of work. → Removed the instruction, added the both-ways clause to the verify gate.
- *🔴 Rotted instruction:* `next-build-spec.md` said read file bodies via `raw.githubusercontent` — the exact path the Operating Standard (LOCKED 07-09) forbids and that served a file 280 PRs stale. → Corrected, old text kept struck-through.
- *🟠 Dueling canonical:* `registry.json` and `roster.json` both claimed to be the agent source of truth; registry was a bootstrap manifest predating the current architecture by 11 days and had become unreadable. → Retired to a stub, one roster survives.
- *🟠 Dueling canonical (this tool's own birth):* `doc-rot-sweep.md` and `rot-sweep.md` shipped the same day from parallel passes, both claiming to be the sweep. The tool caught itself. → Collapsed into this file; the twin was deleted.
- *🟡 Orphan:* four apps existed in the repo root and in NO index. `retrocast` was the FIRST theme-spine consumer per the ledger's own note, with no row anywhere. → Added, flagged for version stamps.
- *⚪ Verified current:* the dashboard's modular launcher, `.nojekyll`, and the markdown-viewer retirement all confirmed intact at HEAD — reported as clean rather than silently omitted.

**Changelog:**
- **v2 (2026-07-25)** — Collapsed the `doc-rot-sweep.md` twin into this file (the six named rot tests A–F, the lane-boundary table, the report format). **All ClickUp Skill linkage removed:** tools live in git only, and the trigger now lives in git as a `**Trigger:**` line plus `rot-sweep.metadata.json`. Michael, 2026-07-25: *"the tools always live in the git only. we are not using CU skills yet."*
- **v1 (2026-07-25)** — Established by Dev Dexter after a session that found four rotted instructions in one day (a phantom destructive revert, a forbidden read path recommended in two places, an inverted hand-edit caution, and a stale LOCKED read path in `README.md`). Core insight: prescriptive text rots faster than descriptive text, so instructions get swept first.
