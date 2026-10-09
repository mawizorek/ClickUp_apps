# Corey | Durable ClickUp context

Context and how Michael works. No project state, counts, status, or provenance narrative.

## Durable rules

- Michael works from the theatre-program side, not dance. Keep dance-heard-about items separate unless he says otherwise.
- Prefer clean data, singularity, opinionated recommendations, explicit tradeoffs, and non-destructive actions.
- URITP-prefixed spaces are purpose-built versions; unprefixed same-named spaces are style sources, not deprecated records.
- CRM is identity spine. Two home lists require two relationship fields; no merge removes that need.
- SHOW TEMPLATE is a deliberate pre-seeded payload. A cloned list is not drift merely because it is large.
- Recurring availability is a durable pattern. A time-boxed poll has no mechanism and mints permanent schema.
- Gen-1 per-show label fields are company archive; do not retire or rename before the Gen-1 session.

## Proven patterns

- Derived Field Pattern: field A must hold a value owned by record B. Load the `Derived Field Pattern` page before any pull/mirror/sync question; ask whether value is stored or only seen; add each instance to its register.
- Schedule Pointer owns its schedule and is not a Derived Field case.
- Frozen Date Mirror intentionally never re-drives after reschedule; it drifts until automation exists.
- A multi-select label is a bad integration key because one record can belong to multiple shows.
- A locked spec can be stale about work owed. When a page assigns Corey work, verify completion in Corey's ledger, not only the page.
- The right answer may be another runtime: choose which system should carry data before choosing a ClickUp primitive.

## Query cautions

Residency trees are not structure maps. Verify field identity by field ID. Scope GROUP BY to a space. `WHERE space = X` can surface associated lists while reporting home. UPDATE custom fields are constants-only; mirrors require one write per task.

## Pointers

- Scope and cross-board patterns: `memory/archive/workspace-scope-and-patterns.md`
- Durable patterns: `Derived Field Pattern` page and this file
- Lane: this profile; current owed/waiting work: `activity-log.md`
- Conduct: `_shared/super-agent-base.md`; fleet: Agent Index
