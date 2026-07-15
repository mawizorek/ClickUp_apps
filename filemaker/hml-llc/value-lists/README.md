# Value Lists

Mirrors *Manage Value Lists*. Rule: **display-only labels live here**; anything with metadata (e.g. transaction types with category + cash direction) belongs in a table (`Standard_Transactions`). Machine mirror: `../schema/value-lists.json`.

## Value Lists

| Name | Source | Status | Values | Notes |
|---|---|---|---|---|
| TransactionStatus | field-based | pending | Late / Paid / Outstanding-Due / Upcoming | per status pill design; confirm exact stored values from file |
| DeliveryType | custom | pending | mailing / wire / ACH | |
| DocumentType | custom | pending | Balloon Note / Settlement Statement / Interest Payment / Check Received | drives Documents.DocumentType |

## Open Items

- Enumerate exact stored values from the FileMaker file (labels above are design-intent).

## Changelog

- 2026-07-14: Added DocumentType; noted design-intent values for the others.
