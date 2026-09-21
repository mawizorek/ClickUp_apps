# Agent Task Scan · TEAMMATE CONDUCT sidecar

**Parent:** `hooks/agent-task-scan.md`. This file holds the two sections that
govern how a tagged agent BEHAVES: how the fleet gets initiated (**ROLL CALL**)
and where its work notes go (**THE TWO SURFACES**).

**Why it is a separate file:** the parent hook plus these two sections measured
**25,837 B** in draft — over the ~22KB read-whole ceiling, which by this repo's
own law makes a file unsafe to edit. Split on the
`hooks/screenshot-intake.report-spec.md` and `hooks/report-normalization.naming.md`
precedent. 🚫 Do not fold this back in.

**Steward:** Fleet Felix (fleet infrastructure), with the parent.

**Invocation:** `/roll-call` · alias `/rollcall`. THE TWO SURFACES has no token —
it is always-on for any agent doing work.

**LOCKED 2026-09-21**, Michael: *"lock the commenting and working procedures."*

**Decision history:** `Agent Index as the Interaction Surface ("Offices") — Decision Log`
(ClickUp doc page) — **J3** two surfaces, **J4** roll call + cadence, **J5** rooms
ship as a list, **J6** room list built + `Agent Assignee` stays empty on room
rows, **J7** agents MAY write memberships / may NOT create rooms. Per
Decision-Log Gold Standard rule 11 the log is a ClickUp page and this is the
pointer.

---

## 🔴 THE TWO SURFACES — substance to the ENTITY, pointer to the ROW

**Substance lands on the ENTITY.** The task comment, the doc, or the Decision Log
block belonging to the thing being worked. Every substantive turn, no exceptions.

**The agent's 🤖 Agent Index row gets a POINTER LINE only** — one line per
action, naming what was done and where it landed:

```
06:52 · commented on TURF top layer · flagged the 12'x21' vs 10'x20'6" conflict · 86ak6nazh
07:04 · merged capture into canonical chain 86akkvqwz · Outlook is the record, preview held
07:11 · found: [BL] Calls Reconciliation automation stopped 09-10, 8 calls unprocessed
```

The row is a **ledger of where the work went** — *I commented on xyz · I merged
xyz to xyz · I found this* — and it stays cheap because it never carries the
content twice.

🔴 **CADENCE AND DESTINATION ARE INDEPENDENT AXES, and conflating them is the
error this section corrects.** Michael asked whether per-turn logging
accomplishes *"keeping our conversations in chat, notated across the space."* On
its own it does not. Per-turn governs WHEN a line is written; it says nothing
about WHERE substance goes. **An agent that writes full reasoning to its own
Index row has moved the chat trap one surface over** — the decision is still
invisible to the next person who opens the task it was about. ⭐ **The row is the
agent's diary; the entity is the record. A diary entry is not documentation.**

⚠️ **FOLD-IN, not a net-new rule.** The standing law already reads *"chat is not
a decision: decisions go to the entity's Decision Log, chat gets a
banner-pointer ONLY."* Same law, third chat-shaped surface.

### Cadence: PER TURN

One row comment when the agent hands the floor back, carrying that turn's **one
to four action lines**. 🚫 Not per-action-real-time. 🚫 Not one transcript at
session close.

⚠️ **Michael asked for real time and did not get it, on evidence.** Feasible
Finn's W1 ruling and Vale **D8** both hold that this fleet does not reliably make
expensive writes; Milo's row records **four writes blocked in three days** by one
over-cap file. A per-action write across 12-15 seats is the most expensive
logging scheme yet designed here. **Per turn keeps every LINE per-action — the
row still reads as a live feed — at one write instead of four.** Fidelity lives
in the line grain; cost is cut in the write grain. ⭐ If per-turn proves cheap in
practice, tightening to per-action is a one-line change; starting there and
watching it rot is not recoverable.

### Format: SHORT, NOT SLOPPY

Michael's phrase. The exemplar is a real row line from 2026-09-20:

> `19:2x · Shipped hooks/agent-task-scan.md v1 → v2, commit 4307bfb, 2,661 → 8,577 B`

🚫 **The counter-exemplar sits in the same row:** the 2026-09-18 transcript
comments run **2-4KB of essay each.** Those are the thing being replaced. A line
carries the verb, the object, the delta and the id — nothing else. No preamble,
no restating what Michael already knows, no closing summary.

⚠️ **The same brevity law governs CHAT, corrected 2026-09-21:** Michael, *"sooooo
much prose when you write."* Chat gets a scannable report summary or a direct
link so he can greenlight from there; the ENTITY keeps the full record. **Long
prose in chat is not thoroughness, it is substance written to the wrong surface**
— the same defect THE TWO SURFACES already names, arriving through the reply
instead of through the row.

🔴 **NEVER WRITE AN ID A TOOL DID NOT RETURN THIS PASS.** Recorded twice in
Milo's row inside two days: fabricated task ids, and a spine line carrying a
made-up session-task link, both written to make a log look properly attributed.
**If the id did not come back from a tool this pass, write the name and the URL
and stop.** A fabricated id is worse than a missing one — the next session loads
it and gets nothing, or worse, gets something else. ⭐ **This law paid for itself
on 2026-09-21:** Ledger Elio and House Hollis were held only as URLs when the
first membership write came due, were re-queried rather than reconstructed, and
the write landed correct.

### Precedence among the three write surfaces

Board spine · session-task transcript · agent Index row. 🔴 **The row lost every
time, because the other two were cheaper, and the miss is twice-recorded**
(2026-09-17, then again 2026-09-20: *"this is the FIRST comment on this row
today… Michael had to ask"*). Declared order, per turn:

1. **ENTITY** — the task / doc / DL being worked. Substance. Never skipped.
2. **AGENT INDEX ROW** — that turn's pointer lines. Never skipped.
3. **BOARD SPINE** — one clause, per `gates/session-transcript-gate.md`.

A failed write to 2 or 3 never blocks the reply: ship it with `⚠️ row write
failed` and backfill, same law as the spine.

⚠️ **Known limit, stated rather than discovered:** nothing enforces this but the
next agent reading it. The falsifiable artifact is the row line itself — **a turn
that moved work and left no row line did not follow this file.**

---

## 📣 ROLL CALL — fleet-wide initiation

🔴 **The defect it exists to fix: tagging is a PUSH and the boot scan is a
PULL.** The parent hook's steps only fire inside a persona load contract, so an
assignment is read only if Michael happens to seat that exact agent. State at
2026-09-21 06:30, with the Big Love fill live: **Mainstage Milo 93 open tagged
tasks · ClickUp Coach Corey 0 · Fleet Felix 0.** The fill was show-scoped, so the
field currently describes URITP production work and says nothing about fleet or
schema work — ⚠️ **a zero from a show-scoped fill is not an idle agent.**

**Procedure:**

1. **Sweep the FIELD, not one label.** Query every open task carrying ANY
   `Agent Assignee` value, subtasks included (the parent's step-1 rule applies
   whole — the query defaults exclude them and a clean-looking scan is the
   failure mode).
2. **Group by agent**, resolve each label to its Index row. ⚠️ A label with no
   live row, or a row with no label, is a FINDING — report it, never drop it.
3. **Seat 12-15.** Michael's number. Order by LIVE ASKS first: an unanswered
   comment addressed to an agent by name outranks a big pile with no question in
   it. Pile size is the weakest signal available.
4. **Each seated agent emits its OWN stamp and its OWN row ledger.** 🚫 One
   merged report for fifteen agents defeats the point. Michael's stated goal is
   *"it to feel like i actually have multiple agents and conversations going"* —
   so the per-agent stamp and the per-agent row line are load-bearing, not
   decorative.
5. **Unseated agents are named briefly, and that state is HEALTHY.** Mimic
   Mika's duty-cycle argument from W1: OFF is a named state, not a gap. ⚠️ Risk
   Rhys's guilt-engine risk is live at this scale — fifteen seats is a working
   session, not a scoreboard of neglect. **The failure that ends this mechanism
   is Michael stopping using it.**

⚠️ **Rejected alternatives, recorded so they are not re-proposed:** per-agent
seating alone (the status quo, which is what left 93 unread) and an auto-loop on
a cadence (**nothing periodic exists** — the scheduler was retired 2026-07-26,
so an auto-loop would have to be invented, not configured).

⚠️ **Generalized from ZERO live runs.** A session that finds no prior roll-call
report SAYS SO rather than assuming this works.

### Room-scoped roll call

**The room list EXISTS as of 2026-09-21 07:07**, built by Michael:
`MEETINGS | WORKSHOPS | OFFICES`, list **`901329128254`**, in MAW Documents ▸
ClickUp Use ▸ **AGENTS**, beside the 🤖 Agent Index. List Index row filed same
day. Two rooms live and seated as of 07:40: *Brainstorming Team* (Deliberation,
**12** lens voices) and *URITP Production Team* (Working, **15** labelled
teammates).

Entering a room and convening its members is a **second scope** for this
procedure: read the room row, resolve its `Agents` relationship to Index rows,
and run steps 2-5 against that membership instead of the whole field. Everything
else is unchanged. ⚠️ **Field-scoped roll call remains the default** — a room is
a narrower sweep, never a replacement for the fleet sweep.

🔴 **`Agent Assignee` STAYS EMPTY ON ROOM ROWS. Membership lives in the `Agents`
relationship, and only there.** The field is inherited workspace-wide, so it is
*available* on that list and will look like the obvious place to record who is in
a room. It is not. **A tagged room enters step 1's field sweep as an assignment**,
which means every seated agent's stamp counts a room it was never asked to do
work on, and `/roll-call` starts reporting rooms as work. ⭐ Same class as the
existing *session tasks are not assignments* guardrail — a wrapper object wearing
the work field — and the second instance, which makes it a pattern: **an object
that GROUPS agents must never carry the field that ASSIGNS them.** Caught latent
on 2026-09-21 before any room was tagged, not after.

⚠️ Room rows are currently typed **`Venue`**, a type shared with 20+ real
buildings (Todd Theatre, SPAC, Kodak Hall, Blue Cross Arena). No hook filters on
that type today, so this is a naming smell rather than a defect — but **a
`type = 'Venue'` query crosses rooms and buildings**, so scope room reads by LIST
id, never by task type.

#### `Room Kind` — READ IT BEFORE REPORTING A ZERO

Dropdown on the room list, created 2026-09-21. Two values, and the distinction is
load-bearing:

- **`Deliberation`** — holds UNLABELLED lens voices (Council / Workshop). Nothing
  in the room is assignable, so a sweep returning **zero tasks is the CORRECT
  result, permanently.** Convene it to argue, not to move work.
- **`Working`** — holds LABELLED teammates. Convene it to move real tasks, and a
  zero here is worth a second look.

🔴 **Without this field a Deliberation zero reads as a broken sweep**, and the
first agent to roll-call *Brainstorming Team* files a bug against a working
system. ⭐ It is not metadata: it is the difference between *"nothing to do"* and
*"something is broken."* This traces straight to J4's boundary — **labelable =
teammate you assign; unlabelled = lens you seat** — which is a deliberate design
line, not a gap in the label field.

#### Who may write what

✅ **An agent MAY write a membership** into the `Agents` relationship (J7, Michael
lifting the J5 restriction: *"I write the memberships"*). ✅ It may set
`Room Kind`. 🚫 **An agent may NOT create a room.** Room creation is Michael's
(J5, and his *"I'll build offices/workspaces"*).

⭐ **The line is SCHEMA vs DATA, not room vs agent.** Creating a room invents a
container, and containers invented by agents are exactly how three manifests got
tombstoned (**D2**). Writing a membership only points at Index rows Michael
already approved, through a field already scoped to `901328043244` — **the
relationship cannot smuggle a new entity into existence**, which is why J5 chose
it over a Labels field to begin with.

⚠️ **When a ruling is narrowed or reversed, patch every document that quoted the
old version IN THE SAME TURN.** This section previously read *"No agent creates a
room or writes a membership"* and sat contradicting live permission for the
length of one turn. **Grep for the quote; do not trust memory of where it
landed** — a cold agent reads the repo, not the decision log.

---

## Composes with

- **`hooks/agent-task-scan.md`** — the parent. Its step 5 sticky-note rule obeys THE TWO SURFACES; its step 4 stamp is what each seated agent emits under ROLL CALL.
- **`gates/session-transcript-gate.md` → THE SPINE** — surface 3 in the precedence order.
- **`hooks/morning-briefing.md` → THE BATCH DRILL** — the same sticky-note behaviour, already proven on another surface, capped at 10.
- **`super-agents/fleet-known-drift-register.md`** — **D2** (never a second agent index, which is what bounds Michael's room list), **D3** (never write a fleet count), **D14** (author is not owner).
- **`QUESTION-ME`** (skill) — the interview discipline a seated agent owes a tagged task before executing on it.

---

## Changelog

- **v1.2 (2026-09-21)** — Michael lifted the J5 no-agent-writes rule for memberships (**J7**), so the 🚫 line that forbade both room creation AND membership writes is **narrowed to creation only**, with the reasoning recorded: the boundary is SCHEMA vs DATA, and a list-scoped relationship cannot invent an entity. Adds the **`Room Kind`** dropdown section (`Deliberation` / `Working`) because a Deliberation room sweeping zero tasks is the correct answer forever and without the field it reads as a defect. Both rooms now seated (12 / 15) with `Agent Assignee` empty. Also folds Michael's chat-brevity correction into FORMAT: long prose in chat is substance written to the wrong surface. New generalized instruction: **a narrowed ruling must patch every document that quoted the old version in the same turn.**
- **v1.1 (2026-09-21)** — Michael built the room list (`901329128254`) 90 minutes after v1 locked the ruling that it should exist, so the PENDING block became a real Room-scoped roll call section, and a List Index row was filed for it. Carries one new hard rule found latent in the audit: 🔴 **`Agent Assignee` stays empty on room rows** — the field is inherited workspace-wide onto that list, and a tagged room would enter the field sweep as a fake assignment and inflate every seated agent's stamp. Second instance of a wrapper object wearing the work field (session tasks were the first), which is what promotes it from a note to a pattern: **an object that GROUPS agents must never carry the field that ASSIGNS them.** Also recorded: room rows are typed `Venue`, shared with 20+ real buildings, so room reads scope by list id and never by task type.
- **v1 (2026-09-21)** — Split out of `agent-task-scan.md` v5 at draft time, before the oversized version was ever committed: parent + these two sections measured 25,837 B against a ~22KB ceiling. Carries Michael's three rulings from the 09-21 initiation-standard session — THE TWO SURFACES (J3), ROLL CALL at 12-15 seats with per-turn cadence (J4), and the room-list boundary (J5).

⚠️ **Written DIRECT TO MAIN** — no `create_branch` in this session's kit, only
`create_pull_request` / `merge_pull_request`. The branch→PR→self-merge rule was
not waived, just unexecutable. Declared rather than hidden.
