# URITP Global Setup — Design Decisions

App-specific rulings for `uritp-global-setup`. Domain-wide FMP rules live in [../../DECISIONS.md](../../DECISIONS.md); cross-app shared build questions are hashed out in the ClickUp "FMP Apps — Shared Build & Behaviour Decision Log."

---

## DG-001 · 2026-07-18 · Greenfield discipline; PRODUCTIONS is builder-owned, no temporary host

**Ruling:** PRODUCTIONS does NOT live in Global Setup. It is owned by the **Productions/Company builder** as that spoke's operational entity. Global Setup keeps ONLY a production-**selector pointer** (match-key table-occurrences against the builder-owned table) so other apps can pick a show. There is NO interim hosting in Global Setup — the builder owns it from day one, and build order follows the dependency graph (apps that pick a show build AFTER the builder exists).

**Why:** PRODUCTIONS is a living operational entity (opening/closing nights, roles, confirmations, revisions hanging off it), not slow config. Per the identity-vs-lifecycle rule (uritp-people DP-002), a thing with its own lifecycle belongs in its owning spoke, not the config hub. Hosting it in Global Setup would make the Productions builder a spoke whose central entity lives outside itself — the mirror of the People bloat already cut.

**The generalized principle (GREENFIELD DISCIPLINE):** almost nothing in this package is truly built yet, so we design the **target-state** schema and let it dictate **build order**; we do NOT let a legacy file's current contents dictate where something "temporarily" lives. Build right the first time. Never cobble around an accident of what got made first. ("What should we have done the first time" is the operating stance for the whole URITP FMP package.)

**Source:** Michael, 2026-07-18 ("none of these are super built... build right the first time... I want that energy and not always trying to cobble what I already have").

## DG-002 · 2026-07-18 · Config vs operational — what Global Setup is allowed to hold

**Ruling:** Global Setup holds ONLY slow-changing org reference data: org identity (logo/name/acronym), Fiscal_Years, Academic_Periods, Departments, Staff_Positions. Operational entities with their own lifecycle (productions, roles, enrollments, assignments) live in their owning spoke and reference Global Setup, never the reverse.

**Consequence:** the config spine stays pure and every app can safely depend on it without inheriting operational churn.

## DG-003 · 2026-07-18 · Staff_Positions lives here (inherits uritp-people DP-006)

**Ruling:** the Staff-Positions layer (department + title/level, referenced by `uritp-people/ADULTS_ext.fkStaffPosition` and Labour) is a Global Setup table. It's org reference data both People and Labour read; housing it in Labour would invert hub-and-spoke. Seeds from the as-built `_setup_Staff Positions` / `URJobProfileLevels` / `Supervisors`.

## DG-004 · 2026-07-18 · Fiscal rollover: manual, as composable stepped scripts

**Ruling:** the `fkCURRENT/PREVIOUS/NEXT_FISCAL_YEAR` pointers are updated manually each year via **discrete stepped scripts** (set-current / shift-previous / set-next), authored so they later compose into one automated rollover script. Not auto-scripted now — a once-a-year event doesn't warrant it — but built to combine without a rewrite.

**Source:** Michael, 2026-07-18 ("manual update each year, as stepped scripts that can eventually be combined and automated").

---

## Out of scope

- **`MAW GLOBAL`** — a separate legit personal-builds file, NOT a duplicate of URITP Global Setup. Do not reconcile or merge; noted here so no future agent tries.
