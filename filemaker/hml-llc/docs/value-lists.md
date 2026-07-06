# Value Lists

> Structured source: [`../schema/value-lists.json`](../schema/value-lists.json). **PENDING** enumeration from the FileMaker file.

Known from the design system: transaction **status** (Late / Paid / Outstanding-Due / Upcoming) and **delivery type** (mailing / wire / ACH). Anything carrying metadata beyond a display label belongs in a table (`Standard_Transactions`), not a value list.
