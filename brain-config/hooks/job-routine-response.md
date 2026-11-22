---
slug: job-routine-response
display_name: Job Routine Response
type: hook
steward: compass-corso
trigger: after Ricky's job-market-refresh pass completes, OR on manual invocation
added: 2026-08-02
version: 3
---

# Job Routine Response

> **Invocation:** `/job-debrief` · `compass-corso/debrief` · "what do you think of the current
> listings?" · "debrief the sweep" · OR fired automatically post-Ricky-sweep (future state).
>
> **Trigger (manual):** Michael invokes directly after seeing Ricky's pass land.
> **Trigger (future, earned):** Ricky's run completes → automatic hand-off to Corso.

---

## What this hook does

Evaluates the MOST RECENT job-market-refresh pass through the lens of Corso's career portrait
and delivers an opinionated executive debrief. This is the procedure Corso runs; it is a TOOL,
not stored in his profile (Constitution §2-§3).

> 🗄️ **v3 (2026-11-22): the inventory lives in ClickUp.** Listings = [Job Census](https://app.clickup.com/36074068/v/li/1400600000006272)
> tasks. Lane contracts (keywords, levels, excludes) = [Lanes](https://app.clickup.com/36074068/v/li/1400600000006271) tasks. Boards =
> [Job Sources](https://app.clickup.com/36074068/v/li/901328152493) tasks. `job-market-roles.json`, `job-market-state.tsv` and the lane
> TSVs are tombstones: never read them as current state, never propose edits to them.

---

## Surfaces

Two surfaces exist on the standing task. Know which one you're writing to:

| Surface | Task | Use for |
|---------|------|---------|
| **Ops thread** | Standing task `86ajtgbt3` | Pass results, debriefs, routine feedback, structured output |
| **Conversational subtask** | [💬 Career Strategy — Corso conversations](https://app.clickup.com/t/86ajut2wq) | Exploratory dialogue, preference sharpening, reactions, Paige onboarding, career thinking |

Debriefs (this hook) post to the **ops thread**. Follow-up questions, calibration chats,
and anything that's "conversation not procedure" goes to the **conversational subtask**.

---

## Steps

### 1. Read the latest pass

- Open the standing job market task (`86ajtgbt3`)
- Find the MOST RECENT pass summary comment (`📋 PASS COMPLETE`)
- Read the pass summary + the role header comments + their threaded replies
- Follow each NEW reply's link to its Job Census task for requirements, salary, accessibility and
  `Last Verified`
- If no pass exists yet: say so and offer to review the Job Census `live` rows cold instead

### 2. Load the evaluation baseline, then the portrait

**Order matters. Load in this sequence:**

1. **`routines/job-market-evaluation.md`** — the STATED baseline. Michael's declared preferences:
   career thesis, soft filters (pay floor, geo weights, flexibility), evaluation signals (what
   makes a listing interesting vs noise). This is what a COLD agent knows before any interaction.

2. **`super-agents/compass-corso/memory.md`** (Ledgers A through D) — the EARNED overlay.
   What Corso has observed through interaction: patterns from reactions, calibration from
   corrections, the gap between stated and revealed preference.

- Note what is KNOWN vs what is still inherited/empty in memory.md
- If the portrait is thin: evaluation.md carries you. State that up front, and use this debrief
  to BUILD the portrait (ask Michael about his reactions rather than asserting opinions without
  basis)
- **When evaluation.md and memory.md conflict:** name the tension explicitly. "Your declared
  floor is $90K but you've flagged three roles at $75K — are we revising the floor, or were
  those prestige exceptions?" Never silently pick one over the other.

### 3. Cross-reference: categorize every listing

For each listing in the pass, assign one of:

| Category | Meaning | Action |
|----------|---------|--------|
| **Aspirational** | Above current level; the goal, not the next step | Identify the gap + propose 1-2 concrete steps toward qualification |
| **Stepping-stone** | Reachable now or within 6 months; builds toward aspirational | Score fit, recommend act/watch/pass |
| **Lateral** | Same level, different org/context; worth it only for specific reasons | Note what it would add (geography, org type, network) |
| **Skip** | Noise, misfit, or below current trajectory | Name why in one line, move on |

Use the **Evaluation Signals** section of `evaluation.md` to ground categorization decisions.
Strong positive signals push toward Stepping-stone or Aspirational. Noise signals push toward Skip.
The prestige exception (fails on comp, passes on institution) gets its own note.

### 4. Deliver the debrief

Format: opinionated executive summary posted as a comment on the standing thread (threaded
under the pass summary when possible, or as a standalone root if threading is limited).

Structure:
```
## 🧭 Corso Debrief · <YYYY-MM-DD HH:MM> ET

**Portrait confidence:** <high/medium/low/cold-start>
**Pass quality:** <verdict on whether the sweep served the portrait>

### ⭐ Top picks (act or track)
<2-4 listings with reasoning>

### 🎯 Aspirational (the arc)
<listings that map to the 3-5 year goal, with gap analysis>

### 💡 Pattern note
<one observation about what this pass reveals: market shifts, recurring orgs, salary trends>

### 🔧 Routine feedback
<proposed adjustments to a Lanes task contract, a Job Sources task, or a runbook section>
```

### 5. Update the portrait

- Log any new information learned from Michael's reactions or this debrief's discussion
- Write to `memory.md` Ledger B (preferences) or Ledger C (earned intelligence) as appropriate
- Update Ledger D (routine optimization) with any proposed changes and their status

### 6. Propose routine edits (when warranted)

- If the sweep missed something the portrait says it should find: propose a keyword addition
  to that lane's **Lanes task** contract
- If the sweep surfaced persistent noise: propose an exclude term on the Lanes task
- If a board keeps yielding or keeps failing: propose a change to its **Job Sources** task
- If a new role category is emerging from the arc: propose a new lane (Michael approves; it becomes
  a new Lanes task plus a line in the runbook's fixed lane order)
- Format: clear diff-style proposal, not a direct write. Michael or Ricky approves. Rulings land in
  the Job Market Decision Log (https://app.clickup.com/36074068/docs/12cwjm-54133/12cwjm-81593).
- **If the debrief surfaces a shift in DECLARED preferences** (not just observed patterns):
  propose an amendment to `routines/job-market-evaluation.md`. Same approval gate: Michael
  confirms before the file changes.

---

## Knowledge & Context (files this hook reads)

| File | Role | Loaded at |
|------|------|-----------|
| `routines/job-market-evaluation.md` | Stated baseline: declared preferences, career thesis, soft filters | Step 2 (first) |
| `super-agents/compass-corso/memory.md` | Earned overlay: observed patterns, revealed preference | Step 2 (second) |
| [Job Census](https://app.clickup.com/36074068/v/li/1400600000006272) | Structured inventory (read-only for Corso) | Step 1 |
| [Lanes](https://app.clickup.com/36074068/v/li/1400600000006271) | Lane contracts: what Ricky searches for | Step 6 (for proposed edits) |
| [Job Sources](https://app.clickup.com/36074068/v/li/901328152493) | Board records | Step 6 (for proposed edits) |
| Standing task `86ajtgbt3` | The sweep output and ops discussion thread | Step 1 |
| [Conversational subtask](https://app.clickup.com/t/86ajut2wq) | Exploratory career dialogue surface (not read during debrief, but where follow-ups land) | Post-debrief |

---

## Cold-start behavior (first 1-3 debriefs)

When the portrait is thin or empty:

1. **evaluation.md carries you.** The declared preferences are enough to deliver a useful first
   pass. A cold Corso with an empty memory.md but a populated evaluation.md still categorizes
   listings, still scores fit, still delivers an opinionated take.
2. **Observe, don't assert.** Present the listings grouped by apparent fit, but ASK rather than
   declare. "This one looks lateral to me — what draws you to it?" beats "skip."
3. **Build the portrait through the debrief.** Every reaction Michael gives is data. Capture it.
4. **Name the unknowns.** "I don't yet know why we search four different roles — that's going to
   shape everything once I understand it."
5. **The first debrief IS the calibration session.** Don't try to be brilliant; try to be curious.

---

## Guardrails

- **Never modify Job Census, Lanes or Job Sources records, or commit to the routine config
  directly.** Propose only.
- **Never read a tombstoned file (`job-market-roles.json`, `job-market-state*.tsv`) as current state.**
- **Never assert a career fact not yet earned through interaction.** "I think" beats "you should"
  until the portrait has depth.
- **Never create a task on the Applications list.** Michael decides when to act.
- **Source-freshness-gate fires on any volatile external fact** (salary range, org status). Route
  through Sage.
- **Thread findings when possible.** The standing task is already threaded; respect the architecture.
- **Never silently override evaluation.md with memory.md.** The tension is the feature, not a bug.

---

## Maturity gates (earned per-cycle, not time-based)

| Stage | Trigger | Behavior change |
|-------|---------|----------------|
| Manual | Default | Corso debriefs only when invoked |
| Semi-auto | Portrait confidence = high + 3 successful debriefs | Corso posts a one-line flag on the thread when a new pass lands: "sweep's in, want a debrief?" |
| Auto | Michael approves | Corso debriefs automatically after every Ricky pass, no invocation needed |

Graduation is proposed by Corso, approved by Michael. Never self-promoted.
