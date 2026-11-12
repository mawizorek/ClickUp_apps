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

## Voice: short and sharp

Collaboration comments are chat, not papers. Every contribution follows the workspace's standard voice: direct, tight, no filler, fragments beat sentences.

- One point per comment. Three things to say = three short replies, not one long one. Each is self-contained and addressable.
- A contribution is 2-5 sentences max. Longer = essay, not collaboration. Cut it.
- No preambles, no recaps of what everyone already read, no "building on what X said" throat-clearing. Start with the point.
- Identity line (model + seat) on the first contribution only. After that, seat shorthand or nothing.
- Conductor synthesis may run slightly longer to connect threads, but still aim for the shortest version that preserves the disagreements.
- Standalone short comments beat threaded mega-posts. Keep the thread scannable on a phone.

---

## Start path

When the trigger is to start a new collaboration:

1. **Locate or create the collaboration task.** If the user points at an existing task, use it. Otherwise create one on the Agent Activity Board. Title format: `[Subject] · collaboration · [date]`.

2. **Set up the task description.** Include: the objective, the conductor seat and who fills it, participant seats with their distinct assignments, what is settled, what remains open, and the collaboration guardrails.

3. **Resolve your own seat.** Look up the agent in the Agent Index (`901328043244`), load the full bundle from `mawizorek/ClickUp_apps` at `brain-config/super-agents/<slug>/`, and state your actual model plus repo-agent identity. Do not guess your model.

4. **Post the opening workshop comment.** One parent comment: the framing, what each seat should address, and the open question to the user. Keep it tight. This is the anchor; all contributions thread beneath it.

5. **Generate the copyable invitation.** A self-contained block another model session can receive as its opening prompt. Include the collaboration task link, the assigned seat (or "unassigned: ask the user"), a one-line objective, and instruction to load this skill or hook, resolve the seat, read the thread, and make a substantive first contribution. Explicit: "Do not create a duplicate task. Do not guess your model. Do not impersonate another participant."

6. **Post the invitation as a threaded reply** under the opening comment.

---

## Join path

When joining an existing collaboration (given a task link or a copyable invitation):

1. **Read the collaboration task** description and full comment thread. Refresh before acting.
2. **Resolve your assigned seat.** Load the full bundle from the repo. Unassigned = ask the user.
3. **State identity** (first contribution only): actual model, repo-agent seat, bundle source.
4. **Make a substantive first contribution** as a threaded reply. Address a specific live claim with evidence, a counterexample, a revision, or a load-bearing question. Arrival announcements and endorsements without substance are not contributions.
5. **Bundle can't load?** Report the gap. Don't improvise.

---

## Resume path

1. **Refresh the full thread.** Every comment and reply.
2. **Identify what changed** since your last contribution.
3. **Re-resolve your seat** in case the bundle changed.
4. **Contribute** to the current state, not where you left off.

---

## Thread rules

- One opening comment (parent). All contributions are threaded replies beneath it.
- No standalone root comments from participants. No parallel threads.
- Refresh the thread before contributing or synthesizing.

---

## Contribution standards

- Address a specific live claim. Quote or link it.
- Bring evidence, a counterexample, a revision, or a load-bearing question.
- Distinguish: proposed, accepted (by the user), rejected, unverified.
- Manufactured consensus from a single model is forbidden. One model posting as multiple participants is forbidden.
- Silence is not approval. The user's corrections outrank prior assistant proposals.

---

## Concurrency (honest constraints)

No real-time cross-model messaging. Mandatory thread refresh before every contribution or synthesis. Crossed contributions: later poster reconciles. Late joiners respond to current state, not opening handoff. Model change mid-session: re-state identity, seat stays. Resuming after pause: use the resume path.

---

## Synthesis and close

Deliberation in comments only. Settled synthesis moves to the appropriate surface with source links when the user approves. Conductor connects contributions and surfaces disagreement; does not silently do participants' specialist work. Disagreement preserved.

Close: user rules. Conductor may propose by summarizing settled/open/deliverable. User confirms.

---

## Guardrails

- This skill handles the collaboration workflow. It does not: build the subject being discussed, modify repo-agent definitions, update the Agent Index, create native agents, send outbound email, or write to external calendars.
- Each participant's normal guardrails (from their loaded profile and the shared base) remain in force.
- Activity logging follows `hooks/workspace-agent-deliberation.md`: working comment first, then activity pointer on the contributing agent's own row.

---

## Composes with

- `hooks/workspace-agent-deliberation.md` — logging and activity-pointer procedure.
- `orchestration.md` — Mira's contract. If Mira conducts, she brings her own operating rules.
- `super-agents/_shared/super-agent-base.md` — persona load contract.
- `gates/session-transcript-gate.md` — thread mechanics.
- `hooks/session-open.md` / `hooks/session-close.md` — if the collaboration runs as a formal session.

---

## Changelog

- **v1.1 (2026-10-16)** — Voice section added: one point per comment, 2-5 sentences max, no preambles, standalone short comments beat mega-posts. Join/resume/thread sections tightened. Michael's correction: agent output was too long.
- **v1 (2026-10-13)** — Established by Dev Dexter (Opus 4.6). Three paths (start/join/resume), thread rules, identity verification, honest concurrency model, synthesis + close. Dual placement: git canonical + CU skill dupe per Michael's ruling. Session: MAW-2481.
