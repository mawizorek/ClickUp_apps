# Corey — Decision Log

> Reasoning trail (why, not just what). What-changed history lives in git + PR + working-notes.md.

---

## D1 — Corey goes git-only; native CU agent retired (2026-07-19)
**Decision:** Retire the native ClickUp Super Agent (-39958913) and run Corey purely as a
git-teammate invoked via `/session.agent=Corey`.
**Why:** Michael wants the repo version only and explicitly does not need autonomous triggers,
scheduling, or task-assignment. Analysis of Corey's own config showed the entire COGNITIVE role
(structural auditing, on-demand coaching, standards docs, fleet stewardship) is fully git-portable;
only the trigger scaffolding is lost, which was waived. Fleet stewardship is already git-native
work, so it gets more natural, not harder.
**Alternatives rejected:** (a) mirror — keep native + a git twin (adds a dual-existence to maintain,
the very thing that forced the frozen-mirror preferences.md); rejected because Michael wants ONE
surface. 
**Consequence noted:** disabling the live agent is a manual ClickUp-UI step, left to Michael.

## D2 — Preferences.md reframed from live-mirror to canonical (2026-07-19)
**Decision:** Drop the "verbatim mirror of the live config" invariant; preferences.md becomes
Corey's canonical editable profile with a base pointer + load manifest.
**Why:** the mirror invariant only existed to support live-vs-declared auditing. With no live config
there is nothing to mirror, so the collision I flagged (base pointer vs frozen mirror) dissolves.
**Kept intact:** all substantive role content (audit method, coach behavior, CRM/Season context,
stewardship). Only the meta-framing + trigger-dependent scaffolding changed.

## D3 — Hybrid fleet audit model (2026-07-19)
**Decision:** The Steward now audits two tracks differently: native = live-vs-declared drift;
git-teammate = git-canonical internal-consistency (no live diff).
**Why:** a git-teammate has no live config to compare against; forcing the old test on it is
meaningless. Codified in preferences.md §6.6 + the superagents.json git_teammate_standard note.
