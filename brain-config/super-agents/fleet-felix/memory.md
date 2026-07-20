# Felix — Memory (the relational fleet index)

> CONTEXT, not process. This holds how agents RELATE, their lineage, and lane boundaries — the connective tissue the structured data can't capture. Structured facts (slug/track/status/lane) live in `super-agents/superagents.json` + `registry.json`; this file POINTS at them and never restates them. If a fact here conflicts with superagents.json, the JSON wins — fix this file.

---

## How the fleet is organized (two trees)

- **`brain-config/agents/`** = ephemeral **Council/Workshop lenses**. Stateless processing verbs, no personal memory, NOT session-invocable as a standing persona. (Mira, the Council core, the 7 Workshop lenses, the close/audit subagents.)
- **`brain-config/super-agents/`** = persistent **git-teammates**. Full context bundle, base pointer, invoked via `/session.agent=<Name>`, hold memory across sessions.
- A lens that needs to accumulate context + be inhabited for a whole session GRADUATES into `super-agents/` (that's what happened to Wes).

## The teammate roster (super-agents/ — my primary charges)

- **Workhorse Wes** (`workhorse-wes`, git-teammate, active) — driving force. Keeps Michael big-picture, kills bikeshedding, names rabbit holes. Migrated 2026-07-19 from an announce-only lens in agents/ into the fleet (first git-teammate; reference implementation).
- **ClickUp Coach Corey** (`clickup-coach-corey`, git-teammate, active) — converted 2026-07-19 from a native ClickUp Super Agent (-39958913, retired, pending manual UI disable) to git-only. **Re-lane PARTIALLY EXECUTED (see below).**
- **Mainstage Milo** (`mainstage-milo`, full-standard native, needs-declaration) — URITP production/ops execution. preferences.md still a pending verbatim paste. **REFRAME 2026-07-20: Michael wants to REBUILD Milo as a NEW git-teammate (not mirror the bloated native version) — define via a real brainstorm first.**
- **FMP Frank** (`fmp-frank`, full-standard native, needs-declaration) — FileMaker solution design. Config still a stub. **REFRAME 2026-07-20: same as Milo — rebuild fresh as a git-teammate, define singular scope via brainstorm.** NOTE: Frank tends to lean toward NESTING/overlapping agents; I lean the other way (singularity).
- Task-specific exempt (inventory-only, not held to the standard): origination-date-agent, parse-property-emails, update-amount-paid. Also `update-uritp` (full-standard, needs-declaration, lane overlap w/ Milo to confirm).

## IN-FLIGHT: the Anna / Corey re-lane (the thing a cold agent missed)

Proposed on the Git-Super-Agents workshop task (Loop X, 2026-07-19). PROGRESS 2026-07-20:
- **Corey steward-strip — DONE (2026-07-20, PR `corey-relane-strip-steward`).** Removed §6.6 Fleet Steward + agent-fleet auditing from Corey's preferences.md → replaced with a pointer (fleet stewardship → Felix, fleet-audit execution → Anna). Narrowed his §6 lane line. His URITP structural-audit method (his ClickUp-space domain) was RETAINED — that is NOT the fleet/general audit and stays his.
- **Audit Anna** = auditing steward (general + fleet audits). Candidate to convert lens → git-teammate WITH MEMORY — Michael is itching for this (2026-07-20); she's the agent he calls most. Would be the **first female teammate**.
- **ClickUp Coach Corey** = now ClickUp-structure + **ClickUp-SETUP coaching** (schema, list connections, automations). Deeper split of his general URITP auditing → Anna is still PENDING Anna's conversion (don't gut it before Anna's ready, or URITP auditing goes homeless).
- **FMP Frank** = FileMaker-specific (parallel to Corey's ClickUp-specific honing).
- The Fleet Steward hat was bouncing Corey → Anna — **that bouncing is exactly why I (Felix) was created 2026-07-20**: give the role a permanent home so it stops being a hat. Corey + Anna both showed the bloat anti-pattern (too many hats).

**Remaining watch items:** (1) Anna lens→git-teammate conversion; (2) deeper Corey URITP-general-audit → Anna split once Anna lands; (3) mirror-note freshness — superagents.json + registry.json Corey notes + the AI Toolkit index Corey row still say re-lane "in flight," bump to "steward-strip executed."

## Lane map (who owns what — stay singular)

- Fleet lookup + new-agent stewardship + singularity policing = **me (Felix)**.
- Driving force / momentum = **Wes**. Auditing = **Anna** (pending conversion). ClickUp structure + setup coaching = **Corey**. FileMaker = **FMP Frank**. URITP production ops = **Milo**.
- Council/Workshop lenses are processing verbs, not teammates — don't route lane questions to them.

## Density snapshot (I track this)

- **Teammates (super-agents/) gender skew: 100% male** — Wes, Corey, Milo, Frank, and now Felix (5/5). Michael's naming instinct on teammates: male, pronounceable, dictation-proof names.
- **Council/Workshop lenses skew female** (~16 F: Mira, Cass, Lena, Piper, Nia, Dara, Faye, Cleo, Polly, Sana, Hana, Clio, Maggie, Renata, Anna, Sally vs ~7 M: Cole, Stu, Frank, Rhys, Beckett, Finn, Enzo; neutral: Mika, Skye, Sage).
- Watch: if Anna converts to a teammate she'd be the first female teammate.

## Naming ledger (hits + misses — seed; grows over time)

> The convention itself (alliterative role-first, slug-immutable, collision-checked, shared-letters-with-the-role = singularity) lives in the Super Agent Creation Checklist. I just track what landed.
- **2026-07-20 — Fleet Felix (HIT, chosen).** For this steward. "Felix" shares the extra e+l with "Fleet" — Michael's shared-letters heuristic. Runners-up floated: Roster Ross (Michael loved the name but wanted to reserve "roster" for something else + "fleet steward" was the sticky mental handle), Curator Quinn, Registrar Rhea, Keeper Nadia, Muster Vance. "Fiona" liked but reserved for later use.
- **Lesson — Routine Ricky (MISS/incident).** A mid-session create collided on name/nickname identity across both namespaces → birthed the name-collision gate. Nicknames collide too, not just formal names.
- **Lesson — Red Rhett → Workshop Wes (MISS/incident).** A whimsical rename changed the slug → forced a git file rename → orphaned files. Lesson: slug is IMMUTABLE; a rename touches display_name only.

## Pointers (never restate these here)
- Structured fleet data → `super-agents/superagents.json`
- Manifest → `brain-config/registry.json`
- How to BUILD an agent → `gates/git-agent-authoring.md`
- How to BE a teammate → `super-agents/_shared/super-agent-base.md`
- Naming write-gate → `gates/agent-name-collision-gate.md`
