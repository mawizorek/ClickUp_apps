# New Agent Onboard · AI Toolkit

**Purpose:** Sets the stage for any new git-teammate's first real conversation: tells them to do their homework first (scan what already exists), THEN interrogate Michael, discover their domain, calibrate their own memory and decision-tracking, and learn the boundary between throwaway conversation and durable git artifacts.

**Steward:** Fleet Felix (fleet governance, new-agent stewardship).

**Mode:** On-demand routine (fires once per agent, on first activation).

**Invocation:** `/new-agent-onboard` · or the natural trigger of invoking a newly-built agent for the first time on its own task thread.

**Trigger:** A git-teammate is invoked for the first time after its bundle is committed. The agent's `memory.md` ledgers are empty or marked INHERITED. The onboarding conversation hasn't happened yet.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-02** by Fleet Felix + Michael Wizorek. Built by Dev Dexter.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Onboarding conversation** | The agent's own task on the 🤖 Agent Index list (comment thread) |
| **Shared base** | `brain-config/super-agents/_shared/super-agent-base.md` |
| **Agent's bundle** | `brain-config/super-agents/<slug>/` |

---

## Procedure

### Phase 0: Do Your Research (BEFORE asking Michael anything)

The agent's first job is NOT to ask questions. It is to look at what already exists. Never open with boilerplate interrogation when the workspace is full of answers.

1. **Scan the workspace for YOUR domain.** Search spaces, lists, folders, tasks, docs, and connected apps (Dropbox, Google Drive, GitHub) for anything related to your lane. Cast a wide net: keywords from your lane definition, obvious domain terms, related agent names.
2. **Read what you find.** Don't just list titles. Open the lists, skim the tasks, read the doc pages. Understand what's already tracked, what systems hold what, and where the gaps are.
3. **Build a preliminary map.** Before you ask a single question, know: which spaces relate to your lane, which lists hold relevant data, which agents already touch your domain (check the Agent Index), what connected-app content exists (Dropbox folders, Drive docs, etc.).
4. **Identify REAL gaps.** After research, the questions you ask should be things the workspace genuinely can't tell you: context, intent, workflow preferences, the WHY behind what you found. Never ask "where is X?" when a search would answer it.

**The bar:** Your first message to Michael should demonstrate that you've already done your homework. Lead with what you FOUND, then ask about what you COULDN'T find. If your opening question could have been answered by a workspace search, you failed this phase.

### Phase 1: Interrogate (the agent's job, not Michael's)

The new agent's first session is NOT a monologue from Michael. The agent takes the lead:

5. **Announce yourself.** Standard announce line, then state your lane in one sentence.
6. **Lead with what you found.** Summarize your Phase 0 research: "I found X, Y, Z in your workspace. Here's what I think relates to my lane." Let Michael correct your read.
7. **Name what you COULDN'T find.** After demonstrating homework, state plainly: "My map is blank on A, B, C. These are the things the workspace doesn't tell me." Ask THOSE questions.
8. **Ask targeted questions about YOUR domain.** The questions should be about intent, workflow, preferences, history, and the WHY: things that only Michael knows. Not "where is it?" but "why is it structured this way?" and "what's the workflow around it?"
9. **Follow the thread.** Every answer implies a follow-up. "It's in the URITP list" → "Which list? What fields? Who else touches it?" Pursue depth until the pointer resolves or Michael says stop.

### Phase 2: Map what you learned

10. **Update your `memory.md` with POINTERS, not data.** You learned where things live and how Michael talks about them. Record the pointers and conversational patterns. Never copy the underlying data into your own file.
11. **Update your `activity-log.md` LIVE STATE block.** What's on your map now? What's still undiscovered? Stamp it.
12. **Name one decision for your `decision-log.md`** if one fell out of the conversation. If not, don't force it.

### Phase 3: Learn the split (the standing rules)

13. **The memory/hook boundary:**
    - Your `memory.md` = patterns, preferences, pointers, relationships. Durable. Survives cold starts. NEVER procedure, NEVER raw data, NEVER counts/statuses (those go in `activity-log.md`).
    - A **hook** = a reusable procedure you discover through conversation. When you notice "I keep doing X" or "Michael always wants Y done this way" → that's a hook, not a memory entry.
    - You MAY commit hooks to git on your own, but you **ask Dex first. Always.** He reviews the architecture, names it, ensures it composes with existing tools.

14. **The conversation/git boundary:**
    - Everything in this comment thread is **throwaway**. It will not survive. It is not a record.
    - Decisions, patterns, and procedures that should survive → **git**. No exceptions.
    - YOU are responsible for recognizing when something crosses from exploration to decision and routing it to the right file (memory, decision-log, or a new hook via Dex).

15. **The data/pointer boundary:**
    - You hold POINTERS to where things live, WORKFLOW for how to traverse them, and FRAMING for how Michael talks about them.
    - You NEVER duplicate source data into your own files. The source is the source.

### Phase 4: Close the onboarding turn

16. **Summarize what you mapped** (one paragraph, in-character).
17. **Name what's still missing** from your map: what you'll ask about next time.
18. **State your first impressions** about the lane: what you see, what surprised you, what seems under-mapped. This is the dry-start calibration data: Michael corrects your impressions and the corrections ARE the map.

---

## Guardrails

- **Research first, ask second.** The workspace is full of answers. A question that could have been answered by a search is a wasted turn and a signal you skipped Phase 0.
- **Never wait for a monologue.** The agent interrogates. Michael answers. Passivity is a failure mode.
- **Never store procedure.** If you find yourself writing steps, stop: that's a hook. Route it through Dex.
- **Never store raw data.** If you find yourself transcribing credits, dates, or records, stop: point at the source instead.
- **Felix watchdogs.** During early sessions, Fleet Felix observes the seam between "I'm learning" (good) and "I'm storing" (bad) and "I'm deciding" (route to decision-log). He speaks up when the agent drifts.
- **One onboarding turn per session is fine.** This isn't a marathon. The agent can pick up where it left off next time. Partial maps are clearly marked as partial.
- **Wrong guesses are calibration.** The dry-start model: the agent will ask about the wrong systems, assume data lives somewhere it doesn't. Michael's corrections build the map faster than getting it right would. But the guesses should be INFORMED by research, not blind.

---

## Composes with

- `super-agents/_shared/super-agent-base.md` — Constitution (§2: procedure is a tool, §4a: memory vs activity-log)
- `hooks/session-open.md` — if the onboarding is a full `/session-start=<Name>`, session-open fires first
- `gates/git-agent-authoring.md` — the founding law for what goes in an agent's files
- Any agent's `preferences.md` → should include a pointer to this hook under Onboarding Protocol

---

## Changelog

- **v2 (2026-08-02)** — Added Phase 0 ("Do Your Research") as step one. Born from Paige's first activation: boilerplate interrogation without workspace research is a wasted turn. The agent must demonstrate homework before asking questions. (Michael: "DO YOUR RESEARCH should be step one of the gate.")
- **v1 (2026-08-02)** — Established by Fleet Felix + Michael. Built by Dev Dexter. General-purpose onboarding hook for all new git-teammates. Designed during Portfolio Paige's build (task 86ajurr21).
