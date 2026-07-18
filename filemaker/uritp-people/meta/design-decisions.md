# URITP People — Design Decisions & Audit Ledger

App-specific rulings for `uritp-people`. Domain-wide FMP rules live in [../../DECISIONS.md](../../DECISIONS.md); cross-app shared build questions are hashed out in the ClickUp "FMP Apps — Shared Build & Behaviour Decision Log" and fold down here + into DECISIONS.md once locked.

---

## DP-001 · 2026-07-18 · Hub-and-spoke; People is the lean identity hub

**Ruling:** People owns identity ONLY — names + display/playbill cascade + pronunciation + contact info + broad Student/Non-Student classification. It is the hub. Spokes (Productions/Company builder, Safety Programs, Courses/Student-Records, Labour) each own their own join tables and reference `PEOPLE.PrimaryKey`. Production-role joins do NOT merge into People (reverses the old ClickUp-doc plan to fold Contact Sheets into People).

**Why:** the moment production roles (with shows, revisions, confirmations) live in People, it stops being a reusable contacts hub and becomes production-aware, poisoning reuse for every other spoke. Lean hub = every spoke inherits identity without re-deriving it.

**Source:** Michael, 2026-07-18 ("definitely want hub and spoke").

## DP-002 · 2026-07-18 · Identity facts vs lifecycle links (the placement rule)

**Ruling:** editable identity facts (name, pronoun, email, class year, student ID) live in People (student-specific ones on `STUDENTS_ext`). A relationship to a thing with its own lifecycle (a course offering, a show, a training) lives in the spoke. No People field is ever maintained in two places; the spoke references the person, it does not restate the field.

**Consequence:** class year + student ID → `STUDENTS_ext` (People-side). Course enrollment → Courses spoke. Contact tree (multiple emails/phones) stays in People (Q4).

**Source:** Michael, 2026-07-18 ("if I want to edit an email, pronoun, class year, ID — that's all in PEOPLE not Course Enrollments").

## DP-003 · 2026-07-18 · ADULTS/STUDENTS split carried by thin extensions

**Ruling:** the diametric Adult vs Student split lives in two thin role-extension tables off People core (`STUDENTS_ext` / `ADULTS_ext`, one-to-one via `fkPERSON`), NOT in a bloated People table and NOT in a spoke. Different downstream exports compose different joins off the same hub. A person may hold both extensions.

**Open:** Adult Department/Title placement — keep on `ADULTS_ext` or graduate to a Staff-Positions layer (the as-built file had `_setup_Staff Positions` / `URJobProfileLevels` / `Supervisors`). Parked, non-blocking.

---

## Naming-Drift Audit Ledger (as-built → target)

This app is documented **as-built**; nothing here is silently rewritten. Each row is a queued fix for the live-file reconciliation + rename pass. Governance question (which house style) is still open.

| # | As-built | Target (URITP std) | Type | Status |
|---|---|---|---|---|
| A1 | `PrimaryKey` (bare) | `pk_<Table>ID`? | key prefix | open — governance: bare (HML) vs pk_ (URITP) |
| A2 | `fkPERSON` / `fkCONTACT` | `fk_Person` / `fk_Contact`? | key prefix | open — tied to A1 |
| A3 | `prefferedFirstName` | `preferredFirstName` | typo | queued |
| A4 | `prefferedLastName` | `preferredLastName` | typo | queued |
| A5 | `namePronounciation` | `namePronunciation` | typo | queued |
| A6 | `emailTEMP` | migrate → CONTACT_INFORMATION, deprecate | legacy field | queued |
| A7 | `Emails.fkCONTACT` vs `PhoneNumbers.fkContact` | one consistent casing | inconsistency | queued |
| A8 | CONTACT_INFO cascade-delete children | confirm keep/reverse | behavior | open (flagged temporary in file) |
| A9 | class from extension existence | explicit `broadClassification` flag? | modeling | open |

**Governance blocker (A1/A2):** the workspace has two live key-naming patterns — URITP `pk_`/`fk_` vs HML bare `PrimaryKey`/`fk<Parent>` — NOT yet unified (DOCUMENTATION-STANDARD notes this). Pick one house style before the rename pass, or explicitly let each app keep its own declared convention.

---

## Deferred to spokes (NOT People) — removed from the hub this pass

The as-built People file carried these; hub-and-spoke moves them out:

- `EMPLOYEES_setup`, `JOB POSTINGS`, `Supervisors`, `_setup_Staff Positions`, `URJobProfileLevels` → **Labour** (or a Staff-Positions layer).
- `PRODUCTION_STAFFS`, `ROLES_IN_PRODUCTION_setup`, `PRODUCTIONS_*` → **Productions/Company builder**.
- Enrollment/roster history → **Courses/Student-Records**.
- `GLOBAL_USAGE_VARIABLES` / org constants / PRODUCTIONS list → **Global Setup** (separate spine app).
