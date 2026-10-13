# Collaboration Mode

**Purpose:** Start, join, or resume a multi-model collaboration on a shared task where independent model sessions work together as repo agents through threaded comments.

**Steward:** Dev Dexter

**Mode:** On-demand routine

**Invocation:** `/collaboration-mode`, `/collaboration-mode start`, `/collaboration-mode join [task]`, `/collaboration-mode resume [task]`, "start a collaboration," "join the collaboration," "collaboration mode on [task]."

**Trigger:** User requests a multi-model collaboration, or is given a copyable invitation to join one.

**Dual placement (Michael ruling, 2026-10-13):** git is canonical; the ClickUp skill "Collaboration Mode" is a synced duplicate for reliable runtime loading. This is the first hook with a sanctioned CU skill copy. If this file and the skill disagree, this file wins.

**Established 2026-10-13** by Dev Dexter (Claude Opus 4.6).

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Git canonical** | `brain-config/hooks/collaboration-mode.md` |
| **CU skill (dupe)** | Collaboration Mode (Skills Hub) |
| **Session task** | Collaboration tasks live on the 🟢 Agent Activity Board (`901327879922`) |
| **Agent resolution** | 🤖 Agent Index (`901328043244`) |

---

## Core concept

One shared task. Multiple independent model sessions. Each participant loads a real repo-agent profile from the Agent Index and its git bundle. A conductor facilitates; other participants bring distinct expertise and challenge specific proposals. The user opens each model session manually. No automatic cross-model launch, no real-time polling, no background monitoring.

This is not single-Brain orchestration (one model seating internal personas; that is Mira's lane via `orchestration.md`). This is cross-session, cross-model collaboration where each participant is a separate Brain instance.

---

## Start path

When the trigger is to start a new collaboration:

1. **Locate or create the collaboration task.** If the user points at an existing task, use it. Otherwise create one on the Agent Activity Board. Title format: `[Subject] · collaboration · [date]`.

2. **Set up the task description.** Include: the objective, the conductor seat and who fills it, participant seats with their distinct assignments, what is settled, what remains open, and the collaboration guardrails.

3. **Resolve your own seat.** Look up the agent in the Agent Index (`901328043244`), load the full bundle from `mawizorek/ClickUp_apps` at `brain-config/super-agents/<slug>/`, and state your actual model plus repo-agent identity. Do not guess your model.

4. **Post the opening workshop comment.** One parent comment on the collaboration task containing: the framing, the test case or central question, what each seat should address, and the open question to the user. This is the anchor; all contributions thread beneath it.

5. **Generate the copyable invitation.** A self-contained block another model session can receive as its opening prompt. Include:
   - The collaboration task link
   - The assigned repo-agent seat (or "unassigned: ask the user")
   - A one-line objective
   - Instruction to: load this skill or hook, resolve the seat through the Agent Index, load the full bundle, read the task description and full comment thread, state actual model + seat, and make a substantive first contribution as a threaded reply
   - Explicit: "Do not create a duplicate task. Do not guess your model. Do not impersonate another participant."

6. **Post the invitation as a threaded reply** under the opening comment, clearly labeled as the startup handoff for incoming models.

---

## Join path

When joining an existing collaboration (given a task link or a copyable invitation):

1. **Read the collaboration task** description and full comment thread. Refresh before acting.

2. **Resolve your assigned seat.** Look up the agent in the Agent Index. Load the full bundle from the repo. If the seat is unassigned, ask the user which seat to use rather than self-assigning.

3. **State identity.** Lead your contribution with: actual model, repo-agent seat, where the bundle was loaded from. Do not guess your model or claim to be a model you are not.

4. **Make a substantive first contribution** as a threaded reply under the opening workshop comment. Address a specific live claim with: evidence, a counterexample, a revision, or a load-bearing question. An arrival announcement alone is not the work. An endorsement without new evidence is not a contribution.

5. **If the repo-agent bundle cannot be loaded** (access failure, missing files), report the specific gap. Do not improvise the identity or invent bundle contents.

---

## Resume path

When resuming a paused collaboration:

1. **Refresh the full thread.** Read every comment and reply, not just the opening.

2. **Identify what changed** since your last contribution. Note new participants, new claims, decisions the user has made, and any shifts in the objective.

3. **Resolve your seat** (same as join). Re-read the bundle in case it has changed.

4. **Contribute** responding to the current state of discussion, not where you left off. Acknowledge anything that invalidates or supersedes your earlier positions.

---

## Thread rules

- One opening workshop comment (parent). All contributions are threaded replies beneath it.
- Each reply leads with model + seat identification (first contribution) or seat shorthand (subsequent).
- No standalone root comments from participants. No parallel threads splitting the discussion.
- Refresh the thread before contributing or synthesizing. A contribution based on a stale read should be flagged by whoever notices.

---

## Contribution standards

- Address a specific live claim. Quote or link it.
- Bring evidence, a counterexample, a revision, or a load-bearing question.
- Distinguish explicitly: proposed, accepted (by the user), rejected, and unverified.
- Manufactured consensus from a single model is forbidden. One model posting as multiple participants is forbidden.
- Silence is not approval. Do not synthesize agreement from the absence of objection.
- The user's corrections outrank prior assistant proposals.

---

## Concurrency (honest constraints)

No real-time cross-model messaging. Each session is independent. Mandatory thread refresh before every contribution or synthesis. If two contributions cross (neither saw the other), the later poster acknowledges the overlap and reconciles. Late joiners read the full thread and respond to the current state, not the opening handoff. A model change within an existing session requires re-stating the new model identity; the seat does not change. Resuming after a pause: use the resume path; do not assume the discussion is where you left it.

---

## Synthesis and close

Deliberation stays in comments. Never write agent remarks into a decision log, spec, or working doc directly. Only settled synthesis moves out to the appropriate surface, with source links, when the user approves. The conductor owns synthesis: connecting contributions, surfacing disagreement, proposing what's settled. The conductor does not silently do every participant's specialist work. Disagreement is preserved. Roads not taken are named.

Close: the user rules when the collaboration is complete. The conductor may propose completion by summarizing what's settled, what's still open, and what the deliverable is. The user confirms before anything is finalized.

---

## Guardrails

- This skill handles the collaboration workflow. It does not: build the subject being discussed, modify repo-agent definitions, update the Agent Index, create native agents, send outbound email, or write to external calendars.
- Each participant's normal guardrails (from their loaded profile and the shared base) remain in force.
- Activity logging follows `hooks/workspace-agent-deliberation.md`: working comment first, then activity pointer on the contributing agent's own row.

---

## Composes with

- `hooks/workspace-agent-deliberation.md` — logging and activity-pointer procedure for agent contributions.
- `orchestration.md` — Mira's orchestration contract. If Mira is the conductor, she brings her own operating contract. This hook provides the multi-model session structure; she provides the facilitation.
- `super-agents/_shared/super-agent-base.md` — persona load contract, which each participant follows to resolve their seat.
- `gates/session-transcript-gate.md` — thread mechanics (two-tier Post Protocol, badge table).
- `hooks/session-open.md` / `hooks/session-close.md` — if the collaboration runs as a formal session.

---

## Changelog

- **v1 (2026-10-13)** — Established by Dev Dexter (Opus 4.6). Three paths (start/join/resume), thread rules, identity verification, honest concurrency model, synthesis + close. Dual placement: git canonical + CU skill dupe per Michael's ruling. Session: MAW-2481.
