# ⛔ MOVED — see `maw-prose` → `apps/hml-llc/build-sheet.md`

**This copy is superseded. Do not build from it.**

It is kept as a stub rather than deleted so a stale link fails loudly instead of 404ing.

Full context: [`INDEX.md`](./INDEX.md) in this folder.

---

## The one thing worth repeating here, because getting it wrong is silent

**Build the `ReceivedFunds` table BEFORE the `txn_*` rollback wrapper.**

FileMaker 19 has no native transactions. Atomicity requires every write to flow through one relationship from one parent record, so a single `Revert Record` on that parent discards the set. The receipt is that parent.

Build the wrapper first and the only candidate is `Loans` — so a check covering two loans has two parents and a revert reaches half of it, **while the routine still reports success.** That is worse than having no rollback, because you believe you were covered.
