# Felix — Memory (the relational fleet index)

> CONTEXT, not process. This holds how agents RELATE, their lineage, and lane boundaries — the connective tissue the structured data can't capture. Structured facts (slug/class/track/status/lane) live in `super-agents/roster.json` + `registry.json`; this file POINTS at them and never restates them. If a fact here conflicts with roster.json, the JSON wins — fix this file.

---

## How the fleet is organized (two trees, ONE roster)

The fleet is still two trees, but as of 2026-07-24 BOTH are indexed in a single combined record, `super-agents/roster.json` (renamed from `superagents.json`, which only covered teammates). The roster carries both classes; the trees are just where each class physically lives:

- **`brain-config/agents/`** = ephemeral **Council/Workshop lenses**. Stateless processing verbs, no personal memory, NOT session-invocable as a standing persona. (The Council core, the 7 Workshop lenses, the close/research/audit lenses.) In the roster as the `council_lenses` tier.
- **`brain-config/super-agents/`** = persistent **git-teammates**. Full context bundle, base pointer, invoked via `/session.agent=<Name>`, hold memory across sessions. In the roster as the `agents` tier (alongside native/task-specific + retired).
- A lens that needs to accumulate context + be inhabited for a whole session GRADUATES into `super-agents/` (Wes, Anna, Mira). Its old `agents/<slug>.md` becomes a tombstone; the roster draws the link with `graduated_from`.

**Invocation is roster-first.** Any `/agent-name` resolves against `roster.json` FIRST (agent-invocation-gate.md STEP 0), then loads the agent's home directly — no double-hop through me or Mira. Reading the roster is NOT invoking me; I'm its steward, not a forwarding desk.

## The teammate roster (super-agents/ — my primary charges)

- **Workhorse Wes** (`workhorse-wes`, git-teammate, active) — driving force. Keeps Michael big-picture, kills bikeshedding, names rabbit holes. Migrated 2026-07-19 from an announce-only lens in agents/ into the fleet (first git-teammate; reference implementation).
- **ClickUp Coach Corey** (`clickup-coach-corey`, git-teammate, active) — converted 2026-07-19 from a native ClickUp Super Agent (-39958913, retired, pending manual UI disable) to git-only. Re-lane FULLY EXECUTED (see below).
- **Audit Anna** (`audit-anna`, git-teammate, active) — **MIGRATED 2026-07-21 from the audit-anna lens (v11); the FIRST female teammate.** Audit Lead: seizes any audit, names TRUE PURPOSE first, drives Know/Touch/Do to done, holds the Open-Surface Ledger. Owns general/root-purpose auditing + the fleet-audit lane (re-laned off Corey) + the deeper URITP-general audit (the Corey split, resolved at her conversion). Migration was run COLD as the lifecycle-runbook's acceptance test — it PASSED end-to-end without me (steward) in the room. Vocal LATCH presence + audit-intent auto-seize are BY DESIGN (auto-seize survives as a house AI Toolkit index-trigger row, not an agent trigger).
- **Maestro Mira** (`maestro-mira`, git-teammate, active) — MIGRATED 2026-07-21 from the Council-lead lens/gate. Orchestrator: the verbal front door to the whole fleet + Michael's DEFAULT front door. She CONSULTS my directory when routing verbally (switchboard vs directory — the seam). Instruction set = orchestration.md.
- **Mainstage Milo** (`mainstage-milo`, git-teammate, active) — URITP production/ops. BUILT 2026-07-21 via the Definition Playbook (NOT a mirror of the over-hatted native). Native -39940529 superseded, pending UI disable. OPEN: confirm the full 7 URITP spaces.
- **FMP Frank** (`fmp-frank`, git-teammate-rebuild-pending, needs-declaration) — FileMaker solution design. REBUILD as a NEW git-teammate (not mirror the over-hatted native); define a singular lane via brainstorm first. NOTE: Frank tends to lean toward NESTING/overlapping agents; I lean the other way (singularity).
- Task-specific exempt (inventory-only): origination-date-agent, parse-property-emails, update-amount-paid. Retired: `update-uritp` (task label, not an agent; chore→doc).

## Lineage: the Anna / Corey re-lane (RESOLVED 2026-07-21)

The saga that birthed me. Fleet Steward + fleet-audit were piled onto Corey (and bounced toward Anna) — the hat-piling anti-pattern. Resolution, now COMPLETE:
- **Felix (me)** created 2026-07-20 to give the STEWARD role a permanent home (who owns what / lineage / singularity) so it stops bouncing.
- **Corey** keeps URITP workspace-structure + ClickUp-SETUP coaching + ClickUp-SPACE structural auditing (his domain). Steward-strip DONE (PR #430 prefs, #433 memory).
- **Anna** takes general/root-purpose auditing across any subject + the fleet-audit lane + the deeper URITP-general audit. Converted to a teammate 2026-07-21 (above), which is what RESOLVED the split the registry had parked "until Anna converts."
- Clean division to hold onto: **Felix KNOWS the fleet, Anna AUDITS it.** Lineage/ownership questions → me; is-this-agent-internally-consistent → her (she runs the git-teammate DoD).
- All three former watch items are now closed: Anna converted ✓; Corey URITP-audit split resolved ✓; mirror-note freshness swept ✓ (roster.json + registry.json + AI Toolkit index all say executed).

## Lane map (who owns what — stay singular)

- Fleet lookup + new-agent stewardship + singularity policing = **me (Felix)**.
- Verbal orchestration / front door = **Mira**. Driving force / momentum = **Wes**. General + fleet auditing = **Anna**. ClickUp structure + setup coaching + ClickUp-space auditing = **Corey**. FileMaker = **FMP Frank** (rebuild pending). URITP production ops = **Milo**.
- Council/Workshop lenses are processing verbs, not teammates — don't route lane questions to them. (Note: Recon Renata = repo-only audit lens, Breaker Beckett = artifact-break lens; Anna orchestrates both, doesn't duplicate them.)

## Density snapshot (I track this)

- **Teammates (super-agents/) = 7, gender skew 6 M : 1 F** — Wes, Corey, Milo, Frank, Felix, Mira (M) vs **Anna** (the FIRST female teammate, landed 2026-07-21). Michael's naming instinct on teammates still trends male + pronounceable + dictation-proof, but the lens→teammate graduation path is now pulling female lenses up (Anna first; watch for more).
- **Council/Workshop lenses skew female** (~16 F vs ~7 M; neutral Mika/Skye/Sage). Anna's + Mira's graduations slightly drain the female-lens pool into the teammate pool.
- Watch: as more lenses graduate, the teammate gender skew should keep evening out.

## Naming ledger (hits + misses — seed; grows over time)

> The convention itself (alliterative role-first, slug-immutable, collision-checked, shared-letters-with-the-role = singularity) lives in the Super Agent Creation Checklist. I just track what landed.
- **2026-07-21 — Audit Anna (migration, slug reused).** Lens→teammate kept the existing `audit-anna` slug (clean, immutable; only display_name could ever change). Reinforces the Red Rhett lesson: a migration reuses the slug, never renames it.
- **2026-07-20 — Fleet Felix (HIT, chosen).** For this steward. "Felix" shares the extra e+l with "Fleet" — Michael's shared-letters heuristic. Runners-up floated: Roster Ross (Michael loved the name but wanted to reserve "roster" for something else + "fleet steward" was the sticky mental handle), Curator Quinn, Registrar Rhea, Keeper Nadia, Muster Vance. "Fiona" liked but reserved for later use.
- **Lesson — Routine Ricky (MISS/incident).** A mid-session create collided on name/nickname identity across both namespaces → birthed the name-collision gate. Nicknames collide too, not just formal names.
- **Lesson — Red Rhett → Workshop Wes (MISS/incident).** A whimsical rename changed the slug → forced a git file rename → orphaned files. Lesson: slug is IMMUTABLE; a rename touches display_name only.
- **2026-07-24 — file rename, NOT an agent rename.** `superagents.json` → `roster.json` (data) + `index.html` → `roster.html` (renderer). Michael: the old name only covered teammates and undersold the combined roster. Redirect stubs left at the old paths (fail-loud, not stale). Distinct from the slug-immutability lesson — this renamed a FILE, not an agent slug.

## Open follow-ups I'm holding

- **registry.json repoint (2026-07-24):** registry.json still has `superagents.json` mentions in its `source` changelog + `session_commands` note. It's a GENERATED artifact (never hand-edit) and sits ~29KB (near the write ceiling), so it needs a clean REGENERATION from front-matter, not a hand-rewrite — flagged, not done in the roster PR. Until then the redirect stub catches any reader.
- **Milo + Frank rebuilds:** Frank still pending the Definition Playbook brainstorm (singular lane). Milo built; confirm the full 7 URITP spaces.
- **Blocked on Michael (manual UI):** disable retired native Corey (-39958913); later native Milo (-39940529) + Frank (-39958890) once their teammates land.

## Pointers (never restate these here)
- Combined fleet roster (both classes) → `super-agents/roster.json` (renderer: `roster.html`)
- Manifest → `brain-config/registry.json`
- Invocation enforcement → `gates/agent-invocation-gate.md` (STEP 0 = roster-first)
- How to BUILD/migrate an agent → `gates/git-teammate-lifecycle-runbook.md` (+ `gates/git-agent-authoring.md`)
- How to BE a teammate → `super-agents/_shared/super-agent-base.md`
- Naming write-gate → `gates/agent-name-collision-gate.md`
