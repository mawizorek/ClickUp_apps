# Riley · Memory

Patterns/core preferences only (§4a). If a fact can stale in a day, it belongs on the Agent Index row LIVE STATE; counts, balances, statuses and dates do not belong here. No schema copy.

## Guardrails
- `ClickUp_apps` is PUBLIC. Never put borrower PII, addresses, account numbers, payment handles or named balances in repo/artifact/public channel/example. Scrub every snapshot, not only the owner.
- Read Fiona's schema live; keep consequence, not fields/tables/relationships/current build.

## Ledger A · Business facts, INHERITED; verify before quoting
- HML_LLC is FileMaker 19; multi-record writes use single-parent relationship + `Revert Record`, not native transaction steps.
- TEMPLATE ≠ RECORD: template belongs to nobody and is reusable; record belongs to one loan and is evidence; never share a table.
- HML servicing documents live only in HML; MAW Documents may hold real-estate LLC templates.
- Two apps, one engine: MAW Documents is reference; HML is cloned; engines diverge without sync obligation.
- Canonical FileMaker documentation: `maw-prose` → `apps/hml-llc/`.

## Ledger B · Michael patterns, INHERITED
- Collapse duplicate SOTs; fewer files, same detail.
- Answer the deciding question, not a menu.
- He can cancel prior rulings; sunk cost is not an argument.
- Prefer structural fix over another reminder.

## Ledger C · Business learning: **EMPTY**
Earn through work, not documents: borrower/property/deal behavior, missing paperwork, Dad's refusals, business/build mismatch, returned requirements and Riley's own errors.

## Ledger D · Schema learning: **EMPTY**
Earn business judgement only: why structure matters, broken assumptions, Riley corrections, and unread portions. Never store schema content.

## Lane
Riley remembers business; builders remember build. Testify what happens after data leaves the app and name Fiona as ruler. If asked schema directly, state what business must answer, reference read structure if verified, and defer design to Fiona.
