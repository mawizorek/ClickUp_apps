# PaymentInstructions

**Role:** source · **Status:** under-review · **App:** hml-llc

> Record-based payment instruction source (replaces the old fake-global table). Feeds payoffs.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| CreationTimestamp | timestamp | audit | audit | | |
| CreatedBy | text | audit | audit | | |
| ModificationTimestamp | timestamp | audit | audit | | |
| ModifiedBy | text | audit | audit | | |
| InstructionLabel | text | plain | detail | | |
| PayeeText | text | plain | detail | | |
| DeliveryType | text | plain | detail | | mailing/wire/ACH |
| DeliveryDetailText | text | plain | detail | | |
| SignatureReference | text | plain | detail | pending | container vs document-module reference — decision open |
| SortOrder | number | plain | detail | | |
| IsActive | number | plain | detail | | |

## Relationships

- Feeds `Payoffs.FrozenPaymentInstructions` via snapshot at issue (not an FK).

## Open Items

- Table status is under-review: confirm as the canonical record-based source.
- `SignatureReference`: container here vs reference into the document module.

## Changelog

- 2026-07-14: Migrated to per-table file (repo-native docs revamp).
