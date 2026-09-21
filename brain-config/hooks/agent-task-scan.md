# Agent Task Scan · AI Toolkit

**Purpose:** Surface every task tagged to the loading super-agent via the **Agent Assignee** field, at boot, with a mandatory stamp — then **own those tasks toward done**, as a teammate, not a reader.

**Steward:** Fleet Felix (fleet infrastructure). Parent law stewarded by Dev Dexter (see Parent law).

**Mode:** Always-on (fires inside every super-agent persona load contract), **plus** on-demand re-run via the tokens below. ⭐ **This hook does not terminate at a greeting — it HANDS OFF** to the agent's own lane with the assignments in hand (see Procedure step 5).

**Invocation:** `/agent-task-scan` · alias `/agent-scan` · also "what's assigned to me", "do I have any assignments", "check my agent assignments", "scan my tagged tasks" · and **automatic** at load contract step 5b.

**Trigger:** Automatic during the persona load contract (`super-agents/_shared/super-agent-base.md`), after confirming wiring (step 5) and before inhabiting (step 6). On-demand any time an agent or Michael wants the scan re-run mid-session.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-09-17** by Brain. Normalized to template 2026-09-20.

⭐ **Why this hook matters more than its size suggests:** it is the ONE step in the
load contract that reads something addressed **to** the agent. Every other step
reads context about the world. A missed scan is not a missed data source, it is
an **unanswered request** — and without the stamp below, Michael cannot tell an
agent that read its assignments and chose not to act from one that never looked.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Agent Assignee field** | Workspace-level Labels (multi-select), field id `70384078-b97f-40c9-b626-3cdf4dcf9cc2` |
| **Label format** | `<emoji> <Full Display Name>`, e.g. `🎭 Mainstage Milo` — match exactly, never fuzzy |
| **🤖 Agent Index list** | `901328043244` — the ONE documented source for whether a label maps to a live agent |
| **Caller** | `super-agents/_shared/super-agent-base.md` → persona load contract **step 5b** |
| **Parent law** | `hooks/silent-fallback-law.md` (Dev Dexter) |
| **Session-task surface** | Agent Activity Board list `901327879922` — session wrappers, filtered per Guardrails |

🚫 **Per-agent label option ids are deliberately NOT listed here.** That is a
volatile set maintained by hand, and a table of them would rot the day an agent
is added, renamed or retired (Known-Drift Register **D3** territory). Resolve the
current agent's label from its own identity, and the fleet from the Index.

---

## Procedure

1. **Query open tasks** where the "Agent Assignee" field includes the
   current agent's canonical label (the emoji + display name as it
   appears in the field, e.g. "🎭 Mainstage Milo").

   🔴 **SUBTASKS ARE IN SCOPE, AND THE QUERY DEFAULTS EXCLUDE THEM** (added v4,
   Michael: *"make sure agents read/look for subtasks then??"*). Pass an explicit
   `is_subtask IN (true, false)` — or whatever the current tool's equivalent is —
   on EVERY run. **A scan that omits subtasks under-reports and looks clean**,
   which is the same failure class as the struck silent-on-empty rule below.
   Proven live 2026-09-20: a default-filter scan missed `TURF top layer`
   (`86ak6nazh`, a subtask of `GRASS PIT`) while reporting a confident total.
   ⚠️ **Second hook to hit this exact defect** — `hooks/prod-cal-reconcile.md`
   already carries it: *"Subtasks and closed tasks are IN SCOPE and ClickUp query
   defaults exclude both — a pass that omits them under-reports and looks clean."*
   Two independent hooks burned by one tool default means **assume every new
   query in this repo has it until proven otherwise.**

   ⚠️ Deep work often lives in the leaves: the parent is the object, the subtask
   is the open question on it. An agent that reads only top-level rows sees the
   nouns and none of the verbs.

2. **Filter to actionable work.** Exclude closed tasks. The Agent
   Activity Board session tasks are not actionable assignments (they
   are session wrappers); include them only if explicitly relevant.

3. **Read the COMMENTS on anything surfaced, not just the row.**
   A label is how a task gets tagged; a comment is how a request gets MADE. The
   09-20 miss was not a missing field value, it was an unread comment on a task
   whose field was set correctly. A scan that reads rows and skips comments will
   report the assignment and miss the ask. **Also check `created_at`:** separate
   what pre-dated this session from what arrived during it, and report the split
   rather than one inflated number — 14 tagged tasks where only 4 pre-dated the
   session is a 4-task miss, and saying 14 is theatre.

4. **Surface in the greeting — THE STAMP IS MANDATORY.**
   After the self-announce header, before addressing the prompt, emit ONE line,
   **always, including the zero case**:
   - Assignments found: `📋 **Agent Assignee:** N open task(s) tagged to me`
     followed by a compact list (name + list + status, max 10; say
     "+ N more" if over 10).
   - None found: `📋 **Agent Assignee:** none`
   - Query failed or field unreachable: `📋 **Agent Assignee:** ⚠️ scan failed — <reason>`
     **Never** render a failure as `none`.

   ~~If none: skip silently. Do not report an empty scan.~~ **STRUCK 2026-09-20.**
   That rule made **never ran** and **found nothing** render identically, which
   left the hook with no falsifiable artifact and made its own non-firing
   invisible. The stamp IS the proof the step ran, same function as the spine
   line and the Task-Context Orientation Gate's 🧭 stamp: **no stamp = the hook
   did not fire.** Three surfaces in this repo now carry that pattern and this is
   the third, deliberately.

5. 🔴 **OWN IT TOWARD DONE — AN ASSIGNMENT IS A HANDOFF, NOT A NOTIFICATION**
   (LOCKED 2026-09-20, Michael, verbatim): *"assume that if you're assigned you
   should help figure out a project to get it to a done state — not 'i've
   assigned you.' You should interview me and start becoming more like workspace
   teammates, leaving short sticky note comments and activity around as we
   progress, and updating tasks."*

   ~~**Do not act on them unprompted.** The scan is awareness, not a work order.
   The agent may reference tagged tasks when they are relevant to the session
   topic, but does not start working them unless Michael directs it.~~
   **STRUCK 2026-09-20, same day it was written.** It was wrong in the most
   expensive way available: it built a mechanism to make assignments visible and
   then forbade the only thing that makes visibility worth having. A tag was
   treated as an FYI when it was always a delegation.

   What owning it means, in order:
   - **INTERVIEW before executing.** A tagged task rarely states its own
     definition of done. Ask what finished looks like, what it is blocked on,
     who else touches it — use `QUESTION-ME` discipline, one question at a time,
     and do not transcribe the answer back at him. A wrong-shaped deliverable
     costs more than the question would have.
   - **LEAVE STICKY NOTES, not reports.** Short comments on the task as work
     progresses: what you found, what you changed, what you are waiting on. Two
     or three lines. The task accumulates the trail so the reply does not have
     to carry it — and so the next cold agent, or Michael a week later, reads
     the surface instead of asking.
   - **UPDATE THE TASK.** Status, fields, relationships, due dates when they are
     yours to move. A task whose status lies is worse than an empty one.
   - **PUSH, don't park.** If it is stalled on a decision only Michael can make,
     say so and name the decision. "Waiting on Michael" with no named question
     is not a status, it is an excuse.
   - **SURFACE THE STRAGGLERS.** An assignment older than the season it belongs
     to gets named, not silently carried. (Live: `86ahnhyt2` open since
     2026-05-22.)

---

## 🔴 A domain hook never displaces the contract

One trigger phrase can fire a domain hook **and** the persona load contract in
the same breath. `milo morning wakeup` is the canonical case: it pulls
`hooks/morning-briefing.md` (23,122 B) **and** loads Mainstage Milo.

**The failure mode:** a big domain hook arrives carrying a complete, ordered
agenda that reads like the whole job. The contract's own steps — 4b Scoreboard,
**5b this scan** — get silently displaced by it, because the hook's agenda is
louder and more specific than the contract's list. Nothing errors. The session
feels thorough.

**The rule:** a domain hook's agenda is ADDITIVE to the load contract, never a
substitute for it. Steps 4b and 5b run on a combo invocation exactly as they do
on a bare `/session.agent=<Name>`. **If a hook's agenda and the contract
compete for the front of the session, the contract wins and the hook's first
section waits.** Proven live: 2026-09-20, Milo morning wakeup, four assignments
unread including one comment addressed to Milo by name, posted 17 minutes after
the brief shipped.

---

## Guardrails

- **Read-only SCAN; the ownership that follows is not.** The scan itself never
  writes to the field or to any task. Step 5 work does, within the limits below.
- 🔴 **OWNERSHIP IS NOT AUTONOMY** (added v4, the necessary bound on step 5).
  Fire freely: task comments, status updates on your own lane's tasks, field
  upkeep, asking Michael questions. Still gated: anything irreversible or
  structural — deletes, merges, moves between lists, new lists/fields/views,
  date writes on shared calendars (an agent date-write is indistinguishable from
  Michael's and manufactures its own reconciliation work), and anything that
  leaves the workspace (email, external calendars). **When a step-5 push needs a
  gated action, propose it and name the action.**
- **No false positives.** Match the canonical label exactly; do not
  fuzzy-match on partial names.
- ~~**No noise on empty.** An agent with zero assignments skips the
  block entirely.~~ **REVERSED 2026-09-20 — see Procedure step 4.** The stamp
  fires on every load, zero included. A one-line `none` is not noise; it is the
  only thing that distinguishes a clean scan from a skipped one.
- **Session tasks are not assignments.** An Agent Activity Board
  session task that happens to carry the label is a wrapper, not work.
  Filter it unless the session topic is explicitly about the board.
- **Never report only one surface.** This hook is a SURFACE PRECEDENCE consumer
  (`hooks/report-normalization.naming.md` → SURFACE PRECEDENCE): the field, the
  task body, and the comments are three surfaces on one assignment. Read all
  three before reporting, and name which one carried the ask.
- 🔴 **A label that does not exist yet returns EMPTY, and empty looks clean.**
  No tool can add an option to a live Labels field, so a newly built agent has
  no label until Michael creates it by hand. Until then this hook returns zero
  for them — correctly, and uselessly (live case: Vellum Victoria, 2026-09-20).
  **A `none` stamp from an agent whose label you have not confirmed exists is
  unverified, not clean.** Say so in the stamp.
- ⚠️ **Never write a fleet COUNT into this file** (Known-Drift Register **D3**).
  ~~28 active super-agents~~ struck 2026-09-20; the 🤖 Agent Index IS the count.

---

## Parent law

The mandatory stamp is **not a net-new rule.** It is `hooks/silent-fallback-law.md`
applied to a hook rather than to app code:

> *"A fallback that does not announce itself is not graceful degradation, it is
> a lie."*

And its corollary lands exactly on v1's silent-on-empty clause:

> *"Resilience features are the prime suspects. Every silent-fallback bug found
> so far was originally added to make something more robust."*

v1's silence WAS a robustness feature — it existed to keep greetings clean. It
made the hook's own failure unobservable. Same law, new surface; a FOLD-IN, not
a second rule. Dexter stewards that law and should see this application.

---

## Composes with

- **`super-agents/_shared/super-agent-base.md`** — the caller. Step 5b points here. 🚫 Do not add procedure to that file; it is at its stated ~22KB ceiling with zero headroom.
- **`hooks/silent-fallback-law.md`** — parent law for the stamp (above).
- **`hooks/morning-briefing.md`** — the proven displacement case. A `milo morning wakeup` fires both; the contract still wins. Its BATCH DRILL (one next-step bump comment on 5-10 surfaced tasks) is the same sticky-note behaviour step 5 now requires, already proven on another surface.
- **`hooks/prod-cal-reconcile.md`** — the other hook burned by the subtask query default (step 1).
- **`gates/session-transcript-gate.md` → THE SPINE** — sibling artifact. Same shape: a one-line write whose absence proves the step didn't run.
- **`hooks/task-context-orientation.md`** — the other sibling stamp (🧭). Its law, *"the stamp is the falsifiable artifact: no stamp = the gate did not fire,"* is the law this hook adopted in v2.
- **`hooks/report-normalization.naming.md` → SURFACE PRECEDENCE** — why step 3 reads comments, not just rows.
- **`hooks/fleet-fact-sweep.md`** + **`super-agents/fleet-known-drift-register.md`** — D3 (never write a fleet count), and the ground-truth ladder for resolving a label to a live agent.
- **`QUESTION-ME`** (skill) — the interview discipline step 5 calls for: drill for the gap and the why, do not transcribe.

---

## Changelog

- **v4 (2026-09-20)** — Michael, two rulings in one message. (a) *"make sure agents read/look for subtasks then??"* → step 1 now carries an explicit subtask clause and the defaults-exclude-them warning, caught live when a default-filter scan silently dropped a subtask while reporting a confident total. (b) **ASSIGNMENT MEANS OWNERSHIP** → step 5 rewritten and its predecessor struck **the same day it was written**: interview, sticky-note comments, task updates, push don't park. Plus the ownership-is-not-autonomy guardrail bounding it. The durable cross-domain half of (b) — teammate behaviour on every task, not just tagged ones — was queued to `open-memory-requests.md` for Maggie rather than duplicated here.
- **v3 (2026-09-20)** — Normalized to `_HOOK-TEMPLATE.md` on Michael's *"yes normalize the hook if need be."* v1 and v2 were both authored off-template and, more importantly, **had no invocation at all** — the hook could only fire as a side effect of somebody else's load contract, which is precisely how it went unrun and stayed unrun silently. A hook with no front door cannot be called on purpose, so it cannot be tested on purpose either. Added `/agent-task-scan` + `/agent-scan` on the `doc-rot-sweep` precedent (filename slug + short alias), the Coordinates table (field id, Index list, caller), and Composes with. **Zero rulings changed; every strikethrough preserved.**
- **v2 (2026-09-20)** — Michael: *"it should be part of your AGENT load to look."* It already was: step 5b has pointed here since it was written, and this file has existed since 09-17. It did not fire on the 09-20 Milo morning wakeup and nothing recorded that it hadn't. Two structural fixes, neither about discipline: the **mandatory stamp** (silent-on-empty struck) and the **hook-displacement clause**. The diagnosis that produced both: the miss was found only because Michael asked, the same way the 09-17 activity-log gap on this same fleet was found. **A step with no artifact is a step with no evidence, and every such step in this repo has eventually gone unrun.** Also added step 3 (read comments + `created_at`), awareness-is-not-silence, and struck the hardcoded fleet count per D3.
- **v1 (2026-09-17)** — Established by Brain, born with the Agent Assignee field. Read-only boot scan, silent on empty.

⚠️ **v2, v3 and v4 were all written DIRECT TO MAIN** — no `create_branch` tool in
those sessions' kits, only `create_pull_request` / `merge_pull_request`. The
branch→PR→self-merge rule was not waived, just unexecutable. Declared here and
in every commit body rather than hidden.
