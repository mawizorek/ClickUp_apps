# ⛔ MOVED — HML_LLC documentation lives in `maw-prose` (private)

**Do not edit anything in this folder. Do not treat anything in it as current.**

Live home: **`mawizorek/maw-prose` → `apps/hml-llc/`**. Start at that package's `build-sheet.md`.

---

## Why it moved

Two reasons, and the second one is not a filing preference.

**The documentation belongs with the documentation.** `maw-prose` is the repo for authored text; this one is for code that runs, gets served, or gets loaded by an agent. A FileMaker schema is neither.

🔴 **This repo is PUBLIC and the fixture leaked a real name twice in three days.** On 2026-07-29 a payee name and a payment handle shipped in `PaymentInstructions.tsv`, copied out of a ClickUp doc. On 2026-07-31, during the migration, **the same name was found still live in `Payoffs.tsv` → `frozen_PaymentInstructionSnapshot`** — two days after the source was scrubbed, because a frozen snapshot field exists precisely so that later edits to its source do not propagate. The schema feature being demonstrated is the feature that defeated the remediation.

Both are scrubbed at HEAD. ⚠️ **The original values remain in this repo's git history and always will unless it is rewritten.** Moving the folder prevents the next leak; it does not undo these two.

## What is different over there

The machine mirrors did not travel. `schema/*.json` and every `_index.json` are retired — their content folded into the notes that replaced them, because `maw-prose` forbids a viewer and an index nobody reads drifts against the prose until one of them is wrong and you cannot tell which.

`meta/` dissolved; those files sit at package root. **Mirrored folders are the app, root files are prose about the app.**

Everything else is the same shape: `tables/`, `scripts/`, `relationships/`, `calculations/`, `functions/`, `layouts/`, `value-lists/`, `fixtures/`.

## What stays in ClickUp, permanently

**The HML_LLC FileMaker v1 Decision Log.** Not a holdout — a correctness constraint. The log runs on inverted-polarity checkboxes and in markdown `- [ ]` is inert text, so a question in a repo cannot be answered without hand-editing a file through the GitHub UI. **Do not "finish the migration" by moving it.**

## Why these folders are still here

`docs/` and `schema/` are deleted, on Michael's ruling. The rest is left in place rather than swept, because **deleting a source before its replacement is verified is how content actually gets lost** — and the verification here was reading every file during the move rather than trusting a file count.

That caution earned its keep twice in one pass. `tables.json` turned out to be the **only** home for fifteen calculation-field definitions that both table notes explicitly deferred to; retiring it first would have deleted the loan math silently. And `ReceivedFunds` — the tenth table, approved 07-29 — was **absent from `tables.json` entirely**, so the registry was already wrong before anyone decided to retire it.

Sweeping the rest is a separate call.
