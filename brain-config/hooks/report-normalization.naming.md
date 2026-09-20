---
id: report-normalization.naming
kind: hook-sidecar
parent: brain-config/hooks/report-normalization.md
version: 2
status: LOCKED
steward: Mainstage Milo
born: 2026-09-17
repo: mawizorek/ClickUp_apps@main (brain-config, PUBLIC)
---

# Rehearsal-report intake: naming + surface precedence

**Sidecar to `report-normalization.md`.** The parent holds the sweep, the reconciliation pass, and the field mappings. This holds what the parent's INTAKE PRECONDITION step needs (what an intake task is called), what the machine-written report rows get renamed to, and **which surface wins when two disagree.**

⚠️ **Why a sidecar and not a parent edit:** the parent is **18,335 B** against the ~22KB editability ceiling, and the GitHub MCP write is full-file-replace. Retyping 18KB to change one bullet is how silent drift gets introduced, which is the exact defect class this file now governs. Same split precedent as `morning-briefing.orientation.md`.

---

## 🔴 SURFACE PRECEDENCE — the law, and it OVERRIDES the parent

Michael, 2026-09-20, verbatim: *"never allow yourself to only parse one surface if you know multiple exist to xref."*

**When a report exists on more than one surface, read ALL of them, then name which one wins.**

The ladder for a rehearsal report, most authoritative first:

1. 📄 **The PDF attachment** (`NN. Rehearsal Report M_D_YY - Sheet1.pdf`). This is the stage manager's actual document, generated from her sheet. It carries the full header block: `date:` · `start:` · `end:` · `actors:` · `management:` · `production:`.
2. ✉️ **The pasted email body** in the comment. A **degraded copy** — the paste routinely drops the header block, mangles the two-column timing table, and loses checkbox state.
3. 🌐 **The `original_email_*.html` attachment.** Same content as (2) with markup; useful only when the paste is truncated mid-sentence.

🔴 **STRIKES THE PARENT'S KNOWN-LIMITS BULLET.** The parent currently reads: *"Cannot read PDF attachments on the `| reports |` task reliably (the email comment text is the working source, not the PDF)."* ~~That bullet is FALSE~~ and it is not merely stale — it is **load-bearing rot**, because it instructs a session not to open the authoritative surface. Newer lock plus live evidence wins (doc-rot-sweep precedent). ⚠️ **The parent still carries the dead bullet; the strike lives here until the parent is next rewritten whole.** A session reading the parent alone will be misled, which is why this file is named in the parent's own sidecar line.

### The failure it was born from, recorded so it is not re-derived

2026-09-20, morning wakeup. Bia's Sep 19 report was normalized from the pasted email body alone. That paste had no header block, so the three attendance fields were written as EMPTY and the brief reported *"no `date:/actors:/start:/end:` header, so all three attendance fields are empty by decision, not by oversight."*

**The decision was real and it was wrong.** `20. Rehearsal Report 9_19_26 - Sheet1.pdf` was attached to the same comment and carried every missing value. Michael caught it in one turn.

⭐ **Why this one is worth a law rather than a correction: the session did not fail to LOOK. It looked, found one surface, and was told by our own documentation that the other surface was unreadable.** An honest-sounding "empty by decision" is more dangerous than a blank field, because a blank invites a second look and a stated decision closes the question.

🔥 **GENERALIZES past reports, past URITP, past this hook.** Whenever two surfaces carry the same fact: read both, state which won, state why. Never let a documented limitation stand in for a test — **a limit claim in our own docs is a claim, not evidence**, exactly like a doc's description of a DDR is a claim about the file. Same family as `ddr-reconcile.md`'s core rule and the `silent-fallback-law.md`.

⚠️ **Report the conflict, never silently reconcile it.** Live example from the same report: the PDF spells a stage manager "Pricilla"; prior rows in the list spell her "Priscilla." Normalizing to match the list is correct AND it gets stated, because a silent spelling fix teaches the stage manager nothing and hides a roster question.

---

## 🔴 REPORT ROW NAMES — normalize every wake, forever

Michael, 2026-09-20: *"need to clean REPORT template names to cull the annoying AMERICA NY timestamp that CU inputs... the automation is not possible to fix, it's a thing in CU so you just clean them up as part of your wake."*

**LOCKED FORMAT:**

```
{<Production> (<Season>)}{Rehearsal Report}{YYYY-MM-DD H:MMAM}
```

Example: `{Big Love (F26)}{Rehearsal Report}{2026-09-19 11:30AM}`

**Two defects are being fixed, not one:**

1. **The timezone suffix.** ClickUp appends ` (America/New_York)` to every machine-created row. Strip it entirely.
2. **The date is not sortable.** `Sep 19 2026` sorts alphabetically as Apr → Aug → Dec. **This is the real parsability problem** and stripping the timezone alone does not solve it. Convert to `YYYY-MM-DD`, keep the clock time as written.

🔴 **THIS IS A RECURRING STEP, NOT A CLEANUP.** The name is written by a ClickUp automation at creation and **that automation cannot be changed** (Michael's ruling; no agent can read or edit ClickUp automations either). So every new report arrives dirty. **Normalize in the same pass that normalizes the fields** — if the pass creates or touches a report row, it renames it before reporting.

🚫 **Never rename a row whose name carries no timestamp.** Two such rows exist; they are not malformed, they were created by a different path. Leave them.

⚠️ **Watch for the missing-word defect separately.** One row read `{Big Love (F26)}{ Report}` — the words "Rehearsal" absent with the space retained. That is a different bug from the timestamp and a pure timezone strip would have preserved it. **Check the middle segment too.**

📐 First full pass: 2026-09-20, 20 rows targeted, 18 renamed, 2 correctly untouched.

---

## 🔴 INTAKE TASK NAME IS LOCKED: `[XX] | reports |`

Ruled by Michael 2026-09-17: *"the Big Love version is the one I want to go with moving forward."*

Every NEW intake task uses that shape, with the show's own abbreviation. Pipes with single spaces inside, lowercase word, square-bracketed abbreviation. `[BC] | reports |`, `[TS] | reports |`, `[TIME] | reports |`.

### The three forms that existed when the rule was made

| Form | Show | Status |
|---|---|---|
| `[BL] \| reports \|` | Big Love (F26) | ✅ **CANONICAL** |
| `ONE ACTS 2026 [ REPORTS ]` | One Acts | 🪦 retired form |
| `CHR [ REPORTS ]` | The Christians | 🪦 retired form |

🚫 **Do not rename the two retired ones.** Both are closed/library records of finished shows. Renaming history to satisfy a new rule destroys the provenance the rule exists to protect. **The convention governs what gets CREATED, never what already happened.**

⚠️ **Note the deliberate asymmetry with the section above.** Report ROW names get normalized retroactively; intake TASK names do not. The difference is authorship: a machine wrote the row names and a machine keeps writing them badly, so history there is noise. A person named the intake tasks, so history there is evidence.

---

## ⭐ Why a convention at all, when a tree-walk finds any spelling

This is the part worth reading, because it generalises well past naming.

**An agent that reads the whole hierarchy on every run never needed the pattern.** It finds `ONE ACTS 2026 [ REPORTS ]` and `[BL] | reports |` with equal ease, reports both as present, and moves on. So nothing ever enforced a convention, nothing ever complained, and **three spellings accumulated silently across three years of productions.**

🔥 **The generalised lesson: conventions rot silently wherever the only consumer is tireless.** A human reader hits friction on the second spelling and asks a question. A machine reader absorbs unlimited inconsistency without ever generating a signal. **Absence of complaint from an automated consumer is not evidence of consistency.**

**So the convention is not for the agent. It is for the person who inherits this.** Michael's own framing, same session: the current system works because he has access to things where he needs them, but it *"does not seem like it is the most patternable for a new person to pick up."* A new stage manager or PA needs ONE shape to look for, not three plus a tree-walk.

---

## Pair it with the index, or the convention rots too

A naming rule written in a repo is invisible to the stage manager who needs it. **The lookup has to live where the work is:**

- The **List Index** row for each Paperwork list names its intake task in the `Purpose` field. "Where do reports land for this show" becomes one read instead of a hunt.
- This is the same **rung-1 lookup** the Task-Context Orientation Gate already uses, so it adds no new surface. ♻️ No new registry, no parallel tracker.

⚠️ **A convention with no index entry is a convention only its author knows.** Both halves ship together or neither does.

---

## Applies to

The parent's INTAKE PRECONDITION step, which as of 2026-09-20 still names **five productions with no intake surface**: Becoming Curious (F26), T.I.M.E. (F26-S27), The Secretary (S27), Songs for a New World, and One Acts (whose task is closed). Becoming Curious rehearses from **Sep 22** and is therefore first. ⚠️ Flagged on three consecutive morning runs; the lead time is now days.

🚫 **Neither this sidecar nor the parent creates the intake task.** It needs an email-forwarding address confirmed against the sending account, which is Michael's setup step. The hook supplies the name, the destination list, and the deadline.

---

## Known limits

- **The surface ladder is generalised from ONE production.** Big Love is the only show currently forwarding reports, so the claim that the PDF always carries the header block rests on that sheet's template. **A different stage manager's sheet may invert the ladder.** Read both surfaces and say which won; do not assume the PDF wins because this file says so.
- **Generalised from one canonical intake example.** `[BL] | reports |` is the only live instance; the abbreviation style for shows without an obvious two-letter form (Songs for a New World, One Acts) has not been ruled on. Ask rather than invent a fourth spelling.
- The conventions cannot enforce themselves. Nothing in ClickUp validates a task name, so a future intake task created outside this hook can still drift, and the report-row automation will keep producing dirty names indefinitely.
- **PDF reads are not free.** A report whose PDF fails to load is a stated gap, never a silent fallback to the email body — say which surface was unavailable.

---

## Provenance

Born 2026-09-17 during a live `/milo` morning wakeup, one turn after `report-normalization` v1.1 shipped the nightly sweep. The sweep's intake-precondition finding surfaced that four shows had no intake task; enumerating the three that did exposed three different spellings, which produced the ruling.

**v2, 2026-09-20**, from a live morning wakeup carrying two rulings: **surface precedence** (born of a real miss, where the parent's own Known-limits bullet licensed skipping the authoritative PDF) and **report-row normalization as a standing wake step** (because the ClickUp automation that writes the names cannot be fixed). ⚠️ Committed **directly to main rather than branch → PR → self-merge**: no branch-creation tool was available in the session's toolset. Named rather than hidden, same call as the 2026-08-11 memory rotation.

⚠️ **Related stale document:** `reports-intake.next-build-spec.md` (2026-09-14) **pre-dates the live hook by one day** and its "Session state" section still asserts that no report-intake runtime hook exists and that no report or note has been created or linked. Both stopped being true on 09-15. **Its form-mapping tables and open-decision list remain useful; its status claims do not.** Read `report-normalization.md` for what ships and that file for what was scoped.
