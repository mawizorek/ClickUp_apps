# Fleet-Fact Sweep · AI Toolkit

**Purpose:** Verify what our files CLAIM **about the fleet** against what the fleet actually IS. Catches the specific rot class where one agent's file states a fact about ANOTHER agent — who the steward is, who owns a lane, who ratifies, who reports to whom, what is canonical — and that fact has since moved.

**Mode:** On-demand routine. Any agent can run it; no persona required. Always scopable, and a scoped run is the good run.

**Invocation:** `/fleet-fact-sweep` · `/fleet-sweep` · "sweep for stale fleet facts" · "is our fleet documentation still true" · "who does the repo think owns X" · "check the fleet cross-references." Scoped forms preferred: *"fleet-fact sweep the hooks folder," "fleet-fact sweep Milo's bundle," "sweep every file that names a steward."*

**Trigger:** before converting, migrating, graduating, renaming, re-laning or retiring any agent · **immediately after** any of those land · when a dump, cache or long-dormant file is being folded into canonical text · when authoring a file that names another agent · when a PROPOSED artifact names a reviewer or ratifier · when Michael asks who owns something and two sources disagree · **and on any turn where you are about to write a sentence about an agent you have not read this session.**

**Front door: this file, and nothing else.** Tools live in git only (LOCKED 2026-07-25). No ClickUp Skill, now or later.

**Established 2026-08-01** by Fleet Felix, at Michael's direction, out of a live failure: see The founding case.

---

## ⭐ The premise

**A fleet fact is a fact about someone else, and nobody who quotes it owns it.**

That is the whole asymmetry. An agent maintains its own bundle carefully and re-reads it every session. What it does NOT re-read is the sentence in its file describing a *different* agent — and that sentence was copied from a snapshot taken on the day it was written.

> **A fleet fact can be perfectly correct at its source and wrong at every single place it is quoted.**

This is not hypothetical and it is the reason this hook exists rather than a note in an existing one. On 2026-08-01 three brand-new canonical files named the wrong Fleet Steward. **Corey's own bundle stated the correct fact in three separate places** — profile, memory, decision log — clearly, with the date and the PR number. It did not help even slightly, because nobody consults the bundle of the agent they are describing. The correct fact sat untouched a hundred yards away while the wrong one propagated.

**Corollary, and the operational rule this hook turns on:** verifying a fleet fact means reading the SUBJECT's source, not the neighbourhood consensus. Ten files agreeing is not evidence. They copied each other.

## The founding case (read this once, it teaches the shape)

FMP Fiona converted her native shell to a thin git loader on 2026-08-01. Her pre-conversion native cache — written ~07-15 — named ClickUp Coach Corey as Fleet Steward and `superagents.json` as canonical fleet metadata. Both had been false for eleven days. The conversion carried that cache forward into `native-loader-kernel.md`, `native-to-git-conversion-runbook.md` and `hooks/native-flush-consolidation.md`, all authored the same afternoon, all landed on `main`, and two of the three **parked their own ratification on a person who no longer held the lane.** The runbook additionally listed Corey as the next agent to convert — impossible, he has been git-only since 07-19 and has no shell to reduce.

Four lessons, all encoded below:

1. **A cache does not only hold stale facts about ITSELF.** Fiona's own role data was fine. What rotted was everything she believed about everyone else.
2. **A conversion, migration or graduation is a rot AMPLIFIER**, not a neutral move. It reads an old snapshot and writes new canonical files from it, at speed, usually in one sitting.
3. **The same rot class had already been caught once** — Fiona's `decision-log.md` D5, 07-26, same wrong steward. Catching a rot class once is a correction. Catching it twice means the fix was never turned into a check. This file is the check.
4. **Wrong attribution is not cosmetic.** It routes work to the wrong person and it stalls work behind approvals that will never come.

---

## Lane boundary (do NOT duplicate these)

| Tool | Asks |
| --- | --- |
| **Doc-Rot Sweep** (`hooks/doc-rot-sweep.md`) | Do our docs still describe the REPO correctly? Prescriptive rot, phantom remediation, dueling canonical, size vs editability. Ground truth = **HEAD**. |
| **Recon Renata** (`agents/recon-renata.md`) | Is the repo SHAPED right? Structure, sizes, template conformance. |
| **Audit Anna** (`super-agents/audit-anna/`) | Leads a formal audit of a SUBJECT to completeness. May seat this sweep inside one. |
| **Agent Invocation Gate** (`gates/agent-invocation-gate.md`) | Resolves ONE token to ONE agent, right now, at invocation time. |
| **Name-Collision Gate** (`gates/agent-name-collision-gate.md`) | Is this NEW name already taken? Forward-looking, one name. |
| **Source Freshness Gate** (`hooks/source-freshness-gate.md`) | Is this OUTSIDE-WORLD fact current? Dated provenance ladder. |
| **THIS sweep** | Do our files still describe the FLEET correctly? Cross-agent claims, at scale, in every direction. Ground truth = **the 🤖 Agent Index + the subject's own bundle.** |

The seam that matters most: **Doc-Rot Sweep checks docs against HEAD; this checks docs against the fleet.** They miss each other's findings entirely, because a claim like *"Corey ratifies this"* is a perfectly valid sentence at HEAD. There is no broken path, no missing file, no contradiction between two locked rules. Nothing a HEAD comparison can see is wrong. Only knowing who Corey IS reveals it. Run both.

---

## Ground truth ladder (rank sources, never average them)

1. **The 🤖 Agent Index list** (ClickUp list `901328043244`) — one task per agent. Authoritative for existence, `Slug`, `Class`, `AKA`, `Invoke`, `Home`, `Lane`, status.
2. **The subject agent's OWN bundle** (`super-agents/<slug>/preferences.md` + `decision-log.md`) — authoritative for the WHY and for nuance the one-line `Lane` cannot hold.
3. **A dated decision record** naming the change (a PR number, a Decision Log J block, a Fleet Build Queue answer).
4. **Everything else — every other agent's file, every hook, every index, every audit, every README.** These are QUOTES. None of them is evidence.

🚫 **Never a manifest.** `roster.json`, `roster.html`, `registry.json` and `superagents.json` are ALL retired tombstone stubs (three retired 07-25 → 07-30). A stub returns empty, and **a check that reads an empty list passes everything silently** — worse than no check. If a sweep finds a file consulting one as live, that is a 🔴 finding, not a 🟡.

⚠️ **Agreement is not corroboration.** If eight files say the same thing and none of them is the Index or the subject's bundle, you have found one unverified claim copied eight times. Count ORIGINS, not rows. (Same rule as the Source Freshness Gate's aggregator clause, one domain over.)

---

## 📋 The Known-Drift Register — repeatable notes for a cold agent

**This is the reusable core of the hook.** These facts rot on a schedule. A cold agent reads this section and knows what to distrust before it knows anything else. **Never quote one of these from memory or from a neighbouring file — go to the ladder.**

**Maintenance rule:** the CURRENT column is the part that rots, so it is deliberately thin and always carries its date. When one changes, update the row in the same pass as the change. **Never add a row without a real observed drift** — a register padded with hypotheticals stops being read. Steward: Fleet Felix.

### D1 · Who the Fleet Steward is
**Current (from 2026-07-20, PR #430): Fleet Felix.** Corey was re-laned OFF it and now owns URITP workspace structure + ClickUp-setup coaching. **Rotted at least four times** (07-25 build stub, 07-26 Fiona D5, and three files on 08-01). The single most-copied wrong fact in the repo. Any sentence assigning steward duties, ratification, or fleet rollout gets checked.

### D2 · What the canonical fleet record is
**Current (from 2026-07-30): the 🤖 Agent Index ClickUp list.** Four manifests have now been retired to stubs. **57 files still contain the string `roster.json`** as of 08-01 — most correctly struck through, some not. Distinguish a live pointer from a tombstone reference; only the live ones are findings.

### D3 · How many agents there are
**Current: do not write a number, anywhere, ever.** Filter the Index by `Class` and count rows. Every hand-maintained count in this repo has gone stale, the last one within 48 hours. A count in prose is a finding on sight, even when it happens to be right today.

### D4 · What `Class` means
**Current: PERSISTENCE — does this voice hold a memory bundle across sessions.** NOT rank, seniority, speaking order or quality. A lens is a peer of every teammate. Any text implying a teammate outranks a lens is a finding. Governing: `_shared/super-agent-base.md` §6 + `orchestration.md` Class Parity.

### D5 · Whether an agent's native ClickUp shell is live, retired, or a loader
**Current: PER AGENT, and this is now the fastest-moving fact in the fleet.** Three distinct states exist: never had one · retired (Corey, from 07-19) · **KEPT as a thin loader body under Model A** (Fiona, from 08-01, and the pattern Milo + Listing Lookout are queued for). "Retired native" language written before 08-01 predates Model A and cannot be trusted. Check the agent's own `activity-log.md`.

### D6 · Where a bundle lives
**Current: lens → `agents/<slug>.md` · git-teammate → `super-agents/<slug>/`.** Graduated lenses leave a redirect tombstone at the old path, so a path that resolves does not prove it is the live home. Six voices have graduated; a lookup that finds nothing in `agents/` checks `super-agents/` before concluding anything.

### D7 · Who ratifies, reviews, or approves a PROPOSED artifact
**Current: derive it from the LANE at read time, never from the file.** A status line naming a person is a snapshot, and a PROPOSED file is by definition one nobody has revisited. This is the highest-consequence row in the register: an artifact parked on a stale approver is not merely inaccurate, **it is blocked forever and nobody is waiting for it.**

### D8 · Whether two agents are peers or one reports to the other
**Current: peer by default, and Michael rules explicitly when it matters.** Standing rulings: **Milo ↔ Tate are PEERS** with an unowned seam (07-30) · **Riley reads Fiona's schema but never rules on it** (08-01). Text implying subordination is a finding unless a dated ruling backs it.

### D9 · Slug vs display name
**Current: slugs are IMMUTABLE; a rename touches `display_name` only.** Live mismatches: **`fmp-frank` IS FMP Fiona** (and `/session-start=fmp-frank` resolves to HER, never to Fold-in Frank) · `memory-maggie` predates her graduation. Never infer an agent from its slug.

### D10 · Retired names, near-homophones, and blessed variants
**Current:** Workshop Wes is RETIRED, **Workhorse Wes** is live, and a bare "Wes" resolves to the live one · **Clio** (session close) vs **Cleo** (Workshop elegance lens) are one vowel apart and homophones in dictation — resolve on exact spelling, ASK if spoken · **"Reality Riley" is a REAL registered token for Realty Riley, not a typo to correct.** A retired name is still TAKEN and still collides.

### D11 · Ledgers that are EMPTY on purpose
**Current: Tate's Ledger C · Riley's Ledger C · Fiona's object-library refusal ledger.** These ship genuinely empty because they are the ledger that justifies the agent's class. A cold session that finds one empty **says so**. Inventing a pattern to fill it is the specific failure they were designed to expose, and inherited entries are LEADS, not facts.

### D12 · Routing seams
**Current: Felix owns the fleet DIRECTORY, Mira CONSULTS it while routing.** Neither is a forwarding desk: a NAMED invocation resolves straight to that agent with **no double-hop** through either. Reading the Index is not invoking Felix.

### D13 · The repo read path
**Current: git blob API at the file's current SHA, or `githubmcp_get_file_contents` pinned to an immutable SHA.** NEVER a raw branch URL — cache-frozen, and demonstrably served a file ~280 PRs stale. Re-fetch SHAs before any decision or write. Bodies over ~22KB on disk truncate; if it did not come back whole, STOP.

---

## The pass

### 0. Read-path discipline
As `doc-rot-sweep.md` §0 — blob API at SHA, re-fetched, never a raw branch URL, never rewrite from a truncated read. **Pointed at, not restated.** A sweep run on cached reads compares one snapshot to another and reports nothing but noise.

### 1. Load ground truth FIRST, before reading a single claim
Pull the 🤖 Agent Index (name · `Slug` · `Class` · `AKA` · `Invoke` · `Home` · `Lane` · status) and hold it as the answer key. **Reading claims first is how you get anchored to the consensus you are supposed to be testing.**

### 2. Scope, then inventory the claim surfaces
Bound it. High-yield surfaces, in order:
- Every `super-agents/*/preferences.md` **§ seams / lane-boundary / "who they are NOT"** — this is where cross-agent claims concentrate.
- Every `memory.md` — especially lines labelled INHERITED, and any `Pointers` block.
- `_shared/super-agent-base.md` · `orchestration.md` · `council.md` · `teams/*` · `super-agents/index.md`
- `gates/*` and `hooks/*` naming an owner, steward or ratifier
- Anything with **PROPOSED / PENDING / DRAFT** status (see D7)
- `audits/*` — old audits fossilize the org chart of their date
- The ClickUp side: the AI Toolkit trigger table, and each Index row's `Lane`

### 3. Extract the claims, do not read for vibes
Pull every sentence that asserts something about an agent OTHER than the file's owner. Mechanical greps that pay: `Steward` · `owns` · `ratif` · `approv` · `review` · `reports to` · `canonical` · `roster.json` · `registry.json` · `superagents.json` · `retired` · `native` · `PROPOSED` · `next` · any agent's first name.

### 4. Check each claim against the ladder
Index first, then the subject's own bundle. **Never against the file next door.** Distinguish three outcomes, and the middle one is the point of the sweep: **TRUE** · **TRUE-BUT-UNSOURCED** (right today, copied not verified, will rot silently — flag it and add the pointer) · **FALSE**.

### 5. Sweep for general discrepancy too, not just the known list
The register catches what has already bitten. This step catches what is about to. Look for:
- **Asymmetric seams** — A's file describes the A↔B boundary one way, B's describes it another. Both are canonical for their own side, so **both are authoritative and they disagree.** The nastiest finding class here and invisible from either file alone.
- **Orphan claims** — a lane, duty or gate assigned to nobody, or to an agent whose row does not exist.
- **Duplicate lanes** — two agents whose descriptions have quietly converged. Singularity is the Steward's job; this is where it shows up first.
- **Index vs bundle drift** — a row's `Lane` and its profile's Role section telling different stories.
- **Empty authoritative fields** — a blank `Lane` is not "no finding," it is the Index failing at the one question it exists to answer.
- **Fossilized org charts** — an old audit or archive quoting the fleet as it stood. These are HISTORY and should read as history; if one reads as current, date-stamp it.

### 6. Triage
- 🔴 **WRONG ATTRIBUTION** — names the wrong owner/steward/ratifier. *Fix in the same pass.*
- 🔴 **BLOCKED ON A GHOST** — a PROPOSED artifact parked on someone who cannot act. Fix the attribution AND surface the artifact; it has been stalled since the day it was written.
- 🔴 **LIVE MANIFEST READ** — a file consulting a retired manifest as though it returns data.
- 🟠 **ASYMMETRIC SEAM** — two bundles describing one boundary differently. Reconcile if mechanical; **flag if it is a genuine lane question, that is Michael's.**
- 🟠 **STALE STATE** — native status, class, path or count no longer matching.
- 🟡 **TRUE-BUT-UNSOURCED** — right today, unverifiable tomorrow. Add the pointer.
- 🟡 **DANGLING AGENT POINTER** — a path, slug or name that no longer resolves.
- ⚪ **VERIFIED CURRENT** — name what was checked and holds. **A sweep that only reports problems is not trustworthy.**

### 7. Fix discipline (where the line sits, and it is NOT "don't touch other bundles")
- **Mechanical corrections land in the same pass, in ANY file, including another agent's bundle.** A wrong steward name, a dead manifest pointer, a stale native status, a retired path: these are factual errors, not lane decisions, and the Steward correcting one is stewardship. Mark it with **edit provenance in the file** — who, when, on whose direction — never quietly.
- **Strike, don't delete.** Keep the wrong text struck through with a dated correction. What a fact USED to say is the artifact that teaches the next reader that authority survives decay. This is also how a register row earns its place.
- **Flag, don't decide:** anything that CHANGES a lane, a seam, a stance, or who should own something. Correcting *"Corey is the steward"* is a fix. Deciding *"Corey should be the steward"* is Michael's.
- **Never edit another agent's voice, personality, or reasoning.** Facts only. A decision log entry gets a correction appended or struck, never rewritten into something its author did not conclude.
- **Additive on conflict.** Rejected write on a stale SHA → re-read HEAD and layer on. Never re-apply your original body.

### 8. Report

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
### Register delta
- <rows updated, and any NEW row this sweep earned>
```

Every finding carries the file, the quoted claim, the date it was written, and the ladder source that overrides it.

---

## The tells (where fleet rot hides)

1. **A file authored in one sitting that names three other agents.** Nobody verifies at drafting speed.
2. **Any PROPOSED / PENDING status line.** It names an approver and then nobody returns to it. (D7)
3. **A memory dump, cache, or flush being folded into canonical text.** The founding case exactly.
4. **An `INHERITED` label.** It means "copied from a snapshot," which is the definition of this rot class.
5. **The word "next"** — next to convert, next to graduate, next in the order. Sequences rot fastest because they encode a plan, and plans change without anyone editing the file.
6. **An audit file.** A perfect fossil of the org chart on its date, still reading as authoritative prose.
7. **A seam described from ONE side.** Read the other side. Every time.
8. **A number about the fleet.** (D3)
9. **Consensus.** Ten agreeing files with no ladder source is one unverified claim with nine echoes.
10. **An agent describing why it is NOT something.** Correct at writing, and it silently inverts the day the other agent moves.

---

**Output:** the report above. Fixes land as a PR (branch → commit → PR → self-merge) with corrections named in the body. Never a prose-only list of things someone else should fix.

**Composes with:** `hooks/doc-rot-sweep.md` (same discipline, orthogonal ground truth — run both) · `gates/agent-invocation-gate.md` (STEP 0 Index resolution) · `gates/agent-name-collision-gate.md` (forward-looking twin) · `hooks/source-freshness-gate.md` (the origins-not-rows rule, one domain over) · `_shared/native-to-git-conversion-runbook.md` (precondition #1 requires this sweep's discipline before any conversion) · `super-agents/audit-instruction.md` (per-agent internal consistency; this is cross-agent) · `code-review-standard.md` (severity + evidence format, reused never re-invented).

**Guardrails:** read-only until a claim is confirmed against the ladder · never verify a fleet fact from a neighbouring file · never read a retired manifest as data · fix facts freely with provenance, flag every lane and stance call for Michael · never rewrite another agent's voice or conclusions · report what VERIFIED CURRENT as well as what failed.

**Changelog:**

- **v1 (2026-08-01)** — Established by Fleet Felix at Michael's direction, after one stale native cache put the wrong Fleet Steward into three brand-new canonical files in a single afternoon, two of which parked their own ratification on him. Core insight: **a fleet fact is correct at its source and wrong at every quote site**, so it is invisible to a docs-vs-HEAD sweep and can only be caught by checking cross-agent claims against the Index and the subject's own bundle. Ships with the 13-row Known-Drift Register so a cold agent inherits the list of what to distrust instead of re-deriving it after being burned.
