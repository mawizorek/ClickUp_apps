---
slug: data-refresh
display_name: Data Refresh Runbook
type: runbook
status: active
trigger: "/data-refresh · /refresh · \"run the refresh\" · a bare `Ricky` (his default_runbook) · or pointing any session at this file and saying \"run this process\""
steward: routine-ricky
version: 1
added: 2026-07-26
---

# Data Refresh Runbook

**The fleet's first RUNBOOK — a routine that lives as its own tool, invocable three ways.** Routine Ricky STEWARDS it; he does not contain it.

> **Why this file exists separately from the agent** (`gates/agent-invocation-gate.md` → invocation-mode contract, LOCKED 2026-07-20): *"A routine an agent runs is a STANDALONE documented hook/runbook, directly invocable on its own — Michael can open any session, point at that document, and say 'run this process,' and it executes identically to the bare-name call. The routine is NEVER baked INTO the persona."* Super Agents are personalities; this is the dense routine the personality is a friendly door to.

## Three doors, one behavior

1. **Bare `Ricky`** → fires the DEFAULT REFRESH below (his `default_runbook`), subject to his `gate_strength`.
2. **`Ricky, run the <name> poll`** → fires that ONE named poll from the registry.
3. **Point any session at this file** → *"run this process"* executes identically, with no persona loaded at all. **If door 3 ever behaves differently from door 1, this file is wrong, not the agent.**

---

## 🚦 Pre-flight (EVERY poll, no exceptions)

**`hooks/source-freshness-gate.md` is FIRE-ALWAYS here.** This runbook exists to state volatile external facts, which is exactly the surface that gate was born from (2026-07-25, the Soleil hours error). Non-negotiables inherited from it:

- **Rank by DATED PROVENANCE, never by proximity to the subject.** Owner-updated dated profile > the business's own dated page > a third party about its OWN operation > a third party reporting someone else's facts > undated aggregators (near worthless).
- **A first-party snapshot EXPIRES.** A two-year-old post by the owner is not current.
- **Agreeing aggregators are ONE source, not five.** Count ORIGINS, not rows.
- **Never assert a volatile fact without knowing the AGE of the claim.** Say "unverified" instead.
- **Confirm you matched the right ENTITY** before trusting a record.

**Then:** confirm the poll is REGISTERED below (an unregistered poll is not a poll — see the registry rule), and confirm its sources still resolve.

---

## The DEFAULT REFRESH (what a bare `Ricky` runs)

**Definition: run every poll in the registry whose `in_default` is `yes`, in registry order, then report once.**

This is deliberately a **derived** default rather than a hardcoded list. Adding a poll to the standard refresh is then a **one-field edit** on its registry row — the same one-field-flip philosophy that keeps `roster.json` from needing a rewrite on every graduation. A hardcoded default would drift from the registry the first time anyone added a poll and forgot to update two places.

⚠️ **If NO poll is marked `in_default: yes`, the default refresh is EMPTY — and an empty routine does NOT silently succeed.** Say so plainly and ask which poll to run. Reporting "refresh complete" after doing nothing is the worst possible outcome of this file. **That is the current state: the registry has no live rows yet.**

---

## 📋 The poll registry

One row per poll. **A poll that is not in this table does not exist** — Ricky does not improvise a data pull, because an unregistered poll has no vetted sources and no freshness discipline, which is precisely how the Soleil miss happened.

| Poll | Invoke | `in_default` | Sources (dated, ranked) | Report shape | Status |
|---|---|---|---|---|---|
| _(none registered yet)_ | — | — | — | — | — |

### Candidate slots (Michael's own examples, Jul 20 — NOT yet registered)

Named here so the shape is obvious and so nobody re-derives the idea from scratch. **Each needs its sources pinned before it becomes a row**, and pinning them is a Michael-or-Sage job, not a guess:

- **F1 / race weekend** — the one candidate with existing domain scaffolding (the **Formula 1** page in the Brain Reference Library, plus the `f1-racetracks` repo app). Most likely first real row.
- **Market data** — needs a decision on WHICH instruments, and a source whose timestamp is visible.
- **Weather** — needs locations pinned; trivially date-stamped, so the freshness gate is easy here.

### To register a poll (the only way a row gets added)

1. Name it, and name what QUESTION it answers. A poll that doesn't answer a standing question is a curiosity, not a routine.
2. Pin sources, **ranked by the freshness ladder**, with a note on how each one is dated. Undated source = not a source.
3. Define the report shape — including **what "nothing changed" looks like.** A poll that can only report change will invent change.
4. Decide `in_default` (does a bare `Ricky` run this?).
5. Add the row. Same session, or it isn't registered.

---

## Report format

One report per invocation, however many polls ran. Terse; this is a status readout, not an essay.

- **Per poll:** the finding, the SOURCE, and **the AGE of the claim.** Age is mandatory — a fact without a date is unverified by definition.
- **"No change since last run"** is a complete, valid, and GOOD result. Say it and move on.
- **On source disagreement:** name both, name both dates, show the tiebreaker. Never silently pick one.
- **On a dead or unreachable source:** say so and mark the poll INCOMPLETE. Do not substitute a different source mid-run and report as if the pinned one answered — that is the silent-fallback failure (`hooks/silent-fallback-law.md`).
- **Trend, when the ledger has one:** *"third run in a row this source lagged."* That is Ricky's memory earning its keep, and it belongs in the report, not just his files.

---

## Guardrails

- **READ-ONLY by default.** This runbook fetches and reports. It does not write to tasks, docs, or the repo. If a poll's result should LAND somewhere, that is a separate explicit instruction, not part of the refresh.
- **Never assert a stale fact to complete the routine.** An incomplete honest report beats a complete confident wrong one.
- **A screenshot from Michael outranks anything cached.** Re-verify from scratch; never defend the stale source.
- **This file holds the PROCEDURE; Ricky holds the HISTORY.** Which sources rot, which polls he keeps re-running, what Michael actually reads — that is `super-agents/routine-ricky/memory.md`. Do not write source-reliability history into this file, and do not write procedure into his.

## Composes with

- **`hooks/source-freshness-gate.md`** — fire-always pre-flight. Stewarded by Scout Sage.
- **`hooks/silent-fallback-law.md`** — never substitute a source and report as if the original answered.
- **`gates/agent-invocation-gate.md`** — the contract that makes this file's three doors equivalent (`default_runbook` + `gate_strength`).
- **Scout Sage** (`super-agents/scout-sage/`) — for a genuinely NEW open-ended lookup. **Lane seam:** Sage RESEARCHES an open question from scratch; this runbook RE-CHECKS a registered question against pinned sources. Research is per-question; a refresh is per-schedule. If a poll needs new sources found, that is Sage's job, then the row gets registered here.

## Changelog

- v1 (2026-07-26) — created alongside Routine Ricky, the fleet's first runbook-agent. Ships with an EMPTY registry on purpose: the routine's SHAPE is the deliverable, and inventing polls with unpinned sources would have built the exact failure the freshness gate exists to prevent. Default refresh defined as *derived* from `in_default` flags rather than hardcoded, so adding a poll to the default is a one-field edit.
