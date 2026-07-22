# Maestro Mira — git-teammate Verify DoD · 2026-07-21

**Track:** git-teammate · **Vehicle:** self/cold (conversion session) · **DoD:** `super-agents/audit-instruction.md` → git-teammate track (v0.1)

Git-teammates have no live config to diff, so the bar is **INTERNAL CONSISTENCY**: will a cold `/session.agent=Mira` load a coherent, non-contradictory agent?

| Check | Result | Notes |
|---|---|---|
| Base pointer present (line 1 → super-agent-base.md) | **PASS** | preferences.md opens with the shared-base pointer. |
| Load manifest valid + resolvable | **PASS** | 8-step manifest; every referenced file (base, council.md, the-workshop.md, superagents.json, registry.json, session-board.md) exists. |
| superagents.json row accurate | **PASS** | slug/display/track(git-teammate)/status(active)/invocation/lane/declaration_folder all match this bundle. |
| registry.json row accurate | **PASS** | type git-teammate, profile repointed to super-agents/maestro-mira/preferences.md, role reflects conductor lane; seat:lead + teams:[council] preserved. |
| Bundle files present + in-format | **PASS** | preferences / memory / activity-log / decision-log / README + this audit record; all in the fleet convention. |
| No cross-file contradiction | **PASS** | profile ↔ memory ↔ decision-log agree on: git-teammate-only surface, conductor role stays a house mechanism, new-tool takeover = fold-in (not net-new gate), default front door. |
| Procedure-is-a-tool (Constitution §2–§3) | **PASS** | no how-to stored; roster scan / seating map / Workshop convening / two-tier protocol / expression law / Frank verdict all POINTERS. |
| Pointer integrity (Anna's lesson) | **PASS** | council.md, teams/the-workshop.md, gates/session-transcript-gate.md, agents/foldin-frank.md all verified to resolve to real content this session. |
| Name-collision (name + nicknames) | **PASS** | Mira / Maestro / Lead unique across superagents.json + registry.json + agents/ sidecars. |
| Lane singularity vs neighbors | **PASS** | conductor/front-door lane distinct from Frank (sprawl gate), Felix (steward), Anna (audit lead), Wes (momentum), Corey (URITP structure). |

**Reviewed via the Audit Anna ↔ Workshop loop (2 rounds), 2026-07-21.** Open surfaces OS-1 (charter home = council.md, dead pointer repointed), OS-3 (four bundle files present + in-format), OS-4 (mirror-pair triple-write) all CLOSED at landing; OS-2 (fold charter step-14 seating-balance into council.md) carried as a post-merge follow-up (secondary behavior, currently only in git history).

**Open (PARTIAL, tracked — not a GAP in the bundle):** OS-2 above (step-14 fold-in to council.md). Does not affect internal consistency of the git bundle. The prior build's ClickUp-side AI Toolkit index edits already landed (they were the surface that revealed the un-merged-PR drift).

**Verdict: PASS.** A cold `/session.agent=Mira` loads a coherent, non-contradictory Council Conductor.
