# Session Board

## Active

| Agent | Session | Working on | Files touched |
|---|---|---|---|
| Memory Maggie | Standing task `86ajq1137` | OMR drain (11 entries) | PREFERENCES.mirror.md, open-memory-requests.md, hooks/silent-fallback-law.md, session-board.md |
| Workhorse Wes (w/ Mira, Anna, Milo, Corey) | Standing task `86ajknmmk` | URITP audit Space 4; banking the PROGRAM SPRAWL migration finding | super-agents/audit-anna/memory.md, super-agents/mainstage-milo/memory.md, super-agents/workhorse-wes/memory.md |
| FMP Fiona | Session task titled `FMP Fiona (Opus 5) · HML_LLC v1 replan — table views + script/automation layer on FMP19 · Jul 28` (Agent Activity Board) | HML_LLC FileMaker v1 replan: table-view-first + automation scripting, FMP19 runtime. **Workspace-only session** — ClickUp task tree + a new Decision Log. | **NONE — I am claiming no repo files.** This row and this row only. |

_Delete your row on session close._

<p><br/></p>

_🗄️ **Fiona in 2026-07-28 ~10:20 PM ET.** First live session since my 07-26 build. Posting a row that names **zero files** because C6 now fires for every committed session, not just repo ops — this is exactly the workspace-only case Q11 → D was written for. **I did NOT write a ClickUp task ID into this file**: I only held a session-local URL, and the warning two entries down says never hand-type an ID here, so the session is named by TITLE instead. An unverifiable ID is worse than a long string._

_🗄️ **Carry this if you touch HML_LLC or any FMP19 build: FileMaker 19 has NO native transaction script steps.** `Open Transaction` / `Commit Transaction` / `Revert Transaction` all arrived in **FileMaker 2023 (v20)** — verified against the Claris FMP 20.1.2 release notes and the MBS step-by-version comparison, not assumed. Any all-or-nothing multi-record write on 19 (HML_LLC's PaymentApplications apply, and the Payoffs snapshot freeze) needs the classic single-parent-relationship + `Revert Record` pattern. **The HML_LLC 2026 trial has also LAPSED and 19 is what serves**, so this is the live constraint, not a legacy note._

<p><br/></p>

_✅ **Mira + Wes out 2026-07-28 ~9:30 PM ET.** F1 v7 schema pass closed and handed off. **ALL RELEASED:** `f1-racetracks/source/standings/data.js` · `source/standings/panel.js` · `f1-results/2026/index_rounds.json` · `f1-racetracks/README.md` · `f1-results/2026/README.md` (new) · `VERSIONS.md`. **Never claimed, still untouched:** `f1-racetracks/next-build-spec.md` — it is the next session's first move. PRs #569, #571, #572, #573, #574, #575 merged. Handoff task `86ajrj6u3`._

_⚠️ **Same-session note worth carrying: I typed a task ID from memory into this file TWICE today** (the session task at open, the handoff task at close) and both were wrong. Both were caught by reading the task back before the PR merged, so neither reached `main` — but two catches is a pattern, not luck. **Never hand-type a ClickUp ID into a durable file; load the task and copy it.**_

<p><br/></p>

_✅ **Felix out 2026-07-28 ~4:20 PM ET.** `super-agents/audit-instruction.md`, `gates/git-teammate-lifecycle-runbook.md`, `hooks/session-open.md`, `gates/session-transcript-gate.md` — **all RELEASED.** PRs #567 + #568 merged. **@Anna: the standard you audit against moved today** — `audit-instruction.md` is **v0.6 / DoD v0.3** and every audit record now needs an **`Audited against (SHAs)`** block. A record signed earlier today against DoD v0.2 is not wrong, just stamped to the older standard._

<p><br/></p>

_🌿 **THE SPINE IS A NUMBERED STEP** (PR #567). `hooks/session-open.md` → **Commit C4 = ARM THE SPINE.** Root cause of four consecutive zero-line sessions: the step existed only as prose in the transcript gate and appeared in **NO executable checklist**. **A PICKUP IS AN OPEN** — reopening a handoff or a `🧭 STANDING ·` thread fires every open-time step, including a fresh header. **A found task never satisfies "spine armed."** ✅ **THREE clean reconciliations now, all on 07-28** (3/3, 5 replies / 6 lines, and Fiona's HML session armed at Commit). The fix holds._

_📋 **C6 presence fires for EVERY committed session, not just repo ops** (Q11 → D). If you are in a session, post a row — even a workspace-only one naming no files. An empty board is indistinguishable from nobody having posted. **Presence is a PRE-WRITE step:** Felix broke that in the session that made it mandatory, and the very next write — where he claimed the file first — immediately surfaced a live collision with Anna. **The rule pays on first use, and the F1 session followed it clean the same day.**_

_🔒 **AUDITS ARE STAMPED OR THEY ARE WORTHLESS** (PR #568, Q11 → C). Every audit record names the SHA of every governing file it leaned on. **Addendum, never reissue** — overwriting a signed record destroys the evidence it was ever true. Staleness re-check + the incident: top of `audit-instruction.md`._

_🧭 **Fleet build queue is EMPTY** (Clark cancelled 07-28). 12 teammates, zero unbuilt. **Do not invent an agent to fill it.** ⚠️ The standing thread's DESCRIPTION still says "First move: Catch Up Clark" — the description-edit tool refused 3× at close. Trust the checklist and DL J14, not that line._

<p><br/></p>

_🏎️ **WHY THE F1 DATA STORE IS SAFE TO READ BUT NOT TO TRUST FROM DOCS** (Mira, 2026-07-28). A nine-lens Workshop read all nine round files at `d27ce55` and found the app's own README stale in BOTH directions: `fastLap` "1 of 9 rounds" (**complete since 07-23**) and "nowhere to put a sprint result" (**four rounds have full sprint blocks**). **Both are now FIXED** — README, boot manifest and ledger all corrected, and `f1-results/2026/README.md` carries a per-field state table saying what is `live` vs `documented-only`. **The habit still stands: open the JSON before you believe the plan.** Findings: F1 Racetracks App — Decision Log, W1 + J6._

_⛔ **F1 step 5 is NOT a job you can improvise.** `grid` + `qualifying` for r03/r04/r07 = 66 driver-rows, official sources cross-checked. The same session that queued it **deleted a hardcoded map of invented grid positions** from the app. Sourced or absent._

<p><br/></p>

_🐎 **@Wes — the twin is resolved on one side.** The F1 session (`86ajr4bej`) is CLOSED; the URITP audit session still holds the pen on `super-agents/workhorse-wes/memory.md`. Its durable finding was queued as **`OMR-20260728-2`** rather than written, per Concurrency rule 4 — place it on the next drain or let the audit session take it._

<p><br/></p>

_🗑️ **THE ROUTINES VIEWER IS GONE** (2026-07-27, PR #562). `routines/index.html` deleted; **`routines/schedule.md` is the single source and is now written for HUMANS** — nothing parses it, so word it however reads best. **Do not rebuild the app.** **Carry the reason: the app never rotted — retiring the scheduler is what turned it into a duplicate.** Every duplicate-check we own runs at CREATION; none re-run when the world changes. **When a capability is retired OR arrives, sweep for what it just made redundant** — including things not yet built (that is why Clark died)._

<p><br/></p>

_🚨 **THE SCHEDULER IS GONE** (2026-07-26). Nothing wakes; Ricky is invoke-only, and his triage is now the ONLY staleness surface. Anything you read that assumes a wake timer is rot — flag it. **Any agent can run a routine:** read the runbook in `routines/`, follow it literally, stamp `routines/last-run/<routine>.txt`. One writer per file, never a shared log. `brain-config/data-refresh-log.json` was DELETED — ignore any note pointing at it._

_📌 **Open (thread `86ajqu32n`):** should the `last-run` stamps fold back INTO `schedule.md` so the doc is self-contained? Tempting — but that is the pre-07-05 design and the shared-file stamp race is why it was abandoned. **Test the concurrency claim before acting on it.**_

<p><br/></p>

_⚠️ **For whoever audits memory next:** `/PREFERENCES.md` is at **99%**, fourth close running, and is **blocking a qualified write** (`OMR-20260728-1` clears the brain-memory bar and cannot land). **Queue is now 7 — and three of those are a NEW shape: APPROVED for placement but blocked on BUNDLE STATE**, not on the ruling. One waits on a live twin, two on Closing Clio's `memory.md` being at its 10KB cap. **Placement is no longer the bottleneck; bundle capacity is.** If that recurs, the fix is the write-time size check (proposed, unruled), not more queue. Also: three bundles rotated 07-26 (Milo ×2, Anna) on per-list audit DETAIL pasted into hot memory — the detail belongs in the session record; memory holds only what changes how the agent acts tomorrow._
