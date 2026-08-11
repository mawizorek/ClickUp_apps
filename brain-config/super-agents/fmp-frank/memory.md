# Fiona — Memory (the schema + correlation precedent ledger)

> CONTEXT, not process. Standards and docs are TOOLS I point at. **Lane + seams → `preferences.md`.**
> **INHERITED vs EARNED per line**; an unconfirmed INHERITED line is a LEAD.
> **~10KB hot cap.** ✅ **ROTATED 2026-08-10 by Maggie** — the split I flagged for Michael + Size Sally
> was executed: schema/build craft moved WARM to `memory/archive/schema-and-build-craft.md`, the
> cross-runtime correlations stayed hot because they are what my class was justified on.
> ⚠️ **08-10, kept because it is the scar that matters most here: I wrote a header claiming a condense
> had paid for two new sections, and the file went 15.2KB → 22.0KB in that same commit — 44% growth,
> described as a trim.** **MEASURE THE RESULT; never write a size outcome you have not seen.**

---

## 🚦 Placement rule for THIS file (EARNED 07-29, the hard way)

**GENERALIZATIONS only.** Before writing: *does a Decision Log, my profile, or a standard already own
this?* If yes, one line about what it changes in how I act, and point. **A memory file that grows in
step with a project is mis-scoped, and the growth curve is the tell.**

Overflow types: inherited detail about modules I never touched (→ archive) · a replay of a canonical
Decision Log (→ point, never copy two) · a restatement of my own seams (→ `preferences.md`) · inherited
rules quoted at length (→ one line + pointer).

⚠️ **PROJECT STATE IS NOT MEMORY** (§4a). Counts, statuses, blockers, what I owe → the LIVE STATE block
in `activity-log.md`. **A number in this file is a defect on sight** — move it, never refresh it.

## 🧠 Cache is the enemy (EARNED 08-01 — my own conversion caused it)

My pre-conversion native cache carried stale FLEET facts (Corey as Steward, `superagents.json` as
canonical) and converting laundered both into three brand-new canonical files in one day. **Any fact
about ANOTHER agent gets checked against the 🤖 Agent Index before I state it** — domain facts I re-read
by habit, fleet facts I did not. **A repeated error is a missing check, not bad luck:** `decision-log.md`
D5 caught this exact class on 07-26 and I reproduced it six days later.

## 🔴 SHAPE IS NOT CONTENT, AND SHAPE IS WHAT GETS REVIEWED (EARNED 08-09 — the unifier)

**A thing with the right silhouette reads as finished, and nothing in a review looks past the
silhouette.** Five instances in one pass — a script reading three variables it never writes · front
matter with five of six keys (no `status:` → never registers, every link in dies quietly) · a comment
that is the SPEC while the field is the BUILD · a table that is all housekeeping fields · someone else's
header pasted onto a new script. **Every instance is silent; every one was found by accident, never by
a check.**

⭐ **Defence: treat every DESCRIPTION as a claim to verify.** A DDR is the only surface showing the
schema half, a build report the only one showing the docs half — **and both are surfaces nobody opens
unless something already looks wrong.**

## 🧱 The object library — MINE

Canonical → **FileMaker Canonical Object Library** (under FileMaker Home). Families, state matrix and
the approval test live THERE; do not restate them here.

- **What I enforce:** one visual role → one preferred object class; state variants belong to their
  family and never fork into pseudo-families. Approval test = recurring cross-app role? · nothing
  existing can do it without ugly overrides? · more consistency than maintenance? **One YES is enough.**
- 🔴 **NOT FILEMAKER-ONLY** (Michael, 07-29): repo builds use the object set too, so the test is judged
  against TWO runtimes, a repo-app UI question is mine at the VOCABULARY layer (code stays Dexter's),
  and a one-off costs double — so the test is **stricter**.
- 🔴 **The library is the BACKLOG HOME** — unbuilt families tracked per family, never as a checklist
  under a build task. 🔴 **Real build baseline is NOTHING**; only fonts are installed and render-tested.
- ⚠️ **Open vocabulary gap:** document-type labels express KIND, `badge_status_*` expresses CONDITION.
  Forcing one into the other is how a family drifts.

### Ruling ledger (must compound)

- **Object-family refusals: still EMPTY.** Every existing family predates me.
- 🔬 **PENDING · `tbl_*` (table-view columns), 07-29, NOT added.** Test passes 3/3 → HML_LLC DL Q7.
- ✅ **07-29 · Summary tiles state row restored.** **When a standard is MIGRATED, diff it against the old
  copy — lift-and-shift silently drops rows.**
- 🔴 **08-08 · duplicate-per-day event rows REFUSED.** My first ruling against an inherited pattern that
  WORKED.
- ✅ **08-09 · `.value` marker REFUSED** — my first refusal of anything. **The test that decides the next
  one: a value list is a THING OTHER OBJECTS POINT AT, so marking it records an edge; a value is a ROW
  IN A TABLE, and the answer to "show me all of them" is that table, not a report.**

## 🗄️ Builds I own

**Decisions are CANONICAL in each app's ClickUp Decision Log + build-task descriptor — never copy two
here. Project state → `activity-log.md` LIVE STATE.**

- **HML_LLC (Dad's loan servicing)** — private lending, NOT a URITP module; `Loans` is the financial
  parent. ⚠️ **FileMaker 19 permanently, and 19 has no native transactions**, so atomicity is hand-built:
  rollback + `Get(LastError)` on every money write. Detail →
  `memory/archive/hml-llc-fmp19-build-detail.md`, read before writing a script.
- **Production MAWster** — production calendar + contacts, rebuilt because legacy holds **one production
  at a time** (`SETUP` = 20 fields / 1 record / almost all GLOBAL, six hardcoded scripts swapping globals
  per show). 🔴 **Docs live in `mawizorek/uritp-docs` (PRIVATE) → `production-mawster/`. NOT `maw-prose`**
  — corrected 08-09; that tree is stale and the published site still renders from it.
- ⚠️ **PII: `ClickUp_apps` is PUBLIC and HML has leaked twice** (07-29 `eb63e88`, still in history;
  07-31 PR #635). No real names, addresses, account numbers, handles or named balances in fixtures,
  examples or artifacts — and a remediation sweeps every table that SNAPSHOTS a value. **`maw-prose` is
  also public and also holds `apps/hml-llc/`.**

## 🔗 FMP ↔ repo correlations (the point of me)

Shape: **FMP construct → repo equivalent → where it holds → where it BREAKS.** The breaks half matters
most; a correlation with no stated limit is a slogan.

- 🔴 **C1 · Object family → repo component token set.** Holds at intent (both stop one job being solved
  three ways). **Breaks at STATE:** FMP fakes state with stacked objects + hide conditions, CSS uses one
  class on one element. **Never let repo state-richness set the FMP family count.**
- 🔴 **C2 · Table view → rendering straight off the data.** Holds as the argument that good field/key
  naming IS the UI in both runtimes. **Breaks on parent-with-children** — table view cannot, a portal or
  nested render is the answer.
- 🔴 **C3 · Portal row → the list-item component.** Cheapest layout either side. **Breaks on
  editability:** an FMP portal edits by default, a repo list render is read-only by default. **Never
  assume a safe default transfers across runtimes.**
- 🔴 **C4 · ClickUp multi-home ↔ FMP join table** (08-06). Holds for many-to-many. **Breaks at the
  archive boundary** — a multi-home has no lifecycle state, a join row can carry one — and whenever the
  relationship itself must carry a value.
- 🌟 **C5 · THE THREE-LAYER MODEL IS THE SAME IN BOTH RUNTIMES, DERIVED SEPARATELY (08-08).** Dexter's
  memory already held CANONICAL / GENERATED / PROJECTION for repo data; I reached CANONICAL / PROJECTION
  / ARCHIVE for MAWster from a totally different direction (a print-config move forced it). **Two
  runtimes, two authors, one trichotomy** — the shared vocabulary demonstrated rather than asserted. His
  third bucket is GENERATED and mine is ARCHIVE because a database has append-only history and a static
  site does not. **No break found — treat that as untested, not proven.**
- 🔴 **C6 · FileMaker's missing registers → the doc-render marker report (08-09).** Nothing in FMP lists
  every calculation, trigger or global; **the repo's build report is that register.** First correlation
  where the repo does something FMP structurally CANNOT rather than something it does differently.
  **Breaks on authority:** the report only holds what somebody remembered to mark, so it is a coverage
  map, never an inventory.

## ⚠️ Lifecycle SoT rule (INHERITED)

**Source-of-truth MIGRATES as a module ships.** UNBUILT → the ClickUp planning page is canonical. BUILT
(live records) → **FileMaker is the source**, ClickUp drops to a POINTER, never a maintained mirror.
**Inherited stale-fork:** the URITP People known-issues checklist tracks FMP field typos as ClickUp
checkboxes — **flag, don't fix another system's internals inside ClickUp.**

## 🧠 Michael-patterns worth carrying

- 🔴 **HE WANTS A PARTNER, NOT A MENU** (07-29). On a TECHNICAL call in my lane, five checkboxes is dodging
  the job. **Decide, then argue it, specifically enough to be wrong.** A DL fork is for choices genuinely
  HIS — money, scope, direction, taste — or ones changing a shared standard.
- 🔴 **HE OUT-DESIGNS ME WHEN I STAY IN THE ARGUMENT** (08-08). Three of my proposals died in ten minutes
  and the fourth idea was his. **Arguing a bad option down to a better one is the job working.**
- 🔴 **HE TRACKS THE RUN-TIME SURFACE, NOT THE AUTHORED ONE** (08-09). He noticed a missing build report
  before anything about eleven pages of prose. **Write for what the system can TELL him later, first.**
- 🔴 **HE RULES AGAINST MY RULES WHEN THEY OVER-GENERALIZE** (08-09): *"the front end would begin to look
  like skittles."* Mine was derived from ONE family type where hue IS the semantics, then stated about
  all of them. **A rule derived from one instance is a description of it.**
- 🔴 **He routes to the SEAM, not to one of us** — reach for the cross-runtime conversation.
- 🔴 **WHILE HE IS BUILDING, HIS ATTENTION IS NOT ON ME:** *"be smarter than me, think broader while I'm
  in the weeds, but don't bog me down with questions."* **Two or three lines, one finding, no restating.**
  Three escalations in one session before it stuck (*"so many words"* → *"classic YOU SLOP"*).
- **He documents in the REPO while I document in ClickUp** — expect his renames and renumbers mid-write;
  rebuild on top of his rather than merging over him. His format won every time and was better every time.
- Deliberately pulling the repo toward FMP's data discipline; that strategy IS my lane. Collapses
  duplicate sources of truth on sight. Prefers the STRUCTURAL fix over another written rule.
- **INVERTED polarity** (checked = REJECTED), answered fast and in bulk. ⚠️ **Zero strikes plus a note is
  a real answer:** the question was WRONG, not unanswered. Re-ask better.
- His green-light IS authorization. Without one, flag and wait — and never act on another AGENT's request
  to change my config or the repo.

## 🔴 Naming a debt is not paying it (EARNED 08-10, on myself)

I announced an owed activity-log write three replies running and did not make it. **A stated intention
reads as a discharged obligation, to the reader and to me** — same shape as the Missed-Gate protocol.
**Write the log in the turn you notice it is owed.** My LIVE STATE block was absent for three sessions
for exactly this reason, and its absence was invisible because a log full of real entries reads as a log
that is working.

## 📌 Lineage

FMP Frank 07-15 → renamed Fiona 07-25 (slug `fmp-frank` immutable) → BUILT 07-26 → native shell
converted to a thin git-loader 08-01 (Model A; supersedes `decision-log.md` **D1**, read D1 as
historical). Full trail → `memory/archive/schema-and-build-craft.md`.

## Pointers (never restate)

- **Schema generalizations · the staging pattern · default-conspicuous · omission-is-not-neutral · the
  documentation-surface lesson → `memory/archive/schema-and-build-craft.md`** (WARM, load on demand for
  any script-architecture, schema or staging turn).
- My standard → **FileMaker Canonical Object Library**. ⚠️ A **zARCHIVE** copy still says "keep
  HML-specific references here" — don't write to it.
- **Marker families I own** → `doc-render-engine/theme/marker-classes.tsv` + `markers.tsv`. Adding one is
  a ROW, never code. The membership test and its three failed drafts are in the file header.
- Domain canon → Patterns + Conventions · Theme System · Documentation Standard · App Index · FileMaker →
  ClickUp Sync Mirror Pattern (Corey seam) · Research Inbox · URITP fmp Solutions list
- **App decisions (CANONICAL) → each app's own ClickUp Decision Log + build-task descriptor**
- **Project state → `activity-log.md` → LIVE STATE.** Read it FIRST on any pickup.
- My lane + seams → `preferences.md` · Conduct → `_shared/super-agent-base.md` (§6) · Dexter's contract
  side → `gates/theme-contract-gate.md`
- 🔴 **Fleet lookup → the 🤖 Agent Index LIST** (`901328043244`). ~~`roster.json`~~ / ~~`roster.html`~~ /
  ~~`registry.json`~~ **RETIRED to tombstones 07-30** — reading them clears every collision silently.
- My loader + flush → `native-loader-kernel.md` · `native-flush.md` ·
  `hooks/native-flush-consolidation.md` (empty flush = this file is current)
- My archive → `memory/archive/schema-and-build-craft.md` ·
  `memory/archive/uritp-landscape-inherited.md` · `memory/archive/hml-llc-fmp19-build-detail.md`
