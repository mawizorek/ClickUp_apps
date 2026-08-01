# Fleet-Fact Sweep · AI Toolkit

**Purpose:** Verify what our files CLAIM **about the fleet** against what the fleet actually IS. Catches the rot class where one agent's file states a fact about ANOTHER agent — who the steward is, who owns a lane, who ratifies, who reports to whom, what is canonical — and that fact has since moved.

**Mode:** On-demand routine. Any agent, no persona required. A scoped run is the good run.

**Invocation:** `/fleet-fact-sweep` · `/fleet-sweep` · "sweep for stale fleet facts" · "is our fleet documentation still true" · "who does the repo think owns X." Scoped preferred: *"fleet-fact sweep the hooks folder," "sweep every file that names a steward."*

**Trigger:** before AND after any agent is converted, migrated, graduated, renamed, re-laned or retired · when a dump, cache or dormant file is folded into canonical text · when authoring a file that names another agent · when a PROPOSED artifact names a ratifier · when two sources disagree about who owns something · **and on any turn where you are about to write a sentence about an agent you have not read this session.**

**Front door: this file.** Tools live in git only (LOCKED 2026-07-25). No ClickUp Skill, now or later.

**Established 2026-08-01** by Fleet Felix, at Michael's direction.

📋 **The Known-Drift Register — the list of facts that rot, and what they currently are — lives at [`../super-agents/fleet-known-drift-register.md`](../super-agents/fleet-known-drift-register.md).** Read it before any run. It is DATA (Felix's); this file is PROCEDURE (Anna-led).

---

## 👥 Who runs this (settled 2026-08-01 — read before assuming it is the Steward's)

Michael, on reading v1: *"maybe this is Anna's job."* He was right, and the ruling already existed — **Audit Anna's own profile has said since 2026-07-21: "Felix knows the fleet; Anna audits it."** v1 shipped without naming that seam, which made a fleet-AUDIT tool read as Steward property.

**Three roles, no overlap:**

- 🔍 **Audit Anna LEADS any formal fleet-fact audit.** A deliberate, scoped, reported pass IS an audit, and audit intent seizes to her — the same way she seats the List Audit DoD, Recon Renata, and Breaker Beckett. She owns completeness, the True Purpose read, the Open-Surface Ledger, and the Closing Report. **This sweep is a protocol she runs, not a rival tool**, and her Protocol-FIRST rule points here: a documented trail now exists for fleet-fact subjects, so she follows it instead of free-forming.
- 🗂️ **Fleet Felix STEWARDS the Register.** Fleet knowledge is the directory, and the directory is his. He maintains rows and adds one when a new drift is observed. **He does not lead the audit** — that would be the hat-piling he exists to flag.
- 🛠️ **The TOOL is ownerless.** Any agent, mid-task, no persona, no permission — exactly like `doc-rot-sweep.md`. **Requiring Anna to be seated for a one-line verification would kill the habit this hook exists to build.**

**The dividing line:** a CHECK is anyone's, an AUDIT is Anna's, the REGISTER is Felix's. If it produces a report, it is an audit. If it answers one question in passing, it is a check.

---

## ⭐ The premise

**A fleet fact is a fact about someone else, and nobody who quotes it owns it.**

An agent re-reads its own bundle every session. What it never re-reads is the sentence in its file describing a *different* agent — copied from a snapshot taken the day it was written.

> **A fleet fact can be perfectly correct at its source and wrong at every place it is quoted.**

**Operational rule:** verify against the SUBJECT's source, never the neighbourhood consensus. Ten files agreeing is not evidence. They copied each other.

### The founding case

FMP Fiona converted her native shell to a thin git loader on 2026-08-01. Her pre-conversion cache — written ~07-15 — named ClickUp Coach Corey as Fleet Steward and `superagents.json` as canonical. Both had been false for eleven days. The conversion carried that into `native-loader-kernel.md`, `_shared/native-to-git-conversion-runbook.md` and `hooks/native-flush-consolidation.md`, all authored the same afternoon, all landed on `main`. **Two of the three parked their own ratification on a person who no longer held the lane**, and the runbook listed Corey as next to convert — impossible, he has been git-only since 07-19.

**Corey's own bundle stated the correct fact in three places**, with the date and the PR number. It did not help at all, because nobody consults the bundle of the agent they are describing.

1. **A cache does not only hold stale facts about ITSELF.** Fiona's own role data was fine. What rotted was everything she believed about everyone else.
2. **A conversion, migration or graduation is a rot AMPLIFIER** — it reads an old snapshot and writes new canonical files from it, at speed, in one sitting.
3. **The same rot had already been caught once** (Fiona's `decision-log.md` D5, 07-26). Catching a rot class once is a correction; catching it twice means the fix was never turned into a check. This is the check.
4. **Wrong attribution is not cosmetic.** It routes work to the wrong person and stalls work behind approvals that will never come.

---

## Lane boundary

| Tool | Asks | Ground truth |
| --- | --- | --- |
| **Doc-Rot Sweep** (`hooks/doc-rot-sweep.md`) | Do our docs still describe the REPO correctly? | HEAD |
| **THIS sweep** | Do our files still describe the FLEET correctly? | the 🤖 Agent Index + the subject's bundle |

**The seam:** *"Corey ratifies this"* is a perfectly valid sentence at HEAD — no broken path, no missing file, no contradiction between locked rules. Nothing a HEAD comparison can see is wrong. Only knowing who Corey IS reveals it. The two sweeps miss each other's findings entirely. **Run both.**

Also distinct, do not duplicate: **Recon Renata** (is the repo SHAPED right) · **`super-agents/audit-instruction.md`** (is ONE agent internally consistent — this is CROSS-agent) · **Agent Invocation Gate** (resolves ONE token, now) · **Name-Collision Gate** (is this NEW name taken — the forward-looking twin) · **Source Freshness Gate** (outside-world facts). **Audit Anna is not on this list — she is the lead who seats it.**

---

## Ground truth ladder (rank sources, never average them)

1. **The 🤖 Agent Index list** (ClickUp list `901328043244`) — existence, `Slug`, `Class`, `AKA`, `Invoke`, `Home`, `Lane`, status.
2. **The subject agent's OWN bundle** (`preferences.md` + `decision-log.md`) — the WHY, and nuance a one-line `Lane` cannot hold.
3. **A dated decision record** — a PR number, a Decision Log J block, a Fleet Build Queue answer.
4. **Everything else** — every other agent's file, hook, index, audit, README. QUOTES, not evidence.

🚫 **Never a manifest.** `roster.json`, `roster.html`, `registry.json`, `superagents.json` are ALL retired tombstone stubs. A stub returns empty, and **a check reading an empty list passes everything silently** — worse than no check. A file consulting one as live is 🔴, not 🟡.

⚠️ **Agreement is not corroboration.** Eight files saying the same thing with no ladder source is one unverified claim copied eight times. Count ORIGINS, not rows.

---

## The pass

**0. Read-path discipline.** As `doc-rot-sweep.md` §0 — pointed at, not restated. A sweep on cached reads compares one snapshot to another.

**1. Load ground truth FIRST, before reading a single claim.** Pull the Agent Index and the Register, and hold them as the answer key. **Reading claims first anchors you to the consensus you are supposed to be testing.**

**2. Scope, then inventory.** High-yield surfaces in order: every `super-agents/*/preferences.md` **seams / lane-boundary / "who they are NOT"** section (where cross-agent claims concentrate) · every `memory.md`, especially INHERITED lines and `Pointers` blocks · `_shared/super-agent-base.md`, `orchestration.md`, `council.md`, `teams/*`, `super-agents/index.md` · any `gates/*` or `hooks/*` naming an owner or ratifier · anything marked **PROPOSED / PENDING / DRAFT** · `audits/*` · the AI Toolkit trigger table and each Index row's `Lane`.

**3. Extract claims, do not read for vibes.** Pull every sentence asserting something about an agent OTHER than the file's owner. Greps that pay: `Steward` · `owns` · `ratif` · `approv` · `review` · `reports to` · `canonical` · `roster.json` · `registry.json` · `superagents.json` · `retired` · `native` · `PROPOSED` · `next` · any agent's first name.

**4. Check each against the ladder.** Index first, then the subject's own bundle. **Never against the file next door.** Three outcomes, and the middle one is the point of the sweep: **TRUE** · **TRUE-BUT-UNSOURCED** (right today, copied not verified — flag it and add the pointer) · **FALSE**.

**5. Sweep for general discrepancy too.** The Register catches what has already bitten; this catches what is about to:

- **Asymmetric seams** — A's file describes the A↔B boundary one way, B's another. Both are canonical for their own side, so **both are authoritative and they disagree.** The nastiest class, invisible from either file alone.
- **Orphan claims** — a lane, duty or gate assigned to nobody, or to an agent with no row.
- **Duplicate lanes** — two agents whose descriptions have quietly converged. Singularity is the Steward's job and this is where it surfaces first.
- **Index vs bundle drift** — a row's `Lane` and the profile's Role section telling different stories.
- **Empty authoritative fields** — a blank `Lane` is not "no finding," it is the Index failing at the one question it exists to answer.
- **Fossilized org charts** — an old audit quoting the fleet as it stood. That is HISTORY and should read as history; if it reads as current, date-stamp it.
- **Unowned or self-owned tooling** — a gate, hook or standard whose owner is unstated, or is simply whoever wrote it (Register D14).

**6. Triage.** 🔴 **WRONG ATTRIBUTION** (names the wrong owner/steward/ratifier — fix same pass) · 🔴 **BLOCKED ON A GHOST** (a PROPOSED artifact parked on someone who cannot act — fix the attribution AND surface the artifact, it has been stalled since it was written) · 🔴 **LIVE MANIFEST READ** · 🟠 **ASYMMETRIC SEAM** (reconcile if mechanical, flag if it is a genuine lane question) · 🟠 **STALE STATE** · 🟡 **TRUE-BUT-UNSOURCED** (add the pointer) · 🟡 **DANGLING AGENT POINTER** · ⚪ **VERIFIED CURRENT** — name what holds. **A sweep that only reports problems is not trustworthy.**

**7. Fix discipline — and the line is NOT "don't touch other bundles."**

- **Mechanical corrections land in the same pass, in ANY file, including another agent's bundle.** A wrong steward name, a dead manifest pointer, a stale native status, a retired path: factual errors, not lane decisions. Mark each with **edit provenance in the file** — who, when, on whose direction — never quietly.
- **Strike, don't delete.** Keep wrong text struck through with a dated correction. What a fact USED to say teaches the next reader that authority survives decay, and it is how a Register row earns its place.
- **Flag, don't decide:** anything CHANGING a lane, a seam, a stance, or who should own something. ⚠️ **But check for an existing dated ruling first** — applying one already written in the subject's own profile is a FIX, not a decision, and treating it as a decision is just a slower way to leave the error in place.
- **Never edit another agent's voice, personality, or reasoning.** Facts only. A decision-log entry gets a correction appended or struck, never rewritten into something its author did not conclude.
- **Additive on conflict.** Rejected write on a stale SHA → re-read HEAD and layer on. Never re-apply your original body.

**8. Report.** Every finding carries the file, the quoted claim, the date it was written, and the ladder source that overrides it. When Anna leads, this feeds her Closing Report rather than replacing it.

```
## Fleet-Fact Sweep · <scope> · <date>
**Ground truth:** Agent Index read <when> · **Files read:** <n> · **Claims checked:** <n>
**Findings:** <n> (🔴 n / 🟠 n / 🟡 n)

### 🔴 Wrong attribution / blocked on a ghost
- `path/file` — claims "<quote>" — truth: <fact> (source: Index row / bundle / PR #) — FIXED / FLAGGED
### 🟠 Asymmetric seams + stale state
### 🟡 True-but-unsourced + dangling pointers
### ⚪ Verified current
### For Michael (lane + stance questions, flagged not decided)
### Register delta — rows updated, and any NEW row this sweep earned
```

---

## The tells (where fleet rot hides)

1. **A file authored in one sitting that names three other agents.** Nobody verifies at drafting speed.
2. **Any PROPOSED / PENDING status line.** It names an approver and nobody returns to it. (D7)
3. **A memory dump, cache, or flush being folded into canonical text.** The founding case exactly.
4. **An `INHERITED` label** — "copied from a snapshot," the definition of this rot class.
5. **The word "next"** — next to convert, next to graduate, next in the order. Sequences encode a plan, and plans change without anyone editing the file.
6. **An audit file.** A fossil of the org chart on its date, still reading as authoritative prose.
7. **A seam described from ONE side.** Read the other side. Every time.
8. **A number about the fleet.** (D3)
9. **Consensus.** Ten agreeing files with no ladder source is one unverified claim with nine echoes.
10. **An agent describing why it is NOT something.** Correct at writing, and it silently inverts the day the other agent moves.
11. **A brand-new file.** The newest text in the repo is the least-verified text in the repo — nobody but its author has read it. This file was a finding twice within four hours of shipping.
12. **A file describing ITSELF** — its own size, its own status, its own scope. Self-description reads as authoritative and is written by the one party who never re-checks it. This file's v1.2 changelog claimed a size that was wrong by 50%, inside the entry documenting a pattern of wrong size claims.

---

**Output:** the report above. Fixes land as a PR (branch → commit → PR → self-merge). Never a prose-only list of things someone else should fix.

**Composes with:** [`../super-agents/fleet-known-drift-register.md`](../super-agents/fleet-known-drift-register.md) (the rows) · `hooks/doc-rot-sweep.md` (orthogonal ground truth — run both) · `super-agents/audit-anna/` (the LEAD on any formal run) · `gates/agent-invocation-gate.md` · `gates/agent-name-collision-gate.md` · `hooks/source-freshness-gate.md` (origins-not-rows, one domain over) · `_shared/native-to-git-conversion-runbook.md` (precondition #1 requires this discipline) · `super-agents/audit-instruction.md` (per-agent internal consistency; this is cross-agent) · `code-review-standard.md` (severity + evidence format, reused never re-invented).

**Guardrails:** read-only until a claim is confirmed against the ladder · never verify a fleet fact from a neighbouring file · never read a retired manifest as data · fix facts freely with provenance, flag every lane and stance call · never rewrite another agent's voice or conclusions · report VERIFIED CURRENT as well as failures · **no Register rows in this file** (data lives in the Register, procedure lives here) · 🔴 **never write a size, count or status about a file without reading the value back first** — this file broke that rule four times in one session, including once inside the sentence prohibiting it.

**Changelog:**

- **v1.2 (2026-08-01)** — Register split out to `super-agents/fleet-known-drift-register.md`. Two reasons: this file had crossed **22,296 bytes, past the ~22KB unreadable-whole ceiling it warns about**, and the v1.1 ownership ruling had just given the Register a different steward than the tool. Procedure vs data, the same split `routines/` uses. Now **16,531 bytes**, measured. ⚠️ **Four size-claim misses on one file in one session** — 21,453 → 19,367 → 18,350 → 22,296 → 16,531, with the stated targets wrong every time. **The last one was wrong by 50% inside the changelog entry documenting the pattern**, which is why tell 12 exists and why the guardrail is now phrased as a prohibition rather than a preference.
- **v1.1 (2026-08-01)** — Michael: *"maybe this is Anna's job."* Correct, and already on the books (Anna's profile, 07-21: *"Felix knows the fleet; Anna audits it"*). Added **Who runs this**, Register **D14** (the author is not automatically the owner), tell 11, the unowned-tooling check, and the clause that applying an existing dated ruling is a FIX, not a decision.
- **v1 (2026-08-01)** — Established by Fleet Felix at Michael's direction, after one stale native cache put the wrong Fleet Steward into three brand-new canonical files in a single afternoon, two of which parked their own ratification on him. Core insight: **a fleet fact is correct at its source and wrong at every quote site**, so it is invisible to a docs-vs-HEAD sweep and can only be caught by checking cross-agent claims against the Index and the subject's own bundle.
