# Hook — Native-Flush Consolidation (per-agent memory drain)

**Status: ✅ RATIFIED 2026-08-01 by Fleet Felix (Fleet Steward). Live for fleet-wide rollout.** Authored by FMP Fiona at Michael's direction. ~~PROPOSED 2026-08-01 … pending Fleet Steward (ClickUp Coach Corey) ratification before fleet-wide rollout and before wiring into Memory Maggie's bundle.~~ ⚠️ **CORRECTED 2026-08-01 (steward edit by Fleet Felix, at Michael's explicit direction): the Fleet Steward is FLEET FELIX.** Corey was re-laned OFF that lane on **2026-07-20 (PR #430)**. This is the THIRD file to carry the same error in one day, all three traceable to one stale native cache (`super-agents/fmp-frank/native-flush.md`, SOURCE PAGE 2) — which is itself the argument for this hook existing. Struck rather than deleted. 🚩 **Still open (Michael's nod):** adding a pointer to this hook inside Memory Maggie's own bundle. Ratifying the shared spec does not entitle the Steward to rewrite another teammate's profile.

Reference implementation of the intake side: `super-agents/fmp-frank/native-flush.md`.

**Type:** Reusable consolidation hook. Any drain-capable run (Memory Maggie by default) follows it to consolidate ONE agent's `native-flush.md` into that agent's canonical `memory.md`. Reusable by design so several agents can be drained in a single Maggie session.

**Trigger:** Michael triggers a Maggie run naming the agent(s) to drain ("run the native-flush on <agent>"). Never fires on its own; never on a schedule.

## Why this exists (the WHY, not the what)

The shared Open Memory Requests queue does not scale as a flush target: it depends on every agent remembering to use one common file, and a single shared hot file becomes a tragedy-of-the-commons and a capacity choke — see the live OMR capacity crisis (2026-07-31: 21 open, `/PREFERENCES.md` at ~99.7%, three of Michael's own standing instructions blocked). Giving each agent its OWN standalone intake decouples dumping from consolidation: the agent's only job is to dump verbatim into its own file; the curator's only job is to place it. The emptiness of the intake then becomes a free freshness signal for cold starts.

Rejected alternative: agents self-editing their own canonical `memory.md`. That reintroduces exactly the divergence and cap-management problems the curator role exists to prevent — an agent is the worst-placed actor to decide what of its own dump is durable.

## Contract

Input: `super-agents/<slug>/native-flush.md` (may be bare, or hold one or more verbatim dumps).

1. If the intake is bare, there is nothing to do — report "current" and stop.
2. Read the agent's canonical `super-agents/<slug>/memory.md`.
3. Triage each dumped item against the deny-by-default bar (same standard as the OMR protocol): does a Decision Log, agent profile, or standard already own this? Keep GENERALIZATIONS and patterns plus core preferences only; drop project state into `activity-log.md`, not `memory.md`.
4. Place kept items into `memory.md`, honoring its ~10KB hot cap and rotation (`hooks/memory-rotation.md`). Overflow goes to archive, never into the cap.
5. **Truncate `native-flush.md` back to bare** — restore its header and an empty dump zone. Clearing is the signal reset; a stale full intake lies exactly the way the shared queue does.
6. Log the drain in Maggie's own log: which agent, what was placed, what was dropped and why, what was archived.
7. ⚠️ **Report FLEET-FACT ROT found in the dump, do not just drop it** (added 2026-08-01 by the Steward, earned on the first real drain). A native cache is where stale claims about OTHER agents hide — who the steward is, who owns a lane, who reviews what. Those items fail the memory bar and get dropped, which is correct; but dropping them SILENTLY leaves the same error live in whatever files the dump already fed. Name them in the drain report and route them to the Fleet Steward.

## Boundaries

- One curator holds the pen on a given agent's `memory.md` at a time (super-agent-base Concurrency rule).
- Consolidation respects each bundle's own placement rules where it has them (e.g. Fiona's cap-earned placement rule).
- Rolling `native-flush.md` out to every agent, and wiring this hook into Memory Maggie's bundle, is the Fleet Steward's call — **Fleet Felix**. This file is the shared spec they point at, not a change to Maggie's profile.
