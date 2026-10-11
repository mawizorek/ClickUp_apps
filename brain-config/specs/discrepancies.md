# The Discrepancies list: one row shape every sweep can fill and any agent can apply

⚠️ **SCOPED 2026-10-11. DECISION-COMPLETE, NOT YET BUILT.** Rulings resolved in §10.

🔴 **READ THIS FIRST: the reason this is ONE list and not six is that six sweeps already produce findings and not one of them produces anything appliable.** The Doc-Rot Sweep writes prose. DOC REVIEW 001 wrote a twelve-row punch list inside a task comment. The receipt reconciliation wrote a markdown attachment. The budget-code mapper writes JSON. Every one of them ends with a human re-reading the finding and deciding what to do, which is the work the finding was supposed to remove.

---

## §1 The ask

> Michael, 2026-10-11: a generic Discrepancies list — the thing, the field, the value on each side, one field where he picks what to keep, and then any cold agent can apply the fix rotely.

## §2 ⭐ THIS WAS ALREADY DECIDED ONCE, FOR BUDGET CODES. GENERALISING IT IS THE BUILD.

The Budget Code Mapper's v6 locked decisions (2026-07-01) are this pattern in one domain, and they are the right ones:

- **A proposed value beside the canonical, never instead of it.** Derived codes write to `Proposed Schema Code`; the canonical `URITP Budget Code #` is *"set in stone, always confirm before editing."*
- **2B — the other side is REFERENCE ONLY.** The app renders fresh, *"then diffs vs `existing_code` and flags drift."* Drift is a reported fact, not an instruction.
- **4A — unmapped records import as `needs_review`:** *"visible, flagged, export-blocked."* An unresolved row cannot leave the queue by being ignored.
- **5A — overrides persist; a conflicting incoming value is flagged, never silently clobbered.**
- **`is_override` rides along** *"so hand-forced codes are visibly flagged, not laundered as derived."*
- **A durable join key** (`cu_task_id`): *"match, never duplicate on re-import."*

⚑ **Those six rules are domain-independent, and every one of them is a rule about not losing information.** The build is lifting them out of one app and giving them a row shape.

## §3 ⭐ AND THE SEPTEMBER RECEIPT RECONCILIATION SUPPLIED THE HALF THAT KILLS THE NAIVE DESIGN

A keep-A-or-keep-B dropdown cannot express two real rows from that pass:

**The headlamp date.** The PDF's charge date is September 6; the imported transaction says September 5. The recorded instruction was *"Preserve both; do not invent a posting-date explanation."* 🔴 **Neither value is wrong and nothing should be written.** Under a two-option dropdown somebody has to pick a side to clear the row, and picking a side here fabricates a fact.

**The BMI $19.33 delta.** An order confirmation for $121.50 against a $140.83 charge, with the note that *"the final invoice must explain the difference"* and the standing rule *"never explain a difference as shipping without a final invoice."* 🔴 **This row is not resolvable from either value.** It needs a third document that does not exist yet.

⚠️ **So a queue with only "keep A / keep B" does not fail by being incomplete. It fails by pressuring an operator into fake-resolving the hardest rows**, which are exactly the rows worth having a queue for. The same pass also warns that cardinality is not 1:1 (*"one receipt to multiple transactions and duplicate scans to one transaction; count money once"*).

## §4 THE ROW

Stacked, one field per line, because a ten-column table is unreadable on a phone and this list gets worked on a phone.

**Name** — generated, `<subject> · <field> · <A> ≠ <B>`. Human-scannable, never parsed.

**Subject address** — plain text, **always required**: `owner/repo@branch:path`, FileMaker table + field, list + task + field, Sheet + tab + cell. Ruled `R2`.

**Subject** — an optional ClickUp relationship, added per pairing as each one comes into use. A convenience for clicking, never the thing an agent reads to find the target.

**Field** — free text, not a dropdown. The vocabulary spans frontmatter keys, FileMaker fields, ClickUp custom fields and spreadsheet columns; an enumerated list would be wrong within a week.

**Source A** and **Source B** — each one names *where*, addressably enough to write to. ⚠️ **"one list and another" is the thing that makes a row unappliable:** a cold agent that has to re-derive which side it is writing to is exercising judgment, which is the whole thing being removed.

**Value A** and **Value B** — as observed, verbatim, including whitespace and case. Not normalised: the difference between `Public` and `public` hid a page for a day (2026-09-28, *"thats a stupid bug"*).

**Writable side** — `A` / `B` / `both` / `neither`. Some halves cannot be written: a FileMaker calculation, a repo file that needs a pull request, a university ledger. 🚫 **A row whose chosen resolution writes to an unwritable side is refused at apply time, not discovered then.**

**Detected** — date, and **Detected by** — which sweep.

**Resolution** — dropdown, six options, no default:

- `Keep A` · `Keep B` — appliable.
- `Keep new value` — appliable, with **New value** filled.
- `Accepted difference` — both sides are correct and **nothing is written**. The headlamp date. Requires **Why**.
- `Not a discrepancy` — the detector was wrong. Requires **Why**, because this is the one that improves the sweep.
- `Blocked — needs evidence` — unresolvable from either value. The BMI delta. **Why** names what is missing.

**Why** — short text. Required on the last three.

**Status** — `Open` → `Ruled` → `Applied` / `Refused` / `Closed`. 🔴 **`Applied` is what stops double-application**, and an unruled row is never applied by anything.

**Applied at** / **Applied by**, and a **read-back** of the value the target actually holds afterwards. The receipt pass's own method: *"Preview and approve write batches, use the dedicated field, then read values back."*

## §5 🔴 APPLY TIME RE-VERIFIES, AND REFUSES ON ANY CHANGE

Before writing, the agent re-reads both sides. **If either no longer holds the value recorded in `Value A` / `Value B`, the row is refused and reopened**, never applied and never merged.

⚑ **This is the lesson from `J2` on the Authoring Contract log, and it is the most expensive one in this workspace: a path can be wrong in two directions, stale or AHEAD of you.** A discrepancy that resolved itself between detection and apply gets *re-broken* by a rote apply — DOC REVIEW 001 did exactly this, flagging `REPO_PAGES/report-contact-sheet.md` as misfiled when it was the destination of a deliberate migration. **Rote application is only safe when the row carries what it saw and the apply step checks that it still sees it.**

## §6 ⭐ SUPPRESSION IS KEYED TO THE VALUES, NOT TO THE FIELD

An `Accepted difference` row becomes the detector's own skip list, keyed on **subject + field + both values**. Change either value and it **re-opens**.

🚫 Not keyed on subject + field alone, which is the obvious implementation and is wrong: accepting the September 5 / September 6 headlamp exception must not silence that field forever, because the next mismatch on it is a different fact. **The exception was about those two values, not about that field for all time.**

🚫 **Nothing is ever culled.** Applied and closed rows stay as the audit trail — the list IS the record of what was reconciled and on whose ruling.

## §7 What it covers, and this is the payoff

ClickUp ↔ ClickUp (the 63 Lab Hours submissions and seven mistyped emails) · ClickUp ↔ FileMaker (budget codes, per §2) · ClickUp ↔ repo frontmatter (`doc-render-engine/specs/clickup-mirror.md`'s drift refusals, which currently die as a report line) · repo ↔ repo (all nine DOC REVIEW 001 findings; the `theme` three-way would have been one row that resolved to `Not a discrepancy` once somebody read `pagetheme.py`) · doc claim ↔ HEAD (Doc-Rot Sweep) · 🤖 Agent Index ↔ repo config (Fleet-Fact Sweep) · ClickUp ↔ the box-office Google Sheet · duplicates inside one list (playbill-name normalisation, 236 edits).

⚠️ **Eight pairings, six existing sweeps, and today every one of them emits a different shape.** One row shape makes all of them rote.

## §8 Detection stays with the sweeps

🚫 **This list does not detect anything.** Each sweep keeps its own comparison logic and gains one output: rows. A detector living here would be a second claimant on every sweep's rules, which is the defect that retired `roster.json`, `registry.json` and `app-index.md`.

## §9 Out of v1

Auto-apply of any kind · bulk resolution across rows · a detector · three-sided discrepancies · cardinality beyond 1:1 (a one-to-many row is split by the sweep, and §3 says why that matters for money) · writing to any side marked unwritable · a second list per domain.

## §10 Rulings, RESOLVED 2026-10-11

⚠️ **Ruled by Brain on Michael's explicit delegation** (*"Resolve the questions."*, 2026-10-11 17:31 ET). Each states its reasoning so he can reverse any of them in a line.

### R1 — ✅ It lives in the **ClickUp Use** folder, MAW Documents.

Beside the other workspace-mechanism lists (🟢 Agent Activity Board, List Index). **The placement test is ownership, not convenience:** this list is cross-domain by construction — URITP money, FileMaker fields, repo frontmatter and agent config all land in it — so filing it under URITP or BETA BUDGET would make one domain the apparent owner of a mechanism that serves eight. `ClickUp Use` is the folder that already means *"how this workspace works"* rather than *"what this workspace is about."*

### R2 — ✅ One REQUIRED text address, plus relationship fields added LAZILY, one per pairing, as each comes into use.

The constraint doing the work: a ClickUp relationship field targets exactly one list, so covering eight pairings means eight fields — and on any given row seven of them are empty. 🚫 **Pre-building eight columns to hold mostly nothing is how a list becomes unworkable on a phone**, which is where this one gets worked.

⭐ **So the text address is the contract and the relationship is the courtesy.** The address is always filled and is the only thing an agent reads to find a target; a relationship gets added for a pairing once that pairing has real rows, purely so a human can tap through. That also keeps the ClickUp↔FileMaker and ClickUp↔Sheet pairings first-class rather than second-class, since neither of them can ever have a relationship field at all.

### R3 — ✅ Michael sets `Resolution`. ⭐ ONE carve-out: a detector may set `Not a discrepancy` on its OWN row, inside the same run.

Holding the line, and the reason is structural rather than cautious: **an agent that both detects and rules has deleted the review step the list exists to provide.** The queue's entire value is that a ruling is a ruling — a row marked `Keep B` means somebody with authority looked. Let an agent rule the easy ones and every row becomes *probably* ruled, which is worth less than an unruled row because it looks finished.

⚠️ **The carve-out is narrow on purpose, and it is not a ruling at all — it is a RETRACTION.** A sweep that finds a mismatch, reads one more file and discovers it was wrong should close its own finding in the same run rather than filing a row for Michael to reject. That is the self-correction this workspace already values; DOC REVIEW 001's `REPO_PAGES` reversal is the exact shape. 🚫 It applies only to the agent's own row, only in the run that created it, and only to `Not a discrepancy`. The moment a row survives into the queue, it is Michael's.

### R4 — ✅ Batched apply with a preview. The preview SEPARATES will-apply from will-be-refused.

Matches the receipt pass's own ratified method: preview, approve, write, read back. Single-row apply would mean forty approvals for a forty-row sweep, which is how a queue stops getting worked — and an unworked queue is worse than no queue, because the findings are now *filed* rather than *visible*.

⚠️ **The separation in the preview is the part that is easy to skip and should not be.** §5's re-verification means some ruled rows will refuse at apply time through nobody's fault. If those surface mid-batch they read as a broken tool; surfaced in the preview, before approval, they read as what they are — rows whose world moved and which need a fresh look.

### R5 — 🚫 NO `Discrepancy` task type in v1. A plain task in a dedicated list.

A task type earns its existence by appearing across **many** lists — that is what makes a type worth more than a list's own shape. Discrepancies only ever live in this one list, so here **the list IS the type**, and a type would add a second place stating one fact.

🔴 **And the second reason is the one that actually decides it: the `Bug` task type on 📋 BUG REPORTS is still an open question, and creating a near-identical type here would settle it by side effect.** Bug reports have a genuine case a discrepancy does not — they get filed from everywhere — so the two questions have different answers and must not be collapsed into one precedent set quietly, by whichever build happens to land first. ⚠️ When `Bug` is ruled, revisit this; until then the refusal keeps that question clean.

## §11 Still owed, and these are not rulings

🚩 **`brain-config/specs/` has no index.** Three specs now live there with nothing listing them. `brain-config/next-build-spec.md` is NOT it — that file is the viewer app's cycle spec, and adding a spec table to it would make it a second claimant on something it does not own. Either a real index file or nothing, consciously.
