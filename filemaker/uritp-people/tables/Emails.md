# Emails

**Role:** contact-child · **Status:** under-review · **App:** uritp-people

> Additional email addresses per person (one-to-many off `CONTACT_INFORMATION` via `fkCONTACT`).

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| fkCONTACT | text-uuid | fk | key | | → CONTACT_INFORMATION.PrimaryKey |
| emailAddress | text | plain | contact | | lowercase |
| label | text | plain | contact | | school / personal / work |

## Relationships

- `Emails.fkCONTACT` → `CONTACT_INFORMATION.PrimaryKey` (many-to-one, under-review)

## Open Items

- Cascade-delete behavior inherited from CONTACT_INFORMATION (temporary, see parent).
- `label` values — free text or value list?

## Changelog

- 2026-07-18: First-pass migration.
