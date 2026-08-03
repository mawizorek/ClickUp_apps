# Corey — Decision Log

> Reasoning trail (why, not just what). What-changed history lives in git + PR + working-notes.md.

---

## D4 — "Schedule Pointer" pattern for irregular recurring events (2026-08-03)
**Decision:** Endorse the schedule pointer pattern: a single persistent task whose start/due dates
always reflect the NEXT upcoming occurrence, with a LONG TEXT custom field holding the canonical
date index (parseable format: `YYYY-MM-DD HH:MM | Location | Status`). An AI automation trigger
on "when due date passes" parses the index and advances start/due to the next occurrence.
**Why:** ClickUp's native recurrence is interval-based and can't handle a pre-defined list of
irregular dates (e.g. no January meeting, September in a different room). The alternatives were:
(a) 8 subtasks cluttering calendar views, or (b) native recurrence with manual exceptions. Both
violate singularity and create noise. The pointer pattern keeps one entity per concept, shows
correctly on calendars/My Work, and the index field gives a machine-parseable SOT for automation.
**Applied to:** Faculty Council Meeting (URITP-8973, merged from URITP-12712). 8 meetings across
2026-2027 academic year (Sep–May, no January, two All Faculty + six Council-only).
**Schema:** Task description = human-readable (location, zoom, contacts, standing agenda).
Custom field = date index (automation reads this). Start/due = next meeting only.
**Consequence noted:** Pattern generalizes to any irregular recurring obligation. If this works well,
apply to other academic calendar events (commencement, convocations, etc.).

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
