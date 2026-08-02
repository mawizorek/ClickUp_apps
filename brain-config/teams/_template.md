# {TEAM NAME} — Team Roster

<!-- TEMPLATE v1 — canonical structure for all team rosters in brain-config/teams/.
     Authoring gate: new team files MUST match this skeleton.
     Auditors (Anna, Dexter): validate against these required sections. -->

**What this is:** {one paragraph — the team's identity and posture in plain language.}

**Lead:** {Agent Name} ({why they lead, in a fragment}).

**One-line job:** "{the question this team answers or the output it produces.}"

---

## Roster

| Role | Agent | Profile | Why |
|---|---|---|---|
| Lead / {specialty} | {Agent Name} | `{path to agent bundle or lens}` | {one sentence: what they do on this team} |
| {Role} | {Agent Name} | `{path}` | {why} |
| {Role} | {Agent Name} | `{path}` | {why} |

<!-- SIZING NOTE: state the team size and WHY it's that size.
     If a rotating/variable seat exists, document it in a dedicated section below. -->

**{N} is deliberate.** {Rationale for team size — reference the decision that locked it if one exists.}

---

## Special seats (optional — delete if not applicable)

<!-- Use this section for rotating, conditional, or context-dependent membership.
     Document the assignment logic so Mira (or any router) can resolve at invocation time. -->

{Who assigns the seat, what determines the pick, and how many variable seats exist (cap it).}

---

## Membership overlap

<!-- Required even if no overlap exists (state "None" explicitly).
     For each overlapping agent: which teams, and what changes about their behavior on THIS team vs the other. -->

{Agent} sits on {Team A} and {Team B}. The rule: {how the hat changes between teams}.

---

## When this team is assigned

<!-- Exhaustive list of invocation contexts. Three categories: -->

- **Build/Review Loop phase:** {which phase(s) this team defaults into}
- **Direct invocation tokens:** {slash commands or natural-language triggers}
- **Escalation/handoff:** {when another team's output routes here}

---

## Verdict logic

<!-- How the team exits. Two shapes: -->
<!-- BINARY (audit-style): each voice PASS/FAIL, any FAIL = overall FAIL. -->
<!-- DELIVERABLE (drafting-style): the team produces an artifact + confidence notes + gaps. -->

{Describe the exit shape. Be explicit about what constitutes "done" vs "retry" vs "escalate."}

---

## Changelog

- {YYYY-MM-DD} — created. {Origin: which session/decision/PR birthed this team.}
