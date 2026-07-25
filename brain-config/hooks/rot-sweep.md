# Rot Sweep — AI Toolkit

**Purpose:** Verify what our documentation **CLAIMS** against what the repo **IS**. Catches stale state, and more importantly **rotted instructions** — a rule that has decayed into the opposite of the rule it was written to enforce, while still reading as authoritative.

**Mode:** On-demand (any agent). Not always-on — this is a deliberate pass.

**Invocation:** "run a rot sweep" / "sweep the repo for stale docs" / "is our documentation still true?" / `/rot-sweep`. Scopable: *"rot sweep the theme docs."*

**Trigger:** Michael asks what's stale · a phantom instruction is caught in the wild · after a structural collapse (retiring a duplicate leaves pointers dangling) · before trusting an unfamiliar standards doc.

**Established 2026-07-25** by Dev Dexter, generalized from a live session that found **four rotted instructions in one day**.

---

## ⭐ The premise

**A document is a claim about reality, not reality.** Every standards doc, index, ledger, spec, and profile is a *snapshot of a belief* that was true when written. Code gets exercised and fails loudly when wrong. **Prose is never executed, so it rots silently and keeps its authority the whole way down.**

**The core asymmetry (the reason this tool exists):**

> **Prescriptive text rots faster than descriptive text, because nobody re-verifies a rule.**

A stale *version number* is noise. A stale *instruction* is a live weapon — someone will follow it. On 2026-07-25 a doc said *"restore via revert of PR #59 + #57"*; both reverts had landed 18 days earlier and executing it would have destroyed 18 days of working code. **Sweep instructions first, always.**

**Distinct from Recon Renata** (`agents/recon-renata.md`), who audits repo *shape* — folder structure, file sizes, template conformance, stragglers. She asks *"is this built right?"* This sweep asks **"is what we wrote about it still true?"** Complementary, not overlapping. Renata's checklist §8 points here.

---

## Pass

### 1. Scope + inventory the claim surfaces

Name the surfaces in scope before reading any. Typical: `brain-config/` standards docs · hooks/gates · agent profiles + memories · `VERSIONS.md` · `super-agents/roster.json` · app `README.md` / `next-build-spec.md` / `CONFORMANCE.md` · the ClickUp AI Toolkit index + reference docs.

An unbounded "sweep everything" produces a shallow pass. **Bound it and go deep.**

### 2. Classify every claim before checking it

| Class | Looks like | Risk |
| --- | --- | --- |
| **PRESCRIPTIVE** | "read X via Y" · "never Z" · "restore via revert of…" · "do NOT hand-edit" | 🔴 **Someone will follow it. Sweep these FIRST.** |
| **DESCRIPTIVE** | "app X is at v4" · "this file holds…" | 🟠 Misleads, rarely destroys. |
| **STRUCTURAL** | "THE source of truth for…" · "canonical" | 🟠 Two claimants = guaranteed drift. |
| **POINTER** | a path, a link, a filename | 🟡 Cheap to check, breaks silently. |

### 3. Verify against HEAD — never against memory, never on one read

- **Blob API, base64-decoded.** Never a branch raw URL (verified: served a file **~280 PRs stale**).
- **Two independent reads before reporting anything about a LIVE URL.** A cache-frozen fetch will hand you a layout that does not exist in the repo. *This exact trap is how phantom notes get written in the first place* — the failure is recursive, and the sweep is not exempt from it.
- **Never rewrite from a truncated read.** Over ~22KB on disk the blob API truncates (base64 inflates 4/3 — see `hooks/source-size-budget-enforcer.md`). If the body didn't come back whole, STOP and say so.
- **Date-check the claim, not just the content.** A note dated weeks ago that describes a *pending action* is guilty until proven innocent.

### 4. Triage what you find

- 🔴 **ROTTED INSTRUCTION** — the rule now contradicts a newer LOCKED standard, or would cause harm if followed. *Fix in the same pass.*
- 🔴 **PHANTOM REMEDIATION** — an instruction to fix something already fixed. **Verify the problem still exists BEFORE executing any documented fix, especially a destructive one.**
- 🟠 **DUELING CANONICAL** — two surfaces both claim to be the source of truth. **The duplicate is always the one that rotted.** Route via the canonical/generated/projection model in `brain-config/README.md`: author once, everything else points or is generated.
- 🟠 **STALE STATE** — version, status, or count no longer matches HEAD.
- 🟡 **DANGLING POINTER** — path/file/link that moved or was retired.
- 🟡 **ORPHAN** — real thing indexed nowhere. *An item nobody indexes is an item nobody verifies.*
- ⚪ **VERIFIED CURRENT** — say so. A sweep that reports only problems is not trustworthy.

### 5. Fix in the same pass, additively

- **Same-turn.** Naming a miss is not acting on it; a found-and-parked miss is a second, worse miss.
- **Correct to the REALIZED state.** The doc must describe reality. If reality is wrong, fix the system — but the doc still can't describe a fiction.
- **When a rotted rule was dangerous, keep the old text visible** (struck through, dated, with the reversal named). *What a stale rule used to say* is the artifact: it teaches that authority survives decay. Silent deletion loses the lesson.
- **Retire, don't delete, a superseded doc.** Leave a loud stub naming its replacement, so a stale pointer fails visibly instead of quietly serving an old worldview.
- **Additive on conflict.** If the file moved under you (stale-SHA rejection), re-read HEAD and layer your findings onto the newer version. **Never re-apply your original body.** A rejected write is information.
- **Structural changes get flagged, not made.** Collapsing two canonical surfaces, renaming a convention, or picking between two blessed patterns is Michael's call.

### 6. Report

Reuse the severity + evidence discipline from `brain-config/code-review-standard.md` — **do not invent a second format.** Every finding carries `path/file:line`-grade evidence, the date the claim was made, and what HEAD actually says.

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

**Composes with:** `code-review-standard.md` (severity + evidence format — reused, never re-invented) · `hooks/source-size-budget-enforcer.md` (the 22KB readable-whole math) · `agents/recon-renata.md` (shape audit; this is the claims audit) · GitHub MCP Operating Standard (read ladder) · the Missed-Gate / Drift Protocol (same-turn, non-deferrable) · `brain-config/README.md` (canonical/generated/projection model). **Audit Anna** may seat this inside a larger audit; it does not replace her lead.

**Guardrails:** read-only until a finding is confirmed against HEAD · fix documentation freely, flag structural calls · never execute a documented remediation without re-verifying the problem exists · never claim "verified" off a single cached read.

**Examples:**

- *🔴 Phantom remediation (the founding case):* `app-index.md` said "restore via revert of PR #59 + #57 pending," dated 07-07. Both reverts landed 07-08; the feature was rebuilt cleanly after. Note was **32 PRs stale** and executing it would have destroyed 18 days of work. → Removed the instruction, added the both-ways clause to the verify gate.
- *🔴 Rotted instruction:* `next-build-spec.md` said read file bodies via `raw.githubusercontent` — the exact path the Operating Standard (LOCKED 07-09) forbids and that served a file 280 PRs stale. → Corrected, old text kept struck-through.
- *🟠 Dueling canonical:* `registry.json` and `roster.json` both claimed to be the agent source of truth; registry was a bootstrap manifest predating the current architecture by 11 days and had become unreadable. → Retired to a stub, one roster survives.
- *🟡 Orphan:* four apps existed in the repo root and in NO index. `retrocast` was the FIRST theme-spine consumer per the ledger's own note, with no row anywhere. → Added, flagged for version stamps.
- *⚪ Verified current:* the dashboard's modular launcher, `.nojekyll`, and the markdown-viewer retirement all confirmed intact at HEAD — reported as clean rather than silently omitted.

**Changelog:**
- **v1 (2026-07-25)** — Established by Dev Dexter after a session that found four rotted instructions in one day (a phantom destructive revert, a forbidden read path, an inverted hand-edit caution, and a stale LOCKED read path in `README.md`). Core insight: prescriptive text rots faster than descriptive text, so instructions get swept first.
