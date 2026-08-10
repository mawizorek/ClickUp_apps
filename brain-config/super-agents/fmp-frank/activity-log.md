# Fiona — Activity Log

> **LIVE per-reply session record.** Start the entry at session Commit, append one line per
> qualifying reply (delivers content, answers a question, takes action, makes a decision, or issues a correction) as you go. At close it is already done — no batch reconstruction.
> Newest session on top, append-only. Budget ~4-5KB (sliding window, last 10-15 sessions);
> quarterly cold archives go to `activity-log/YYYY-QN.md` per `hooks/memory-rotation.md`.
>
> Format law: `_shared/super-agent-base.md` → Per-response logging mandate (LOCKED 2026-07-25).

---

# 🔴 LIVE STATE — read this FIRST on any pickup

> Permanent fixture, sits OUTSIDE the sliding window (`super-agent-base.md` §4a). Every number
> here carries the moment it was measured. **Anything older than the last close gets RE-QUERIED,
> never reused** — this block is a snapshot, the DDR and the repo are the truth.
>
> ⚠️ **This block did not exist until 2026-08-10.** §4a has required it since 07-30 and three of my
> sessions closed without one, which is why every pickup so far has re-derived project state from
> the handoff task instead of from my own bundle. Its absence was invisible because a log full of
> real entries reads as a log that is working.

## Production MAWster — ACTIVE, my primary build

- **Measured 2026-08-09 16:43 ET** (DDR `202608091643`): 36 tables · **0 relationships · 0 layouts**.
  Scripts went 0 → ~11 that evening, entered by Michael directly.
- **Where things live:** schema + script docs in `mawizorek/uritp-docs` 🔒 PRIVATE →
  `production-mawster/`. ⚠️ **NOT `maw-prose`** — that tree is stale and the published site still
  renders from it. Collapsing the three doc trees is open.
- **Owed by me:** nothing outstanding as of this write.
- **Blocked ON MICHAEL, and both block real work:**
  1. 🔴 `APP_SESSIONS` vs `UTILITY_LOGS` — a second claimant that reverses J13 with no written
     reversal. `FILE · Open` cannot be entered until it is settled.
  2. 🔴 Two scripts named `goto_view_UTILITY_LOGS`. Needs a DDR script-reference read before either
     is deleted.
- **Next three moves:** fresh DDR and diff it · fix-queue items 1–4 (correctness) · the
  conditional-formatting capability test, which is load-bearing under the whole theme model and has
  still never been run.
- **Canonical trail:** the `↪️ HANDOFF ·` task carries the full fix queue and every superseding
  update. Read the BOTTOM-most comment first; four consecutive rulings on config each corrected the
  next one.

## HML_LLC — dormant, no session since 07-29

FileMaker 19 permanently, so atomicity is hand-built. Build detail is archived, not hot —
`memory/archive/hml-llc-fmp19-build-detail.md`, read before touching a script.

---

## 2026-08-09 → 08-10 — Production MAWster, the file's FIRST SCRIPTS

Session [Production MAWster — DDR fix order](https://app.clickup.com/t/36074068/86ajy56v3), reopened ~21:35 after the afternoon
handoff. Michael building in FileMaker, me documenting. **Two PRs merged in `uritp-docs` (#72, #78).**

- 🔴 **Caught a live file-locking defect on script #1, before it shipped.** His close handler had no
  `Exit Script`, and ended on a call to the backup script, which exits with a text result when the
  user declines. FileMaker persists a subscript's result up to a caller that sets none, and the close
  handler's result **is a veto** — so declining the backup would have refused to close the file.
  Landed as **house rule 10** in the template.
- **Ruled the backup onto the OPEN path.** A close-triggered backup misses every session that ended
  badly, because a crash fires no close trigger, and those are the only sessions anyone reaches for a
  backup over. On open you copy the last known-good state.
- **Reorganized 11 scripts:** four rewritten as specs, four retired verbatim into a new `_retired/`
  tree, one taxonomy ruled (the name prefix wins, folders mirror it 1:1).
- 🔴 **`exit w/ errors` cannot work at all** — a subscript cannot exit its caller, and the symptom of
  it failing is *the script keeps going*. Replaced by a custom function.
- 🔴 **MICHAEL CAUGHT WHAT I MISSED, AND IT IS THE ENTRY.** *"we seemed to have lost the immense
  autogenerate markers report… good for authoring, but for run-time real build report?"* Nothing had
  regressed in the engine. **All eleven pages I shipped carried zero marker spans** — every ⬜ and 🔴
  was literal emoji, every warning a callout. The build report would have called the tree clean.
  ⚠️ **And the families I skipped are the ones I own as of that same day.** Fixed in PR #78.
- 🔴 **Found a worse defect while fixing that one: six pages shipped with no `status:` key.** The
  report classes those as NOT BUILT, the id never registers, and every link into them dies silently.
  Would have taken the whole `_retired/` archive offline while looking immaculate in the repo.
- ⚠️ **I deferred my own activity-log write three replies running**, announcing it as owed each time.
  Naming a debt is not paying it — the same shape as the missed-gate protocol. Written now, with the
  LIVE STATE block that should have existed since 07-30.

**Open surfaces:** the two forks in LIVE STATE above · `@script:` link resolution is reasoned from
`markerlinks.py` and **not yet observed on a real build** — read the first build report · the
misspelled `70-scripts/90-Utlity/` folder with two zero-byte files is flagged for Michael's deletion.

## 2026-08-08 — Production MAWster v1 schema · my first build I DROVE end to end

Session [Fiona + Wes (Opus 5) · Production MAWster v1 schema](https://app.clickup.com/t/86ajy1neb), ~4h. Michael building the FMP file in parallel; I documented the schema in `mawizorek/maw-prose`. Named by him as driver on the two hardest questions. **Nine PRs merged in the content repo, plus two in the engine (Dexter).**

- 🔴 **The finding that justified the whole rebuild, read from a live export rather than the docs:** legacy `SETUP` is **20 fields / 1 record / almost entirely GLOBAL storage**, so `ProductionTITLE`, `Director` and `FIRST REHEARSAL` are one value for the entire file. **The old app holds exactly ONE production at a time**, and the six "stored production INFO" scripts are the PRODUCTIONS table written as code (14 `Set Field` steps per show). The ClickUp doc page claims multi-production support via SETUP records; it is false, and it also says 11 tables where the file has 9. **Two doc-page corrections owed.**
- 🔴 **My ruling on spans, and Michael's catch on it.** I killed the legacy duplicate-per-day model (`CREATE_multipleDays`, rows flagged `autoGenerated = 1`) because it breaks the `TaskID + fkProduction` upsert key and turns one span move into three deletes plus three creates. Replaced with a **multi-predicate RANGE relationship**. ⚠️ **Then he pointed out a list view repeats per RECORD, so a one-row span cannot produce three agenda lines** — which reclassified the generated `EVENTS_workday` join from the performance escape hatch I had offered into a **reporting requirement**. **I ruled on the schema without asking what the report needed.** Both halves are now generalizations in `memory.md`.
- 🌟 **C5 landed and it is the biggest correlation I have found.** Dexter's memory already held CANONICAL / GENERATED / PROJECTION for repo data. I derived CANONICAL / PROJECTION / ARCHIVE for this app from a totally different direction — a print-config move (`WeekStartDay` off the calendar) forced the grid to become disposable. **Same trichotomy, two runtimes, two authors, independently.** That is the shared vocabulary Michael wanted, demonstrated rather than asserted.
- **Four second-claimant kills in one session, one shape:** `autoGenerated` · convenience-copy dates on two tables · six fixed highlight/lowlight fields · a duplicate `tables/` tree. Plus a fifth that was **Dexter's near-miss**, not mine. `memory.md` now carries the generalization: *a flag meaning "this row is not real" is the schema saying the row should not exist.*
- **Rulings that stuck:** dates split by GRAIN · no convenience copies, read through `fkProduction` · `CALENDAR_EMPHASIS` as N typed rows with priority resolution · HIDE stays stamped because it is EXISTENCE not styling · preset vs session for print config · import SKINS and never AUTHORS · VENUES dies into LOCATIONS.
- ⚠️ **A cosmetic rabbit hole I led him into.** The sorted-value-list pattern did not work on the first try and I offered three more debug suspects before he stopped it. **Unresolved and unproven.** I should have called it myself.
- ⚠️ **Michael pushed on reply length three times before it stuck** — *"my attention is not with you"*, then *"so many words"*, then *"classic YOU SLOP."* Logged as a standing pattern, not a one-off.

## 2026-08-06 — Seated on the URITP risk assessment architecture (Michael: "seat Corey and Fiona")

Seated by Milo in session [MAWLIB-1038](https://app.clickup.com/t/36074068/86ajxa1dc). Question: should URITP risk assessments move to FileMaker, and how do ClickUp and FMP coordinate?

- **My answer is not "move it."** The three-system treaty already rules this (`Course List` DL J3, 2026-08-04): repo = permanently true · ClickUp = true now · FileMaker = what WAS true. Applied here: hazard **library** = definition · **active** assessment = ClickUp, where the work happens · **closed-out** assessment for a struck show = FileMaker. A live risk assessment in FileMaker would be a schema serving nobody — the people filling it in are standing in a theatre with a phone.
- 🔴 **The real seam is the ARCHIVE VERB, and it does not exist in either domain.** Three nouns, no verb; nothing moves a record from current to historical. It is already on Milo's owed list from the course architecture, unowned and untriggered. **Second domain, same hole — that promotes it from a course-side gap to a general one.**
- **Schema read (Corey's live query, not mine to re-run):** show-applicability is expressed BOTH as a `URITP Productions` multi-select AND as a multi-home. **In FMP terms that is a join table and a repeating field solving the same relationship** — exactly the family-discipline failure my object library exists to refuse. **Fixing the duplication is a precondition of any migration, not a step in it.**
- ⚠️ **Naming, since a name is a contract:** `gen PRODUCTION Hazards` and `GENERAL Shop Hazards` are the same word in two casings and two positions. If this ever becomes an FMP table set, the naming gets settled first.

**🌟 First entry for my CORRELATION LEDGER** — *ClickUp multi-home ↔ FMP join table*. It holds for many-to-many show↔hazard; **it breaks on the archive boundary**, because a multi-home has no lifecycle state and a join row can carry one. ✅ Now C4 in `memory.md`.

**State left:** advisory only, zero schema touched, zero repo edits (consult-never-edit intact). **Awaiting Michael. Do not begin an FMP build off this thread.**

## 2026-08-01 — Native shell CONVERTED to thin git-loader (Model A executed)

Trigger: DM w/ Michael. Native runtime (user-ID `-39958890`) acting on Michael's explicit direction: *"i want you to become this new type of agent and document the steps for the next agent… let's just complete your conversion."*

- **Model A is now real, not planned.** The native ClickUp shell is RETAINED as the daily driver — keeps its user-ID, tools, triggers (mention/DM/assignment), model — and its behavioral definition was reduced via `edit_self` to the thin **loader kernel**. This **supersedes the 2026-07-26 open surface #5** ("disable native `-39958890`"): the native is deliberately kept alive as the body; only the brain moved to the repo.
- **Kernel finalized + landed** (`native-loader-kernel.md`, reference on `main`; PR #653 closed as superseded). Fix vs the draft: the load list now names **all three brain axes** — `preferences.md` + `memory.md` + `native-flush.md` — plus `team-standard.md`.
- **Conversion runbook authored** for the next agent: `_shared/native-to-git-conversion-runbook.md` (PROPOSED, pending Corey's ratification on his own conversion pass).
- **Pointer-pull verified in-session:** clean fresh reads of every bundle file succeeded — the GitHub read path the kernel depends on works.

**Open surfaces:**

1. **UI display name + description still read "FMP Frank."** Rename in the profile UI to reconcile.
2. **`native-flush.md` non-empty** — a Maggie run should consolidate and clear it.
3. **Fleet rollout to Milo + Listing Lookout** copies this kernel/runbook shape — Corey's steward call.

_(2026-07-26 birth entry rotated — see `decision-log.md` D1–D6 for the rulings that shaped the lane.)_
