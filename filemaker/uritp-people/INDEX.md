# URITP People — Object Index (rendering manifest)

_The navigable map of every documented object. Mirrors the FileMaker solution. Human entry point; the viewer reads the `_index.json` in each folder._

## Tables (`tables/`)

| Table | Role | Status |
|---|---|---|
| [PEOPLE](./tables/PEOPLE.md) | identity-hub | under-review |
| [STUDENTS_ext](./tables/STUDENTS_ext.md) | role-extension | under-review |
| [ADULTS_ext](./tables/ADULTS_ext.md) | role-extension | pending |
| [CONTACT_INFORMATION](./tables/CONTACT_INFORMATION.md) | contact | under-review |
| [Emails](./tables/Emails.md) | contact-child | under-review |
| [PhoneNumbers](./tables/PhoneNumbers.md) | contact-child | under-review |
| [GRADUATION_CLASSES](./tables/GRADUATION_CLASSES.md) | value-source | under-review |

> **Deliberately NOT here (graduated to spokes per hub-and-spoke):** production-role joins (→ Productions builder), employees/job postings (→ Labour), enrollments (→ Courses), org constants + PRODUCTIONS (→ Global Setup). The as-built file carried some of these; they leave People to keep the hub lean.

## Relationships (`relationships/`)

Hub-and-spoke, People-internal edges only. See [relationships/README.md](./relationships/README.md) + `schema/relationships.json`.

## Scripts (`scripts/`)

Pending enumeration from the live file (import, batch-create, chooser). Not scaffolded this pass.

## Layouts (`layouts/`)

Stubbed this pass (schema-first). A (ALL PEOPLE) + B (STUDENTS) built in file; C (ADULTS) designed. See [layouts/README.md](./layouts/README.md).

## Meta / narrative (`meta/`)

- [design-decisions](./meta/design-decisions.md) — hub-and-spoke ruling + the naming-drift audit ledger
- verification.json — D-007 object audit ledger (empty = honest unverified baseline)
