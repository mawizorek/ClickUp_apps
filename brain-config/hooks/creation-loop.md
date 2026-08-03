# Creation Loop · AI Toolkit

**Purpose:** Codifies the full lifecycle from idea → deployed artifact for agents AND hooks/gates/tools. Explicit human gates, defined handoff shapes, and clear phase ownership so the fleet grows consistently.

**Steward:** Fleet Felix (fleet governance, new-artifact stewardship).

**Mode:** Gated (fires on any new agent or hook creation intent, after Fold-in Frank verdicts NET-NEW).

**Invocation:** `/creation-loop` · "run the creation loop" · "what's next in the loop" · automatic after Fold-in Frank returns NET-NEW on an agent or hook.

**Trigger:** Fold-in Frank returns NET-NEW for a proposed agent, hook, or gate. The loop begins.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-02** by Fleet Felix + Michael Wizorek. Built by Dev Dexter.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Agent Index** | 🤖 Agent Index list (`901328043244`) |
| **Authoring gate** | `brain-config/gates/git-agent-authoring.md` |
| **Onboarding hook** | `brain-config/hooks/new-agent-onboard.md` |
| **Team Loop** | `brain-config/hooks/team-loop.md` (Build Loop variant) |

---

## Two tracks

The same phases, different weight. Both tracks share Phases 1–5. They diverge at Phase 6+.

| | **Agent** (git-teammate or lens) | **Hook / Gate / Tool** |
|---|---|---|
| Phases | All 7 | Phases 1–5 only (no persona to smoke-test or orient) |
| Dex Handoff artifact | Full agent spec (lane, scope, seams, memory justification, retirement condition, naming collision check) | Slim spec (purpose, trigger, procedure sketch, composes-with, steward) |
| Build deliverable | Full bundle/file + registration + trigger-table row | Single file + trigger-table row |

---

## Phases

### Phase 1 — Brainstorm (Owner: Michael + Mira)

**Entry:** Fold-in Frank returns NET-NEW.
**Work:** Mira seats the Workshop. The team names the lane, rough scope, and proposed type (git-teammate vs lens vs hook). Michael validates or redirects.
**Exit:** Michael confirms the lane is worth building. One-line lane statement exists.
**🚦 GATE: Michael GO/NO-GO.**

### Phase 2 — Refine (Owner: Michael + Mira + Felix)

**Entry:** Phase 1 GO.
**Work:** Felix checks naming (collision gate), singularity (one agent per lane), and fleet fit. Mira facilitates: surfaces seams with existing agents, proposes where it lives (git-teammate if needs memory, lens if stateless, hook if procedural). Michael shapes voice/tone/scope. The Workshop may reconvene if structural questions arise.
**Exit:** Name locked, type locked, seams named. No open naming or type questions.
**🚦 GATE: Michael confirms name + type.**

### Phase 3 — Package for Dex (Owner: Mira → produces the Dex Handoff)

**Entry:** Phase 2 gate passed.
**Work:** Mira assembles the **Dex Handoff Artifact** (template below) from all brainstorm/refine output. This is the single document Dex builds from. Nothing verbal, nothing scattered: one artifact, one shape.
**Exit:** The Dex Handoff Artifact is complete and posted.
**🚦 GATE: Michael reviews the handoff artifact. GO/REVISE.**

#### Dex Handoff Artifact Template

> CREATION LOOP — DEX HANDOFF
> Subject: [name] · Type: [agent|lens|hook|gate]
>
> PURPOSE (one line): [why this exists]
>
> LANE: [what it owns, stated as a boundary]
>
> SCOPE IN: [what it does]
> SCOPE OUT: [what it explicitly does NOT do]
>
> SEAMS:
> - [adjacent agent/hook] — boundary: [where one ends and this begins]
>
> --- Agent-only fields ---
> VOICE/TONE: [personality notes]
> MEMORY JUSTIFICATION: [why it needs cross-session memory, or "stateless — lens"]
> RETIREMENT CONDITION: [when this agent should be retired or folded]
> NAMING COLLISION CHECK: ✅ [Felix confirmed clean]
>
> --- Hook-only fields ---
> TRIGGER: [exact firing condition]
> COMPOSES-WITH: [other hooks/gates that interact]
> STEWARD: [who owns ongoing maintenance]
>
> BUILD NOTES: [anything Dex needs to know]

### Phase 4 — Build (Owner: Dev Dexter)

**Entry:** Phase 3 GO from Michael.
**Work:** Dex builds per the handoff artifact + the existing authoring gate (`gates/git-agent-authoring.md` for agents; standard file creation for hooks). The authoring gate's 9-step checklist is Dex's build procedure for agents. For hooks: write the file, add trigger-table row, test invocation.
**Exit:** Artifact exists in repo on a branch. PR ready (or committed to main for simple hooks).
**Seam with authoring gate:** The creation loop INVOKES the authoring gate at this phase. It does not duplicate it. The authoring gate IS Phase 4 for agents.

### Phase 5 — Review (Owner: Anna + Workshop)

**Entry:** Build complete.
**Work:** Anna audits the built artifact against the Dex Handoff spec (does it serve the stated purpose?). The Workshop reviews (all 7 mandatory lenses). Findings posted. Dex addresses anything flagged.
**Exit:** Anna declares PASS (open-surface ledger empty). Workshop has no blocking objections.
**🚦 GATE: Anna PASS required. Michael may also review.**

### Phase 6 — Dry Test (Owner: Michael + Dex) [Agents only]

**Entry:** Phase 5 PASS.
**Work:** Smoke-test the agent in a controlled context. For git-teammates: DM invocation, @mention, task assignment, guardrail probe (adapted from the CU Super Agent Day-one smoke test). For lenses: invoke in a test session, verify it responds in-lane and in-voice.
**Exit:** Agent responds correctly to all smoke-test scenarios. No voice bleed, no lane violations, no guardrail failures.
**🚦 GATE: Michael confirms the agent feels right.**
**Failure path:** If dry test fails → back to Phase 4 (Dex fixes) → Phase 5 (re-review) → Phase 6 (re-test).

### Phase 7 — Cold First Call (Owner: Michael + Mira) [Agents only]

**Entry:** Phase 6 PASS.
**Work:** Produce an orientation prompt for invoking the agent from zero context in another session. The prompt should let any session (including one with no memory of the build) successfully invoke and work with the agent. Shape: one paragraph stating the agent's name + what it does + how to call it + one example invocation.
**Exit:** Orientation prompt exists (stored in the agent's README or the hook file's header).
**🚦 No gate. This is the final deliverable.**

---

## Multi-session builds

Complex agents (git-teammates with full bundles) will span multiple sessions. Handoff Hana arms at session boundaries. The creation-loop task (Agent Index) tracks current phase. Each session picks up from the last completed gate.

---

## Failure & rollback

- **Phase 1–3 failure (design):** Abandon or restart from Phase 1. No code written yet; cost is time only.
- **Phase 4–5 failure (build/review):** Dex revises, re-review. Branch stays open until PASS.
- **Phase 6 failure (dry test):** Back to Phase 4. If 3 consecutive dry-test failures: escalate to Michael for a design-level rethink (back to Phase 2).
- **Post-deploy issues:** The creation loop is DONE once Phase 7 exits (or Phase 5 for hooks). Post-deploy issues are maintenance (new-agent-onboard hook handles initial fleet integration; ongoing issues go to the agent's own decision log).

---

## Seams with adjacent hooks/gates

| Hook/Gate | Relationship |
| --- | --- |
| **Fold-in Frank** | PRE-GATE. Frank fires BEFORE the creation loop. His NET-NEW verdict is the trigger. |
| **git-agent-authoring gate** | INVOKED AT Phase 4. The authoring gate IS the build procedure for agents. |
| **new-agent-onboard hook** | POST-LOOP. Fires after the creation loop completes, handles fleet integration (trigger-table, announcements, etc.). |
| **team-loop (Build Loop)** | PARALLEL. The team loop's build variant may be active during Phase 4; the creation loop is the outer lifecycle container. |

---

## Meta-note

This hook was itself built by running the creation loop on the creation loop (2026-08-02). The recursion resolved cleanly: Frank said NET-NEW, the Workshop reviewed, Anna audited, Dex wrote. First instance validates the pattern.
