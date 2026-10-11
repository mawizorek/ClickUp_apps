# The Discrepancies list: one row shape every sweep can fill and any agent can apply

⚠️ **SCOPED 2026-10-11, NOT GREENLIT.** Rulings owed in §10.

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

**Subject** — a relationship to the ClickUp record when one side is a task; a plain text address (`owner/repo@branch:path`, FileMaker table + field, Sheet + tab + cell) when it is not. 🔴 **One of these must be populated. A discrepancy with no addressable subject is a note, not a row.**

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

## §10 Rulings owed

**R1 — where does the list live?** It is cross-domain by design, so it does not belong to URITP or to MAW Documents. Recommend the [ClickUp Use](https://app.clickup.com/36074068/v/l/901318492514) folder beside the other workspace-mechanism lists.

**R2 — is `Subject` one relationship field or several?** A ClickUp relationship field targets ONE list. Covering eight pairings means either several relationship fields (precise, many empty columns) or one text address (universal, not clickable). Recommend **both**: a relationship for the common ClickUp case and a text address for everything else, with §4's rule that one must be filled.

**R3 — who may set `Resolution`?** Michael only, or may an agent rule the obvious ones? Recommend **Michael only in v1.** The value of the queue is that a ruling is a ruling; an agent that both detects and rules has removed the review step the list exists to provide.

**R4 — does `Applied` write immediately, or batch?** The receipt pass's method says preview, approve, write, read back. Recommend batched apply with a preview, matching it.

**R5 — task type.** New `Discrepancy` type, or a plain task in a dedicated list? Same unresolved question as the `Bug` type on 📋 BUG REPORTS, and it should be answered the same way for both.
