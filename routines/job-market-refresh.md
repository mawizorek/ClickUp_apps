---
slug: job-market-refresh
display_name: Job Market Refresh
type: runbook
status: active
steward: routine-ricky
cadence: see routines/schedule.md
last_run: routines/last-run/job-market.txt
added: 2026-07-30
---

# Job Market Refresh

**WHAT this does.** The WHEN lives in `routines/schedule.md`. The universal floor lives in `routines/README.md` (Data-Refresh Discipline). Neither is restated here.

> ## 🚨 THE HUNT TRIGGER IS OFF
>
> **This routine is RESEARCH ONLY. It reads boards and writes ONE comment. It does not create leads, does not draft anything, does not contact anyone.**
>
> The trigger state lives in the standing ClickUp task, in its title and its State block — not here, and not in memory. **Read it before every run.** If the title still says `hunt trigger OFF`, you are in research mode.
>
> Standing task: **`86ajtgbt3`** · <https://app.clickup.com/t/86ajtgbt3> · list: **Applications**
>
> Michael flips it in plain language ("turn the job hunt on"). Nobody else flips it, and it is never inferred from an interesting posting.

## The two modes (this is the whole design)

| | Trigger OFF (now) | Trigger ON (later) |
|---|---|---|
| Output | ONE dated comment on the standing task | Comment **plus** one `Application` task per real lead |
| Looking for | **patterns** — titles, salary bands, repeat hirers, qualification gaps | **individual postings worth acting on** |
| Cadence | daily staleness threshold | same, but a miss actually costs something |

**Why patterns and not postings while OFF:** a posting captured today is dead in six weeks, and a list of 200 dead postings is worse than no list. A pattern ("three regionals posted PM roles at $65–75k in one month") stays true and is what actually sharpens the plan.

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

1. **Read the standing task first.** Confirm the trigger state. If it flipped, you are in the ON column of the table above.
2. **Read `routines/last-run/job-market.txt`.** That timestamp is the cutoff: you care about what is NEW since it. `never` means this is the first pass, so establish a baseline instead of a delta.
3. **Walk Tier 1 in order.** Apply the target profile. Discipline-check every title.
4. **Note the STRUCTURE, not just the jobs.** A board that died, a paywall that appeared, a filter that moved, a title convention that shifted — that is the most durable thing a pass produces.
5. **Write ONE comment** on the standing task in the format below. Delta only. If nothing changed, say that in one line.
6. **Stamp** `routines/last-run/job-market.txt`. One line, `YYYY-MM-DD HH:MM` ET. **An unstamped run did not happen** and the next pass will redo it.

## Comment format

Terse. A running log, not a report. Short beats complete.

```
**YYYY-MM-DD · Entry N**

Boards: <which read, which gated/dead>

Patterns: <2-4 lines max, or "nothing new">
Salary sightings: <real posted numbers only, with the org>
Repeat hirers: <orgs posting again>
Gaps: <qualifications that keep appearing that Michael can't claim yet>
Structural: <board/source changes, or omit the line>
```

- **"Nothing new" is a complete, good answer.** Say it in one line and stop. Never pad a pass to look productive.
- **Real numbers or no numbers.** A posted range with the org attached is worth something; a guessed band is worse than silence.
- **Never assert a stale posting as current.** `hooks/source-freshness-gate.md` is fire-always the moment this fetches.

## Guardrails

- **READ-ONLY except the comment and the stamp.** No lead tasks, no field edits, no outreach, no drafts while the trigger is OFF.
- **Never create an `Application` task speculatively.** The Applications list is the funnel; polluting it before the hunt starts is the failure this routine exists to avoid.
- **A gated source is reported as gated.** `hooks/silent-fallback-law.md`: never substitute a board and report as if the pinned one answered.
- **Catch-up, don't replay.** Overdue by three weeks = ONE pass, labeled a catch-up. Never one pass per missed day.
- **A failed run leaves the stamp untouched** so it stays overdue and self-heals.
- **Michael's screenshot outranks anything cached.** Re-verify from scratch.

## Composes with

- **`routines/schedule.md`** — the cadence. Retune there, never here.
- **`routines/README.md`** — Data-Refresh Discipline, the 12-rule floor.
- **`hooks/source-freshness-gate.md`** — fire-always on any fetch. Steward: Scout Sage.
- **`hooks/silent-fallback-law.md`** — no silent source substitution.
- **Scout Sage** — lane seam: a NEW source or an open market question is hers first; this routine RE-CHECKS pinned sources. Promoting anything out of Tier 3 goes through her.

## Changelog

- **v1 (2026-07-30)** — created. Geography ANYWHERE + lane NON-ACADEMIC locked by Michael the same day. Sources verified live 2026-07-30; two corrections carried in from the old ClickUp Job Search doc (ARTSEARCH moved hosts, OffStageJobs is `staging.`-only). Trigger OFF at birth: this is the first routine written to be deliberately half-asleep, and the ON/OFF table is the load-bearing part. ⚠️ The standing-task link was hand-typed on the first commit and wrong; corrected against the loaded task in the same session. The session board's rule holds — load the task, copy the ID, never type it.
