# 📋 Fleet Known-Drift Register

**What this is:** the list of fleet facts that rot on a schedule, with each one's CURRENT value and the date it was set. **A cold agent reads this and knows what to distrust before it knows anything else.**

**Steward: Fleet Felix.** The Register is fleet knowledge, and fleet knowledge is the directory. ⚠️ **The AUDIT that reads it is Audit Anna's** — she leads any formal fleet-fact pass (`Felix knows the fleet; Anna audits it`, her profile, 2026-07-21). Two roles, one file, no overlap.

**Procedure lives elsewhere.** How to run a sweep, the ground-truth ladder, triage, and fix discipline are all in [`../hooks/fleet-fact-sweep.md`](../hooks/fleet-fact-sweep.md). **This file is DATA, not steps** (Constitution §2–§3). Do not write procedure here.

**Split out of the hook 2026-08-01** for two reasons: the combined file crossed the ~22KB unreadable-whole ceiling it warns about, and the ownership ruling that same day gave the Register a different steward than the tool. Procedure vs data — the same split the `routines/` framework uses.

---

## 🚦 The one rule for using this file

**Never quote a row from memory or from a neighbouring file.** A row tells you a fact is VOLATILE and gives you today's value; it does not license you to skip verification. **Go to the ladder:** the 🤖 Agent Index list (ClickUp `901328043244`) → the subject agent's own bundle → a dated decision record. Everything else is a quote, not evidence.

## 🚦 The one rule for maintaining it

**Never add a row without a real observed drift.** A register padded with hypotheticals stops being read, and an unread register is worse than none because it looks like coverage. Every row below is something that actually went wrong, with the receipt.

The CURRENT line is the part that rots, so it stays thin and dated. **Update the row in the same pass as the change that makes it true.**

🚫 **And do not put a COUNT in a row.** See D3 — which this file broke in D2 within four hours of being written.

---

## The rows

### D1 · Who the Fleet Steward is
**Current (2026-07-20, PR #430): Fleet Felix.** Corey was re-laned OFF it and now owns URITP workspace structure + ClickUp-setup coaching. **Rotted at least four times** (07-25 build stub · 07-26 Fiona `decision-log.md` D5 · three separate files on 08-01). The most-copied wrong fact in the repo. Check any sentence assigning steward duties, ratification, or fleet rollout.

### D2 · What the canonical fleet record is
**Current (2026-07-30): the 🤖 Agent Index ClickUp list** (`901328043244`). Four manifests have been retired to tombstone stubs: `registry.json` (07-25) · `superagents.json` · `roster.json` · `roster.html` (07-30).

⚠️ **A LARGE NUMBER of files still contain the string `roster.json`** — most correctly struck through, some not. **Only the LIVE pointers are findings**; a strikethrough reference is doing its job. ~~57 files~~ **CUT 2026-08-01: that was a hand-maintained count, it was wrong within four hours (the real figure was 62), and it sat two rows above D3, which forbids exactly this.** Grep it when you need it; do not write the answer down. *(The remediation sweep ran 08-01 in two batches, PR #691 + the batch-2 follow-up.)*

### D3 · How many agents there are
**Current: do not write a number, anywhere, ever.** Filter the Index by `Class` and count rows. Every hand-maintained count in this repo has gone stale, the last one within 48 hours. **A count in prose is a finding on sight, even when it happens to be right today** — refreshing a number resets the timer, removing it ends the vector.

⚠️ **This row is the most-violated one in the register, including by the register.** Known instances: the AI Toolkit index ("13 super-agents") · Felix's own `memory.md` ("the teammate roster (12)") · Wes's `memory.md` ("fleet now 12+ teammates") · D2 above. All four cut rather than refreshed.

### D4 · What `Class` means
**Current: PERSISTENCE** — does this voice hold a memory bundle across sessions. NOT rank, seniority, speaking order or quality. A lens is a peer of every teammate, and a teammate never pulls rank on one. Text implying otherwise is a finding. Governing: `_shared/super-agent-base.md` §6 + `orchestration.md` (Class Parity).

### D5 · Whether an agent's native ClickUp shell is live, retired, or a loader
**Current: PER AGENT, and the fastest-moving fact in the fleet.** Three distinct states now exist: never had one · **retired** (Corey, 07-19) · **KEPT as a thin loader body under Model A** (Fiona, 08-01; Milo + Listing Lookout queued). Any "retired native" language written before 08-01 predates Model A and cannot be trusted. Check the agent's own `activity-log.md`.

⚠️ **Second-order (08-01): the AUDIT STANDARD had not caught up either.** `audit-instruction.md` marked its native track DORMANT on 07-26 ("no native agents exist") and Model A falsified that six days later. Re-labelled UNMAINTAINED — the class exists again, but live-vs-declared cannot audit a kernel that points at a bundle. **A third track is needed and unwritten.**

### D6 · Where a bundle lives
**Current:** lens → `agents/<slug>.md` · git-teammate → `super-agents/<slug>/`. Graduated lenses leave a redirect tombstone at the old path, so **a path that resolves does not prove it is the live home.** A lookup finding nothing in `agents/` checks `super-agents/` before concluding anything.

### D7 · Who ratifies, reviews, or approves a PROPOSED artifact
**Current: derive it from the LANE at read time, never from the file.** A status line naming a person is a snapshot, and a PROPOSED file is by definition one nobody has revisited. **Highest-consequence row here:** an artifact parked on a stale approver is not merely inaccurate, **it is blocked forever and nobody is waiting for it.**

### D8 · Whether two agents are peers or one reports to the other
**Current: peer by default**, and Michael rules explicitly when it matters. Standing rulings: **Milo ↔ Tate are PEERS** with a seam that has NO owner (07-30) · **Riley READS Fiona's schema, comments on it, and never RULES on it** (08-01). Subordination language is a finding unless a dated ruling backs it.

### D9 · Slug vs display name
**Current: slugs are IMMUTABLE**; a rename touches `display_name` only. Live mismatches to know: **`fmp-frank` IS FMP Fiona**, and `/session-start=fmp-frank` resolves to HER, never to Fold-in Frank · `memory-maggie` predates her graduation. **Never infer an agent from its slug.**

### D10 · Retired names, homophones, blessed variants
**Current:** Workshop Wes is RETIRED and **Workhorse Wes** is live — a bare "Wes" resolves to the live one · **Clio** (session close) vs **Cleo** (Workshop elegance lens) are one vowel apart and homophones in dictation, so resolve on exact spelling and ASK if spoken · **"Reality Riley" is a REAL registered token for Realty Riley, not a typo to correct.** **A retired name is still TAKEN and still collides.**

### D11 · Ledgers that are EMPTY on purpose
**Current: Tate's Ledger C · Riley's Ledger C · Fiona's object-library refusal ledger.** Each ships genuinely empty because it is the ledger that justifies its agent's class. A cold session that finds one empty **says so**. Inventing a pattern to fill it is the exact failure they were designed to expose. Inherited entries elsewhere in those files are LEADS, not facts.

### D12 · Routing seams
**Current: Felix owns the fleet DIRECTORY, Mira CONSULTS it while routing.** Neither is a forwarding desk — a NAMED invocation resolves straight to that agent with **no double-hop**. Reading the Index is not invoking Felix. Adjacent and equally load-bearing: **Felix KNOWS the fleet, Anna AUDITS it** (Anna's profile, 07-21).

### D13 · The repo read path
**Current: git blob API at the file's current SHA**, or `githubmcp_get_file_contents` pinned to an immutable SHA. **NEVER a raw branch URL** — cache-frozen, and demonstrably served a file ~280 PRs stale. Re-fetch SHAs before any decision or write. Bodies over ~22KB on disk truncate (base64 inflates 4/3 against a ~30KB cap); if it did not come back whole, STOP rather than infer.

### D14 · Who owns a newly-built tool
**Current (earned 2026-08-01, hours after the sweep shipped): the author is not automatically the owner.** The Fleet-Fact Sweep was written by the Steward and silently read as Steward property until Michael asked *"maybe this is Anna's job."* It was — and the ruling was already written in Anna's profile. **A tool's home is decided by its LANE, not by whose hands built it.** Check for an existing dated ruling before assuming otherwise.

### D15 · Whether a stated SIZE is real
**Current (earned 2026-08-01): assume every written byte count is wrong until re-read.** Nine size claims in one session were wrong on arrival — one commit message claimed a trim on a file it grew 26%, one was off by 50% *inside the entry documenting the pattern*, and two capped memory files were grown by the very passes fixing them. **Read the returned byte count, THEN write the claim.** This is not a discipline note; it is the reason `_shared/super-agent-base.md` now forbids writing a size figure into itself at all.

---

## Register delta log

Every sweep that changes a row records it here, newest on top. A row changing without a line here means the maintenance rule was skipped.

- **2026-08-01 (batch 2)** — **D2's "57 files" CUT** (hand-maintained count, wrong within four hours, and it violated D3 two rows below). D3 gained its own violation list. D5 gained the audit-track second-order note. **D15 added** (a stated size is a fleet fact too). Delta driven by the batch-2 repoint of the remaining live `roster.json` reads.
- **2026-08-01 (established)** — Register created with D1–D13 (Fleet Felix, at Michael's direction), inside `hooks/fleet-fact-sweep.md`. **D14 added the same day** after Michael's ownership question. **Split to this file** hours later on the 22KB ceiling plus the ownership ruling.

---

**Pointers:** procedure → [`../hooks/fleet-fact-sweep.md`](../hooks/fleet-fact-sweep.md) · the docs-vs-HEAD twin → [`../hooks/doc-rot-sweep.md`](../hooks/doc-rot-sweep.md) · the audit lead → [`audit-anna/`](./audit-anna/) · the steward → [`fleet-felix/`](./fleet-felix/) · ground truth → the 🤖 Agent Index list (ClickUp `901328043244`), resolved per `../gates/agent-invocation-gate.md` STEP 0.
