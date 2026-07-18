# Staff_Positions — 🪦 MOVED TO LABOUR

**Status:** tombstone · **App:** uritp-global-setup (no longer owns this)

> This table was briefly assigned to Global Setup (DG-003, DP-006). **Reversed 2026-07-18 (DG-005):** staff positions are so intertwined with employment AND student-worker assignment that they are **operational assignment data, not org config**. They now live in the **Labour** spoke, which owns both the position catalog and the person↔position assignments.

## Where it went

- **Owner:** the **Labour** app (positions catalog + assignments).
- **People carries nothing:** `uritp-people/ADULTS_ext` dropped its `fkStaffPosition` link. People stays pure identity.
- **Contact sheets / any app needing a title:** join THROUGH Labour at report time.
- **Departments** stay in Global Setup (shared reference); Labour's position rows reference `Departments` here.

## Why (DG-005)

An assignment of any kind (employment, show role, shop slot, enrollment) is never spine data — it's always spoke-owned. A stored position link on the identity hub or the config spine would scatter operational data across files. Labour owns the whole positions/assignments domain; the spines stay clean.

See `meta/design-decisions.md` DG-005 and `uritp-people/meta/design-decisions.md` (DP-006 superseded).
