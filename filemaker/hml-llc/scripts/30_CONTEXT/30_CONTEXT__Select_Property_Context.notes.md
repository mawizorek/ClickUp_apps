# 30_CONTEXT__Select_Property_Context — notes

**STATE: GOLDEN.** Rewritten 2026-06-18 to kill the old `loan == property` assumption. Everything else in the file depends on this resolving correctly.

Copy text: [`30_CONTEXT__Select_Property_Context.fmscript`](./30_CONTEXT__Select_Property_Context.fmscript)

---

## The one thing it exists to prevent

**Silently choosing the wrong loan.** A property can carry several loans — fixture `PROP-001` has two — so when the caller does not say which, this script must resolve unambiguously or refuse. It must never pick one to be helpful.

The four `resolution` values are the whole contract:

| Value | Means | `g_fkCurrentLoan` |
|---|---|---|
| `explicit` | caller passed the loan | that loan |
| `single` | exactly one active loan found | that loan |
| `none` | no active loan (paid-off collateral) | **empty** |
| `ambiguous` | several active loans | **empty** |

**An empty global is honest. A wrong one is a payment posted to the wrong note.**

## OPEN — the ambiguous branch has no chooser behind it

The original contract said "route to a controlled chooser path." That chooser does not exist. Until it does, this script returns `resolution:"ambiguous"` with the loan global empty, and **the hub must handle an empty loan context** rather than assuming one is set.

That is deliberate, not a shortcut: a hub that renders blank on an ambiguous property is fixable. A hub that quietly lands on loan A while you think you are looking at loan B is not.

## Preferred call path

If the selector row already knows both property and loan, **pass both.** That skips resolution entirely and is what the live hub should do. Resolution exists for startup restore and the property picker, not for the common case.

## Guard rails

- Exit safely if no property is passed
- **NEVER** set `g_fkCurrentLoan` equal to the property PK — that was the original bug
- Clear stale row-selection globals, or a tab can show the previous loan's row against the new loan

## Why it stays thin

Context resolution only. No document capture, no payoff generation, no schedule work. It is `buildOrder` 4 (right after the `txn_*` trio) precisely because everything downstream reads what it writes, and a fat context script makes every screen unpredictable.

## Fixture expectation — `fixtures/golden-month`

- `PROP-001` has `LOAN-001` (Active) and `LOAN-003` (Paid Off) → exactly one active → `resolution:"single"`, loan = `LOAN-001`.
- `PROP-002` has `LOAN-002` only → `resolution:"single"`.
- ⚠️ **Nothing in the fixture currently produces `ambiguous`.** To exercise the branch that matters most, flip `LOAN-003` to Active and confirm the hub survives an empty loan context instead of silently landing on one of them.

## History

- **2026-06-18** — rewritten loan-aware; `loanID` became an optional explicit param.
- **2026-07-29** — ported from ClickUp into a real body; the ambiguous-return contract made explicit so callers cannot mistake empty for resolved.
- **2026-07-29 (later)** — body stripped to pure copy text; this sidecar created.
