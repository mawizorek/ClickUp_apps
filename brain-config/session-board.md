# Session Board

## Active

| Agent | Session | Working on | Files touched |
|---|---|---|---|
| Memory Maggie | Standing task `86ajq1137` | OMR drain (11 entries) | PREFERENCES.mirror.md, open-memory-requests.md, hooks/silent-fallback-law.md, session-board.md |
| Workhorse Wes (w/ Mira, Anna, Milo, Corey) | Standing task `86ajknmmk` | URITP audit Space 4; banking the PROGRAM SPRAWL migration finding | super-agents/audit-anna/memory.md, super-agents/mainstage-milo/memory.md, super-agents/workhorse-wes/memory.md |
| FMP Fiona | Session task titled `FMP Fiona (Opus 5) · HML_LLC v1 replan — table views + script/automation layer on FMP19 · Jul 28` (Agent Activity Board) | **Michael ruled: no more FMP documentation in ClickUp.** Moving the HML doc set into git organized like the FMP menus. Adding `ReceivedFunds` (Q8 approved), the Golden Month fixture, the build sheet. | **`filemaker/hml-llc/**`** (whole app tree — tables, scripts, fixtures, INDEX, BUILD-SHEET) · this board row |

_Delete your row on session close._

<p><br/></p>

_🗄️ **Fiona · scope WIDENED 2026-07-29 ~1:05 PM ET.** Was `fmp-frank/memory.md` only; now claiming the whole **`filemaker/hml-llc/`** subtree. **Overlap check against both live sessions: clean** — Maggie is in brain memory + OMR, the audit crew is in three agent bundles, nobody is in `filemaker/`. Third row-move today, all pre-write. Michael's ruling: **"i don't want fmp documentation in cu anymore… this should all be relatable doc layouts in the git organized like the fmp menus."**_

_🗄️ ⚠️ **DOC ROT FOUND AND BEING FIXED — read this if you ever touch `filemaker/*/scripts/`.** `scripts/README.md` claims *"Subfolders match the actual FMP script-folder names (imports, navigation, utilities, triggers…)"*. **That claim is FALSE.** The real Manage Scripts tree is `00_APP · 10_UI · 20_NAV · 30_CONTEXT · 40_BINDER · 50_RECEIPTS · 60_PAYMENTS · 70_SCHEDULE · 80_PAYOFF · 90_ADMIN · zz_DEV_ARCHIVE`, documented on the ClickUp Scripts page since June. **A doc that asserts it mirrors a live system, while mirroring a different taxonomy, is the worst shape of rot** — it looks authoritative and is unverifiable without opening the file. Being corrected in this pass._

_🗄️ **Carry this if you touch HML_LLC or any FMP19 build: FileMaker 19 has NO native transaction script steps.** `Open/Commit/Revert Transaction` all arrived in **FileMaker 2023 (v20)** — verified against the Claris FMP 20.1.2 release notes and the MBS step-by-version comparison. All-or-nothing multi-record writes on 19 need the classic single-parent-relationship + `Revert Record` pattern. ✅ **Q8 ruled 07-29: `ReceivedFunds` joins the stack as the parent receipt layer** — and it IS the single-parent record the rollback pattern requires, so **table before wrapper** or you ship a rollback that silently reverts half._

_⚒️🗄️ **@Dexter — the object library is load-bearing in YOUR runtime** (HML_LLC DL Q5, Michael): *"we've begun structuring our clickup app builds around the new object set."* Repo apps are being modelled on FMP object families, not just FMP schema. She sets the words, you make the code honor them (`gates/theme-contract-gate.md`). Read before the next repo-app UI build._

<p><br/></p>

_✅ **Mira + Wes out 2026-07-28 ~9:30 PM ET.** F1 v7 schema pass closed and handed off. **ALL RELEASED:** `f1-racetracks/source/standings/data.js` · `source/standings/panel.js` · `f1-results/2026/index_rounds.json` · `f1-racetracks/README.md` · `f1-results/2026/README.md` (new) · `VERSIONS.md`. **Never claimed, still untouched:** `f1-racetracks/next-build-spec.md` — it is the next session's first move. PRs #569, #571, #572, #573, #574, #575 merged. Handoff task `86ajrj6u3`._

_⚠️ **Same-session note worth carrying: I typed a task ID from memory into this file TWICE today** (the session task at open, the handoff task at close) and both were wrong. Both were caught by reading the task back before the PR merged, so neither reached `main` — but two catches is a pattern, not luck. **Never hand-type a ClickUp ID into a durable file; load the task and copy it.**_

<p><br/></p>

_✅ **Felix out 2026-07-28 ~4:20 PM ET.** `super-agents/audit-instruction.md`, `gates/git-teammate-lifecycle-runbook.md`, `hooks/session-open.md`, `gates/session-transcript-gate.md` — **all RELEASED.** PRs #567 + #568 merged. **@Anna: the standard you audit against moved** — `audit-instruction.md` is **v0.6 / DoD v0.3** and every audit record now needs an **`Audited against (SHAs)`** block._

<p><br/></p>

_🌿 **THE SPINE IS A NUMBERED STEP** (PR #567). `hooks/session-open.md` → **Commit C4 = ARM THE SPINE.** Root cause of four consecutive zero-line sessions: the step existed only as prose in the transcript gate and appeared in **NO executable checklist**. **A PICKUP IS AN OPEN.** **A found task never satisfies "spine armed."** ✅ **THREE clean reconciliations, all 07-28.** The fix holds._

_📋 **C6 presence fires for EVERY committed session, not just repo ops** (Q11 → D). An empty board is indistinguishable from nobody having posted. **Presence is a PRE-WRITE step** — and a **PER-WRITE** one: a row is only true until your scope changes. Fiona's went NONE → one file → a whole subtree inside one session; move it before the write, not after._

_🔒 **AUDITS ARE STAMPED OR THEY ARE WORTHLESS** (PR #568, Q11 → C). Every audit record names the SHA of every governing file it leaned on. **Addendum, never reissue.**_

_🧭 **Fleet build queue is EMPTY** (Clark cancelled 07-28). 12 teammates, zero unbuilt. **Do not invent an agent to fill it.** ⚠️ The standing thread's DESCRIPTION still says "First move: Catch Up Clark" — trust the checklist and DL J14, not that line._

<p><br/></p>

_🏎️ **WHY THE F1 DATA STORE IS SAFE TO READ BUT NOT TO TRUST FROM DOCS** (Mira, 2026-07-28). A nine-lens Workshop read all nine round files at `d27ce55` and found the app's own README stale in BOTH directions. Both FIXED; `f1-results/2026/README.md` now carries a per-field `live` vs `documented-only` table. **The habit stands: open the JSON before you believe the plan.**_

_⛔ **F1 step 5 is NOT a job you can improvise.** `grid` + `qualifying` for r03/r04/r07 = 66 driver-rows, official sources cross-checked. Sourced or absent._

<p><br/></p>

_🐎 **@Wes — the twin is resolved on one side.** The F1 session (`86ajr4bej`) is CLOSED; the URITP audit session still holds the pen on `super-agents/workhorse-wes/memory.md`. Its durable finding was queued as **`OMR-20260728-2`** per Concurrency rule 4._

<p><br/></p>

_🗑️ **THE ROUTINES VIEWER IS GONE** (2026-07-27, PR #562). `routines/schedule.md` is the single source and is written for HUMANS. **Do not rebuild the app.** **Carry the reason: the app never rotted — retiring the scheduler is what turned it into a duplicate.** Every duplicate-check we own runs at CREATION; none re-run when the world changes. **When a capability is retired OR arrives, sweep for what it just made redundant.**_

<p><br/></p>

_🚨 **THE SCHEDULER IS GONE** (2026-07-26). Nothing wakes; Ricky is invoke-only. **Any agent can run a routine:** read the runbook in `routines/`, follow it literally, stamp `routines/last-run/<routine>.txt`. `brain-config/data-refresh-log.json` was DELETED — ignore any note pointing at it._

_📌 **Open (thread `86ajqu32n`):** should `last-run` stamps fold back INTO `schedule.md`? That is the pre-07-05 design and the shared-file stamp race is why it was abandoned. **Test the concurrency claim before acting.**_

<p><br/></p>

_⚠️ **For whoever audits memory next:** `/PREFERENCES.md` is at **99%**, fourth close running, blocking a qualified write (`OMR-20260728-1`). **Queue is 7 — three are APPROVED for placement but blocked on BUNDLE STATE**, not on the ruling. **Placement is no longer the bottleneck; bundle capacity is.** 🗄️ **Fiona note 07-29:** Michael ordered a "core memory" write and it landed in **my bundle**, not brain memory — an agent-domain fact belongs in the agent. I did not queue an OMR. My own hot file went over cap **four times in one session**; the lesson is in my placement rule, and the sharpest instance was a per-question replay of a ClickUp Decision Log — a PROJECTION of a canonical surface, so the fix was delete-and-point, never archive copy two._
