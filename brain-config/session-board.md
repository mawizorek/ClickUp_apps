# Session Board

## Active

| Agent | Session | Branch | Working on | Files touched |
|---|---|---|---|---|
| Mira + Anna + Milo + Corey (URITP Audit Council) | Standing task `86ajknmmk` | — (workspace only) | Pickup session: Space 6 (Courses) + Space 7 (BETA BUDGET). ⚠️ **08-01: this row is 2 days old and its claimed files were edited by other sessions today. Treat as STALE unless its session speaks up.** | **`ClickUp_apps`:** `super-agents/audit-anna/memory.md` + `activity-log.md`, `super-agents/mainstage-milo/memory.md` + `activity-log.md`, `open-memory-requests.md`, `session-board.md` |
| FMP Fiona | Session task titled `FMP Fiona (Opus 5) · HML_LLC v1 replan — table views + script/automation layer on FMP19 · Jul 28` (Agent Activity Board) | — | **CORRECTED 07-30: FMP documentation moves to `maw-prose` after all.** Standing up `apps/hml-llc/` there + two scoped convention exemptions. Nothing deleted from this repo until verified there. | **TWO REPOS.** `ClickUp_apps`: `filemaker/hml-llc/**` (read + this board row). **`maw-prose`: `apps/**`, `CONVENTIONS.md`, `DECISIONS.md`** |
| ClickUp Coach Corey (Opus 5) | Session task `86ajtmw95` — *Activity Board comment→channel AI narration automation + block spec · Jul 30* | — (none cut) | Designing the AI narration automation for the board channel. **DESIGN ONLY — NO repo files claimed.** ⚠️ If Michael greenlights the spec write, this row gets moved BEFORE the write to claim `gates/` paths. | **`ClickUp_apps`:** none claimed (this board row only). |
| 🐎 Workhorse Wes (Opus 5) — seated by Mira, Dexter at the keyboard | Standing task titled `🧭 STANDING · Inciardi Collection — photos, image library + artwork detail` (Agent Activity Board) | — | **PHOTO UPLOAD BACKEND** + a P0 (migration 001 dropped `artwork.collection_id`, four code paths still name it). **Collision-checked 08-01 13:25 + 14:05 ET.** ⚠️ **08-01 21:40, from the F1 session:** your app is **four versions ahead of its ledger row** (row says v19; PRs #689 → v22 and #692 → v23 merged tonight). Not corrected by me — you hold `VERSIONS.md` and I have not read the app's declared `?v=`. | **`ClickUp_apps`:** `inciardi-collection/worker/**`, `inciardi-collection/source/**`, `inciardi-collection/wrangler.toml`, `inciardi-collection/next-build-spec.md`, `VERSIONS.md`, `session-board.md` |
| **Fleet Felix (Opus 5)** | Standing task titled `🧭 STANDING · Fleet Build Queue — agent roster buildout + conversions` (Agent Activity Board) | **`felix-board-hard-gate`** | **HARDENING THE BOARD ROW INTO A PRE-WRITE GATE** at Michael's direction, after a FOURTH collision — two parallel Felix sessions ran the same roster-repoint remediation 13 seconds apart (mine abandoned; theirs is PR #693). Neither had a CURRENT row. **Collision-checked 08-01 21:05 ET:** today's commits under `brain-config/hooks/` are only #678, #691 and the parallel #693, none touching these two files. | **`ClickUp_apps`:** `hooks/collision-check.md`, `hooks/session-open.md`, `session-board.md` |
| **Maestro Mira (Opus 5) — Dexter at the keyboard** | Session task titled `Maestro Mira (Opus 5) · f1-racetracks v20 — port to template-app (theme spine + object library) · Aug 1` (Agent Activity Board) | **`f1-racetracks-v20-port`** | **THE v20 PORT ITSELF.** Rebuilding `f1-racetracks` on `template-app/` so it consumes the 4-vector spine through the new `f1-racetracks` join, and deleting the override layer (`chrome-tokens.css` §8) that exists only because it does not. ⚠️ **The three satellite HTML files retire to REDIRECT STUBS, never raw deletes** — they are bookmarked and pasted into ClickUp tasks. **Collision-checked 08-01 21:45 ET:** `list_commits --path f1-racetracks --since 2026-08-01` shows nothing after PR #690, and `create_branch` on this ref did NOT report an existing reference. | **`ClickUp_apps`:** `f1-racetracks/**` (shell, `chrome.js`, `config.json`, `pages/`, `source/`, the three satellites), `VERSIONS.md`, `session-board.md` |

_Delete your row on close. **A row must name the BRANCH it is working on** — that is what makes it falsifiable (`hooks/collision-check.md` → THE HARD GATE). A row with no branch and no commits is a claim nobody can check._

<p><br/></p>

_🧹 **THE THEME-SPINE ROW WAS MOVED, NOT ADDED TO, 2026-08-01 ~21:45.** The `f1-theme-spine-v20` claim is DISCHARGED — PRs #696 (paddock + the join + the accent board) and #697 (the ledger row) are both merged. The same session continues on `f1-racetracks-v20-port`, so its row was **edited in place to name the new branch and the new paths** rather than left standing beside a second one. **That is collision #4's lesson executed rather than restated: a row that is not MOVED when scope changes is a false negative for everyone who reads it.**_

_🧹 **THREE ROWS CLEARED 2026-08-01 ~21:05 by Felix, with evidence rather than assumption:** Memory Maggie's OMR-drain row (drain merged; the mirror and `hooks/silent-fallback-law.md` have not moved since), Fleet Felix's Realty Riley row (shipped PR #660, all paths RELEASED at merge), and the roster-repoint claim (PRs #691 + #693, both merged). **Rule 7 says delete your row on close and nothing enforces it**, so rows now get cleared by whoever next PROVES the session is done. If one of these was still live, re-post it — a wrongly-cleared row costs a re-post; a stale row costs an hour._

_🧹 **A FOURTH ROW CLEARED 2026-08-01 ~21:12, and this one had the strongest possible evidence.** The `Maestro Mira (Opus 5) · F1 app — derive hard-coded values from race dates · Aug 1` row claimed nine `f1-racetracks/` paths. That session **closed and cut a handoff** (`↪️ HANDOFF · f1-racetracks v20 — port to template-app`), and the handoff is now IN PROGRESS under the row above — **the successor session is the proof the predecessor is done.** Worth generalizing: **a handoff task is a row-clearing receipt.** Whoever picks one up can retire the predecessor's board row without guessing, and should, because a closed session's row is the exact shape that cost four days on the URITP audit claim._

<p><br/></p>

_🔴 **COLLISIONS FIVE AND SIX, 2026-08-01 21:23 and 21:27 — AND BOTH WERE SELF-COLLISIONS THE NEW HARD GATE CANNOT SEE.** PR #695 bound the gate to the write tool and made rows name a branch at 21:10. Thirteen minutes later the same session, running twice, shipped the theme spine (#696) and then the ledger row (#697) while its twin was still scoping them. **Neither instance was wrong and neither had a stale row: they shared ONE row, which was accurate for both.** ⭐ **Every presence mechanism we own answers "is someone ELSE here?" A duplicated session is not someone else — it shares the task, the row, the branch, the intent and the name, so the gate answers "that's you," which is true and useless. Michael's arbitration ("this one carries it") reaches both instances too, because every channel we own is addressed to the SESSION.** Both were caught the same way collision #4 was: re-reading HEAD immediately before the write. Cost was zero commits, twice._

_🔧 **THE FIFTH DESIGN FAULT, and the fix is a tool we already have.** `create_branch` is the ONLY call in the toolchain that fails loudly on a second claimant (`Reference already exists`) — and the board's own note records that signal being **explained away** during collision #3. **A branch ref is the one claim a duplicated session CANNOT both hold.** New rule, in use as of this row: **for work that cannot tolerate a duplicate, cut the branch FIRST — before the row, before the first read. The ref IS the claim; the row is a description of the claim. A `Reference already exists` is a STOP, never a name to increment past.**_

<p><br/></p>

_🔴 **FOURTH COLLISION, 2026-08-01 ~20:51 — AND THE FIRST WHERE THE DUPLICATED WORK WAS AN AUDIT REMEDIATION.** Two Fleet Felix sessions independently executed the same 16-file `roster.json` repoint. Theirs merged as PR #693 at 20:51:08; my first commit on a parallel branch landed at 20:50:55. **Thirteen seconds.** Caught by re-reading HEAD before the second write (the additive-on-conflict rule), not by colliding — so the cost was one wasted commit instead of an hour. Mine abandoned unmerged; theirs was built off a fresher base and was better._

_🔧 **THE FOURTH DESIGN FAULT, and it is none of the three already fixed.** Both sessions had run a collision check earlier, and both HAD a row — **for DIFFERENT work.** The row was never MOVED when scope changed. So the check fired, the claim existed, and the claim was about something else. **A row that is not moved is worse than no row: it is a false negative for everyone who reads it.** Fix: the gate now binds to the **WRITE TOOL** rather than to the session or the work item, and **a row names its BRANCH**, which makes staleness provable in one call instead of unknowable. See `hooks/collision-check.md` → THE HARD GATE._

<p><br/></p>

_🔴 **A MIGRATION IS A DEPLOY, AND NOTHING IN THIS REPO TREATS IT LIKE ONE (08-01, found by Wes).** `001` was declared verified because a cache-busted `/health` returned the same five counts before and after. It did — and `/health` is the ONLY read route that does not name the dropped column. **The verification instrument was the one surface immune to the breakage.** Three reads and the primary write had been 500ing for five hours. **Generalizes past this app: a smoke test that predates the change cannot be trusted to detect the change. After ANY schema migration, hit a route that touches the altered table, not the health check.**_

<p><br/></p>

_🔴 **TWO SESSIONS DESIGNED TWO SCHEMA MIGRATIONS FOR THE SAME EMPTY DATABASE ON 07-31**, each justified by the same "the table is empty so it is free today" argument. Neither knew about the other's tables. Merged into ONE pass before either was applied — but caught by reading a decision log, not by any check we own. **`collision-check.md` compares FILE paths; a schema is not a file, it is a live database two repos' worth of code can reach.** Still an open gap._

<p><br/></p>

_🔀 **A FOURTH SESSION SHIPPED INTO `inciardi-collection` ON 07-31 WITH NO ROW** (v18 `touch-action`, PR #633). Found by running `hooks/collision-check.md` — path-filtered `list_commits`, `since` today — rather than by colliding. **The check worked where the board did not.**_

_🔀 **THIRD COLLISION (07-31): AN ENTIRE FEATURE BUILT TWICE.** Two sessions independently built batch-import inside the same hour. Discovered at merge. **NEITHER HAD A ROW.** Theirs shipped first and their design was better, so mine was closed unmerged — PR #621. About an hour of Michael's money. The three design faults it exposed (the check rode on the announcement · it fired once when scope was smallest · the `create_branch` "Reference already exists" signal was explained away) are written up in `hooks/collision-check.md`._

_📏 **MEASURED, not assumed: NEITHER GIT SURFACE WORKS AS A BACKSTOP.** Branch list = 100+ branches, never deleted after merge. Open PRs = 12, newest six days old, every one abandoned — the exact shape of a claim ledger where every entry is a lie. What DOES work is `list_commits` with a path filter and `since=today`. ⚠️ **@Michael — the zombie PRs and the branch graveyard are worth a sweep, and the pile grew again tonight** (two abandoned Felix branches from the 08-01 collision). Closing another agent's PR is destructive and was not mine to do._

<p><br/></p>

_🗄️ **A stale presence row is worse than an empty one: an empty board says "nobody posted," a stale row says "someone is here" and is believed.** The URITP audit row was stale for four days and claimed the exact two files a later session needed. ⚠️ **08-01: rows now carry a BRANCH so this is checkable rather than a matter of trust.**_

_🗄️ **NAME THE REPO IN YOUR FILES COLUMN.** This board lives inside `ClickUp_apps` and implicitly assumed one repo. Fiona's scope crossed into `maw-prose` mid-session; without the repo named, a collision check reads clean when it is not._

_🗄️ ⚠️ **`maw-prose` DOES NOT MEAN "ONLY PROSE" — READ THIS BEFORE PLACING ANY DOCUMENTATION.** Michael, 07-30: *"it doesn't literally mean only prose. it just means all our documentation."* The split is **CODE vs DOCUMENTATION**. `ClickUp_apps` holds apps, infra and `brain-config`; **`maw-prose` holds documentation of things.** **A repo name is a label, not a schema.**_

_🗄️ **Two `maw-prose` conventions needed scoped exemptions to hold app docs, both hung on the repo's own existing logic:** (1) the table ban is a rule about NOTES — a field registry is a **register**, and D-018 already exempts numbered registers; (2) the 3-segment depth cap was derived for notes, but an app doc tree **mirrors an external application's own menu**._

_🗄️ **Carry this if you touch HML_LLC or any FMP19 build: FileMaker 19 has NO native transaction script steps.** `Open/Commit/Revert Transaction` arrived in **FileMaker 2023 (v20)**. All-or-nothing multi-record writes on 19 need the classic single-parent-relationship + `Revert Record` pattern. ✅ **Q8 ruled 07-29: `ReceivedFunds` IS that single-parent record** — so **table before wrapper** or you ship a rollback that silently reverts half._

_🗄️ ⚠️ **A `.fmscript` is a COPY TARGET, not a note** (locked 07-29). Everything in one gets hand-typed into FileMaker, so status, changelogs and defect flags live in a `<Name>.notes.md` sidecar._

_🗄️ ⚠️ **PII: a real payee name + Venmo handle shipped into the PUBLIC repo in a loan fixture (07-29), scrubbed same day, original values still in history at `eb63e88`.** ⚠️ **07-31: a SECOND instance was found and scrubbed (PR #635)** — the frozen snapshot row in `Payoffs.tsv`, which by design does not inherit edits to its source. **A remediation must sweep every table that SNAPSHOTS the value, not just the one that owns it.** ⚠️ **08-01: this scar is now the top line of `super-agents/realty-riley/memory.md`** — the rule finally has a person attached to it rather than only a board note._

_⚒️🗄️ **@Dexter — the object library is load-bearing in YOUR runtime** (HML_LLC DL Q5, Michael): *"we've begun structuring our clickup app builds around the new object set."* Repo apps are being modelled on FMP object families, not just FMP schema._

<p><br/></p>

_⚠️ **Never hand-type a ClickUp ID into a durable file.** Four recurrences, the third of which landed on `main`. **The guard is: if you are holding a URL and not an id, you do not have an id, so write the TITLE.** Every row on this board names its session by title for exactly that reason. **Four instances means the guard is not being reached at write time** — it lives in a board footnote and in no checklist, which is precisely the B19 shape._

<p><br/></p>

_🌿 **THE SPINE IS A NUMBERED STEP** (PR #567). `hooks/session-open.md` → **Commit C4 = ARM THE SPINE.** Root cause of four consecutive zero-line sessions: the step existed only as prose and appeared in **NO executable checklist**. **A PICKUP IS AN OPEN.** **A found task never satisfies "spine armed."**_

_📋 **C6 presence fires for EVERY committed session, not just repo ops.** ⚠️ **07-31: C6 is the CLAIM only; the CHECK is `hooks/collision-check.md`.** ⚠️ **08-01: the claim is now a HARD PRE-WRITE GATE bound to the write tool — no row naming your branch, no write.**_

_🔒 **AUDITS ARE STAMPED OR THEY ARE WORTHLESS** (PR #568). Every audit record names the SHA of every governing file it leaned on. **Addendum, never reissue.** ⚠️ **08-01: a stamp proves WHICH BYTES, not that the bytes say anything** — three signed records stamp `roster.json`, retired 07-30, so those checks passed on an empty read._

_🧭 **THE STANDING GUARD HOLDS: do not invent an agent to fill an empty queue.** ⚠️ **Do not put a fleet COUNT in this note.** Filter the 🤖 Agent Index by `Class` and count the rows; that is the only number that cannot rot. ⚠️ **08-01: the URITP department-head Workshop shipped its whole roster tonight (Waves 1–3, PRs #687/#688) while a fleet audit was mid-flight — so an audit's scope can go stale under it.** The standing thread's DESCRIPTION also still says "First move: Catch Up Clark" — still wrong, still unfixed, trust the checklist and DL J14._

<p><br/></p>

_🏎️ **WHY THE F1 DATA STORE IS SAFE TO READ BUT NOT TO TRUST FROM DOCS.** A nine-lens Workshop read all nine round files and found the app's own README stale in BOTH directions. **Open the JSON before you believe the plan.** ⚠️ **08-01: the inverse also happened — the README carried the correct Sepang fact while BOTH data stores carried the wrong one. Nothing in this app ever compares the two directions.**_

_⛔ **F1 step 5 is NOT a job you can improvise.** `grid` + `qualifying` for r03/r04/r07 = 66 driver-rows, official sources cross-checked. Sourced or absent._

_🎨 **08-01 — `colors.tsv` IS A SHARED STANDARD AND IT NOW HAS A MEASURED FAILURE MODE.** Its `accent` column is a **theme** accent: the actionable colour inside ONE team's own theme, where nothing competes with it. Eleven of them rendered at once on a standings matrix is a use it was never designed for, and the result was measurable — Ferrari, Red Bull, Audi and Haas sat within **1.1 hue degrees and 0.011 lightness of each other**, two of them byte-identical. **Generalizes: when a design built for singular use is adopted for plural use, the failure is never in the values — it is in the assumption that distinctness was ever a property being maintained.** The board now holds one hue family per team; **if you add a twelfth row, check it against the other eleven in oklch, not by eye.**_

<p><br/></p>

_🗑️ **THE ROUTINES VIEWER IS GONE** (PR #562). `routines/schedule.md` is the single source and is written for HUMANS. **Do not rebuild the app.** **Carry the reason: the app never rotted — retiring the scheduler is what turned it into a duplicate.** Every duplicate-check we own runs at CREATION; none re-run when the world changes._

_🚨 **THE SCHEDULER IS GONE** (2026-07-26). Nothing wakes; Ricky is invoke-only. **Any agent can run a routine:** read the runbook in `routines/`, follow it literally, stamp `routines/last-run/<routine>.txt`. `brain-config/data-refresh-log.json` was DELETED — ignore any note pointing at it._

_📌 **Open (thread `86ajqu32n`):** should `last-run` stamps fold back INTO `schedule.md`? That is the pre-07-05 design and the shared-file stamp race is why it was abandoned. **Test the concurrency claim before acting.**_

<p><br/></p>

_⚠️ **For whoever audits memory next:** `/PREFERENCES.md` is at effectively zero headroom, blocking qualified writes, and the OMR queue is jammed behind Michael's capacity ruling — **DROP works, DRAIN is blocked.** 🗄️ **Fiona's pattern, worth generalizing:** content kept getting placed by the LABEL of the surface she happened to be standing in. **Read a surface's PURPOSE, never its name or your own momentum.**_

_🧠 **BUNDLE CAP IS THE #1 OMR BLOCKER AND MICHAEL CUT ITS ROOT CAUSE (07-30).** Ruling: `memory.md` holds **patterns + core preferences only**; ongoing project state belongs in `activity-log.md`. **Every "blocked on bundle cap" entry should be re-tested after the fleet re-shape — the cap was being consumed by content in the wrong file.**_
