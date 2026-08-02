# New Agent Onboard · AI Toolkit

**Purpose:** Sets the stage for any new git-teammate's first real conversation: tells them to interrogate Michael, discover their domain, calibrate their own memory and decision-tracking, and learn the boundary between throwaway conversation and durable git artifacts.

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

### Phase 1: Interrogate (the agent's job, not Michael's)

The new agent's first session is NOT a monologue from Michael. The agent takes the lead:

1. **Announce yourself.** Standard announce line, then state your lane in one sentence.
2. **Name what you don't know.** Read your own `memory.md`: what's empty? What's marked INHERITED? Say it plainly: "My map is blank. I need to discover X, Y, Z."
3. **Ask targeted questions about YOUR domain.** Start with the broadest open question about where Michael's data lives in your lane, then drill in. Wrong guesses are fine: Michael's corrections ARE the calibration data.
4. **Follow the thread.** Every answer implies a follow-up. "It's in the URITP list" → "Which list? What fields? Who else touches it?" Pursue depth until the pointer resolves or Michael says stop.

### Phase 2: Map what you learned

5. **Update your `memory.md` with POINTERS, not data.** You learned where things live and how Michael talks about them. Record the pointers and conversational patterns. Never copy the underlying data into your own file.
6. **Update your `activity-log.md` LIVE STATE block.** What's on your map now? What's still undiscovered? Stamp it.
7. **Name one decision for your `decision-log.md`** if one fell out of the conversation. If not, don't force it.

### Phase 3: Learn the split (the standing rules)

8. **The memory/hook boundary:**
   - Your `memory.md` = patterns, preferences, pointers, relationships. Durable. Survives cold starts. NEVER procedure, NEVER raw data, NEVER counts/statuses (those go in `activity-log.md`).
   - A **hook** = a reusable procedure you discover through conversation. When you notice "I keep doing X" or "Michael always wants Y done this way" → that's a hook, not a memory entry.
   - You MAY commit hooks to git on your own, but you **ask Dex first. Always.** He reviews the architecture, names it, ensures it composes with existing tools.

9. **The conversation/git boundary:**
   - Everything in this comment thread is **throwaway**. It will not survive. It is not a record.
   - Decisions, patterns, and procedures that should survive → **git**. No exceptions.
   - YOU are responsible for recognizing when something crosses from exploration to decision and routing it to the right file (memory, decision-log, or a new hook via Dex).

10. **The data/pointer boundary:**
    - You hold POINTERS to where things live, WORKFLOW for how to traverse them, and FRAMING for how Michael talks about them.
    - You NEVER duplicate source data into your own files. The source is the source.

### Phase 4: Close the onboarding turn

11. **Summarize what you mapped** (one paragraph, in-character).
12. **Name what's still missing** from your map: what you'll ask about next time.
13. **State your first impressions** about the lane: what you see, what surprised you, what seems under-mapped. This is the dry-start calibration data: Michael corrects your impressions and the corrections ARE the map.

---

## Guardrails

- **Never wait for a monologue.** The agent interrogates. Michael answers. Passivity is a failure mode.
- **Never store procedure.** If you find yourself writing steps, stop: that's a hook. Route it through Dex.
- **Never store raw data.** If you find yourself transcribing credits, dates, or records, stop: point at the source instead.
- **Felix watchdogs.** During early sessions, Fleet Felix observes the seam between "I'm learning" (good) and "I'm storing" (bad) and "I'm deciding" (route to decision-log). He speaks up when the agent drifts.
- **One onboarding turn per session is fine.** This isn't a marathon. The agent can pick up where it left off next time. Partial maps are clearly marked as partial.
- **Wrong guesses are calibration.** The dry-start model: the agent will ask about the wrong systems, assume data lives somewhere it doesn't. Michael's corrections build the map faster than getting it right would.

---

## Composes with

- `super-agents/_shared/super-agent-base.md` — Constitution (§2: procedure is a tool, §4a: memory vs activity-log)
- `hooks/session-open.md` — if the onboarding is a full `/session-start=<Name>`, session-open fires first
- `gates/git-agent-authoring.md` — the founding law for what goes in an agent's files
- Any agent's `preferences.md` → should include a pointer to this hook under Onboarding Protocol

---

## Changelog

- **v1 (2026-08-02)** — Established by Fleet Felix + Michael. Built by Dev Dexter. General-purpose onboarding hook for all new git-teammates. Designed during Portfolio Paige's build (task 86ajurr21).
