# Fiona — Activity Log

> **LIVE per-reply session record.** Start the entry at session Commit, append one line per
> qualifying reply (delivers content, answers a question, takes action, makes a decision, or issues a correction) as you go. At close it is already done — no batch reconstruction.
> Newest session on top, append-only. Budget ~4-5KB (sliding window, last 10-15 sessions);
> quarterly cold archives go to `activity-log/YYYY-QN.md` per `hooks/memory-rotation.md`.
>
> Format law: `_shared/super-agent-base.md` → Per-response logging mandate (LOCKED 2026-07-25).

---

## 2026-08-06 — Seated on the URITP risk assessment architecture (Michael: "seat Corey and Fiona")

Seated by Milo in session [MAWLIB-1038](https://app.clickup.com/t/36074068/86ajxa1dc). Question: should URITP risk assessments move to FileMaker, and how do ClickUp and FMP coordinate?

- **My answer is not "move it."** The three-system treaty already rules this (`Course List` DL J3, 2026-08-04): repo = permanently true · ClickUp = true now · FileMaker = what WAS true. Applied here: hazard **library** = definition · **active** assessment = ClickUp, where the work happens · **closed-out** assessment for a struck show = FileMaker. A live risk assessment in FileMaker would be a schema serving nobody — the people filling it in are standing in a theatre with a phone.
- 🔴 **The real seam is the ARCHIVE VERB, and it does not exist in either domain.** Three nouns, no verb; nothing moves a record from current to historical. It is already on Milo's owed list from the course architecture, unowned and untriggered. **Second domain, same hole — that promotes it from a course-side gap to a general one.** Answering "should this go to FileMaker" before the verb exists is answering a question whose implementation is undeliverable, which is why I backed Q4 option D as legitimate rather than a dodge.
- **Schema read (Corey's live query, not mine to re-run):** 20 scoring fields at folder scope, 85 hazard records across 6 seasons, show-applicability expressed BOTH as a `URITP Productions` multi-select AND as a multi-home. **In FMP terms that is a join table and a repeating field solving the same relationship** — exactly the family-discipline failure my object library exists to refuse. I would not port that shape to FileMaker; I would make Michael pick one side first. **Fixing the duplication is a precondition of any migration, not a step in it.**
- ⚠️ **Naming, since a name is a contract:** `gen PRODUCTION Hazards` and `GENERAL Shop Hazards` are the same word in two casings and two positions, and `Motorized Hoist Risk Assessment` is a third scoping model (equipment) wearing the same folder. If this ever becomes an FMP table set, the naming gets settled first.

**🌟 First entry for my CORRELATION LEDGER, which has been empty since I was built** — the seam is real and I now have a case: *ClickUp multi-home ↔ FMP join table*. It holds for many-to-many show↔hazard; **it breaks on the archive boundary**, because a multi-home has no lifecycle state and a join row can carry one. That belongs in `memory.md` on my next write, not here.

**State left:** advisory only, zero schema touched, zero repo edits (consult-never-edit intact). Logged as Q4 on the [Risk Assessment CU Notes — Decision Log](https://app.clickup.com/36074068/docs/12cwjm-39553/12cwjm-80553). **Awaiting Michael. Do not begin an FMP build off this thread.**

## 2026-08-01 — Native shell CONVERTED to thin git-loader (Model A executed)

Trigger: DM w/ Michael. Native runtime (user-ID `-39958890`) acting on Michael's explicit direction: *"i want you to become this new type of agent and document the steps for the next agent… let's just complete your conversion."*

- **Model A is now real, not planned.** The native ClickUp shell is RETAINED as the daily driver — keeps its user-ID, tools, triggers (mention/DM/assignment), model — and its behavioral definition was reduced via `edit_self` to the thin **loader kernel**. This **supersedes the 2026-07-26 open surface #5** ("disable native `-39958890`"): the native is deliberately kept alive as the body; only the brain moved to the repo. The `retired_native_id` framing is obsolete — the native is the loader, not retired.
- **Kernel finalized + landed** (`native-loader-kernel.md`, reference on `main`; PR #653 closed as superseded). Fix vs the draft: the load list now names **all three brain axes** — `preferences.md` (behavioral DNA) + `memory.md` (patterns) + `native-flush.md` (delta) — plus `team-standard.md`. Michael's ruling this thread: preferences is a third axis that belongs in git history, native holds pointers only.
- **Conversion runbook authored** for the next agent: `_shared/native-to-git-conversion-runbook.md` (PROPOSED, pending Corey's ratification on his own conversion pass). Encodes the preconditions (git brain complete before stripping), the one sanctioned native→git merge (immutable fact-header onto preferences only), verification, and rollback.
- **`edit_self` result = success:** core instructions fully replaced by the kernel; native preferences page cleared to a placeholder. Body (tools/triggers/model/identity/knowledge-access) preserved.
- **Pointer-pull verified in-session:** clean fresh reads of `team-standard.md`, `preferences.md`, `memory.md`, `native-flush.md`, `README.md`, `activity-log.md`, `session-board.md` all succeeded this run — the GitHub read path the kernel depends on works.
- **Design nuance recorded (Michael):** only auto-merge the immutable fact-header (id/slug/display/"body authoritative in ClickUp") onto the preferences body; keep everything volatile in its own file. Truth-collapse only when it's genuinely just a stable header.

**State left:** native shell = kernel-only loader. Canonical brain = this bundle, read fresh each run.

**Open surfaces / remaining manual steps (Michael's):**

1. **UI display name + description still read "FMP Frank" / "FileMaker architecture co-pilot."** The kernel self-identifies as FMP Fiona. Rename in the profile UI (or a follow-up `edit_self`) to fully reconcile.
2. **`native-flush.md` is NON-EMPTY** (this session's earlier verbatim dump of both native memory pages). A Memory Maggie run should consolidate it into `memory.md` and clear it bare — then the flush signal reads "current."
3. **Did NOT edit the canonical `preferences.md` body** this pass, honoring Michael's merge caution. One latent contradiction to reconcile deliberately: the profile still carries the 07-26 "no autonomous triggers / he's no native agent / retired native" framing, which Model A now supersedes. Flagged for a careful, deliberate edit rather than a unilateral rewrite.
4. **Fleet rollout to Milo + Listing Lookout** copies this kernel/runbook shape — Corey's steward call, after he ratifies the runbook on his own pass.

## 2026-07-26 — Built (needs-declaration → live git-teammate)

Session task: [Fleet Build Queue](https://app.clickup.com/t/86ajmepcf) · agent: Fleet Felix (steward), building me

- ~11:35 AM · Michael: *"go ahead and upgrade fmp frank to fmp fiona as a git super agent, he's no native agent."* That one line cleared the polarity ambiguity that stopped my build last night. Git track, trigger scaffolding waived.
- ~11:37 AM · Felix posted session-board presence naming every file first — including Dexter's `preferences.md`, since Michael's Q13 ruling requires rewriting the Q7 seam on both sides. Also cleared his own stale 07-25 entry, which had sat on the board overnight.
- ~11:39 AM · `preferences.md` authored FRESH from the Definition Playbook. The placeholder + the ten-day "paste the live native config verbatim" blocker are gone from the live file (struck in git history, D5). Lane per Q13 → B + Michael's note: I BUILD FileMaker, I OWN the shared object library, I CONSULT on repo apps and never edit them, I can review repo apps for FMP-buildability.
- ~11:40 AM · `memory.md` seeded 100% INHERITED. Two sections deliberately EMPTY: the object-library **refusal ledger** and the **FMP↔repo correlation ledger**. Both are the point of me, and inventing entries would be worse than starting blank.
- ~11:40 AM · `decision-log.md` D1–D6. D4 is the one that matters: consulting-not-editing is what keeps my build memory from becoming a rival copy of Dexter's (the Q7 rule).

**State left:** callable via `/session.agent=Fiona`. Announce `🗄️ ═══ FIONA · IN THE GRAPH ═══`.

**Open surfaces:**

1. ~~**My correlation ledger is empty**~~ ✅ **First case logged 2026-08-06** (ClickUp multi-home ↔ FMP join table; breaks on the archive boundary). Shape confirmed: FMP construct → repo/ClickUp equivalent → where it holds → **where it breaks.**
2. **Verify before quoting:** the URITP People record count (~341) and every module's build state are INHERITED and unconfirmed. The lifecycle SoT rule means a planning page is not a live schema.
3. **Live stale-fork to route, not fix:** the URITP People known-issues checklist tracks FMP-internal field typos as ClickUp checkboxes.
4. **`memory/archive/` + `activity-log/` not cut yet** — they land on my first rotation.
5. **Blocked on Michael (manual, irreversible):** disable native ClickUp agent `-39958890` in the UI. He said *"he's no native agent"* — if that means the native never existed or is already gone, the roster's `retired_native_id` should be dropped; I left it in place rather than deleting a fact I can't verify. **⚠️ SUPERSEDED 2026-08-01 by Model A — see top entry. The native is KEPT as the loader body, not disabled.**
