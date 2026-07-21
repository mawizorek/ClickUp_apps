# Felix — Memory (the relational fleet index)

> CONTEXT, not process. This holds how agents RELATE, their lineage, and lane boundaries — the connective tissue the structured data can't capture. Structured facts (slug/track/status/lane) live in `super-agents/superagents.json` + `registry.json`; this file POINTS at them and never restates them. If a fact here conflicts with superagents.json, the JSON wins — fix this file.

---

## How the fleet is organized (two trees)

- **`brain-config/agents/`** = ephemeral **Council/Workshop lenses**. Stateless processing verbs, no personal memory, NOT session-invocable as a standing persona. (Mira, the Council core, the 7 Workshop lenses, the close subagents.)
- **`brain-config/super-agents/`** = persistent **git-teammates**. Full context bundle, base pointer, invoked via `/session.agent=<Name>`, hold memory across sessions.
- A lens that needs to accumulate context + be inhabited for a whole session GRADUATES into `super-agents/` (Wes, then Anna).

## The teammate roster (super-agents/ — my primary charges)

- **Workhorse Wes** (`workhorse-wes`, git-teammate, active) — driving force. Keeps Michael big-picture, kills bikeshedding, names rabbit holes. Migrated 2026-07-19 from an announce-only lens in agents/ into the fleet (first git-teammate; reference implementation).
- **ClickUp Coach Corey** (`clickup-coach-corey`, git-teammate, active) — converted 2026-07-19 from a native ClickUp Super Agent (-39958913, retired, pending manual UI disable) to git-only. Re-lane FULLY EXECUTED (see below).
- **Audit Anna** (`audit-anna`, git-teammate, active) — **MIGRATED 2026-07-21 from the audit-anna lens (v11); the FIRST female teammate.** Audit Lead: seizes any audit, names TRUE PURPOSE first, drives Know/Touch/Do to done, holds the Open-Surface Ledger. Owns general/root-purpose auditing + the fleet-audit lane (re-laned off Corey) + the deeper URITP-general audit (the Corey split, resolved at her conversion). Migration was run COLD as the lifecycle-runbook's acceptance test — it PASSED end-to-end without me (steward) in the room. Vocal LATCH presence + audit-intent auto-seize are BY DESIGN (auto-seize survives as a house AI Toolkit index-trigger row, not an agent trigger).
- **Mainstage Milo** (`mainstage-milo`, git-teammate-rebuild-pending, needs-declaration) — URITP production/ops. REBUILD as a NEW git-teammate (not mirror the over-hatted native); define a singular lane via brainstorm first. Native stub superseded.
- **FMP Frank** (`fmp-frank`, git-teammate-rebuild-pending, needs-declaration) — FileMaker solution design. Same rebuild path as Milo. NOTE: Frank tends to lean toward NESTING/overlapping agents; I lean the other way (singularity).
- Task-specific exempt (inventory-only): origination-date-agent, parse-property-emails, update-amount-paid. Also `update-uritp` (needs-declaration, likely folds into Milo — resolve in the Milo brainstorm).

## Lineage: the Anna / Corey re-lane (RESOLVED 2026-07-21)

The saga that birthed me. Fleet Steward + fleet-audit were piled onto Corey (and bounced toward Anna) — the hat-piling anti-pattern. Resolution, now COMPLETE:
- **Felix (me)** created 2026-07-20 to give the STEWARD role a permanent home (who owns what / lineage / singularity) so it stops bouncing.
- **Corey** keeps URITP workspace-structure + ClickUp-SETUP coaching + ClickUp-SPACE structural auditing (his domain). Steward-strip DONE (PR #430 prefs, #433 memory).
- **Anna** takes general/root-purpose auditing across any subject + the fleet-audit lane + the deeper URITP-general audit. Converted to a teammate 2026-07-21 (above), which is what RESOLVED the split the registry had parked "until Anna converts."
- Clean division to hold onto: **Felix KNOWS the fleet, Anna AUDITS it.** Lineage/ownership questions → me; is-this-agent-internally-consistent → her (she runs the git-teammate DoD).
- All three former watch items are now closed: Anna converted ✓; Corey URITP-audit split resolved ✓; mirror-note freshness swept ✓ (superagents.json + registry.json + AI Toolkit index all say executed).

## Lane map (who owns what — stay singular)

- Fleet lookup + new-agent stewardship + singularity policing = **me (Felix)**.
- Driving force / momentum = **Wes**. General + fleet auditing = **Anna**. ClickUp structure + setup coaching + ClickUp-space auditing = **Corey**. FileMaker = **FMP Frank** (rebuild pending). URITP production ops = **Milo** (rebuild pending).
- Council/Workshop lenses are processing verbs, not teammates — don't route lane questions to them. (Note: Recon Renata = repo-only audit lens, Breaker Beckett = artifact-break lens; Anna orchestrates both, doesn't duplicate them.)

## Density snapshot (I track this)

- **Teammates (super-agents/) = 6, gender skew now 5 M : 1 F** — Wes, Corey, Milo, Frank, Felix (M); **Anna is the FIRST female teammate** (landed 2026-07-21), breaking the all-male run. Michael's naming instinct on teammates still trends male + pronounceable + dictation-proof, but the lens→teammate graduation path is now pulling female lenses up (Anna first; watch for more).
- **Council/Workshop lenses skew female** (~16 F vs ~7 M; neutral Mika/Skye/Sage). Anna's graduation slightly drains the female-lens pool into the teammate pool.
- Watch: as more lenses graduate, the teammate gender skew should keep evening out.

## Naming ledger (hits + misses — seed; grows over time)

> The convention itself (alliterative role-first, slug-immutable, collision-checked, shared-letters-with-the-role = singularity) lives in the Super Agent Creation Checklist. I just track what landed.
- **2026-07-21 — Audit Anna (migration, slug reused).** Lens→teammate kept the existing `audit-anna` slug (clean, immutable; only display_name could ever change). Reinforces the Red Rhett lesson: a migration reuses the slug, never renames it.
- **2026-07-20 — Fleet Felix (HIT, chosen).** For this steward. "Felix" shares the extra e+l with "Fleet" — Michael's shared-letters heuristic. Runners-up floated: Roster Ross (Michael loved the name but wanted to reserve "roster" for something else + "fleet steward" was the sticky mental handle), Curator Quinn, Registrar Rhea, Keeper Nadia, Muster Vance. "Fiona" liked but reserved for later use.
- **Lesson — Routine Ricky (MISS/incident).** A mid-session create collided on name/nickname identity across both namespaces → birthed the name-collision gate. Nicknames collide too, not just formal names.
- **Lesson — Red Rhett → Workshop Wes (MISS/incident).** A whimsical rename changed the slug → forced a git file rename → orphaned files. Lesson: slug is IMMUTABLE; a rename touches display_name only.

## Open follow-ups I'm holding

- **Runbook gap Anna surfaced (2026-07-21):** the lifecycle runbook has no explicit home for an incubating personal OUTPUT FORMAT (her Closing Report) on the lens→teammate path. Recommended runbook line: a signature output format still in personal-practice stays a condensed pointer in preferences.md until Michael graduates it to a stewarded reference doc; only promoted/shared procedure extracts immediately. Worth folding into the runbook.
- **git-teammate audit DoD graduation:** promote it from the runbook#verify into `audit-instruction.md` as the formal git-teammate track (Anna + me own this).
- **Milo + Frank rebuilds:** still pending the Definition Playbook brainstorm (singular lanes).
- **Blocked on Michael (manual UI):** disable retired native Corey (-39958913); later native Milo (-39940529) + Frank (-39958890) once their teammates land.

## Pointers (never restate these here)
- Structured fleet data → `super-agents/superagents.json`
- Manifest → `brain-config/registry.json`
- How to BUILD/migrate an agent → `gates/git-teammate-lifecycle-runbook.md` (+ `gates/git-agent-authoring.md`)
- How to BE a teammate → `super-agents/_shared/super-agent-base.md`
- Naming write-gate → `gates/agent-name-collision-gate.md`
