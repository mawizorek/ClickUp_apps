# URITP Global Setup — Design Decisions

App-specific rulings for `uritp-global-setup`. Domain-wide FMP rules live in [../../DECISIONS.md](../../DECISIONS.md); cross-app shared build questions are hashed out in the ClickUp "FMP Apps — Shared Build & Behaviour Decision Log."

---

## DG-005 · 2026-07-18 · Positions belong to LABOUR, not Global Setup (supersedes DG-003)

**Ruling:** the Staff-Positions concept does NOT live in Global Setup (nor in People). It is owned entirely by the **Labour** spoke — both the position catalog AND the person↔position assignments. Global Setup carries nothing about positions; it keeps only `Departments` (which Labour's position rows reference). `uritp-people/ADULTS_ext` drops its `fkStaffPosition` link. A contact sheet or any app needing someone's title joins THROUGH Labour at report time.

**Why:** Michael's catch — positions are "so intertwined with Labour and other students too." A position is only meaningful as an **assignment** (this person holds this role, for pay/hours/a shop slot), and an assignment of any kind is operational, not reference. The earlier calls (DP-006 / DG-003) treated positions as org reference like departments; that was wrong because a title without a holder is inert, and the moment it has a holder it's employment data. Putting a `fkStaffPosition` on the identity hub OR the config spine scatters operational data across files.

**The generalized rule (bank this):** an ASSIGNMENT of any kind — employment, show role, shop slot, course enrollment — is NEVER spine data; it is always spoke-owned. Same shape as DP-002, applied to positions. The spines (People = identity, Global Setup = config) stay clean; assignments live in the spoke whose lifecycle they belong to.

**Consequence:** Labour owns positions + assignments from day one (greenfield, DG-001). Departments stay in Global Setup as the shared reference Labour points at. Contact-sheet titles compose a join at export time rather than storing a position link on the person.

**Source:** Michael, 2026-07-18 ("staff positions are so intertwined with labor and other students too so maybe not in people or global setup?" → chose: one catalog + assignments both in Labour).

**Supersedes:** DG-003 (Staff_Positions in Global Setup) and uritp-people DP-006 (Global-Setup-owned). Both are now marked superseded in their homes; the Staff_Positions table file here is a tombstone pointing to Labour.

## DG-004 · 2026-07-18 · Fiscal rollover: manual, as composable stepped scripts

**Ruling:** the `fkCURRENT/PREVIOUS/NEXT_FISCAL_YEAR` pointers are updated manually each year via **discrete stepped scripts** (set-current / shift-previous / set-next), authored so they later compose into one automated rollover script. Not auto-scripted now — a once-a-year event doesn't warrant it — but built to combine without a rewrite.

**Source:** Michael, 2026-07-18 ("manual update each year, as stepped scripts that can eventually be combined and automated").

## DG-003 · 2026-07-18 · (SUPERSEDED by DG-005) Staff_Positions lived here

**Ruling (no longer in force):** the Staff-Positions layer was assigned to Global Setup as org reference data both People and Labour read.

**Why it was reversed (same day, DG-005):** positions are only meaningful as assignments, which are operational, not config. Moved to Labour. Kept here as a tombstone so the reasoning isn't relitigated.

## DG-002 · 2026-07-18 · Config vs operational — what Global Setup is allowed to hold

**Ruling:** Global Setup holds ONLY slow-changing org reference data: org identity (logo/name/acronym), Fiscal_Years, Academic_Periods, Departments. Operational entities with their own lifecycle (productions, roles, enrollments, position assignments) live in their owning spoke and reference Global Setup, never the reverse.

**Consequence:** the config spine stays pure and every app can safely depend on it without inheriting operational churn.

## DG-001 · 2026-07-18 · Greenfield discipline; PRODUCTIONS is builder-owned, no temporary host

**Ruling:** PRODUCTIONS does NOT live in Global Setup. It is owned by the **Productions/Company builder** as that spoke's operational entity. Global Setup keeps ONLY a production-**selector pointer** (match-key table-occurrences against the builder-owned table) so other apps can pick a show. There is NO interim hosting in Global Setup — the builder owns it from day one, and build order follows the dependency graph (apps that pick a show build AFTER the builder exists).

**Why:** PRODUCTIONS is a living operational entity (opening/closing nights, roles, confirmations, revisions hanging off it), not slow config. Per the identity-vs-lifecycle rule (uritp-people DP-002), a thing with its own lifecycle belongs in its owning spoke, not the config hub. Hosting it in Global Setup would make the Productions builder a spoke whose central entity lives outside itself — the mirror of the People bloat already cut.

**The generalized principle (GREENFIELD DISCIPLINE):** almost nothing in this package is truly built yet, so we design the **target-state** schema and let it dictate **build order**; we do NOT let a legacy file's current contents dictate where something "temporarily" lives. Build right the first time. Never cobble around an accident of what got made first. ("What should we have done the first time" is the operating stance for the whole URITP FMP package.)

**Source:** Michael, 2026-07-18 ("none of these are super built... build right the first time... I want that energy and not always trying to cobble what I already have").

---

## Out of scope

- **`MAW GLOBAL`** — a separate legit personal-builds file, NOT a duplicate of URITP Global Setup. Do not reconcile or merge; noted here so no future agent tries.
