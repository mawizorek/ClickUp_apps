# Value Lists

Mirrors *Manage Value Lists*. Rule: **display-only labels live here**; anything with metadata (e.g. transaction types with category + cash direction) belongs in a table (`Standard_Transactions`). Machine mirror: `../schema/value-lists.json`.

## Value Lists

| Name | Source | Status | Values | Notes |
|---|---|---|---|---|
| TransactionStatus | field-based | pending | (empty) | Late / Paid / Outstanding-Due / Upcoming per status pill design |
| DeliveryType | custom | pending | (empty) | mailing / wire / ACH |

## Open Items

- Enumerate real values from the FileMaker file.
