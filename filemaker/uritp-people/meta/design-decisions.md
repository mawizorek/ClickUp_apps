# URITP People — Design Decisions & Audit Ledger

App-specific rulings for `uritp-people`. This is the **build-toward source of truth**, not a mirror of the old file: the schema was researched from the ClickUp `URITP People FMP` doc, then each field was made to earn its place or get cut. Domain-wide FMP rules live in [../../DECISIONS.md](../../DECISIONS.md); cross-app shared build questions are hashed out in the ClickUp "FMP Apps — Shared Build & Behaviour Decision Log" and fold down here + into DECISIONS.md once locked.

---

## DP-001 · 2026-07-18 · Hub-and-spoke; People is the lean identity hub

**Ruling:** People owns identity ONLY — names + display/playbill cascade + pronunciation + contact info + broad Student/Non-Student classification + the ClickUp merge handle. It is the hub. Spokes (Productions/Company builder, Safety Programs, Courses/Student-Records, Labour) each own their own join tables and reference `PEOPLE.PrimaryKey`. Production-role joins do NOT merge into People (reverses the old ClickUp-doc plan to fold Contact Sheets into People).

**Why:** the moment production roles (with shows, revisions, confirmations) live in People, it stops being a reusable contacts hub and becomes production-aware, poisoning reuse for every other spoke. Lean hub = every spoke inherits identity without re-deriving it.

**Source:** Michael, 2026-07-18 ("definitely want hub and spoke").

## DP-002 · 2026-07-18 · Identity facts vs lifecycle links (the placement rule)

**Ruling:** editable identity facts (name, pronoun, email, class year, student ID) live in People (student-specific ones on `STUDENTS_ext`). A relationship to a thing with its own lifecycle (a course offering, a show, a training) lives in the spoke. No People field is ever maintained in two places; the spoke references the person, it does not restate the field.

**Consequence:** class year + student ID → `STUDENTS_ext` (People-side). Course enrollment → Courses spoke. Contact tree (multiple emails/phones) stays in People (Q4).

**Source:** Michael, 2026-07-18 ("if I want to edit an email, pronoun, class year, ID — that's all in PEOPLE not Course Enrollments").

## DP-003 · 2026-07-18 · ADULTS/STUDENTS split carried by thin extensions

**Ruling:** the diametric Adult vs Student split lives in two thin role-extension tables off People core (`STUDENTS_ext` / `ADULTS_ext`, one-to-one via `fkPERSON`), NOT in a bloated People table and NOT in a spoke. Different downstream exports compose different joins off the same hub. A person may hold both extensions.

**Open:** Adult Department/Title placement — keep on `ADULTS_ext` or graduate to a Staff-Positions layer (the as-built file had `_setup_Staff Positions` / `URJobProfileLevels` / `Supervisors`). Parked, non-blocking.

## DP-004 · 2026-07-18 · The four-input name model (all justified, none redundant)

**Ruling:** PEOPLE keeps FOUR distinct name inputs, each solving a real case — this is deliberate, not over-build:

1. **True name** (`First Name`/`Last Name`) — legal identity, the fallback.
2. **Preferred name** (`preferredFirstName`/`preferredLastName`) — everyday working name; overrides true in all general displays (drives the auto calcs).
3. **Alternate name** (`alternateName` + `useAlternateNameGlobally`) — the **foreign-exchange-student** case: goes by something distinct from both legal and preferred. Additive; the toggle controls global override vs playbill-only.
4. **Playbill credit** (`NameDisplayInPlaybills`) — hard-coded, never-scripted manual print source of truth; **frequently NOT any combination** of the other three, so it must be its own editable field.

**General display priority:** preferred → (alternate if `useAlternateNameGlobally`) → true. Playbill is independent.

**Also ruled:** `customID` (CRM-###) STAYS — it's the human-readable **merge handle to ClickUp** (with `primaryEmail`), distinct from the machine-only UUID PK.

**Source:** Michael, 2026-07-18 (defended alternate = foreign-exchange, playbill = manual print truth, customID = CU merge key). Brain had proposed cutting alternate + toggle as over-build; Michael overruled with the real cases. Correct call logged so no future agent re-cuts them.

---

## Naming-Drift Audit Ledger (target vs as-built)

This app is the **build-toward** source of truth. Typos are corrected inline in the schema (not preserved). Remaining rows are queued fixes/decisions for the live-file reconciliation + rename pass.

| # | As-built | Target | Type | Status |
|---|---|---|---|---|
| A1 | `PrimaryKey` (bare) | `pk_<Table>ID`? | key prefix | open — governance: bare (HML) vs pk_ (URITP) |
| A2 | `fkPERSON` / `fkCONTACT` | `fk_Person` / `fk_Contact`? | key prefix | open — tied to A1 |
| A3 | `prefferedFirstName` | `preferredFirstName` | typo | **corrected in target schema** |
| A4 | `prefferedLastName` | `preferredLastName` | typo | **corrected in target schema** |
| A5 | `namePronounciation` | `namePronunciation` | typo | **corrected in target schema** |
| A7 | `Emails.fkCONTACT` vs `PhoneNumbers.fkContact` | one consistent casing | inconsistency | queued (rename pass) |
| A8 | CONTACT_INFO cascade-delete children | confirm keep/reverse | behavior | open (flagged temporary in file) |
| A9 | class from extension existence | explicit `broadClassification` flag? | modeling | open |

**Governance blocker (A1/A2):** the workspace has two live key-naming patterns — URITP `pk_`/`fk_` vs HML bare `PrimaryKey`/`fk<Parent>` — NOT yet unified (DOCUMENTATION-STANDARD notes this). Pick one house style before the rename pass, or explicitly let each app keep its own declared convention.

### Deliberate field CUTS (target-state pass, 2026-07-18)

Recorded so the history is kept without polluting the source of truth. These were in the as-built file and were removed on purpose:

| Field | Why cut | Data disposition |
|---|---|---|
| `emailTEMP` | legacy import-staging field; a canonical identity hub should not ship a "temp" field | migrate any live values into CONTACT_INFORMATION, then drop |
| `hiddenLatestImport` | import-batch tracking cruft; belongs to the import script's scope, not on every person record forever | drop; if import needs a marker, use a script global |

---

## Deferred to spokes (NOT People) — removed from the hub this pass

The as-built People file carried these; hub-and-spoke moves them out:

- `EMPLOYEES_setup`, `JOB POSTINGS`, `Supervisors`, `_setup_Staff Positions`, `URJobProfileLevels` → **Labour** (or a Staff-Positions layer).
- `PRODUCTION_STAFFS`, `ROLES_IN_PRODUCTION_setup`, `PRODUCTIONS_*` → **Productions/Company builder**.
- Enrollment/roster history → **Courses/Student-Records**.
- `GLOBAL_USAGE_VARIABLES` / org constants / PRODUCTIONS list → **Global Setup** (separate spine app).
