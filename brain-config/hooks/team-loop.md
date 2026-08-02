# Team Loop — Sequential Team Pipeline

> **What this is:** a reusable orchestration pattern where work passes through a SEQUENCE of named teams, each with a defined role, exit condition, and handoff shape. Mira routes it. The teams are pluggable — the loop defines the MECHANISM, team roster files define WHO.
>
> **Distinct from:** a single-team convening (Workshop fires once), a seating sequence (agent-to-agent handoff), or the Council (Mira's standing advisory poll). A team loop is team-to-team, sequential, multi-pass.

---

## Invocation & Trigger

**Tokens:** `/team-loop`, `/build-loop`, `/review-loop`, "loop it with the team", "run it through the teams", "pass it through prebuild/build/post-build"

**Trigger:** any request that names a multi-team pipeline OR explicitly asks for sequential team passes on an artifact. Mira picks the loop variant based on the request shape.

**Who fires it:** Maestro Mira. She owns the routing decision (which variant, which teams, which order). The procedure itself is ownerless like any hook — Mira executes it.

---

## Core concept: a loop is teams in sequence, not agents in parallel

A team loop is NOT "seat everyone and synthesize." It is:

1. Hand the artifact to Team A.
2. Team A does its job. Exit condition met → handoff artifact produced.
3. Hand the artifact (now enriched/modified) to Team B.
4. Repeat until the final team exits.

Each phase is a FULL team convening (Mira seats the whole roster for that team, runs the room, synthesizes). The output of one phase becomes the input of the next.

---

## Two variants

### Variant 1: The Build Loop (sequential phases)

Three phases. Each gets a named team. Work flows forward only.

| Phase | Role | Default Team | Exit Condition |
|---|---|---|---|
| **Prebuild** | Spec, stress-test, feasibility, scope. "Should this exist and is it shaped right?" | The Workshop (7 mandatory + 2 supplemental) | GO / ADJUST / HALT verdict. On HALT: loop stops, findings return to Michael. On ADJUST: fixes applied, re-run prebuild once. On GO: advance. |
| **Build** | Construct the artifact. The actual making. | Dev Dexter (lead) + domain agents Mira routes based on artifact type | Artifact exists and meets the spec produced by Prebuild. Dexter declares BUILT. |
| **Post-build** | Audit the built thing for correctness, compliance, integrity. "Is this right, safe, honest?" | Audit Team (Anna, Renata, Beckett) | PASS / FAIL. On FAIL: findings return to Build phase (one retry). On PASS: done. |

**Mira's routing call at invocation:** she picks which teams fill each phase slot based on the artifact type. The defaults above are the STANDARD build loop; she can substitute (e.g., Department Heads at post-build for a production document, Research Team at prebuild for an investigation-heavy spec).

**The build loop is the default when Michael says "build this" on anything non-trivial.** Trivial = a one-file edit, a field change, a quick fix. Non-trivial = a new procedure, a new agent, a new app, a structural change.

---

### Variant 2: The Review Loop (concentric rings)

Three rings. Each EXPANDS the audience. Work stays the same artifact; the teams WIDEN.

| Ring | Role | Team Selection | Exit Condition |
|---|---|---|---|
| **Ring 1 (surgical)** | 2–4 heads whose domain directly owns the artifact. | Mira picks from the full roster based on artifact's subject tags and declared ownership. | Findings stabilize (no new material surfaces in a second pass) OR a hard disagreement is logged that needs Ring 2's perspective. |
| **Ring 2 (adjacent)** | Expand to heads whose work BORDERS Ring 1's output. The seam-finders. | Mira picks the bordering agents. Ring 1 voices STAY seated. | Same: findings stabilize OR a pattern-level finding surfaces that needs the full company. |
| **Ring 3 (full company)** | All seated heads. Final pass catches pattern-level findings nobody in Rings 1–2 could see alone. | A named team (e.g., Department Heads for production docs, the full Workshop for repo specs). | Terminal. Findings report to Michael. |

**The review loop is the default when Michael says "loop it" / "audit this" / "review this with the team."** Mira picks Ring 1 based on artifact ownership, then expands only if exit conditions push outward.

---

## Team assignment rules

1. **Teams are named rosters** living in `brain-config/teams/<team-slug>.md`. Each file defines: membership, lead (if any), and the team's one-line job.
2. **Membership is many-to-many.** An agent can sit on multiple teams. When seated on a specific team, they act AS that team's mandate (Finn on the Workshop = feasibility lens; Finn on a Build team = implementation lead).
3. **Mira picks the team for each phase at invocation time.** She names her picks in the Opening Post: "Build Loop: Prebuild → Workshop, Build → Dexter + Milo + Fiona, Post-build → Audit Team."
4. **The loop definition is the MECHANISM; the team files are the ROSTERS.** Changing who's on a team = edit the roster file. Changing how the loop works = edit this file.
5. **One lead per phase.** The team's declared lead (if any) runs that phase's synthesis. If no declared lead, Mira synthesizes directly.

---

## Handoff shape between phases

Each phase produces a **Phase Handoff** (posted as a comment on the session task):

```
## Phase Handoff: [Phase Name] → [Next Phase Name]

**Verdict:** [GO / BUILT / PASS / ADJUST / HALT / FAIL]
**Team:** [who was seated]
**Key findings:** [2–5 bullet synthesis]
**Open questions for next phase:** [if any]
**Artifact state:** [link or description of what's being handed forward]
```

The next team reads this handoff BEFORE starting their phase. It is the input contract.

---

## Bounded iteration (HARD)

- **Build Loop:** Prebuild may loop ONCE on ADJUST (fix + re-run). Post-build may bounce to Build ONCE on FAIL. After that: hard stop, findings to Michael.
- **Review Loop:** Ring 1 may do a second pass if findings are still unstable. Rings 2 and 3 are single-pass. Total maximum: 5 passes across all rings.
- **Never infinite.** A loop that can't exit is broken. Mira calls it.

---

## Relationship to existing patterns

- **The Workshop** is a TEAM that can be assigned to a phase (typically Prebuild). Its internal verdict logic (GO/ADJUST/HALT) maps directly to a phase exit condition.
- **Seating Sequences** (orchestration.md) are agent-to-agent handoffs; a team loop is team-to-team. They can nest: within a Build phase, Dexter might run a seating sequence with Fiona.
- **The Council** is Mira's full advisory roster; teams are subsets she assigns to pipeline phases.
- **Fold-in Frank** still fires at brainstorm-open BEFORE a build loop starts. He verdicts FOLD-IN / NET-NEW / MERGE on the concept; the build loop starts AFTER his verdict.

---

## Standing teams (roster files in `brain-config/teams/`)

| Team | File | One-line job |
|---|---|---|
| The Workshop | `teams/the-workshop.md` | Pre-commit stress-test (spec/structural) |
| Audit Team | `teams/audit-team.md` | Correctness, compliance, integrity |
| Department Heads | `teams/department-heads.md` | Domain expertise, production review |
| Research Team | `teams/research-team.md` | Sourced investigation, multi-source lookup |
| Drafting Team | `teams/drafting-team.md` | Composition, first-draft creation |

---

## Changelog

- 2026-08-01 — created. Born from the Fleet Felix session (PR #688 wave 3 gate pass) where Michael watched 11 department heads run a concentric review and said: make this a procedure, define the teams, let Mira route by judgement. Workshop weighed in on team composition (Rhys wanted a defender on Audit, Beckett killed it; Cleo shaped Research; Skye shaped Drafting; Finn flagged the overlap rule). Michael's refinement: a BUILD LOOP with 3 sequential phases (prebuild → build → post-build), not just a review loop.
