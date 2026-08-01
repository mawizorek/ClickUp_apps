# Doc-Rot Sweep · AI Toolkit

**Purpose:** Verify what our documentation **CLAIMS** against what the repo **IS** at HEAD. Catches stale state, and above all **rotted instructions**: a rule that has decayed into the opposite of the rule it was written to enforce, while still reading as authoritative.

**Mode:** On-demand routine. Any agent can run it. Not always-on, this is a deliberate pass. Always scopable.

**Invocation:** `/doc-rot-sweep` · `/rot-sweep` (alias) · "run a rot sweep" · "sweep the repo for stale docs" · "is our documentation still true?" · "check for rotted guardrails." Scoped forms are preferred: *"rot sweep the theme docs," "rot sweep brain-config/hooks."*

**Trigger:** Michael asks what's stale · a phantom instruction is caught in the wild · after any structural collapse (retiring a duplicate leaves pointers dangling) · after any session that edited standards docs · before trusting an unfamiliar standards doc · **before executing any documented remediation, especially a destructive one.**

**Front door: this file, and nothing else.** There is no ClickUp Skill for this tool and there must not be one. **Tools live in git only** (LOCKED 2026-07-25, see `brain-config/skills-integration.md`). Any agent may fire this on itself mid-task; it needs no owner and no registration beyond its AI Toolkit index trigger row.

**Established 2026-07-25** by Dev Dexter, generalized from a live session that found **four rotted instructions in one day**. **v2** the same day, after this tool became the exact duplicate it exists to catch. See Changelog.

---

## ⭐ The premise

**A document is a claim about reality, not reality.** Every standards doc, index, ledger, spec, and profile is a *snapshot of a belief* that was true when written. Code gets exercised and fails loudly when wrong. **Prose is never executed, so it rots silently and keeps its authority the whole way down.**

The core asymmetry, and the reason this tool exists:

> **Prescriptive text rots faster than descriptive text, because nobody re-verifies a rule.**

A stale *version number* is noise. A stale *instruction* is a live weapon: someone will follow it. On 2026-07-25 a doc said *"restore via revert of PR #59 + #57"*; both reverts had landed 18 days earlier and executing it would have destroyed 18 days of working code. **Sweep instructions first, always.**

**One-line law:** *a guardrail can decay into the exact opposite of the rule it was written to enforce, and it looks just as authoritative on the way down.*

---

## Lane boundary (do NOT duplicate these)

| Tool | Asks |
| --- | --- |
| **Recon Renata** (`agents/recon-renata.md`) | Is the repo SHAPED right? Folder structure, file sizes, template conformance, stragglers, commit format. |
| **Audit Anna** (`super-agents/audit-anna/`) | Leads a formal audit of a SUBJECT, names its true purpose, drives Know/Touch/Do to completeness. |
| **`code-review-standard.md`** | Is this CODE good? Severity-graded review of a built artifact. |
| **Fleet-Fact Sweep** (`hooks/fleet-fact-sweep.md`) | Do our files still describe the FLEET correctly? Cross-agent claims — who is steward, who owns a lane, who ratifies — checked against the 🤖 Agent Index and the subject's own bundle. |
| **THIS sweep** | Is what our docs CLAIM still TRUE at HEAD? Prescriptive rot, contradictions, phantom instructions. |

Renata reads the repo and checks it against the standard. **This sweep reads the standard and checks it against the repo**: the same comparison run in the opposite direction. Run both, they catch different things. If a finding is "this app's folder is wrong," it's Renata's. If it's "this doc is lying," it's this sweep's. Renata's checklist §8 points here. **Audit Anna** may seat this inside a larger audit; it does not replace her lead.

⚠️ **The Fleet-Fact seam is the one this tool is BLIND to, so read it as a real gap and not a courtesy row** (added 2026-08-01, and this file was itself a finding of that sweep's first run). A sentence like *"Corey ratifies this"* passes every test below: the path resolves, the file exists, no locked rule contradicts it, nothing is stale at HEAD. It is still wrong, and only knowing who Corey IS reveals it. **A docs-vs-HEAD comparison cannot see a wrong person.** Run both sweeps.

---

## Pass

### 0. Read-path discipline (non-negotiable, and it is the whole game)

This sweep is worthless run on stale reads: you would be comparing one cached copy to another.

- **Blob API, base64-decoded, re-fetched.** Never a branch raw URL (verified: served a file **~280 PRs stale**).
- **Two independent reads before reporting anything about a LIVE URL.** A cache-frozen fetch will hand you a layout that does not exist in the repo. *This exact trap is how phantom notes get written in the first place*, so the failure is recursive and the sweep is not exempt from it.
- **Never rewrite from a truncated read.** Past ~22KB on disk the blob API truncates (base64 inflates 4/3, see `hooks/source-size-budget-enforcer.md`). If the body did not come back whole, STOP and say so. Do not infer the rest.

### 1. Scope, then inventory the claim surfaces

Name the surfaces in scope before reading any. An unbounded "sweep everything" produces a shallow pass. **Bound it and go deep.**

- `brain-config/README.md`, `CHANGELOG.md`, `metadata-schema.md`, `team-standard.md`, `skills-integration.md`
- `brain-config/hooks/*`, `gates/*`, `teams/*`, `orchestration.md`, `council.md`, `code-review-standard.md`
- `brain-config/next-build-spec.md` plus every app's own `next-build-spec.md`
- `VERSIONS.md` (the app ledger)
- **The 🤖 Agent Index ClickUp list** (list `901328043244`) — the agent record. ⚠️ **CORRECTED 2026-08-01:** ~~`super-agents/roster.json` (the agent roster)~~ — `roster.json`, `roster.html`, `registry.json` and `superagents.json` are ALL retired tombstone stubs (07-25 through 07-30). **A sweep that follows a scope list into an empty stub reads nothing and passes everything silently**, which is strictly worse than not checking at all. `super-agents/index.md` survives as a pointer page, not a record.
- `template-app/CONFORMANCE.md`, `shared/themes/THEME-SYSTEM.md`
- Agent and super-agent profiles plus their `memory.md` files
- The ClickUp side: the AI Toolkit index trigger table and the Brain Reference Library domain pages

### 2. Classify every claim BEFORE checking it

| Class | Looks like | Risk |
| --- | --- | --- |
| **PRESCRIPTIVE** | "read X via Y" · "never Z" · "restore via revert of..." · "do NOT hand-edit" | 🔴 **Someone will follow it. Sweep these FIRST.** |
| **DESCRIPTIVE** | "app X is at v4" · "this file holds..." | 🟠 Misleads, rarely destroys. |
| **STRUCTURAL** | "THE source of truth for..." · "canonical" | 🟠 Two claimants = guaranteed drift. |
| **POINTER** | a path, a link, a filename, a list ID | 🟡 Cheap to check, breaks silently. |

### 3. The six rot tests (run each against HEAD)

**A. Phantom remediation.** Any doc containing an instruction to FIX something ("revert X," "restore Y," "pending," "needs repointing," "still broken," "TODO," a bare warning emoji). **Verify the problem still exists at HEAD before believing it.** A remediation note dated older than a few days is a suspect, not a fact. Highest-severity test: these are the ones that cause damage when followed.

**B. Contradiction between locked rules.** Two docs asserting incompatible rules. **A lock date is not a freshness guarantee.** On conflict the NEWER lock plus live evidence wins, and the older one gets **corrected**, not merely noted. Look for the same subject stated twice (read paths, size caps, file shapes, close procedures).

**C. Pointers into retired or renamed things.** File paths, doc links, agent names, list IDs, slugs that no longer resolve. Cheapest test, run it mechanically. Retired things should be loud stubs, not silence, **and every stub's "repoint anything aimed here" instruction is itself a work item**, not decoration.

**D. Two claimants on one truth.** Any two surfaces both declaring themselves canonical for the same fact. Classify each as **CANONICAL / GENERATED / PROJECTION** (see `brain-config/README.md`'s surface map). **The duplicate is always the one that rots.** Verdict: collapse to one, or declare one a projection carrying a one-line summary plus a pointer.

**E. Undocumented arithmetic.** Rules stating a threshold without the math that makes it real. The founding example: the ~30KB read cap is on the bytes the tool RETURNS, and the blob API returns base64 (4/3 inflation), so the practical ceiling is **~22KB on disk**. Undocumented, and it silently ate two canonical files in one day. **A number without its derivation is a number nobody can apply correctly.**

**F. Size vs editability.** Any hand-maintained canonical file (index, ledger, roster, schema, profile) approaching **~22KB**. It is about to stop being readable-whole and therefore stop being safely editable, and **the file's own maintenance flow is what breaks first**. The tell: growth is **prose, not rows**. Remedy: trim the narrative to git/PR/per-item README. **Never split a list-shaped canonical file**, the boundary moves with the data.

### 4. Verify in both directions before you report

A sweep that cries wolf trains people to ignore it. For every candidate finding, confirm against the live source before writing it down, **including your own prior claims.** If a doc says a thing is broken, check HEAD. If HEAD looks broken, check twice. **Date-check the claim, not just the content:** a note dated weeks ago describing a *pending action* is guilty until proven innocent.

### 5. Triage vocabulary

- 🔴 **ROTTED INSTRUCTION**: the rule now contradicts a newer LOCKED standard, or would cause harm if followed. *Fix in the same pass.*
- 🔴 **PHANTOM REMEDIATION**: an instruction to fix something already fixed. **Never execute a documented remediation without re-verifying the problem exists.**
- 🟠 **DUELING CANONICAL**: two surfaces both claim to be the source of truth. Route via the canonical/generated/projection model in `brain-config/README.md`: author once, everything else points or is generated.
- 🟠 **STALE STATE**: version, status, or count no longer matches HEAD.
- 🟡 **DANGLING POINTER**: path/file/link that moved or was retired.
- 🟡 **ORPHAN**: real thing indexed nowhere. *An item nobody indexes is an item nobody verifies.*
- ⚪ **VERIFIED CURRENT**: say so. A sweep that reports only problems is not trustworthy.

### 6. Fix in the same pass, additively

- **Same-turn.** Naming a miss is not acting on it; a found-and-parked miss is a second, worse miss (Missed-Gate / Drift Protocol).
- **Correct to the REALIZED state.** The doc must describe reality. If reality is wrong, fix the system, but never leave the doc describing a fiction.
- **Preserve the reversal, visibly.** When a rule had inverted, keep the old text struck-through with a dated correction rather than silently deleting it. *What a stale rule used to say* is the useful artifact: it teaches the next reader that authority survives decay. Silent deletion loses the lesson.
- **Retire, don't delete, a superseded doc.** Leave a loud stub naming its replacement, so a stale pointer fails visibly instead of quietly serving an old worldview.
- **Additive on conflict.** If a write is rejected on a stale SHA, re-read HEAD and layer your findings onto the newer version. **Never re-apply your original body.** A rejected write is information: a parallel pass may have found something you missed.
- **Structural changes get flagged, not made.** Collapsing two canonical surfaces, retiring a file, renaming a convention, or picking between two blessed patterns is Michael's call. Correcting a factually wrong sentence is not.

### 7. Report

Reuse the severity and evidence discipline from `brain-config/code-review-standard.md`. **Do not invent a second format.** Every finding carries the file, the quoted claim, the date the claim was made, and what HEAD actually says.

```
## Doc-Rot Sweep · <scope> · <date>

**Surfaces read:** <n> · **Findings:** <n> (🔴 n / 🟠 n / 🟡 n)

### 🔴 Rotted instructions (would cause harm if followed)
- `path/file` - claims "<quote>" (dated <when>) - HEAD says <reality> - FIXED in this pass / FLAGGED

### 🟠 Stale state + dueling canonical
### 🟡 Dangling pointers + orphans
### ⚪ Verified still true
- <what was checked and holds, named, so the sweep is auditable>

### For Michael (structural, flagged not decided)
- <two claimants, conflicting locks, architecture forks>
```

**Clean bill → say what was checked.** Never invent findings to look thorough. "I verified these nine claims and they hold" is a real result.

---

## The tells (where rot hides, learned not theoretical)

1. **A dated warning describing pending work.** "Restore pending," "needs fixing," "regressed." The fix usually shipped and nobody came back.
2. **Two docs opening with "this is the source of truth."** Guaranteed one is a corpse.
3. **A read-path or tooling instruction.** Tooling changes underneath prose constantly; these were 3 of the first 4 finds.
4. **"Do NOT hand-edit X"** where X was later retired or restructured. The caution inverts.
5. **A LOCKED date.** A lock is not a freshness guarantee. On two conflicting locks, the NEWER plus live evidence wins.
6. **Anything an audit was supposed to backfill.** "Verify on next touch" that nobody touched.
7. **A file that grew past readable-whole.** It stopped being editable, so it stopped being corrected. Size is a rot accelerant.
8. **Index growth in PROSE, not rows.** Both files that went unwriteable had tiny row counts and essay-length rows.
9. **A tool written twice by two passes on the same day.** Neither pass saw the other; both dated themselves v1. Parallel work duplicates before it drifts.
10. **A scope list, load manifest, or checklist naming a file that has since been retired.** The most dangerous shape of a dangling pointer, because the reader never opens it to notice — **the empty read looks exactly like a clean pass.** Found in this file's own §1 on 2026-08-01, two days after the file it named was retired.

---

**Output:** the report above. Fixes land as a PR (branch → commit → PR → self-merge) with the reversals named in the PR body. Never a prose-only list of things someone else should fix.

**Composes with:** `code-review-standard.md` (severity + evidence format, reused never re-invented) · `hooks/source-size-budget-enforcer.md` (test E and F's numbers plus the base64 math) · `hooks/fleet-fact-sweep.md` (the cross-agent claims this sweep is structurally blind to) · `agents/recon-renata.md` (shape audit; this is the claims audit) · GitHub MCP Operating Standard (read ladder) · the Missed-Gate / Drift Protocol (same-turn, non-deferrable) · `brain-config/README.md` (canonical/generated/projection model) · Size Sally (forecasts test F before it bites).

**Guardrails:** read-only until a finding is confirmed against HEAD · fix documentation freely, flag structural calls · never execute a documented remediation without re-verifying the problem exists · never claim "verified" off a single cached read.

**Examples:**

- *🔴 Phantom remediation (the founding case):* `app-index.md` said "restore via revert of PR #59 + #57 pending," dated 07-07. Both reverts landed 07-08; the feature was rebuilt cleanly after. The note was **32 PRs stale** and executing it would have destroyed 18 days of work. → Removed the instruction, kept a do-NOT-revert warning in its place, added the both-ways clause to the verify gate.
- *🔴 Rotted instruction:* `next-build-spec.md` said read file bodies via `raw.githubusercontent`, the exact path the Operating Standard (LOCKED 07-09) forbids and that served a file 280 PRs stale. → Corrected, old text kept struck-through.
- *🟠 Dueling canonical:* `registry.json` and `roster.json` both claimed to be the agent source of truth; registry was a bootstrap manifest predating the current architecture by 11 days and had become unreadable. → Retired to a stub, one roster survives. ⚠️ **And then the survivor was retired too** (07-30, to the 🤖 Agent Index list), **while this file's own §1 kept pointing at it for two more days.** Collapsing to one canonical surface does not end the work: every pointer aimed at the loser has to move, including the ones inside the tool that found the duplication.
- *🟠 Dueling canonical (this tool, v2):* `rot-sweep.md` and `doc-rot-sweep.md`, same premise, same day, same author, written by two parallel passes. → Collapsed here, `rot-sweep.md` retired to a stub, `/rot-sweep` kept as an alias.
- *🟡 Orphan:* four apps existed in the repo root and in NO index. `retrocast` was the FIRST theme-spine consumer per the ledger's own note, with no row anywhere. → Added, flagged for version stamps.
- *⚪ Verified current:* the dashboard's modular launcher, `.nojekyll`, and the markdown-viewer retirement all confirmed intact at HEAD, reported as clean rather than silently omitted.

**Changelog:**

- **v2.1 (2026-08-01)** - Fixed by Fleet Felix as the FIRST finding of `hooks/fleet-fact-sweep.md`, run on this file. §1's surface inventory still listed `roster.json` as "the agent roster" two days after it was retired, so a sweep following its own scope list would have read an empty stub and reported a clean pass. Repointed at the 🤖 Agent Index list; added tell 10 (a scope list naming a retired file is the dangerous shape of a dangling pointer, because the empty read looks like a clean pass); extended the dueling-canonical example with what happened AFTER the collapse; added the Fleet-Fact lane row plus the blindness note.
- **v2 (2026-07-25)** - Michael's correction: **tools live in git only**, no ClickUp Skill linkage. Removed the "Skill front door: DOC-ROT-SWEEP" line and replaced it with a self-contained Invocation + Trigger block matching the anatomy every other hook in this folder uses. Absorbed `hooks/rot-sweep.md` (a same-day parallel-pass duplicate of this file) and its claim-classification table, tells list, and report format. Added tell 9 (parallel passes duplicate before they drift) and test D's self-referential example.
- **v1 (2026-07-25)** - Established by Dev Dexter after a session that found four rotted instructions in one day (a phantom destructive revert, a forbidden read path recommended in two places, an inverted hand-edit caution, and a stale LOCKED read path in `README.md`). Core insight: prescriptive text rots faster than descriptive text, so instructions get swept first. Lane-separated from Recon Renata: she checks the repo against the standard, this checks the standard against the repo.
