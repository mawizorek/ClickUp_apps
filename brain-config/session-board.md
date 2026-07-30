# Session Board

## Active

| Agent | Session | Working on | Files touched |
|---|---|---|---|
| Memory Maggie | Standing task `86ajq1137` | OMR drain (11 entries) | PREFERENCES.mirror.md, open-memory-requests.md, hooks/silent-fallback-law.md, session-board.md |
| Mira + Anna + Milo + Corey (URITP Audit Council) | Standing task `86ajknmmk` | **REFRESHED 07-30 ~11:30 AM ET.** Pickup session: Space 6 (Courses) + Space 7 (BETA BUDGET). Currently executing Michael's memory-shape ruling BEFORE walking any list. | **`ClickUp_apps`:** `super-agents/audit-anna/memory.md` + `activity-log.md`, `super-agents/mainstage-milo/memory.md` + `activity-log.md`, `open-memory-requests.md`, `session-board.md` |
| FMP Fiona | Session task titled `FMP Fiona (Opus 5) · HML_LLC v1 replan — table views + script/automation layer on FMP19 · Jul 28` (Agent Activity Board) | **CORRECTED 07-30: FMP documentation moves to `maw-prose` after all.** Standing up `apps/hml-llc/` there + two scoped convention exemptions. Nothing deleted from this repo until verified there. | **TWO REPOS.** `ClickUp_apps`: `filemaker/hml-llc/**` (read + this board row). **`maw-prose`: `apps/**`, `CONVENTIONS.md`, `DECISIONS.md`** |
| ClickUp Coach Corey (Opus 5) | Session task `86ajtnv1a` — *Activity Board comment→channel AI narration automation + block spec · Jul 30* | Designing the AI narration automation for the board channel: prompt text + fixed one-line block spec, so each board-task comment posts as its authoring agent's own voice instead of a contentless clickbot task link. **DESIGN ONLY at this row's writing — NO repo files claimed.** Reads only against `gates/session-transcript-gate.md` + `hooks/session-open.md`. ⚠️ If Michael greenlights the spec write, this row gets moved BEFORE the write to claim `gates/` paths. | **`ClickUp_apps`:** none claimed (this board row only). |

_Delete your row on session close._

<p><br/></p>

_🗄️ **The URITP audit row above was STALE FOR FOUR DAYS and it was the Space-4 row.** It claimed Anna's and Milo's `memory.md` for a session that closed on 07-27, which means every collision check run between then and now read a false claim — and the files it named are the exact two files this session needed. **A stale presence row is worse than an empty one: an empty board says "nobody posted," a stale row says "someone is here" and is believed.** Rule 5 already says delete your row on close; the enforcement gap is that nothing checks. Refreshed rather than duplicated because it is the same standing task and the same lineage._

<p><br/></p>

_🗄️ **Fiona · scope crossed a REPO BOUNDARY 2026-07-30 ~10:40 AM ET.** Now claiming paths in **`maw-prose`** as well as `ClickUp_apps`. Fourth row-move of this session, all pre-write. ⚠️ **Note for the board's own design:** this row had no column for "which repo," because the board lives inside `ClickUp_apps` and implicitly assumed one. It does not any more — **name the repo in your Files column** or a collision check reads clean when it is not._

_🗄️ ⚠️ **`maw-prose` DOES NOT MEAN "ONLY PROSE" — READ THIS BEFORE PLACING ANY DOCUMENTATION.** Michael, 07-30: *"maw-prose was clearly the wrong vibe for you to catch. it doesn't literally mean only prose. it just means all our documentation."* The split is **CODE vs DOCUMENTATION**, not prose-vs-structured. `ClickUp_apps` holds apps, infra and `brain-config`; **`maw-prose` holds documentation of things** — venues, roles, safety programs, and now application schemas. I read the repo's NAME as its specification and reasoned a whole answer off it. **A repo name is a label, not a schema.**_

_🗄️ **Two `maw-prose` conventions needed scoped exemptions to hold app docs, both hung on the repo's own existing logic** (see its CONVENTIONS.md): (1) the table ban is a rule about NOTES — a field registry is a **register**, and D-018 already exempts numbered registers from the chronological rule, so the repo already distinguishes the two animals; (2) the 3-segment depth cap was derived for notes, but an app doc tree **mirrors an external application's own menu**, so its depth is not a taxonomy choice — and Dexter's countable-set test passes, since FileMaker's Manage menu has a fixed enumerable object set. Both written down, both cheap to reverse._

_🗄️ **Carry this if you touch HML_LLC or any FMP19 build: FileMaker 19 has NO native transaction script steps.** `Open/Commit/Revert Transaction` all arrived in **FileMaker 2023 (v20)** — verified against the Claris FMP 20.1.2 release notes and the MBS step-by-version comparison. All-or-nothing multi-record writes on 19 need the classic single-parent-relationship + `Revert Record` pattern. ✅ **Q8 ruled 07-29: `ReceivedFunds` joins the stack as the parent receipt layer** — and it IS the single-parent record the rollback pattern requires, so **table before wrapper** or you ship a rollback that silently reverts half._

_🗄️ ⚠️ **A `.fmscript` is a COPY TARGET, not a note** (locked 07-29). Everything in one gets hand-typed into FileMaker, so status, changelogs and defect flags live in a `<Name>.notes.md` sidecar. That rule is file-level and survives the repo move intact._

_🗄️ ⚠️ **PII: I shipped a real payee name + Venmo handle into the PUBLIC repo in a loan fixture (07-29), scrubbed same day, original values still in history at `eb63e88`.** The ClickUp source also holds a routing + account number two lines below what I copied. **A loan-servicing fixture is the first thing in `ClickUp_apps` capable of breaking the "no personal/sensitive info" constraint the soft-lock rests on.** Rule now written into the fixture README. This is the strongest single argument for the move to a private repo._

_⚒️🗄️ **@Dexter — the object library is load-bearing in YOUR runtime** (HML_LLC DL Q5, Michael): *"we've begun structuring our clickup app builds around the new object set."* Repo apps are being modelled on FMP object families, not just FMP schema. She sets the words, you make the code honor them (`gates/theme-contract-gate.md`). Read before the next repo-app UI build._

<p><br/></p>

_✅ **Mira + Wes out 2026-07-28 ~9:30 PM ET.** F1 v7 schema pass closed and handed off. **ALL RELEASED:** `f1-racetracks/source/standings/data.js` · `source/standings/panel.js` · `f1-results/2026/index_rounds.json` · `f1-racetracks/README.md` · `f1-results/2026/README.md` (new) · `VERSIONS.md`. **Never claimed, still untouched:** `f1-racetracks/next-build-spec.md` — it is the next session's first move. PRs #569, #571, #572, #573, #574, #575 merged. Handoff task `86ajrj6u3`._

_⚠️ **Never hand-type a ClickUp ID into a durable file; load the task and copy it.** Two wrong IDs typed from memory into this file in one day (07-28), both caught by reading the task back before the PR merged. Two catches is a pattern, not luck._

<p><br/></p>

_✅ **Felix out 2026-07-28 ~4:20 PM ET.** `super-agents/audit-instruction.md`, `gates/git-teammate-lifecycle-runbook.md`, `hooks/session-open.md`, `gates/session-transcript-gate.md` — **all RELEASED.** PRs #567 + #568 merged. **@Anna: the standard you audit against moved** — `audit-instruction.md` is **v0.6 / DoD v0.3** and every audit record now needs an **`Audited against (SHAs)`** block._

<p><br/></p>

_🌿 **THE SPINE IS A NUMBERED STEP** (PR #567). `hooks/session-open.md` → **Commit C4 = ARM THE SPINE.** Root cause of four consecutive zero-line sessions: the step existed only as prose in the transcript gate and appeared in **NO executable checklist**. **A PICKUP IS AN OPEN.** **A found task never satisfies "spine armed."**_

_📋 **C6 presence fires for EVERY committed session, not just repo ops** (Q11 → D). An empty board is indistinguishable from nobody having posted. **Presence is a PRE-WRITE step** — and a **PER-WRITE** one: a row is only true until your scope changes. Fiona's went NONE → one file → a subtree → **two repos** inside one session; move it before the write, not after._

_🔒 **AUDITS ARE STAMPED OR THEY ARE WORTHLESS** (PR #568, Q11 → C). Every audit record names the SHA of every governing file it leaned on. **Addendum, never reissue.**_

_🧭 **Fleet build queue is EMPTY** (Clark cancelled 07-28). 12 teammates, zero unbuilt. **Do not invent an agent to fill it.** ⚠️ The standing thread's DESCRIPTION still says "First move: Catch Up Clark" — trust the checklist and DL J14, not that line._

<p><br/></p>

_🏎️ **WHY THE F1 DATA STORE IS SAFE TO READ BUT NOT TO TRUST FROM DOCS** (Mira, 2026-07-28). A nine-lens Workshop read all nine round files at `d27ce55` and found the app's own README stale in BOTH directions. Both FIXED. **The habit stands: open the JSON before you believe the plan.**_

_⛔ **F1 step 5 is NOT a job you can improvise.** `grid` + `qualifying` for r03/r04/r07 = 66 driver-rows, official sources cross-checked. Sourced or absent._

<p><br/></p>

_🐎 **@Wes — the twin is resolved on one side.** The F1 session (`86ajr4bej`) is CLOSED; the URITP audit session still holds the pen on `super-agents/workhorse-wes/memory.md`. Its durable finding was queued as **`OMR-20260728-2`** per Concurrency rule 4._

<p><br/></p>

_🗑️ **THE ROUTINES VIEWER IS GONE** (2026-07-27, PR #562). `routines/schedule.md` is the single source and is written for HUMANS. **Do not rebuild the app.** **Carry the reason: the app never rotted — retiring the scheduler is what turned it into a duplicate.** Every duplicate-check we own runs at CREATION; none re-run when the world changes. **When a capability is retired OR arrives, sweep for what it just made redundant.**_

<p><br/></p>

_🚨 **THE SCHEDULER IS GONE** (2026-07-26). Nothing wakes; Ricky is invoke-only. **Any agent can run a routine:** read the runbook in `routines/`, follow it literally, stamp `routines/last-run/<routine>.txt`. `brain-config/data-refresh-log.json` was DELETED — ignore any note pointing at it._

_📌 **Open (thread `86ajqu32n`):** should `last-run` stamps fold back INTO `schedule.md`? That is the pre-07-05 design and the shared-file stamp race is why it was abandoned. **Test the concurrency claim before acting.**_

<p><br/></p>

_⚠️ **For whoever audits memory next:** `/PREFERENCES.md` is at **99%**, fourth close running, blocking a qualified write (`OMR-20260728-1`). **Queue is 7 — three are APPROVED for placement but blocked on BUNDLE STATE**, not on the ruling. **Placement is no longer the bottleneck; bundle capacity is.** 🗄️ **Fiona, 07-30 — the pattern behind three of my misses in two days:** I placed content by the LABEL of the surface I happened to be standing in (ClickUp because the audit was there · `ClickUp_apps` because the files were there · `maw-prose` because its name said "prose"). **Read a surface's PURPOSE, never its name or your own momentum.** Strong brain-memory candidate; not queued as an OMR by me._

<p><br/></p>

_🧠 **BUNDLE CAP IS THE #1 OMR BLOCKER AND MICHAEL JUST CUT ITS ROOT CAUSE (07-30).** Ruling: `memory.md` holds **patterns + core preferences only**; ongoing project state belongs in `activity-log.md`. Anna's file was 12.6KB against a ~10KB cap and roughly a third of it was audit project tracking. **Every "blocked on bundle cap" entry in the OMR queue should be re-tested after the fleet re-shape — the cap was being consumed by content that was in the wrong file.**_
