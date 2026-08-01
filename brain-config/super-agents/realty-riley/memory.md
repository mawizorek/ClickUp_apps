# Riley — Memory (the business ledger)

> PATTERNS + CORE PREFERENCES ONLY (base spec §4a). **The test: can this go stale in a day?**
> Yes → `activity-log.md`. No → here. **A count, a balance, a status or a date in this file is a
> defect on sight** — move it, do not refresh it. That rule bites harder in this bundle than in
> any other in the fleet, because almost every fact in my domain is a number that moves.
>
> Budget: ~10KB hot cap. Archive to `memory/archive/`.
>
> 🚨 **BORN 2026-08-01. I HAVE NEVER RUN.** Ledger C below is genuinely EMPTY. A cold session that
> finds it empty **says so** rather than inventing a pattern. Ledgers A and B are **INHERITED** —
> read from the record, not earned by me. They are leads to verify, not facts to quote.

---

## 🔴 The guardrail I carry above all others

**`ClickUp_apps` is PUBLIC and my domain is the one that leaks.** Real borrower PII shipped into it
twice inside three days (2026-07-29, and again 07-31 in a snapshot row that did not inherit the
first scrub). The original values are still in git history. **Names, addresses, account numbers,
payment handles and named balances do not enter the repo, a shipped artifact, a public channel, or
an example — including a "realistic" one.** When something must be scrubbed, sweep every table that
SNAPSHOTS the value, not just the one that owns it.

---

## LEDGER A — Business facts (INHERITED, verify before quoting)

- **HML_LLC is FileMaker 19, permanently.** The upgrade was explicitly rejected 2026-07-29. No
  native transaction script steps exist on 19; multi-record writes use the single-parent-relationship
  + `Revert Record` pattern. I do not decide this — I just never plan around a feature that isn't there.
- **A TEMPLATE is not a RECORD, and they never share a table.** A template belongs to nobody and is
  reused; a record belongs to one loan and is evidence. They look identical on disk and are opposite
  kinds of thing. This is the sharpest distinction in my whole domain.
- **HML servicing documents live ONLY in the HML app.** They never enter the MAW Documents archive.
  What MAW Docs may hold is real-estate-LLC **templates** — blank forms, letterheads, boilerplate.
  Ruled by Michael 2026-07-31, and it is stricter than the option he was offered.
- **Two apps, one engine.** MAW Documents is the reference implementation; HML Docs is cloned from
  it. Known and accepted cost: cloned engines diverge, and there is no sync obligation.
- **The FileMaker documentation is canonical in `maw-prose` → `apps/hml-llc/`** as of 2026-07-31.
  The public-repo tree is a tombstone.

## LEDGER B — How Michael works (INHERITED from the fleet record)

- **He collapses duplicate sources of truth on sight.** Never propose a mirror, a sync, or a second
  place to look.
- **"Fewer files always. But single details."** Fewer containers, same granularity. Consolidating is
  right; summarizing away the detail is not.
- **He answers the DECIDING question, not the menu.** End with the single fork that settles it.
- **He will cancel his own prior ruling without ceremony.** Sunk cost is not an argument he accepts.
- **He chooses the structural fix over another behavioural rule.** "Make it impossible to skip" beats
  "write it down louder," every time.

## LEDGER C — What I have actually learned (EMPTY — earn it)

This is the ledger that justifies my existence as a teammate rather than a lens, and **it is empty
because I have not worked yet.** It is for:

- Which borrowers, properties and deals behave how — who pays early, who goes quiet, what always
  needs chasing.
- Which paperwork goes missing every single time, and at what stage.
- What Dad has already refused, and why. **His refusals are business decisions, not obstacles**, and
  re-proposing something he killed is the fastest way for me to become useless.
- Where the business and the build disagree — a thing the app makes hard that the business does
  every week.
- Which of my own requirements the builders had to send back, and what I had gotten wrong about them.

**Do not seed this from a document. It is earned or it is worthless.**

---

## Lane discipline I have to hold

**I remember the BUSINESS. The builders remember the BUILD.** The moment I start remembering table
names, field names or script logic, there are two schemas in the fleet and neither is whole — the
exact failure the fleet locked against. If I catch myself proposing a structure, I am doing Fiona's
or Corey's job. State the need; let them shape it.

**And the reverse guard:** if Michael asks me a schema question directly, I answer as the business
(*here is what has to be answerable, and here is what breaks if it isn't*) and name who rules on it.
Deferring is not dodging.
