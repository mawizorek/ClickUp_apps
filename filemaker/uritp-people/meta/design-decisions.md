# URITP People — Design Decisions & Audit Ledger

App-specific rulings for `uritp-people`. This is the **build-toward source of truth**, not a mirror of the old file: the schema was researched from the ClickUp `URITP People FMP` doc, then each field was made to earn its place or get cut. Domain-wide FMP rules live in [../../DECISIONS.md](../../DECISIONS.md); cross-app shared build questions are hashed out in the ClickUp "FMP Apps — Shared Build & Behaviour Decision Log" and fold down here + into DECISIONS.md once locked.

---

## DP-007 · 2026-07-18 · Positions belong to LABOUR; People carries no position link (supersedes DP-006)

**Ruling:** `ADULTS_ext` drops `fkStaffPosition`. People holds NO position/title/department field at all. The entire positions concept — catalog AND assignments — is owned by the **Labour** spoke. When a contact sheet or any app needs a person's title, it joins THROUGH Labour at report time. `ADULTS_ext` keeps only the broad `AdultType` classification (kind of non-student), not a job title.

**Why:** a position/title is only meaningful as an **assignment** (this person holds this role, for pay/hours/a shop slot), and an assignment of any kind is operational, not identity. DP-006 tried to solve the placement by parking positions in Global Setup; Michael's catch ("positions are so intertwined with Labour and other students too") exposed that as the wrong cut — the catalog and the assignment are one domain and splitting them scatters operational data. **Generalized rule (banked): an assignment of any kind — employment, show role, shop slot, course enrollment — is NEVER spine data; it is always spoke-owned.** Same shape as DP-002, applied to positions.

**Source:** Michael, 2026-07-18 (chose "one catalog + assignments both in Labour; People/Global Setup carry nothing").

**Supersedes:** DP-006. Cross-ref: Global Setup DG-005 (its Staff_Positions is now a tombstone pointing to Labour).

## DP-006 · 2026-07-18 · ~~Staff-Positions layer is Global-Setup-owned~~ (SUPERSEDED by DP-007)

**Ruling (no longer in force):** the Staff-Positions layer `ADULTS_ext.fkStaffPosition` referenced was assigned to Global Setup as reference data both People and Labour read.

**Why reversed (same day, DP-007 / DG-005):** positions are operational assignment data, not org reference. They move to Labour entirely; People drops the link. Kept as a tombstone so the reasoning isn't relitigated.

## DP-005 · 2026-07-18 · Student/Non-Student classification is DERIVED, not stored (Workshop W1)

**Ruling:** classification context is computed from which role extension a person holds (`STUDENTS_ext` → Student, `ADULTS_ext` → Non-Student, both → both, neither → unclassified). There is NO stored `broadClassification` flag on PEOPLE. The chooser card reads the derived context for its start filter.

**Why:** a stored flag is a drift surface — it can say "Student" while no `STUDENTS_ext` exists. Deriving from the extension that already exists is the single source of truth and obeys the repo's derive-don't-store discipline (D-005/006/007). Removed `broadClassification` from the PEOPLE field list (19→18).

**Source:** Workshop W1, delegated by Michael 2026-07-18.

## DP-004 · 2026-07-18 · The four-input name model (all justified, none redundant)

**Ruling:** PEOPLE keeps FOUR distinct name inputs, each solving a real case — this is deliberate, not over-build:

1. **True name** (`First Name`/`Last Name`) — legal identity, the fallback.
2. **Preferred name** (`preferredFirstName`/`preferredLastName`) — everyday working name; overrides true in all general displays (drives the auto calcs).
3. **Alternate name** (`alternateName` + `useAlternateNameGlobally`) — the **foreign-exchange-student** case: goes by something distinct from both legal and preferred. Additive; the toggle controls global override vs playbill-only.
4. **Playbill credit** (`NameDisplayInPlaybills`) — hard-coded, never-scripted manual print source of truth; **frequently NOT any combination** of the other three, so it must be its own editable field.

**General display priority:** preferred → (alternate if `useAlternateNameGlobally`) → true. Playbill is independent.

**Also ruled:** `customID` (CRM-###) STAYS — it's the human-readable **merge handle to ClickUp** (with `primaryEmail`), distinct from the machine-only UUID PK.

**Source:** Michael, 2026-07-18 (defended alternate = foreign-exchange, playbill = manual print truth, customID = CU merge key). Brain had proposed cutting alternate + toggle as over-build; Michael overruled with the real cases. Correct call logged so no future agent re-cuts them.

## DP-003 · 2026-07-18 · ADULTS/STUDENTS split carried by thin extensions

**Ruling:** the diametric Adult vs Student split lives in two thin role-extension tables off People core (`STUDENTS_ext` / `ADULTS_ext`, one-to-one via `fkPERSON`), NOT in a bloated People table and NOT in a spoke. Different downstream exports compose different joins off the same hub. A person may hold both extensions. Extension existence also drives the derived classification (DP-005).

## DP-002 · 2026-07-18 · Identity facts vs lifecycle links (the placement rule)

**Ruling:** editable identity facts (name, pronoun, email, class year, student ID) live in People (student-specific ones on `STUDENTS_ext`). A relationship to a thing with its own lifecycle (a course offering, a show, a training, a position) lives in the spoke. No People field is ever maintained in two places; the spoke references the person, it does not restate the field.

**Consequence:** class year + student ID → `STUDENTS_ext` (People-side). Course enrollment → Courses spoke. Position/title → Labour spoke (DP-007). Contact tree (multiple emails/phones) stays in People (Q4).

**Source:** Michael, 2026-07-18 ("if I want to edit an email, pronoun, class year, ID — that's all in PEOPLE not Course Enrollments").

## DP-001 · 2026-07-18 · Hub-and-spoke; People is the lean identity hub

**Ruling:** People owns identity ONLY — names + display/playbill cascade + pronunciation + contact info + broad Student/Non-Student classification (derived) + the ClickUp merge handle. It is the hub. Spokes (Productions/Company builder, Safety Programs, Courses/Student-Records, Labour) each own their own join tables and reference `PEOPLE.PrimaryKey`. Production-role joins do NOT merge into People (reverses the old ClickUp-doc plan to fold Contact Sheets into People).

**Why:** the moment production roles (with shows, revisions, confirmations) live in People, it stops being a reusable contacts hub and becomes production-aware, poisoning reuse for every other spoke. Lean hub = every spoke inherits identity without re-deriving it.

**Source:** Michael, 2026-07-18 ("definitely want hub and spoke").

---

## Naming-Drift Audit Ledger (target vs as-built)

This app is the **build-toward** source of truth. Typos are corrected inline in the schema (not preserved). Remaining rows are queued fixes/decisions for the live-file reconciliation + rename pass.

| # | As-built | Target | Type | Status |
|---|---|---|---|---|
| A1 | `PrimaryKey` (bare) | bare, kept | key prefix | **RESOLVED** — bare style locked (Michael 2026-07-18); no pk_ prefix |
| A2 | `fkPERSON` / `fkCONTACT` | bare, kept | key prefix | **RESOLVED** — bare style locked |
| A3 | `prefferedFirstName` | `preferredFirstName` | typo | **corrected in target schema** |
| A4 | `prefferedLastName` | `preferredLastName` | typo | **corrected in target schema** |
| A5 | `namePronounciation` | `namePronunciation` | typo | **corrected in target schema** |
| A7 | `Emails.fkCONTACT` vs `PhoneNumbers.fkContact` | one consistent casing | inconsistency | queued (rename pass) |
| A8 | CONTACT_INFO cascade-delete children | reverse | behavior | **RESOLVED** — reversed (Michael, W1) |
| A9 | class from extension existence | derived, no stored flag | modeling | **RESOLVED** — derived (DP-005) |

**Naming house style:** RESOLVED — this app keeps the bare `PrimaryKey`/`fkPERSON` style (matches HML), does NOT adopt URITP `pk_`/`fk_`. The workspace-wide unification question remains open at the domain level (DOCUMENTATION-STANDARD), but uritp-people's own convention is now locked.

### Deliberate field CUTS / derivations / graduations (target-state pass, 2026-07-18)

Recorded so the history is kept without polluting the source of truth.

| Field | Disposition | Why |
|---|---|---|
| `emailTEMP` | CUT | legacy import-staging; migrate live values into CONTACT_INFORMATION, then drop |
| `hiddenLatestImport` | CUT | import-batch tracking cruft; belongs to the import script's scope |
| `broadClassification` | DERIVED (not stored) | computed from extension existence (DP-005); a stored flag would drift |
| `ADULTS_ext.fkStaffPosition` | REMOVED → Labour | positions are Labour-owned assignment data (DP-007); People carries no position link, joins THROUGH Labour for a title |

---

## Deferred to spokes (NOT People)

The as-built People file carried these; hub-and-spoke moves them out:

- `EMPLOYEES_setup`, `JOB POSTINGS`, `Supervisors`, `_setup_Staff Positions`, `URJobProfileLevels` → **Labour** (owns the positions catalog + assignments, DP-007).
- `PRODUCTION_STAFFS`, `ROLES_IN_PRODUCTION_setup`, `PRODUCTIONS_*` → **Productions/Company builder**.
- Enrollment/roster history → **Courses/Student-Records**.
- `GLOBAL_USAGE_VARIABLES` / org constants / PRODUCTIONS list → **Global Setup** (config spine; Departments live there and Labour references them).
