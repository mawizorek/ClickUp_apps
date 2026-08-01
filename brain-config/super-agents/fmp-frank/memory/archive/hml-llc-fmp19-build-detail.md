# ARCHIVE — HML_LLC / FMP19 build detail (rotated out of `memory.md` 2026-08-01)

> Rotated by **Memory Maggie** during the first `hooks/native-flush-consolidation.md` drain, to bring
> Fiona's hot `memory.md` back under its ~10KB cap. **Nothing here was dropped** — the hot file keeps a
> four-line summary plus a pointer to this page. Canonical decisions for this build live in the
> **HML_LLC FileMaker v1 — Decision Log** + the build-task descriptor; this is Fiona's own working
> precedent, not a second copy of that log.
>
> Rotation heuristic (EARNED 07-25): *is this resolved, encoded elsewhere, or replaceable by a pointer?*
> One YES graduates it. This block is project-scoped detail for a build that is now underway — hot
> memory holds generalizations, not the build's own working notes.

---

## Schema shape (locked June 2026)

NOT a URITP module — private-lending servicing for Michael's dad. `Loans` is the true financial
parent. `PropertySUMMARIES` is demoted to the collateral lens. The ledger tables
(`ExpectedTransactions`, `AccountTransactions`, `PaymentApplications`, `Payoffs`) hang off `Loans`.
`PrimaryKey` UUID everywhere; `fk*` / `calc_` / `g_` prefixes enforced.

## FileMaker 19, permanently

Upgrading was explicitly rejected 2026-07-29. Every technique below is constrained by that.

## 🔴 FMP19 has no native transactions

`Open Transaction` / `Commit Transaction` / `Revert Transaction` are **FileMaker 2023 (v20)** script
steps — verified against the Claris 20.1.2 release notes and the MBS step-by-version table. They do
not exist in 19.

**Atomicity pattern on 19:**

- All writes go through **ONE relationship from a single parent record**, so a single `Revert Record`
  discards the entire set.
- `Set Error Capture [On]` at the top of the block.
- Check `Get(LastError)` after **every** write step. Not the last one — every one.
- **No `Commit Records` inside the block.** This is the usual silent break: a stray commit ends the
  window and the revert no longer undoes anything.
- Wrapped once as `txn_*` scripts. ⚠️ Those names imply an engine transaction that does not exist —
  **say so in the script comments**, or the next reader trusts a guarantee the runtime never made.
- Rollback + error catching **throughout** is a requirement, not a preference.

## What must be atomic

- One `AccountTransactions` row applied across N `ExpectedTransactions`. Half-applied = corrupt money
  data.
- The `Payoffs` snapshot freeze. A partial freeze = a payoff quote that changes after it was sent.

## Shape of v1

Internal instrument for Michael, scoped to the screens that carry a month.

- Ledgers go **table view** — a REAL user surface here, because the column set and the conditional
  formatting ARE the UI.
- Loan and Property hubs stay **layouts**, being parent-with-children (table view cannot do that).
- **No portal on Payoffs.**

## Related pending standard

`tbl_*` (table-view column vocabulary) was proposed 07-29 out of this build and is still PENDING in the
object library → HML_LLC DL Q7. That ruling stays HOT in `memory.md` because it is unresolved.
