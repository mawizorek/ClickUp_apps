---
id: report-normalization.naming
kind: hook-sidecar
parent: brain-config/hooks/report-normalization.md
version: 1
status: LOCKED
steward: Mainstage Milo
born: 2026-09-17
repo: mawizorek/ClickUp_apps@main (brain-config, PUBLIC)
---

# Rehearsal-report intake: the naming convention

**Sidecar to `report-normalization.md`.** The parent holds the sweep, the reconciliation pass, and the field mappings. This holds the one rule the parent's INTAKE PRECONDITION step needs: what a new intake task is called.

⚠️ **Why a sidecar and not a parent edit:** the parent is **18,335 B** against the ~22KB editability ceiling, and a file that cannot be read whole cannot be safely edited. Same split precedent as `morning-briefing.orientation.md`.

---

## 🔴 THE CONVENTION IS LOCKED: `[XX] | reports |`

Ruled by Michael 2026-09-17: *"the Big Love version is the one I want to go with moving forward."*

Every NEW intake task uses that shape, with the show's own abbreviation. Pipes with single spaces inside, lowercase word, square-bracketed abbreviation. `[BC] | reports |`, `[TS] | reports |`, `[TIME] | reports |`.

### The three forms that existed when the rule was made

| Form | Show | Status |
|---|---|---|
| `[BL] \| reports \|` | Big Love (F26) | ✅ **CANONICAL** |
| `ONE ACTS 2026 [ REPORTS ]` | One Acts | 🪦 retired form |
| `CHR [ REPORTS ]` | The Christians | 🪦 retired form |

🚫 **Do not rename the two retired ones.** Both are closed/library records of finished shows. Renaming history to satisfy a new rule destroys the provenance the rule exists to protect. **The convention governs what gets CREATED, never what already happened.**

---

## ⭐ Why a convention at all, when a tree-walk finds any spelling

This is the part worth reading, because it generalises well past naming.

**An agent that reads the whole hierarchy on every run never needed the pattern.** It finds `ONE ACTS 2026 [ REPORTS ]` and `[BL] | reports |` with equal ease, reports both as present, and moves on. So nothing ever enforced a convention, nothing ever complained, and **three spellings accumulated silently across three years of productions.**

🔥 **The generalised lesson: conventions rot silently wherever the only consumer is tireless.** A human reader hits friction on the second spelling and asks a question. A machine reader absorbs unlimited inconsistency without ever generating a signal. **Absence of complaint from an automated consumer is not evidence of consistency.**

**So the convention is not for the agent. It is for the person who inherits this.** Michael's own framing, same session: the current system works because he has access to things where he needs them, but it *"does not seem like it is the most patternable for a new person to pick up."* A new stage manager or PA needs ONE shape to look for, not three plus a tree-walk.

---

## Pair it with the index, or the convention rots too

A naming rule written in a repo is invisible to the stage manager who needs it. **The lookup has to live where the work is:**

- The **[List Index](https://app.clickup.com/36074068/v/li/901327881037)** row for each Paperwork list names its intake task in the `Purpose` field. "Where do reports land for this show" becomes one read instead of a hunt.
- This is the same **rung-1 lookup** the Task-Context Orientation Gate already uses, so it adds no new surface. ♻️ No new registry, no parallel tracker.

⚠️ **A convention with no index entry is a convention only its author knows.** Both halves ship together or neither does.

---

## Applies to

The parent's INTAKE PRECONDITION step, which as of 2026-09-17 names **four productions with no intake surface**: Becoming Curious (F26), T.I.M.E. (F26-S27), The Secretary (S27), Songs for a New World. Becoming Curious rehearses from **Sep 22** and is therefore first.

🚫 **Neither this sidecar nor the parent creates the intake task.** It needs an email-forwarding address confirmed against the sending account, which is Michael's setup step. The hook supplies the name, the destination list, and the deadline.

---

## Known limits

- **Generalised from one canonical example.** `[BL] | reports |` is the only live instance of this convention; the abbreviation style for shows without an obvious two-letter form (Songs for a New World, One Acts) has not been ruled on. Ask rather than invent a fourth spelling.
- The convention cannot enforce itself. Nothing in ClickUp validates a task name, so a future intake task created outside this hook can still drift.

---

## Provenance

Born 2026-09-17 during a live `/milo` morning wakeup, one turn after `report-normalization` v1.1 shipped the nightly sweep. The sweep's intake-precondition finding surfaced that four shows had no intake task; enumerating the three that did exposed three different spellings, which produced the ruling.

⚠️ **Related stale document:** `reports-intake.next-build-spec.md` (2026-09-14) **pre-dates the live hook by one day** and its "Session state" section still asserts that no report-intake runtime hook exists and that no report or note has been created or linked. Both stopped being true on 09-15. **Its form-mapping tables and open-decision list remain useful; its status claims do not.** Read `report-normalization.md` for what ships and that file for what was scoped.
