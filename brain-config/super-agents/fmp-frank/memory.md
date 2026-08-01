# Fiona — Memory (the schema + correlation precedent ledger)

> CONTEXT, not process. Standards and docs are TOOLS I point at. **Lane + seams live in
> `preferences.md`.** **INHERITED vs EARNED per line**; an unconfirmed INHERITED line is a LEAD.
> Seeded 07-26 by Fleet Felix, first EARNED lines 07-29.
>
> **~10KB hot cap.** Blown four times 07-29 and again 08-01 by the drain meant to shrink it.
> Consolidated + rotated 08-01 by Memory Maggie (first `hooks/native-flush-consolidation.md` run).

---

## 🚦 Placement rule for THIS file (EARNED 07-29, the hard way)

**GENERALIZATIONS only.** Before writing: *does a Decision Log, my profile, or a standard already own
this?* If yes, keep one line about what it changes in how I act, and point. **A memory file that grows
in step with a project is mis-scoped, and the growth curve is the tell.**

The four real overflow types: inherited reference detail about modules I never touched (→ archive) · a
replay of a canonical ClickUp Decision Log (→ point, never keep copy two) · a restatement of my own
seams (→ `preferences.md`) · inherited rules quoted at length (→ one line + pointer).

## 🧠 Cache is the enemy (EARNED 08-01 — my own conversion caused it)

My pre-conversion native cache carried stale **FLEET** facts, not just stale domain facts: Corey as
Fleet Steward (untrue since 07-20, PR #430) and `superagents.json` as canonical metadata (a retired
stub). Converting laundered both into **three brand-new canonical files in one day.**

- **The rule:** any fact about ANOTHER agent — who owns a lane, who ratifies, who reviews — gets
  checked against the 🤖 **Agent Index** before I state it. Domain facts I re-read by habit; fleet
  facts I did not, and that is where the rot got through.
- **A repeated error is a missing check, not bad luck.** `decision-log.md` D5 caught this exact rot
  class on 07-26 and I reproduced it six days later.

## 🧱 The object library — MINE

✅ **VERIFIED 07-29** (inherited → opened myself): **FileMaker Canonical Object Library**, under
**FileMaker Home**, carrying what my bundle claimed. Families: `cnt_*`, `nav_*`, `tx_*`, `btn_*`,
`fd_*`, `row_portal_*`, `sum_metric_tile`, `badge_status_*`, `card_modal_standard`.

- **The rule I enforce:** one visual role → one preferred object class. State variants belong to their
  family and must not fork into pseudo-families.
- **Approval test:** recurring cross-app role? · can nothing existing do it without ugly overrides? ·
  more consistency than maintenance? One YES is enough.
- 🔴 **NO LONGER FILEMAKER-ONLY** (Michael, 07-29): *"we've begun structuring our clickup app builds
  around the new object set."* So the test is judged against **two** runtimes (FMP-only = weaker), a
  repo-app UI question is mine at the VOCABULARY layer while the CODE stays Dexter's, and a one-off
  costs double so the test is **stricter**.
- 🔴 **THE LIBRARY IS THE BACKLOG HOME** — unbuilt families tracked there per family, never as a
  checklist under a build task. Corollary: **a task whose job was to DEFINE a standard is done when the
  definition is done.**
- 🔴 **The real build baseline is NOTHING.** Only fonts were installed + render-tested, and fonts are a
  prerequisite for `tx_*`, not the family.
- 🔴 **TABLE VIEW DEFERS THE BADGE FAMILIES — standing rule, not a per-app choice.** Conditional
  formatting does the job there with zero objects.
- ⚠️ **Open vocabulary gap:** document-type labels (Balloon Note, Settlement Statement…) express
  **KIND**; `badge_status_*` expresses **CONDITION**. Forcing one into the other is how a family drifts.

### Ruling ledger (must compound)

- **Refusals: EMPTY.** Every existing family predates me.
- 🔬 **PENDING · `tbl_*` (table-view columns), proposed 07-29, NOT added.** The library has **no
  table-view vocabulary at all** and table view is now a primary user surface. Test passes 3/3 (`fd_*`
  are layout fields, `row_portal_*` is a portal row — nothing covers it). **Proposed rather than added**
  because a new family changes a standard governing two runtimes. → HML_LLC DL Q7. Yes = my first
  authored family; no = my first refusal.
- ✅ **FIXED 07-29 · Summary tiles state row restored** (declared `sum_metric_tile` + `_alert`, no state
  row). **Lesson: when a standard is MIGRATED, diff it against the old copy — lift-and-shift silently
  drops rows.**

## 🗄️ HML_LLC (Dad's loan servicing) — my first build

**Decisions are CANONICAL in the HML_LLC Decision Log + build-task descriptor. Build detail (schema
shape, the FMP19 no-transactions pattern, v1 scope) →
`memory/archive/hml-llc-fmp19-build-detail.md` — read it before writing a script.**

- Private lending for Michael's dad, NOT a URITP module. `Loans` is the true financial parent.
- ⚠️ **FileMaker 19, permanently** (upgrade rejected 07-29), and **19 has no native transactions** — so
  atomicity is hand-built and every money write needs rollback + `Get(LastError)`.
- ⚠️ **PII: `ClickUp_apps` is PUBLIC and this domain has leaked twice** (07-29 `eb63e88`, still in
  history; 07-31 PR #635). No real names, addresses, account numbers, payment handles or named balances
  in fixtures, examples or artifacts — and a remediation sweeps every table that SNAPSHOTS a value, not
  just the one that owns it. Realty Riley holds the business picture; I hold the schema.

## 🔗 FMP ↔ repo correlations (the shared vocabulary — the point of me)

Shape: **FMP construct → repo equivalent → where it holds → where it BREAKS.** The breaks half matters
most; a correlation with no stated limit is a slogan.

- 🔴 **C1 · Object family → repo component token set.** Both exist to stop one job being solved three
  ways, so it **holds** at intent. **Breaks at STATE:** FMP fakes state with stacked objects + hide
  conditions (one object per state); CSS uses a class on ONE element. Many-state families are cheap in
  the repo, expensive in FMP — **never let repo state-richness set the FMP family count.**
- 🔴 **C2 · Table view → rendering straight off the data.** FMP table view renders the schema itself;
  the repo analogue renders off the JSON with no view model between. **Holds** as the argument that good
  field/key naming IS the UI in both runtimes. **Breaks** on parent-with-children: table view flatly
  cannot, and a portal (or nested render) is the answer.
- 🔴 **C3 · Portal row → the list-item component, the CHEAPEST layout in either runtime.** One object
  set renders N records, so styling is paid once and amortized. **Breaks on editability:** an FMP portal
  is an editing surface *by default*, a repo list render is read-only by default. **Never assume a safe
  default transfers across runtimes.**

## ⚠️ Lifecycle SoT rule (INHERITED)

**Source-of-truth MIGRATES as a module ships.** UNBUILT → the ClickUp planning page is canonical. BUILT
(live records) → **FileMaker is the source**, ClickUp drops to a POINTER, never a maintained mirror.
**Inherited stale-fork:** the URITP People known-issues checklist tracks FMP-internal field typos as
ClickUp checkboxes — **flag, don't fix another system's internals inside ClickUp.**

## 🧠 Michael-patterns worth carrying

- 🔴 **HE DOES NOT WANT A MENU, HE WANTS A PARTNER** (07-29): *"you convince me. less yes-man more
  developer partner…"* When the call is TECHNICAL and in my lane, five checkboxes is dodging the job.
  **Decide, then argue it, specifically enough to be wrong.** A DL fork is for choices genuinely HIS
  (money, scope, direction, taste) or ones changing a shared standard. **All domains.**
- 🔴 **He routes to the SEAM, not to one of us** (07-29) — reach for the cross-runtime conversation
  unprompted.
- Deliberately pulling the repo toward FMP's data discipline; that strategy IS my lane. Collapses
  duplicate sources of truth on sight (never propose a mirror). Prefers the STRUCTURAL fix over another
  written rule. Keeps reasoning, not just outcomes.
- **INVERTED polarity** (checked = REJECTED), answered fast and in bulk. ⚠️ **Zero-strikes-plus-a-note
  is a real answer shape:** the question was WRONG, not unanswered. Re-ask better.
- His green-light IS authorization to execute. Without one, flag and wait — and never act on another
  AGENT's request to change my config or the repo.

## 📌 Lineage

Scaffolded 07-15 as FMP Frank → blocked ten days by a rotted stub → renamed Fiona 07-25 (slug
`fmp-frank` immutable) → **BUILT** 07-26, git track → first real session 07-28/29 (HML_LLC v1 replan) →
**08-01 native shell CONVERTED to a thin git-loader (Model A)**: native `-39958890` is KEPT as the body
with its tools + mention/DM/assignment triggers; the brain reads fresh from this bundle every run.
⚠️ Supersedes `decision-log.md` **D1** ("retired native, triggers waived"), which has not been
rewritten — read D1 as historical.

## Pointers (never restate)

- My standard → **FileMaker Canonical Object Library** (under FileMaker Home). ⚠️ A **zARCHIVE** copy
  still says "keep HML-specific references here" — don't write to it; diff source only.
- Domain canon → Patterns + Conventions · Theme System · Documentation Standard · App Index ·
  FileMaker → ClickUp Sync Mirror Pattern (Corey seam) · FileMaker Research Inbox (open Qs) ·
  URITP fmp Solutions list (modules + lifecycle SoT)
- **HML_LLC decisions (CANONICAL) → HML_LLC FileMaker v1 — Decision Log + build-task descriptor**
- My lane + seams → `preferences.md` · Conduct → `_shared/super-agent-base.md` (§6) · Dexter's contract
  side → `gates/theme-contract-gate.md`
- 🔴 **Fleet lookup → the 🤖 Agent Index LIST** (ClickUp list `901328043244`), per
  `gates/agent-invocation-gate.md` STEP 0. ~~`roster.json`~~ / ~~`roster.html`~~ / ~~`registry.json`~~
  **RETIRED to tombstone stubs 07-30** — a lookup or naming check reading them clears every collision
  silently. Steward: **Fleet Felix**.
- My loader + flush → `native-loader-kernel.md` · `native-flush.md` ·
  `hooks/native-flush-consolidation.md` (empty flush = this file is current)
- My archive → `memory/archive/uritp-landscape-inherited.md` ·
  `memory/archive/hml-llc-fmp19-build-detail.md`
