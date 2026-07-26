---
slug: data-refresh
display_name: Data Refresh Runbook
type: runbook
status: active
trigger: "/data-refresh · /refresh · \"run the refresh\" · \"what needs refreshing\" · a bare `Ricky` (his default_runbook → TRIAGE) · or pointing any session at this file and saying \"run this process\""
steward: routine-ricky
version: 2
added: 2026-07-26
---

# Data Refresh Runbook

**The fleet's first RUNBOOK — a routine that lives as its own tool, invocable three ways.** Routine Ricky STEWARDS it; he does not contain it.

> **Why this file exists separately from the agent** (`gates/agent-invocation-gate.md` → invocation-mode contract, LOCKED 2026-07-20): a routine an agent runs is a **standalone documented runbook, directly invocable on its own** — point any session at this file, say "run this process," and it executes identically to the bare-name call. The routine is NEVER baked into the persona. Super Agents are personalities; this is the dense routine the personality is a friendly door to.

## Three doors, one behavior

1. **Bare `Ricky`** → **TRIAGE** (below). Reads the log, computes what is due, **proposes**. Read-only.
2. **`Ricky, run the <name> poll`** → executes that ONE poll from the registry.
3. **Point any session at this file** → *"run this process"* behaves identically to door 1. **If door 3 ever differs from door 1, this file is wrong, not the agent.**

---

# 🔍 TRIAGE — what a bare `Ricky` actually does (LOCKED 2026-07-26, Michael)

> Michael: *"review what needs to be refreshed and propose a refresh. For now, just say 'here's what needs to happen — proceed?'"*

**A bare invocation does NOT run polls. It reads state, does arithmetic, and asks.** Four steps:

1. **READ `brain-config/data-refresh-log.json`** (blob API, fresh — never a carried copy). This is shared state, not Ricky's memory.
2. **COMPUTE what is due.** For each registered poll: `now - last_run >= cadence` → DUE. `last_run: null` → **NEVER RUN**, which is due immediately and must be reported *as* "never run," not as a giant overdue interval.
3. **PROPOSE, then stop.** One compact readout (format below) ending in a real question. **Do not run anything yet.**
4. **On "go" → EXECUTE** the approved polls, then **STAMP THE LOG** (step below). Nothing else in this file fires without that go.

**Why the default is triage and not execution:** the schedule is maintained OUTSIDE Ricky and **other agents (or Michael) may refresh a poll and stamp the log themselves.** So Ricky's first job on waking is to find out what the world already did, not to assume his own last run is the truth. **A refresh agent that trusts its own memory over the shared log will re-run work someone else already did.**

## The proposal format

Terse. It is a decision surface, not a report.

```
🔍 REFRESH TRIAGE · <date/time>

DUE (n):
  • <poll> — last run <when> (<how overdue>) · cadence <cadence>
  • <poll> — NEVER RUN

NOT DUE (n):
  • <poll> — ran <when>, next due <when>

STALE-LOG FLAGS:
  • <poll> — <e.g. last result was `incomplete`; the source may still be broken>

→ Proceed with the DUE list? (or name a subset)
```

- **Nothing due is a complete, good answer.** *"All current, nothing due. Next up: <poll> in 2 days."* Say it and stop.
- **Always show WHO last stamped it** when it was not Ricky. That is the point of a shared log — *"Mira ran the F1 poll 6 hours ago"* is exactly what stops duplicate work.
- **Never propose an unregistered poll.** Not in the registry = does not exist.

## 📌 Stamping the log (MANDATORY after any poll runs — by ANYONE)

Whoever runs a poll writes its row in `data-refresh-log.json`: `last_run` (ISO-8601), `last_run_by`, `result` (`ok` · `no-change` · `incomplete` · `failed`), an optional one-line `note`, and push onto `recent` (keep max 3).

- **A run that is not stamped did not happen**, as far as the next triage can tell — and the next agent will re-run it.
- **Stamp a FAILED run too.** `failed` with a note is far more useful than a silently missing timestamp, which is indistinguishable from "never tried."
- Any agent may stamp. Ricky is the steward of this file, not its gatekeeper.

---

## 🚦 Pre-flight (EVERY poll that actually RUNS, no exceptions)

**`hooks/source-freshness-gate.md` is FIRE-ALWAYS here.** This runbook exists to state volatile external facts — exactly the surface that gate was born from (2026-07-25, the Soleil hours error). Non-negotiables inherited from it:

- **Rank by DATED PROVENANCE, never proximity to the subject.** Owner-updated dated profile > the business's own dated page > a third party about its OWN operation > a third party reporting someone else's facts > undated aggregators (near worthless).
- **A first-party snapshot EXPIRES.** A two-year-old post by the owner is not current.
- **Agreeing aggregators are ONE source, not five.** Count ORIGINS, not rows.
- **Never assert a volatile fact without knowing the AGE of the claim.** Say "unverified" instead.
- **Confirm you matched the right ENTITY.**

*(Triage itself is arithmetic on our own log and does not need this gate — it fires the moment a poll actually fetches.)*

---

## 📋 The poll registry — CONFIG (the schedule lives here)

One row per poll. **A poll not in this table does not exist** — an unregistered poll has no vetted sources and no freshness discipline, which is precisely how the Soleil miss happened.

⚠️ **`cadence` lives HERE, timestamps live in the LOG.** Config vs state, one claimant each. Never copy cadence into the log or timestamps into this table.

| Poll | Key | Invoke | Cadence | `in_default` | Sources (dated, ranked) | Report shape | Status |
|---|---|---|---|---|---|---|---|
| _(none registered yet)_ | — | — | — | — | — | — | — |

**`in_default`** now means *"include this poll in TRIAGE's due-check"* — **not** "auto-run it." Nothing auto-runs as of v2. A poll flagged out of the default is still runnable by name; it just doesn't appear in the standing sweep.

⚠️ **With an empty registry, triage has nothing to check and says exactly that** — "no polls registered, nothing to triage." It does NOT report success for doing nothing. **That is the current state.**

### Candidate slots (Michael's own examples, Jul 20 — NOT registered)

Named so the shape is obvious and nobody re-derives the idea. **Each needs sources pinned before it becomes a row** — a Michael-or-Sage job, not a guess:

- **F1 / race weekend** — the only candidate with existing scaffolding (the **Formula 1** page in the Brain Reference Library + the `f1-racetracks` repo app). Likeliest first row. Natural cadence: race-weekend-driven rather than fixed-interval, which will be the first real test of whether `cadence` needs to express more than a duration.
- **Market data** — needs a decision on WHICH instruments, and a source with a visible timestamp.
- **Weather** — needs locations pinned; trivially date-stamped, so the freshness gate is easy here.

### To register a poll (the only way a row gets added)

1. Name it + the KEY it uses in the log. Name what standing QUESTION it answers; a poll that answers no standing question is a curiosity, not a routine.
2. Pin sources **ranked by the freshness ladder**, noting how each is dated. Undated = not a source.
3. **Set the cadence.** How stale is too stale? This is the number triage does arithmetic on, so a wrong cadence produces confidently wrong "due" claims.
4. Define the report shape — **including what "nothing changed" looks like.** A poll that can only report change will invent change.
5. Decide `in_default` (does triage watch it?).
6. Add the row **and** seed its log row with `last_run: null`. Same session, or it is not registered.

---

## Report format (when polls actually run)

One report per invocation, however many ran. Terse; a status readout, not an essay.

- **Per poll:** the finding, the SOURCE, and **the AGE of the claim.** Age is mandatory — a fact without a date is unverified by definition.
- **"No change since last run"** is complete, valid, and GOOD. Say it and move on.
- **On source disagreement:** name both, name both dates, show the tiebreaker. Never silently pick one.
- **On a dead source:** say so, mark the poll `incomplete`, and **still stamp the log.** Do not substitute another source mid-run and report as if the pinned one answered — that is the silent-fallback failure (`hooks/silent-fallback-law.md`).
- **Trend, when the log or Ricky's memory has one:** *"third run in a row this source lagged."* That is his memory earning its keep, and it belongs in the report.

## Guardrails

- **Triage NEVER auto-executes.** It proposes and waits. *(Graduating to auto-run is Michael's call — see Graduation.)*
- **READ-ONLY except the log.** This runbook fetches, reports, and stamps `data-refresh-log.json`. It does not write to tasks, docs, or app code. Landing a result somewhere is a separate explicit instruction.
- **Registered polls only.** No improvised pulls.
- **Never assert a stale fact to complete the routine.** Incomplete and honest beats complete and wrong.
- **A screenshot from Michael outranks anything cached.** Re-verify from scratch; never defend the stale source.
- **This file holds PROCEDURE; the log holds STATE; Ricky holds JUDGEMENT.** Which sources rot and what normal looks like is `super-agents/routine-ricky/memory.md`. Never write source history into this file, timestamps into his memory, or cadence into the log.

## 🎓 Graduation path (Michael, 2026-07-26: *"maybe eventually we'll graduate to just updating automatically"*)

Deliberately staged, and the stages are one-field edits — not a rewrite:

1. **NOW — propose-only.** Triage reports, Michael says go. `gate_strength: auto` on the *triage* (it is read-only), the *execution* always gated.
2. **NEXT — per-poll auto.** A specific poll earns `auto_run: true` on its registry row once it has run clean repeatedly. Triage then runs those and proposes the rest. **Earn it per poll, not fleet-wide** — a trusted weather pull says nothing about a market source.
3. **LATER — auto-sweep.** All `in_default` polls run on invocation, with a report instead of a proposal.

**The bar for each promotion is the LOG, not a feeling:** a poll graduates when its `recent` window shows clean runs and Ricky's memory carries no open source flag against it. He proposes the promotion; Michael approves.

## Composes with

- **`hooks/source-freshness-gate.md`** — fire-always pre-flight on any fetch. Stewarded by Scout Sage.
- **`hooks/silent-fallback-law.md`** — never substitute a source and report as if the original answered.
- **`gates/agent-invocation-gate.md`** — the contract making the three doors equivalent.
- **Scout Sage** (`super-agents/scout-sage/`) — **lane seam:** Sage RESEARCHES an open question from scratch and finds sources; this runbook RE-CHECKS a registered question against pinned ones. Research is per-question; a refresh is per-schedule. New sources needed → hers first, then register the row here.
- **`brain-config/data-refresh-log.json`** — the state store triage reads and every runner stamps.

## Changelog

- **v2 (2026-07-26) — TRIAGE became the default.** Michael's ruling: a bare `Ricky` reviews a timestamp log and PROPOSES what needs refreshing rather than running a fixed set. Added the log (`data-refresh-log.json`), the `cadence` column, the due-math, the proposal format, the mandatory stamp step (**any** agent may stamp — the schedule is externally maintained), and the three-stage graduation path. `in_default` re-scoped from "auto-runs" to "watched by triage." **This made the default strictly SAFER than v1** — v1's default executed fetches; v2's default is arithmetic on our own log — which is why Ricky's `gate_strength` moved `confirm` → `auto` in the same pass. Also fixed a v1 gap: v1 never said who writes down that a poll ran, so its own "no change since last run" claim had nothing to stand on.
- v1 (2026-07-26) — created alongside Routine Ricky, the fleet's first runbook-agent. Shipped with an EMPTY registry on purpose (the routine's SHAPE is the deliverable; inventing polls with unpinned sources would have built the exact failure the freshness gate prevents). Default was "run every `in_default` poll," derived rather than hardcoded.
