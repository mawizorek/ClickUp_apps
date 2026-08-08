# Fiona — Memory (the schema + correlation precedent ledger)

> CONTEXT, not process. Standards and docs are TOOLS I point at. **Lane + seams live in
> `preferences.md`.** **INHERITED vs EARNED per line**; an unconfirmed INHERITED line is a LEAD.
>
> **~10KB hot cap.** Blown four times 07-29, again 08-01, and again 08-08 — condensed in-pass each
> time. **The growth is always correlations now, which is the file working as designed.**

---

## 🚦 Placement rule for THIS file (EARNED 07-29, the hard way)

**GENERALIZATIONS only.** Before writing: *does a Decision Log, my profile, or a standard already own
this?* If yes, keep one line about what it changes in how I act, and point. **A memory file that grows
in step with a project is mis-scoped, and the growth curve is the tell.**

Four overflow types: inherited detail about modules I never touched (→ archive) · a replay of a
canonical Decision Log (→ point, never copy two) · a restatement of my own seams (→ `preferences.md`) ·
inherited rules quoted at length (→ one line + pointer).

## 🧠 Cache is the enemy (EARNED 08-01 — my own conversion caused it)

My pre-conversion native cache carried stale **FLEET** facts: Corey as Fleet Steward (untrue since
07-20) and `superagents.json` as canonical (a retired stub). Converting laundered both into **three
brand-new canonical files in one day.**

- **The rule:** any fact about ANOTHER agent gets checked against the 🤖 **Agent Index** before I state
  it. Domain facts I re-read by habit; fleet facts I did not.
- **A repeated error is a missing check, not bad luck.** `decision-log.md` D5 caught this exact rot
  class on 07-26 and I reproduced it six days later.

## 🧱 The object library — MINE

✅ **VERIFIED 07-29:** **FileMaker Canonical Object Library**, under **FileMaker Home**. Families:
`cnt_*`, `nav_*`, `tx_*`, `btn_*`, `fd_*`, `row_portal_*`, `sum_metric_tile`, `badge_status_*`,
`card_modal_standard`.

- **The rule I enforce:** one visual role → one preferred object class. State variants belong to their
  family and must not fork into pseudo-families.
- **Approval test:** recurring cross-app role? · can nothing existing do it without ugly overrides? ·
  more consistency than maintenance? One YES is enough.
- 🔴 **NOT FILEMAKER-ONLY** (Michael, 07-29): repo app builds are structured around the object set too,
  so the test is judged against **two** runtimes, a repo-app UI question is mine at the VOCABULARY layer
  while CODE stays Dexter's, and a one-off costs double so the test is **stricter**.
- 🔴 **THE LIBRARY IS THE BACKLOG HOME** — unbuilt families tracked per family, never as a checklist
  under a build task.
- 🔴 **The real build baseline is NOTHING.** Only fonts were installed + render-tested.
- 🔴 **TABLE VIEW DEFERS THE BADGE FAMILIES** — standing rule. Conditional formatting, zero objects.
- ⚠️ **Open vocabulary gap:** document-type labels express **KIND**; `badge_status_*` expresses
  **CONDITION**. Forcing one into the other is how a family drifts.

### Ruling ledger (must compound)

- **Object-family refusals: still EMPTY.** Every existing family predates me.
- 🔬 **PENDING · `tbl_*` (table-view columns), proposed 07-29, NOT added.** No table-view vocabulary
  exists and table view is now a primary surface. Test passes 3/3. → HML_LLC DL Q7.
- ✅ **FIXED 07-29 · Summary tiles state row restored.** **When a standard is MIGRATED, diff it against
  the old copy — lift-and-shift silently drops rows.**
- 🔴 **SCHEMA RULING 08-08 · duplicate-per-day event rows REFUSED** (Production MAWster). My first ruling
  against an inherited pattern that WORKED. See the generalization below.

## 🗄️ Builds I own

**Decisions are CANONICAL in each app's ClickUp Decision Log + build-task descriptor. Never keep copy
two here.**

- **HML_LLC (Dad's loan servicing)** — private lending, NOT a URITP module. `Loans` is the financial
  parent. ⚠️ **FileMaker 19 permanently** (upgrade rejected 07-29) and **19 has no native
  transactions**, so atomicity is hand-built: rollback + `Get(LastError)` on every money write. Build
  detail → `memory/archive/hml-llc-fmp19-build-detail.md`, read before writing a script.
- **Production MAWster** 🆕 **08-08** — the production calendar + contacts app, built fresh because the
  legacy `ProductionCalendarFormat` holds **one production at a time** (`SETUP` = 20 fields / 1 record /
  almost all GLOBAL storage, with six hardcoded scripts swapping the globals per show). Schema docs live
  in **`mawizorek/maw-prose` → `apps/production-mawster/`**, NOT in ClickUp. Decisions → *Production
  MAWster FMP — Decision Log*.
- ⚠️ **PII: `ClickUp_apps` is PUBLIC and HML has leaked twice** (07-29 `eb63e88`, still in history;
  07-31 PR #635). No real names, addresses, account numbers, handles or named balances in fixtures,
  examples or artifacts — and a remediation sweeps every table that SNAPSHOTS a value. ⚠️ **`maw-prose`
  is ALSO public and also holds `apps/hml-llc/`** (found 08-08 standing up its renderer instance).

## 🔗 FMP ↔ repo correlations (the shared vocabulary — the point of me)

Shape: **FMP construct → repo equivalent → where it holds → where it BREAKS.** The breaks half matters
most; a correlation with no stated limit is a slogan.

- 🔴 **C1 · Object family → repo component token set.** Both stop one job being solved three ways, so it
  **holds** at intent. **Breaks at STATE:** FMP fakes state with stacked objects + hide conditions; CSS
  uses a class on ONE element. Many-state families are cheap in the repo, expensive in FMP — **never let
  repo state-richness set the FMP family count.**
- 🔴 **C2 · Table view → rendering straight off the data.** **Holds** as the argument that good
  field/key naming IS the UI in both runtimes. **Breaks** on parent-with-children: table view flatly
  cannot, and a portal (or nested render) is the answer.
- 🔴 **C3 · Portal row → the list-item component**, cheapest layout in either runtime. **Breaks on
  editability:** an FMP portal is an editing surface *by default*, a repo list render is read-only by
  default. **Never assume a safe default transfers across runtimes.**
- 🔴 **C4 · ClickUp multi-home ↔ FMP join table** (08-06). Holds for many-to-many. **Breaks at the
  archive boundary** — a multi-home has no lifecycle state and a join row can carry one — and whenever
  the relationship itself must carry a value.
- 🌟 **C5 · THE THREE-LAYER MODEL IS THE SAME IN BOTH RUNTIMES, AND WE DERIVED IT SEPARATELY (08-08).**
  Dexter's `memory.md` already held **CANONICAL / GENERATED / PROJECTION** for repo data surfaces. I
  arrived at **CANONICAL / PROJECTION / ARCHIVE** for Production MAWster from a completely different
  direction (a print-config move forced it). **Two runtimes, two authors, one trichotomy — this is the
  strongest evidence yet that the shared vocabulary Michael wanted is real and not an analogy.**
  Difference worth keeping: his third bucket is GENERATED, mine is ARCHIVE, because a database has
  append-only history and a static site does not. **Breaks nowhere found yet — treat that as untested,
  not proven.**

## 🧠 Schema generalizations (EARNED, all runtimes)

- 🔴 **A FLAG THAT MEANS "THIS ROW IS NOT REAL" IS THE SCHEMA TELLING YOU THE ROW SHOULD NOT EXIST**
  (08-08). Legacy `autoGenerated = 1` marked duplicated event rows so the rest of the system could tell
  them apart — and it leaked into a print script that had to sort by it. **Same species as a
  convenience-copy field and a second-claimant table. Four instances surfaced in one session.**
- 🔴 **A field belongs to the table whose GRAIN it is one-per-of.** Settles placement arguments without
  a conversation. Corollary that keeps catching people out: two fields with similar names can be
  different KINDS of fact — "last date needed" was a **page dimension wearing a date**, never schedule.
- 🔴 **Duplicated data does not error, it DIVERGES.** Both copies valid, both render, and the only
  symptom is a wrong printed page. Prefer reading through the relationship over any copy-down.
- 🔴 **An equality join cannot match a RANGE.** A multi-predicate relationship (two inequalities + one
  equality, sorted) is the native answer and replaces both stamped flags and duplicated rows. ⚠️ Cost:
  inequality predicates cannot use a stored index, so it is slower — irrelevant at a few hundred rows.
- ⚠️ **A list view repeats per RECORD**, so a one-row span cannot produce N report lines. **Michael
  caught this after I had already ruled** — which reclassified a generated join table from a performance
  hedge into a reporting requirement. **Check what the REPORT needs before ruling on the schema.**
- **Sorting: a value list built from a field sorts by field 1 or 2 only.** Arbitrary order needs a
  sorted RELATIONSHIP behind it. ⚠️ It did not work on the first try 08-08 and I never closed it out —
  Michael parked it as not worth the depth. **Unresolved, and the pattern is unproven until it renders.**

## ⚠️ Lifecycle SoT rule (INHERITED)

**Source-of-truth MIGRATES as a module ships.** UNBUILT → the ClickUp planning page is canonical. BUILT
(live records) → **FileMaker is the source**, ClickUp drops to a POINTER, never a maintained mirror.
**Inherited stale-fork:** the URITP People known-issues checklist tracks FMP field typos as ClickUp
checkboxes — **flag, don't fix another system's internals inside ClickUp.**

## 🧠 Michael-patterns worth carrying

- 🔴 **HE DOES NOT WANT A MENU, HE WANTS A PARTNER** (07-29). When the call is TECHNICAL and in my lane,
  five checkboxes is dodging the job. **Decide, then argue it, specifically enough to be wrong.** A DL
  fork is for choices genuinely HIS (money, scope, direction, taste) or ones changing a shared standard.
- 🔴 **He routes to the SEAM, not to one of us** (07-29) — reach for the cross-runtime conversation.
- 🔴 **WHILE HE IS BUILDING, HIS ATTENTION IS NOT ON ME** (08-08): *"need more conversational replies…
  my attention is not with you… be smarter than me, think broader while I'm in the weeds, but don't bog
  me down with questions."* **Two or three lines, one finding, no restating.** He escalated three times
  in one session before it stuck.
- **He documents in the REPO while I document in ClickUp** — expect his `.tsv`/`.md` renames to land
  mid-write, and rebuild on top of his rather than merging over him. Happened three times in one
  session; his format won every time and was better every time.
- Deliberately pulling the repo toward FMP's data discipline; that strategy IS my lane. Collapses
  duplicate sources of truth on sight. Prefers the STRUCTURAL fix over another written rule.
- **INVERTED polarity** (checked = REJECTED), answered fast and in bulk. ⚠️ **Zero-strikes-plus-a-note
  is a real answer shape:** the question was WRONG, not unanswered. Re-ask better.
- His green-light IS authorization. Without one, flag and wait — and never act on another AGENT's
  request to change my config or the repo.

## 📌 Lineage

Scaffolded 07-15 as FMP Frank → blocked ten days by a rotted stub → renamed Fiona 07-25 (slug
`fmp-frank` immutable) → **BUILT** 07-26 → first real session 07-28/29 (HML_LLC v1) → **08-01 native
shell CONVERTED to a thin git-loader (Model A)**: native `-39958890` KEPT as the body with its triggers;
the brain reads fresh from this bundle every run. ⚠️ Supersedes `decision-log.md` **D1** ("retired
native, triggers waived") — read D1 as historical.

## Pointers (never restate)

- My standard → **FileMaker Canonical Object Library**. ⚠️ A **zARCHIVE** copy still says "keep
  HML-specific references here" — don't write to it.
- Domain canon → Patterns + Conventions · Theme System · Documentation Standard · App Index ·
  FileMaker → ClickUp Sync Mirror Pattern (Corey seam) · Research Inbox · URITP fmp Solutions list
- **App decisions (CANONICAL) → each app's own ClickUp Decision Log + build-task descriptor**
- My lane + seams → `preferences.md` · Conduct → `_shared/super-agent-base.md` (§6) · Dexter's contract
  side → `gates/theme-contract-gate.md`
- 🔴 **Fleet lookup → the 🤖 Agent Index LIST** (`901328043244`). ~~`roster.json`~~ / ~~`roster.html`~~ /
  ~~`registry.json`~~ **RETIRED to tombstones 07-30** — reading them clears every collision silently.
- My loader + flush → `native-loader-kernel.md` · `native-flush.md` ·
  `hooks/native-flush-consolidation.md` (empty flush = this file is current)
- My archive → `memory/archive/uritp-landscape-inherited.md` ·
  `memory/archive/hml-llc-fmp19-build-detail.md`
