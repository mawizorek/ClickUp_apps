---
slug: job-market-focus
display_name: Job Market Refresh — FOCUS OVERRIDE
type: override-sidecar
parent: routines/job-market-refresh.md
steward: routine-ricky
status: ACTIVE
opened: 2026-09-26
review_by: 2026-10-26
version: 1
authority: scope only — NEVER a run/no-run switch
---

> ⚠️ **THIS FILE IS A SCOPE OVERRIDE, NOT A SWITCH.** `routines/schedule.md`'s table remains the ONLY
> on/off switch for whether the routine runs (LOCKED 2026-07-30, Michael). This file changes only WHAT a
> pass looks for once it is already running. **Presence of this file ≠ permission to run.**
>
> 🔴 **REVERT = DELETE THIS FILE.** Nothing in `job-market-refresh.md`, `job-market-refresh.notes.md`,
> `job-market-templates.md`, `job-market-roles.json` or any lane file was changed to install this. Delete
> this one file and the routine is byte-for-byte back to v19 behaviour. That was Michael's explicit
> requirement: *"retaining all instructions as is currently to revert back easily."*

# Job Market Refresh — FOCUS OVERRIDE: remote + concurrent

**Michael, 2026-09-26:** *"i only care about remote work that fits my skill set - so i want to search far
and wide for work that I could pick up concurrently."*

**Variant chosen (same session, ClickKit):** **all remote is reported, concurrent-capable ranked first.**
Not concurrent-only. A full-time remote role is still found, still rowed, still reported — it just sits
below the concurrent-capable block in the read surface.

---

## 🔴 WHY THIS IS A SIDECAR AND NOT FRONTMATTER

Michael's original instruction was *"adding some additional front matter."* It is built as a separate file
instead, for three reasons, all of which are reversals of his stated mechanism and therefore recorded
rather than assumed:

1. **`job-market-refresh.md` line 2 forbids it.** *"Frontmatter is metadata, never a switch"* (LOCKED
   2026-07-30, by Michael). Live behaviour in frontmatter would contradict a lock in the same file.
2. **One claimant per fact.** Search terms already have exactly one claimant, `keywords[]` in
   `job-market-roles.json`, which the runbook calls *the gate*. A second list of terms in a header is the
   shape that killed `roster.json`, `roster.html` and `registry.json`.
3. **Size.** `job-market-roles.json` is 30,877 B and `job-market-refresh.md` is 25,474 B. Both are above
   the line where this repo has already lost data to a truncated-read-then-full-file-write
   (`job-market-state.tsv`, retired at 25,403 B). An override that cannot be installed without rewriting
   a 31KB file is more dangerous than the thing it configures.

⭐ **The generalising rule, worth keeping past this file: a TEMPORARY change should be a SEPARATE
ARTIFACT, never an edit threaded through permanent ones.** An edit has to be un-picked to revert; a file
is deleted. Michael asked for easy revert — this is the shape that delivers it.

---

## What the override changes

### ✅ UNCHANGED — every one of these still applies in full

- **All ten lanes in `roles[]` are still walked, in config order, from role 1.** The no-lane-is-ever-
  skipped lock (LOCKED 2026-08-04, EXTENDED 2026-08-31) is NOT suspended, and a focus pass may not skip a
  lane for being remote-thin. **Thin is the expected result in most lanes and is reported, not avoided.**
- **SEARCH FIRST, RECONCILE SECOND.** Unchanged and non-negotiable.
- **A DOOR IS NOT A BOARD.** Unchanged.
- **Never infer `remote` or `hybrid`.** The posting's own words or no tag — and a board metadata card is
  not the posting. This override makes that guardrail *more* load-bearing, not less: when the whole pass
  is about remote, a false remote tag corrupts the entire deliverable.
- **Capture the location qualifier.** "Remote" rarely means location-free. Required states, travel
  percentages, office-day minimums and in-person event obligations go in the row's `location` field.
- **No keyword is cut, no lane is retired, no exclude_terms are added.** Ruled twice before, wrong both
  times. A focus window is not a licence to prune the config.
- **Schema, templates, threading, one-comment-per-NEW, friction icons, reaction rating, commit-at-every-
  role-boundary, the Resume Scan.** All unchanged.

### 🎯 CHANGED — three things, and only these three

**1. Sweep emphasis within each lane.** Remote-capable routes are swept FIRST and deepest inside each
lane, using `job-market-sources-remote.md` as the primary source file rather than a supplement. Lane
posture, taken from the verified 09-19 research and NOT re-derived:

| Lane | Remote posture under focus |
|------|---------------------------|
| `creative-admin` | ⭐ **PRIMARY.** The only genuinely productive remote lane. Sweep it hardest. |
| `drafting-design` | ✅ secondary, with the AutoCAD gate named out loud on every row |
| `production-manager` · `producing-artistic` | ⚠️ opportunistic; mostly hybrid, mostly broadcast/media |
| `technical-director` | ⚠️ opportunistic; documentation and pre-production work only |
| `operations-safety` | ⚪ one probe for remote safety-planning/compliance contracting. Probed empty 09-18 — **probe again, report swept-empty, do not skip** |
| `electrician` · `audio-sound` · `stage-manager` | 🚫 no remote sweep. The work is in the room. Genuine market absence, re-confirmed 09-19. **See the carve-out below — these lanes still produce under this focus.** |

**2. Reporting order.** The ⚡ ACCESSIBLE block in Template 6 becomes the headline of the pass summary,
above ⚡ Spotlight, and splits into two sub-blocks:

- **⚡⚡ CONCURRENT-CAPABLE** — ranked first. This is the deliverable.
- **⚡ REMOTE, FULL-TIME** — everything else tagged `remote`, reported beneath it.

**3. The density floor is SUSPENDED and REPLACED.** 40 live listings cannot be met by a remote-scoped
pass: the measured remote rate is **7 rows in 338 (about 4%)** and the sourcing file's own calibration is
**3-8 remote rows per pass across ALL lanes combined.** Concurrent-capable is a subset of that, so the
honest expectation is **1-4 rows per focus pass.**

- 🔴 **Replacement test = SOURCES COVERAGE, not row count.** A focus pass succeeds when every lane was
  walked and every reachable remote route in `job-market-sources-remote.md` was swept and accounted for in
  the 🔌 SOURCES block, with ✅ / ⚪ / 🕐 / ⚠️ / ❌ kept distinct. **Two rows off full coverage is a
  SUCCESSFUL pass. Twelve rows off half the routes is not.**
- ⚠️ **AND THE STAMP:** a complete focus pass **DOES stamp**, marked `focus`. Rationale, stated because it
  is a real deviation from THE STAMP LAW's below-floor clause: the floor it would fail is a floor this
  override deliberately removed, and a routine that can never stamp for a month reads as permanently
  overdue and self-heals into a catch-up it does not need. **A pass that fails the COVERAGE test still
  does not stamp** — the law is intact, its test was substituted.
- **Mark every role header `focus`** (alongside the existing `top-up` convention) so the Resume Scan never
  mistakes a deliberately-narrow pass for an abandoned wide one.

---

## 🏠 CARVE-OUT: home-accessible concurrent work stays IN

**Ruled by the executor, reversible in one line, and flagged to Michael rather than buried.**

Michael's instruction names two things: **remote** (the arrangement) and **work he can pick up
concurrently** (the purpose). Geva Theatre's show-by-show overhire is not remote, but it is the canonical
concurrent work in this config and he said on 2026-09-10 that he was *"actually more interested in the
geva per show overhire thing."*

**So the `home_accessible` overhire exception (`global.exclude_overhire.exception`) stays live and keeps
producing under this focus**, tagged `home|immediate`, and those rows appear in the ⚡⚡ CONCURRENT-CAPABLE
block even though they are not remote. This is the only place the override admits non-remote work.

🚫 **This is NOT a licence to widen the focus generally.** Relocation-required full-time work is out of
scope for the window. If Michael says *remote strictly means remote*, delete this section and the
`electrician`/`audio-sound` lanes go quiet for the duration.

---

## 🧪 The CONCURRENT test

A row is `concurrent-capable` when the **posting's own words** support being held alongside a full-time
salaried position. Same discipline as the `remote` tier: **quote it or drop it.**

**Qualifies:**

- Part-time, fractional, or a stated weekly-hours figure at or under ~25 hrs/wk
- Freelance, contract, consultant, project-based, per-project or per-show engagement
- Hourly with no stated minimum full-time commitment
- Rolling / ongoing / open-until-filled calls with no fixed start (the existing `immediate` tier)
- Interim or seasonal work with a defined end date

**Does NOT qualify:**

- Full-time salaried, however remote. Still rowed, still reported, ranked second.
- Anything with a stated in-person minimum that collides with a URITP production week
- ⚠️ **Anything inferred.** "Probably flexible" is not a finding. No supporting language = no tag.

📌 **Recording it:** use the existing `level=contract` value plus the `accessibility` tiers already in the
schema (`remote` / `immediate` / `home`). 🚫 **Do NOT add an 18th column and do NOT invent a new tier
string** — the schema may only change in a build session (README rule 7), and this window is temporary by
design. Concurrency evidence is quoted in the row's NOTABLE line.

---

## 🔻 THE REAL GAP — say this in every focus pass report

**The filter is the easy half. The sources are the problem, and no filter fixes them.**

`job-market-sources.md`, `-experiential.md` and `-remote.md` between them index arts boards, venue boards,
experiential boards and remote-arrangement boards. **Not one of them indexes a freelance or contract
marketplace**, which is exactly where concurrent-capable work concentrates. So the first focus passes will
under-report, and **they must say so in the header rather than reporting a thin market.**

⚠️ **UNVERIFIED CANDIDATES — leads only, NOT sources.** None of these has been opened or confirmed to
carry relevant roles. **Do not cite them as swept until someone verifies them**, and source discovery is
**Scout Sage's** lane per the seam in `hooks/data-refresh.md`:

- Upwork · Contra · Catalant / Graphite (fractional-professional marketplaces)
- Superpath, Peak Freelance and similar content/comms freelance boards — plausible for the ADM half's
  grant-writing, donor-comms and marketing work, which is where the concurrent money actually is
- Grant-writing specific rosters and consultant directories (arts service organisations maintain these)
- ⚠️ The four verified-dead and the whole mirror set in `job-market-sources-remote.md` stay dead. A
  focus window is not a reason to re-chase a CareerBuilder repost.

🔴 **A BLOCKER IS A CLAIM AND CLAIMS EXPIRE.** The last time a remote directive stalled, the blocker
*"cannot be executed properly"* was cited as current for eight days and one research pass closed it. If a
focus pass returns one row, **re-test the source layer before concluding the market is empty.**

---

## Review

**Opened 2026-09-26. Review by 2026-10-26, or the moment Michael says the window is over.**

⏰ **A focus window that nobody re-raises has silently become a permanent filter Michael never agreed
to** — the exact failure mode named in the 2026-09-18 AutoCAD deferral ruling. The review date is the
guardrail. On review: delete the file, extend it with a new dated line, or graduate a proven part of it
into the parent in a real build session.

**Provenance:** Michael in chat, 2026-09-26 21:33-22:38 ET. Seated: Maestro Mira (front door), Audit Anna
(the 4%/3-8 calibration and the floor collision), ClickUp Coach Corey (the frontmatter-lock and
one-claimant collisions), Fold-in Frank (ruled FOLD-IN onto the existing single-role `top-up` mode, not
net-new), Size Sally (ruled the sidecar over an edit to either 25KB+ parent).
