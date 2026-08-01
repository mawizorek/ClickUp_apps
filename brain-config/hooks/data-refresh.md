---
slug: data-refresh
display_name: Data Refresh — Triage Door
type: runbook
status: active
trigger: "/data-refresh · /refresh (TRIAGE) · /refresh run (execute everything DUE) · /refresh run -<routine> (execute DUE minus an exclusion) · /refresh run <routine> [<routine>] (execute a named set) · \"run the refresh\" · \"what needs refreshing\" · a bare `Ricky` (his default_runbook → TRIAGE) · or pointing any session at this file and saying \"run this process\""
steward: routine-ricky
version: 3.3
added: 2026-07-26
---

# Data Refresh — Triage Door

> ## 🚨 THIS FILE IS A DOOR, NOT A FRAMEWORK
>
> **The routines framework is `routines/` in this repo. It has existed since 2026-07-05 and it is canonical.**
>
> - **Procedure** → `routines/<name>.md` (the runbooks)
> - **Cadence / the WHEN** → `routines/schedule.md`
> - **Timestamps / state** → `routines/last-run/<routine>.txt`, one file per routine
> - **Universal refresh rules** → `routines/README.md` (Data-Refresh Discipline, THE STAMP LAW, Run reports)
> - **Where a finished run gets RECORDED** → 🧭 **STANDING · Routine Ricky — Run Reports** · https://app.clickup.com/t/86ajuhw1d *(that task is the record surface — the TEMPLATE for what goes in it is procedure and lives right here)*
>
> This file contains **none** of those and must never grow them back. It holds exactly three things: **what an INVOCATION does** — read that framework, do the arithmetic, and propose — **the invocation syntax**, and **the two output templates** (the triage proposal, and the run report). Everything else is a pointer.

## What v3 deleted, and why (read before adding anything here)

v1–v2 of this file carried its own poll registry, its own `cadence` column, its own state file (`brain-config/data-refresh-log.json`), and a three-stage "earn auto-run" graduation ladder. **All four duplicated `routines/`, and two of them actively regressed it:**

- **The shared log reintroduced a fixed bug.** One file with a row per routine is the exact shape that caused the 2026-07-05 stamp race (a later stamp reverted a sibling's off a stale snapshot). `routines/last-run/*.txt` was locked to prevent it. **The log has been deleted; it was never used.**
- **The graduation ladder was a demotion.** `routines/README.md` risk tiers already granted data-only refreshes auto-commit. The ladder invented a permission ceremony for authority the routines already had.
- **The registry shipped empty**, so triage reported "nothing registered" while three real routines with real stamps sat one directory over.

**The lesson, generalized:** the search was scoped to `brain-config/` and the silence there was read as proof nothing existed. **Before building state or scheduling machinery, read `routines/`.**

---

# 🎛️ Invocation syntax

**Two modes: TRIAGE (read-only, proposes) and RUN (executes). Everything below is one of those two.**

| You say | What happens |
|---|---|
| bare `Ricky` · `/refresh` · `/data-refresh` · "what needs refreshing" | **TRIAGE.** Compute what's due, propose, stop. Read-only. |
| point any session at this file, "run this process" | **TRIAGE**, identically. Door 3 must never differ from door 1. |
| `/refresh run` · `Ricky, run the due list` | **RUN everything currently DUE.** Triage first (silently), then execute the whole due list in complete loops. |
| `/refresh run -<routine>` · `/refresh run -job-market` | **RUN everything DUE, MINUS the excluded routine(s).** Stack exclusions: `/refresh run -job-market -f1`. |
| `/refresh run <routine> [<routine>…]` · `Ricky, run on-track` | **RUN exactly the named routine(s)**, due or not. An explicit name overrides the due-math. |

**Rules that apply to every RUN form:**

- **RUN still triages first.** It has to: another agent may have run and stamped something since. It just doesn't stop to ask.
- **An excluded routine is REPORTED, never hidden.** It goes on the `Left standing:` line of the run report with the reason `excluded by invocation`. Silently dropping it would make the next triage's arithmetic look like coverage it never had.
- **An exclusion is for THIS invocation only.** It is not a pause, not a mode, and it never touches `schedule.md`. **Turning a routine OFF is a schedule-table edit and nothing else** (LOCKED 2026-07-30). If you find yourself excluding the same routine every single time, that is a cadence conversation with Michael, not a habit to keep typing.
- **A named routine that is RETIRED does not run** even if you name it explicitly. Revival is Michael's call.
- **A named routine with no runbook does not run.** Say so; never improvise a pull.
- **Exclusions never apply to the stamp or the report.** Everything that DID run stamps and reports normally.

> **Why the exclusion syntax exists (2026-08-01):** Job Market is daily and therefore reads as due on almost every invocation, so "run the set but not that one" is the common case, not an edge case. Before this, the only way to express it was to triage and then reply in prose. That worked, but it made the fast path a two-turn conversation.

---

# 🔍 TRIAGE — what a bare `Ricky` does (LOCKED 2026-07-26, Michael)

> Michael: *"review what needs to be refreshed and propose a refresh. For now, just say 'here's what needs to happen — proceed?'"*

**An invocation does NOT run routines. It reads state, does arithmetic, and asks.** Four steps:

1. **READ `routines/schedule.md`** (blob API, fresh — never a carried copy) for the routine table and the due-math rules. Then read each ACTIVE routine's `routines/last-run/<routine>.txt`.
2. **COMPUTE what is due**, using the rules in `schedule.md` — do not re-derive them here. Cases worth naming because they are the ones that get faked:
   - **`never`** = NEVER RUN. Report it as that, **never** as a giant overdue interval. Rendering an unset stamp as arithmetic is lying with numbers.
   - **A stamp you could not READ is not `never` either** — say "unknown." *(A renderer conflated those two for three weeks; do not repeat it in prose.)*
   - **Retired** routines are never proposed and never counted as a gap.
   - **Session-aware routines** (F1) are *eligible*, not *due* — the runbook decides. Say "eligible, runbook will check," not "due."
   - ⚠️ **Never decide a routine is on or off by reading its own frontmatter.** `schedule.md`'s table is the only switch (LOCKED 2026-07-30). A `status:` key in a runbook header is orientation, and if it disagrees with the table it is rot to fix, not a signal to obey.
3. **PROPOSE, then stop.** One compact readout ending in a real question. **Run nothing yet.**
4. **On "go" → EXECUTE** the approved runbooks from `routines/` **in complete loops** (README rule 13), **STAMP** each one's own last-run file per THE STAMP LAW, then **post ONE run report** to the standing thread. Per `routines/README.md`, an approved run is not re-gated mid-flight.

**Why triage is the default:** there is **no scheduler** — git-teammates have no autonomous triggers, and the native agent that held the clock is gone. So a routine is only as current as the last invocation, **every invocation is potentially a catch-up**, and other agents or Michael may have run and stamped something already. Ricky's first job on waking is to find out what the world actually did, not to assume his own last run is the truth.

⚠️ **As of 2026-07-27 this triage is the ONLY staleness surface that exists.** The Routines Viewer app was deleted; there is no dashboard to fall back on and no second opinion. Michael confirmed he never opened it. **Get the arithmetic right and say the boring answer out loud.**

## Output template 1 — the TRIAGE PROPOSAL (before anything runs)

Terse. It is a decision surface, not a report.

```
🔍 REFRESH TRIAGE · <date/time>

DUE (n):
  • <routine> — last run <when> (<how overdue>) · cadence <cadence>
  • <routine> — NEVER RUN

ELIGIBLE (n):
  • <routine> — session-aware; runbook will check for new data

CURRENT (n):
  • <routine> — ran <when>, next due <when>

→ Proceed with the DUE list? (or name a subset)
```

- **Nothing due is a complete, good answer.** *"All current, nothing due. Next up: On Track on Wednesday."* Say it and stop. **Never stay silent** — silence was correct for a background sweep and is a bug for an invocation.
- **Flag catch-ups explicitly.** Overdue is the normal state now, not an alarm, but a silently-late refresh reads as a current one.
- **Never propose a routine that has no runbook in `routines/`.**
- **Triage posts NOTHING to the standing thread.** It is a conversation, not a run.

---

## Output template 2 — the RUN REPORT (after routines actually ran)

> 📌 **THE TEMPLATE IS PROCEDURE, SO IT LIVES HERE (LOCKED 2026-08-01, Michael:** *"template should live in repo as procedure notes. not clickup task scratch."***)** The ClickUp standing task is the **record surface** — the place completed runs get posted. It is not the place the format is defined, and it must never carry a second copy of this template. If the two ever disagree, **this file wins and the task is corrected.** Changing the format is a commit, deliberately: a format edited in a task description has no diff, no history, and no review.

**Where it goes: [🧭 STANDING · Routine Ricky — Run Reports](https://app.clickup.com/t/86ajuhw1d)** — one comment per invocation. Never a repo run-log file (that is the shared-file shape the stamp race forbade). Never a second task.

### The template

```
🔄 RUN REPORT · <YYYY-MM-DD HH:MM> ET · <n> routines · invoked by <who>

✅ <routine> — <one clause: what landed> · <link> · stamped <HH:MM>
✅ <routine> — <one clause> · <link> · stamped <HH:MM> · CATCH-UP (<n>d late)
⚠️ <routine> — PARTIAL: <what landed / what didn't> · <link> · stamped <HH:MM>
❌ <routine> — FAILED at step <n>: <reason> · NOT stamped, stays overdue
⏭️ <routine> — no-op, <why> (not stamped)

Left standing: <due routines not attempted, and why>
Next due: <routine> — <when>
Ledger: <source behavior / cadence honesty worth remembering>
```

### Rules for filling it in

- **One line per routine, and the glyph carries the verdict.** `✅` landed · `⚠️` partial · `❌` failed · `⏭️` legitimate no-op (F1 with no finished session). The glyph must agree with the stamp: `✅`/`⚠️` are stamped, `❌`/`⏭️` are not. **A ✅ with no stamp time is a bug in the report.**
- **Every line ends in a link to the real artifact** — the commit, the pass-summary comment, the touched task. A number with no link is a rumor.
- **The stamp time is part of the line**, because stamped and not-stamped must be visibly different: the stamp is the only input to the next triage.
- **`Left standing` is MANDATORY whenever anything due was not attempted** — including anything excluded by the invocation (`excluded by invocation`). A report that lists only what ran implies nothing else was due.
- **`Ledger` is the line that earns Ricky his memory.** Source behavior, a cadence that looks dishonest, a routine nobody reads. It feeds `super-agents/routine-ricky/memory.md`. **Empty is a fine answer; omitting the line is not.**
- **Per-routine DETAIL stays where its runbook says** (Job Market's own thread, a data commit). This is the roll-up; it links to detail rather than repeating it.
- **Keep it phone-readable.** Stacked short lines, no tables.
- **Any agent who runs a routine posts one of these** — not just Ricky.
- **No run, no comment.** Triage never posts.

## 📌 Stamping (per THE STAMP LAW in `routines/README.md`)

Whoever runs a routine writes **that routine's own file**: `routines/last-run/<routine>.txt`, one line, `YYYY-MM-DD HH:MM` ET.

- **One writer per file, always.** 🚫 **Never a shared log with a row per routine** — see `routines/schedule.md` for the incident, and for the 2026-07-26 attempt to rebuild exactly that.
- **Success and PARTIAL stamp. Failure and no-op do NOT.** <s>Stamp after any run including a failure.</s> **Corrected 2026-08-01** — the old wording here and in README rule 12 contradicted its own body and Ricky's profile. The single test: *did the product land on its target surface?* Full table in `routines/README.md`.
- **Stamp AFTER the product lands, BEFORE the report.** run → land → stamp → report.
- **A run that is not stamped did not happen**, as far as the next triage can tell, and the next agent will redo it.
- **A FAILED run leaves the stamp untouched** so it stays overdue and self-heals — and is reported in the reply and on the standing thread, not by DM.
- Any agent may run and stamp. Ricky is the steward of the framework, not its gatekeeper.

---

## 🚦 Pre-flight (EVERY routine that actually RUNS)

The full floor is **Data-Refresh Discipline** in `routines/README.md` (13 rules) — read it there, it is not restated here. `hooks/source-freshness-gate.md` is folded in as rule 10 and is **fire-always** the moment a routine fetches. **Rule 13 (complete loops) governs the shape of the whole run:** steps in order, none skipped, one routine finished and stamped before the next is started, and if you must stop, stop at a routine boundary.

*(Triage itself is arithmetic on our own files and needs no gate; it fires when a routine actually fetches.)*

## Guardrails

- **Triage NEVER auto-executes.** It proposes and waits. Ending in a question is the design. **A RUN form is not triage** — the invocation itself is the approval.
- **READ-ONLY except the stamp and the run report.** Landing a result somewhere new is a separate explicit instruction.
- **Registered routines only** — a routine is real when it has a runbook in `routines/` and a row in `schedule.md`. No improvised pulls.
- **Never assert a stale fact to complete the routine.** Incomplete and honest beats complete and wrong.
- **Never skip or compress a step to finish faster.** README rule 13. A long procedure is long on purpose.
- **An exclusion is never a switch.** One invocation only; the schedule table is the switch.
- **A screenshot from Michael outranks anything cached.** Re-verify from scratch.
- **Procedure, cadence and state all live in `routines/`.** If you are about to add any of the three to this file, you are rebuilding v2. Don't.

## Composes with

- **`routines/`** — ⭐ the canonical framework. README (discipline + stamp law + run reports), `schedule.md` (cadence + the on/off switch), the runbooks (procedure), `last-run/` (state).
- **🧭 STANDING · Routine Ricky — Run Reports** — https://app.clickup.com/t/86ajuhw1d — the RECORD surface. Format is defined above, not there.
- **`hooks/source-freshness-gate.md`** — fire-always on any fetch. Stewarded by Scout Sage.
- **`hooks/silent-fallback-law.md`** — never substitute a source and report as if the original answered.
- **`gates/agent-invocation-gate.md`** — the contract making the three doors equivalent.
- **Scout Sage** — **lane seam:** Sage RESEARCHES an open question from scratch and finds sources; a routine RE-CHECKS a known question against pinned ones. Research is per-question; a refresh is per-schedule. New sources needed → hers first, then the runbook.

## Changelog

- **v3.3 (2026-08-01) — the template moved OFF the ClickUp task and into this file, and the subset-run invocation was added.** Michael: *"template should live in repo as procedure notes. not clickup task scratch."* v3.2 had parked the full run-report template in the standing task's description with the reasoning *"so it can be tuned without a commit"* — **which is exactly the defect, not a feature:** a format with no diff, no history and no review is how a spec rots invisibly, and it also split one truth across two homes. The task is now purely the record surface. Also added the **Invocation syntax** table, including `/refresh run -<routine>` — because Job Market is daily and therefore reads as due nearly every invocation, so "the set minus that one" is the common case and previously took two turns to say.
- **v3.2 (2026-08-01) — the RUN REPORT half was missing, and the stamp rule contradicted itself.** Added Output shape 2 (run report) and pointed it at the new standing thread, because `report-to:` in two of three active runbooks named an "executor's reporting standard" that had never been written and the third named a chat channel. Corrected the stamping section: success + partial stamp, failure + no-op do not (the old "stamp including a failure" wording disagreed with its own body, with `routines/README.md`, and with Ricky's profile). Folded in README rule 13 (complete loops) and the frontmatter-is-not-a-switch rule.
- **v3.1 (2026-07-27) — swept the `routines/index.html` pointer; the Routines Viewer app was DELETED (PR #562).** It rendered `schedule.md`, so this file recommended keeping that table's shape for it — **that constraint no longer exists and the doc has been rewritten for human reading.** Michael: *"i don't need the fancy app as long as the schedule is findable and legible."* The app and this triage had converged on the same question off the same two files. **Worth carrying: the app didn't rot, the ground moved — retiring the scheduler is what made it a duplicate.** Also noted that triage is now the only staleness surface, and folded the unreadable-vs-`never` distinction into step 2.
- **v3 (2026-07-26) — FOLDED INTO `routines/`; the scheduler is gone.** Michael: *"scheduled Ricky can no longer exist since we're removing him from real CU agent."* Deleted this file's duplicate registry, `cadence` column, graduation ladder, and `brain-config/data-refresh-log.json` (deleted from the repo, never used — its single-shared-file shape reintroduced the stamp race that `routines/last-run/*.txt` was locked to prevent on 07-05). What survives is the part that was genuinely new: **invoked triage and the proposal format.** Everything else now points at `routines/`. Also folded the source-freshness gate into the universal Discipline as rule 10, added the missing stamp step to both live runbooks, and stood down the World Cup routine.
- v2 (2026-07-26) — triage became the default; added the log, cadence column, due-math, proposal format, mandatory stamp, graduation path. *(Most of it duplicated `routines/`; see v3.)*
- v1 (2026-07-26) — created alongside Routine Ricky, shipped with an empty registry.
