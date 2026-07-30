---
slug: job-market-refresh
display_name: Job Market Refresh
type: runbook
status: active
steward: routine-ricky
cadence: see routines/schedule.md
last_run: routines/last-run/job-market.txt
added: 2026-07-30
version: 2
---

# Job Market Refresh

**WHAT this does.** The WHEN lives in `routines/schedule.md`. The universal floor lives in `routines/README.md` (Data-Refresh Discipline). Neither is restated here.

> ## ✅ THIS RUNS LIVE. THERE IS NO MODE GATE.
>
> **The routine has one behavior: walk the boards, capture what matters, and cut a task for anything genuinely worth acting on.** It does not check a flag first.
>
> **The schedule row IS the switch.** To switch this off, mark the Job Market row **retired** in `routines/schedule.md` with a dated reason (per that file's ledger rules — mark it, never delete the row). No row, no run. One switch, in the one place cadence already lives.
>
> ⚠️ **Do not rebuild an OFF/ON gate here.** v1 had one — a mode flag held in a ClickUp task title, read at step 1 of every pass — and Michael cut it the same day: *"don't really need this other gate. if i want it off, ill just have it removed from the schedule md."* **Two switches for one behavior is one switch too many**, and the second one lived in a different system from the schedule, so "is this running?" needed two lookups and could get two different answers. If you feel the urge to add a mode, add a routine instead.

## What a pass produces

Two things, every time:

1. **ONE dated comment** on the standing thread — the running log. Patterns, salary sightings, repeat hirers, gaps, structural changes.
2. **An `Application` task per real lead** in the **Applications** list, status `interested`. Only for postings that clear the target profile below.

Standing thread: **`86ajtgbt3`** · <https://app.clickup.com/t/86ajtgbt3>
Applications list: **`900600097138`** · <https://app.clickup.com/36074068/v/li/900600097138>

**The comment is the thinking; the tasks are the funnel.** Never collapse them into one. A pattern that produced no lead still goes in the comment; a lead still gets summarized in the comment even though it also became a task.

### ⚠️ The bar for cutting a task (this is what replaced the gate)

The gate used to stop task creation wholesale. Nothing does now, so **the quality bar is the only thing standing between this routine and a junk-filled funnel.** A lead earns a task only if ALL of:

- it clears the **target profile** (lane, level, discipline) below;
- it is **currently open** — a posting past its deadline, or undated on a board that normally dates things, is a comment line at most;
- it is **not already in the list** — search Applications by company + title first (`Company` field, then title text). A duplicate lead is worse than a missed one because it corrupts the funnel's counts.

**Everything that fails the bar but is still interesting goes in the comment as one line.** That is what the comment is for. **Never cut a task "just to be safe."**

## Target profile (LOCKED 2026-07-30, Michael)

- **Geography: ANYWHERE.** No location filter. Relocation is live. Do not silently privilege Rochester or Upstate NY, and do not drop a strong non-US posting.
- **Lane: NON-ACADEMIC, next move.** Regional/LORT theatre, commercial and touring, arena and live events, opera, production shops, corporate/broadcast live production.
  - ⚠️ **Academic postings are DEPRIORITIZED, not banned.** Michael currently holds a university PM job; the point is to look OUTSIDE it. A university posting that is genuinely a step up (senior producing, director of production at a major conservatory) is still worth one line. Do not spend the pass on academic listings.
- **Level: at or above Production Manager.** PM, Director of Production, Technical Director, Production Supervisor, Project Manager (entertainment), General Manager (production side). Skip crew, overhire, seasonal, and internship postings.
- ⚠️ **The title trap.** "Production Manager" outside live entertainment means FACTORY FLOOR — plastics, switchgear, packaging, food manufacturing. Michael's refer.io alert has been feeding exactly this for months. **Discipline-check every hit before you count it.** A manufacturing PM is not a near-miss, it is a different profession.

## Sources (walk in this order)

**Tier 1 — every run:**

1. **OffStageJobs** — <https://staging.offstagejobs.com/jobs.php> · filter `Management` + `Professional`. ⚠️ The `staging.` subdomain is the live site; the bare domain redirects to it. Not a typo, do not "fix" it.
2. **USITT Jobs** — <https://www.usitt.org/industry-resources/jobs> · postings carry a visible **Post Date**, which makes it the best freshness signal in the set. Use it to calibrate the others.
3. **Playbill Jobs** — <https://playbill.com/jobs> · broadest theatre coverage, NYC-heavy.
4. **EntertainmentCareers.net** — <https://www.entertainmentcareers.net/> · commercial, corporate and broadcast live production. LA-weighted.
5. **ARTSEARCH (TCG)** — <https://circle.tcg.org/resources/jobs> · ⚠️ **subscription-gated and it MOVED hosts.** If the paywall blocks the read, say "ARTSEARCH: gated, not read" and move on. **Never infer its contents from another board.** Old ARTSEARCH URLs are stale; this is the current one.

**Tier 2 — weekly-ish, or when Tier 1 is thin:**

- BroadwayWorld Classifieds · AACT · TheatreArtLife: The Market (subscription, worldwide — the best non-US surface in the set) · IATSE local job boards · LinkedIn saved searches.

**Tier 3 — candidates, UNVETTED:**

- StageBoard <https://faizova.com/> · StageJobsy <https://stagejobsy.com/jobs>
- Both are new aggregators that scrape the Tier 1 boards. ⚠️ **Agreeing aggregators are ONE source, not five** — count ORIGINS, never rows. Their value would be non-US reach, and that is unproven. Do not promote either to Tier 1 without a pass that shows they surfaced something Tier 1 missed.

## Steps

1. **Read `routines/last-run/job-market.txt`.** That timestamp is the cutoff: you care about what is NEW since it. `never` means this is the first pass, so establish a baseline instead of a delta.
2. **Walk Tier 1 in order.** Apply the target profile. Discipline-check every title.
3. **For each candidate lead, apply the task bar** above. Dedupe against Applications BEFORE creating anything.
4. **Cut the qualifying leads** as `Application`-type tasks in Applications, status `interested`. Populate what the posting actually says: `Company`, `Located`, `Salary Range`, `🌐 Link`, `Industry Interests`. **Leave a field empty rather than guessing it.**
5. **Note the STRUCTURE, not just the jobs.** A board that died, a paywall that appeared, a filter that moved, a title convention that shifted — that is the most durable thing a pass produces.
6. **Write ONE comment** on the standing thread in the format below. Delta only.
7. **Stamp** `routines/last-run/job-market.txt`. One line, `YYYY-MM-DD HH:MM` ET. **An unstamped run did not happen** and the next pass will redo it.

## Comment format

Terse. A running log, not a report. Short beats complete.

```
**YYYY-MM-DD · Entry N**

Boards: <which read, which gated/dead>
Leads cut: <n> — <title @ org>, ... (or "none")

Patterns: <2-4 lines max, or "nothing new">
Salary sightings: <real posted numbers only, with the org>
Repeat hirers: <orgs posting again>
Gaps: <qualifications that keep appearing that Michael can't claim yet>
Near-misses: <interesting but failed the bar, one line each>
Structural: <board/source changes, or omit the line>
```

- **"Nothing new, no leads" is a complete, good answer.** Say it in one line and stop. Never pad a pass to look productive, and never cut a marginal task to make a pass feel worthwhile.
- **Real numbers or no numbers.** A posted range with the org attached is worth something; a guessed band is worse than silence.
- **Never assert a stale posting as current.** `hooks/source-freshness-gate.md` is fire-always the moment this fetches.

## Guardrails

- **Creates tasks; sends nothing.** No outreach, no applications, no emails, no drafts to anyone but Michael. ⚠️ The standing **EMAIL SEND LOCK** applies — surface anything that wants sending, never send it.
- **Never edit a lead task after the first pass created it.** Once a task exists, it is Michael's working surface. A later pass that sees the same posting does NOTHING (that is what the dedupe check is for).
- **A gated source is reported as gated.** `hooks/silent-fallback-law.md`: never substitute a board and report as if the pinned one answered.
- **Catch-up, don't replay.** Overdue by three weeks = ONE pass, labeled a catch-up. Never one pass per missed day. ⚠️ On a long catch-up, be **stricter** on the task bar, not looser — three weeks of backlog is exactly when a funnel gets flooded.
- **A failed run leaves the stamp untouched** so it stays overdue and self-heals.
- **Michael's screenshot outranks anything cached.** Re-verify from scratch.

## Composes with

- **`routines/schedule.md`** — the cadence AND the on/off switch. Retune or retire there, never here.
- **`routines/README.md`** — Data-Refresh Discipline, the 12-rule floor.
- **`hooks/task-dedup-gate.md`** — the 3-step search. Fires before every lead task, no exceptions.
- **`hooks/source-freshness-gate.md`** — fire-always on any fetch. Steward: Scout Sage.
- **`hooks/silent-fallback-law.md`** — no silent source substitution.
- **Scout Sage** — lane seam: a NEW source or an open market question is hers first; this routine RE-CHECKS pinned sources. Promoting anything out of Tier 3 goes through her.

## Changelog

- **v2 (2026-07-30, hours after v1) — THE TRIGGER GATE IS GONE. Default is ON.** Michael: *"turn on a default to on. for sure. don't really need this other gate. if i want it off, ill just have it removed from the schedule md."* Deleted the OFF/ON mode table, the trigger callout, and step 1 (read the flag off a ClickUp task title). **What replaced it is a QUALITY BAR, not another gate** — the gate was doing two jobs, "don't run yet" and "don't create junk," and only the first one was actually wanted. Also added the dedupe requirement and the near-misses comment line, both of which the gate had made unnecessary by suppressing task creation entirely. **Worth carrying: a mode flag in a second system is a duplicate switch, and it made "is this on?" a two-lookup question with two possible answers.** The schedule row was always the real switch.
- **v1 (2026-07-30)** — created. Geography ANYWHERE + lane NON-ACADEMIC locked by Michael the same day. Sources verified live 2026-07-30; two corrections carried in from the old ClickUp Job Search doc (ARTSEARCH moved hosts, OffStageJobs is `staging.`-only). Shipped with a ClickUp-held OFF/ON trigger, retired within the hour (see v2). ⚠️ The standing-task link was hand-typed on the first commit and wrong; corrected against the loaded task in the same session. Load the task, copy the ID, never type it.
