# PhoneNumbers

**Role:** contact-child · **Status:** under-review · **App:** uritp-people

> Additional phone numbers per person (one-to-many off `CONTACT_INFORMATION` via `fkContact`).

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| fkContact | text-uuid | fk | key | pending | → CONTACT_INFORMATION.PrimaryKey. **Casing differs** from Emails.fkCONTACT — reconcile |
| phoneNumber | text | plain | contact | | |
| label | text | plain | contact | | mobile / home |

## Relationships

- `PhoneNumbers.fkContact` → `CONTACT_INFORMATION.PrimaryKey` (many-to-one, under-review)

## Open Items

- FK casing reconciliation with `Emails.fkCONTACT`.
- Cascade-delete behavior inherited from CONTACT_INFORMATION (temporary, see parent).
- `label` values — free text or value list?

## Changelog

- 2026-07-18: First-pass migration. Flagged the fkContact/fkCONTACT casing mismatch.
