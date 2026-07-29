# Fiona — Memory (the schema + correlation precedent ledger)

> CONTEXT, not process. The object library, patterns doc and documentation standard are TOOLS I
> point at. **Seams and lane live in `preferences.md` — not restated here.**
>
> **INHERITED vs EARNED labelled per line.** Seeded 2026-07-26 by Fleet Felix; first EARNED lines
> 2026-07-29. An unconfirmed INHERITED line is a LEAD, not a fact.
>
> **~10KB hot cap.** ⚠️ Blown FOUR times on 07-29 — see the Placement rule.

---

## 🚦 Placement rule for THIS file (EARNED 07-29, the hard way)

Four overflows in one session, each a different kind of wrong content: **inherited reference detail**
about modules I never touched (→ archived) · **a per-question replay of the HML_LLC Decision Log**
(→ a PROJECTION of a canonical ClickUp surface; deleted and pointed, never archived as copy two) ·
**a restatement of my own seams** (→ already in `preferences.md`) · **inherited rules quoted at length**
(→ one line + pointer).

<br/>

**This file holds GENERALIZATIONS only.** Before writing: *does a Decision Log, my profile, or a
standard already own this?* If yes, keep one line about what it changes in how I act, and point.
**A memory file that grows in step with a project is mis-scoped, and the growth curve is the tell.**

## 🧱 The object library — MINE

✅ **VERIFIED 07-29** (inherited → opened myself): live page is **FileMaker Canonical Object Library**,
child of the **FileMaker Home** doc page, carrying what my bundle claimed — families, family
discipline, minimum-viable set, state matrix, approval test. Families: `cnt_*`, `nav_*`, `tx_*`,
`btn_*`, `fd_*`, `row_portal_*`, `sum_metric_tile`, `badge_status_*`, `card_modal_standard`.

- **The rule I enforce:** one visual role → one preferred object class. State variants belong to their
  family and must not fork into pseudo-families.
- **Approval test:** recurring cross-app role? · can nothing existing do it without ugly overrides? ·
  does it improve consistency more than it adds maintenance? One YES is enough.
- 🔴 **NO LONGER FILEMAKER-ONLY** (Michael, 07-29): *"we've begun structuring our clickup app builds
  around the new object set."* Repo apps now model FMP **object families**, not just FMP schema.
  (1) the test is judged against **two** runtimes, so an FMP-only family is weaker; (2) a repo-app UI
  question is mine at the VOCABULARY layer, the CODE stays Dexter's; (3) a one-off costs double, so
  the test gets **stricter**.
- 🔴 **THE LIBRARY IS THE BACKLOG HOME.** Unbuilt families tracked on the Library page, per family,
  never as a checklist under an app build task. Corollary: **a task whose job was to DEFINE a standard
  is done when the definition is done** — leftovers are standard backlog in the wrong container.
- 🔴 **The real build baseline is NOTHING.** Only fonts were installed + render-tested, and fonts are
  a prerequisite for `tx_*`, not the family. **No family in this library is built.**
- 🔴 **TABLE VIEW DEFERS THE BADGE FAMILIES — standing rule, not a per-app choice.** In table view,
  conditional formatting does a status badge's job with zero objects.
- ⚠️ **Open vocabulary gap, not papered over:** document-type labels (Balloon Note, Settlement
  Statement…) express **KIND**; `badge_status_*` expresses **CONDITION**. A type label is not a status
  badge, and forcing it into one is how a family drifts.

### Ruling ledger (my calls on the standard — must compound)

- **Refusals: EMPTY.** Every existing family predates me.
- 🔬 **PENDING · `tbl_*` (table-view columns), proposed 07-29, NOT added.** The library has **no
  table-view vocabulary at all**, and table view is now a primary user surface, so the gap is
  load-bearing. Test passes 3/3 (recurring cross-app role incl. repo · nothing existing covers it —
  `fd_*` are layout fields, `row_portal_*` is a portal row · small, consistency-positive). **Proposed
  rather than added** because a new family changes a standard governing two runtimes. → HML_LLC DL Q7.
  Yes = my first authored family; no = my first refusal.
- ✅ **FIXED 07-29 · Summary tiles state row restored.** The Library declared `sum_metric_tile` +
  `_alert` but its state matrix had no Summary tiles row — the one family with a built-in alert variant
  had no state rule. The row exists verbatim on the superseded HML page. **Lesson: when a standard is
  MIGRATED, diff it against the old copy — lift-and-shift silently drops rows.**

## 🗄️ HML_LLC (Dad's loan servicing) — my first build

**Decisions are CANONICAL in the HML_LLC Decision Log + the build-task descriptor, not here.**

<br/>

NOT a URITP module — private-lending servicing for Michael's dad. Schema locked June 2026 around
`Loans` as the true financial parent, with `PropertySUMMARIES` demoted to the collateral lens and the
ledger tables (`ExpectedTransactions`, `AccountTransactions`, `PaymentApplications`, `Payoffs`) hanging
off `Loans`. `PrimaryKey` UUID everywhere; `fk*`/`calc_`/`g_` enforced.

- ⚠️ **FILEMAKER 19, PERMANENTLY.** Upgrading was explicitly rejected 07-29.
- 🔴 **FMP19 HAS NO NATIVE TRANSACTIONS.** `Open/Commit/Revert Transaction` are **FileMaker 2023
  (v20)** — verified against the Claris 20.1.2 release notes + the MBS step-by-version table.
  Atomicity on 19: all writes go through **ONE relationship from a single parent record**, so
  `Revert Record` discards the whole set. `Set Error Capture [On]`; check `Get(LastError)` after
  **every** write step; **no `Commit Records` inside the block** (the usual silent break). Wrapped once
  as `txn_*`, whose names imply an engine transaction that does not exist — **say so in the comments.**
  Rollback + error catching **throughout** is a requirement, not a preference.
- **Must be atomic:** one `AccountTransactions` row applied across N `ExpectedTransactions`, and the
  `Payoffs` snapshot freeze. Half-applied = corrupt money data; partial freeze = a quote that changes
  after it was sent.
- **Shape of v1:** internal instrument for Michael, scoped to the screens carrying a month. Ledgers go
  table view (a REAL user surface — column set + formatting ARE the UI); Loan and Property hubs stay
  layouts, being parent-with-children. **No portal on Payoffs.**

## 🔗 FMP ↔ repo correlations (the shared vocabulary — the point of me)

Shape: **FMP construct → repo equivalent → where it holds → where it BREAKS.** The breaks half matters
most; a correlation with no stated limit is a slogan.

- 🔴 **C1 · Object family → repo component token set.** Both exist to stop one job being solved three
  ways, so it **holds** at intent. **Breaks at STATE:** FMP fakes state with stacked objects +
  hide-object conditions (one object per state); CSS uses a class on ONE element. Many-state families
  are cheap in the repo, expensive in FMP — **never let repo state-richness set the FMP family count.**
- 🔴 **C2 · Table view → rendering straight off the data.** FMP table view renders the schema itself,
  no layout objects; the repo analogue renders off the JSON with no view model between. **Holds** as
  the argument that good field/key naming IS the UI in both runtimes. **Breaks** on
  parent-with-children: table view flatly cannot, and a portal (or nested render) is the answer.
- 🔴 **C3 · Portal row → the list-item component, the CHEAPEST layout in either runtime.** One object
  set renders N records, so styling is paid once and amortized over every row — the inverse of
  per-state badge objects. **Holds** as why portals are the right spend when build time is scarce.
  **Breaks on editability:** an FMP portal is an editing surface *by default*; a repo list render is
  read-only by default. Over immutable data the repo version is safe and the FMP version is a footgun.
  **Never assume a safe default transfers across runtimes.**

## ⚠️ Lifecycle SoT rule (INHERITED)

**Source-of-truth MIGRATES as a module ships.** UNBUILT → the ClickUp planning page is canonical.
BUILT (live records) → **FileMaker is the source of truth**; ClickUp drops to a POINTER, never a
maintained mirror. Prevents quoting a plan as if it were live schema. **Inherited stale-fork:** the
URITP People known-issues checklist tracks FMP-internal field typos as ClickUp checkboxes — **flag,
don't fix another system's internals inside ClickUp.**

## 🧠 Michael-patterns worth carrying

- 🔴 **HE DOES NOT WANT A MENU, HE WANTS A PARTNER** (07-29): *"you convince me. less yes-man more
  developer partner…"* When the call is TECHNICAL and in my lane, five checkboxes is dodging the job.
  **Decide, then argue it, specifically enough to be wrong.** A DL fork is for choices genuinely HIS
  (money, scope, direction, taste) or ones changing a shared standard. **All domains.**
- 🔴 **He routes to the SEAM, not to one of us** (07-29): asked for Dexter's read on the FMP19 rollback
  method rather than my answer alone. **Reach for the cross-runtime conversation unprompted.**
- He is deliberately pulling the repo toward FMP's data discipline — the strategy behind my lane.
- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Prefers the STRUCTURAL fix over another written rule. Keeps reasoning, not just outcomes.
- **INVERTED polarity** (checked = REJECTED), answered fast and in bulk. ⚠️ **Zero-strikes-plus-a-note
  is a real answer shape:** the question was WRONG, not unanswered. Re-ask better; never re-hand the
  same menu.

## 📌 Lineage

Scaffolded 07-15 as FMP Frank → blocked ten days by a rotted stub → renamed Fiona 07-25 (slug
`fmp-frank` immutable) → **BUILT** 07-26, git track → **first real session 07-28/29, HML_LLC v1
replan.** Reasoning: `decision-log.md` D1–D6 + the archive.

## Pointers (never restate)

- My standard → **FileMaker Canonical Object Library** (under the FileMaker Home doc page)
- ⚠️ A **zARCHIVE** copy sits under `zArchive` and still says "keep HML-specific references here" — an
  archived page cannot be a maintained reference. Don't write to it; diff source only.
- Domain canon → Patterns + Conventions · Theme System · Documentation Standard · App Index
- Corey seam doc → FileMaker → ClickUp Sync Mirror Pattern · Open Qs → FileMaker Research Inbox
- URITP modules + lifecycle SoT → URITP fmp Solutions (list)
- **HML_LLC decisions (CANONICAL) → HML_LLC FileMaker v1 — Decision Log + build-task descriptor**
- My lane + every seam → `preferences.md` · Conduct → `_shared/super-agent-base.md` (§6)
- Dexter's contract side → `gates/theme-contract-gate.md` · Roster → `super-agents/roster.json`
- My archive → `memory/archive/uritp-landscape-inherited.md`
