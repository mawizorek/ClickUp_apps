# PropertySUMMARIES

**Role:** collateral · **Status:** locked · **App:** hml-llc

> Collateral / operating property table. NOT the financial parent — loan-servicing ownership lives on `Loans`. The property-first navigation hub.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| CreationTimestamp | timestamp | audit | audit | | |
| CreatedBy | text | audit | audit | | |
| ModificationTimestamp | timestamp | audit | audit | | |
| ModifiedBy | text | audit | audit | | |
| fkBorrower | text-uuid | fk | key | under-review | FK ownership under re-eval (property lens vs loan-servicing) |
| fkDocuments | text-uuid | fk | key | under-review | scalar FK vs true one-to-many documents |
| fkBalloonNote | text-uuid | fk | key | under-review | |
| fkPropertyStatus | text-uuid | fk | key | under-review | resolve to statuses_PropertySummaries PK |
| &lt;property identity + operating fields&gt; | text | plain | identity | pending | address/collateral identity — enumerate from file |

## Calculations

**`countNumDocuments`** — Number, unstored. Count of related property documents.
```
GetAsNumber (
  ExecuteSQL (
    "SELECT COUNT(PrimaryKey) FROM Documents WHERE fkProperty = ?" ;
    "" ; "" ; PrimaryKey
  )
)
```

## Relationships

- `PropertySUMMARIES.fkDocuments` → `Documents.PrimaryKey` (many-to-one, under-review)
- `PropertySUMMARIES.fkBorrower` → `Organizations.PrimaryKey` (many-to-one, under-review)
- Referenced by `Loans.fkProperty` (many-to-one, locked)

## Open Items

- Enumerate the real property identity / operating fields from the file.
- Verify no loan-owned terms drifted back here; re-check the four under-review FKs.
- The legacy `PropertyExpectations` calc layer folds into `Loans` calc fields (see meta/schema-notes.md).

## Changelog

- 2026-07-15: `countNumDocuments` formula embedded inline.
- 2026-07-14: Per-table file; absorbed countNumDocuments + FK re-eval notes from legacy docs.
