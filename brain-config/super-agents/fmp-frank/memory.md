# Fiona — Memory (the schema + correlation precedent ledger)

> CONTEXT, not process. The object library, the patterns doc and the documentation standard are
> TOOLS I point at — never restated here.
>
> **INHERITED vs EARNED is labelled per line.** Seeded 2026-07-26 by Fleet Felix; my first EARNED
> lines landed 2026-07-29. An unconfirmed INHERITED line is a LEAD, not a fact.
>
> **Budget ~10KB hot cap.** ⚠️ **Blown TWICE on 07-29** — see the Placement rule below. It is the
> most useful thing I learned about my own memory on day one.

---

## 🚦 Placement rule for THIS file (EARNED 07-29, the hard way)

I went over the cap twice in one session. First time I archived. Second time I looked at *what* was
over-spilling and found it was **a per-question replay of the HML_LLC Decision Log** — a surface that
is already CANONICAL in ClickUp, with the build-task descriptor as its companion. That is not memory,
it is a **projection**, and the fix is to delete it and point, not to archive a second copy.

<br/>

**So: this file holds the GENERALIZATION, never the decision record.** For any decided thing, ask
*"does a ClickUp Decision Log already own this?"* If yes, keep one line about what it changes in how
I act and point at the log. **A memory file that grows in step with a project's decisions is
mis-scoped, and the growth curve is the tell.**

## 🧱 The object library — MINE

✅ **VERIFIED 07-29** (inherited → opened myself): the live page is **FileMaker Canonical Object
Library**, child of the **FileMaker Home** doc page, and it does carry all four things my bundle
claimed — families, family discipline, minimum-viable set, state matrix, approval test. Families:
`cnt_*`, `nav_*`, `tx_*`, `btn_*`, `fd_*`, `row_portal_*`, `sum_metric_tile`, `badge_status_*`,
`card_modal_standard`.

- **The rule I enforce:** one visual role → one preferred object class. Never solve the same job with
  a field in one layout, a button in another, a button-bar segment in a third. State variants belong
  to their family and must not fork into pseudo-families.
- **Approval test:** recurring cross-app role? · can no existing family do it without ugly overrides?
  · does it improve consistency more than it adds maintenance? One YES is enough.
- 🔴 **NO LONGER FILEMAKER-ONLY** (Michael, 07-29): *"we've begun structuring our clickup app builds
  around the new object set."* Q13 arriving for real — repo apps model FMP **object families**, not
  just FMP schema. (1) the test is judged against **two** runtimes, so an FMP-only family is weaker;
  (2) a repo-app UI question is mine at the VOCABULARY layer, the CODE stays Dexter's; (3) a one-off
  now costs double, so the test gets **stricter**.
- 🔴 **THE LIBRARY IS THE BACKLOG HOME.** Unbuilt families are tracked on the Library page, per
  family — never as a checklist under an app build task. Generalizing corollary: **a task whose job
  was to DEFINE a standard is done when the definition is done**; leftover items are standard
  backlog in the wrong container, not task backlog.
- 🔴 **The real build baseline is NOTHING.** Only fonts were ever installed + render-tested, and
  fonts are a prerequisite for `tx_*`, not the family. **No family in this library is built.**
- 🔴 **TABLE VIEW DEFERS THE BADGE FAMILIES — standing rule, not a per-app choice.** In a table view
  conditional formatting does a status badge's job with zero objects.
- ⚠️ **Open vocabulary gap, not papered over:** document-type labels (Balloon Note, Settlement
  Statement…) express **KIND**; `badge_status_*` expresses **CONDITION** (neutral/good/warn/alert).
  A type label is not a status badge, and forcing it into one is how a family drifts.

### Ruling ledger (my calls on the standard — the thing that must compound)

- **Refusals: EMPTY.** Every existing family predates me.
- 🔬 **PENDING · `tbl_*` (table-view columns), proposed 07-29, NOT added.** The library has **no
  table-view vocabulary at all** and table view is now a primary user surface, so the gap is
  load-bearing. Test passes 3/3 (recurring cross-app role incl. repo · no existing family covers it,
  `fd_*` are layout fields and `row_portal_*` is a portal row · small, consistency-positive).
  **Proposed rather than added** because a new family now changes a standard governing two runtimes.
  → HML_LLC DL Q7. Yes = my first authored family; no = my first refusal. Either belongs here.
- ✅ **FIXED 07-29 · Summary tiles state row restored.** The Library declared `sum_metric_tile` +
  `_alert` while its state matrix had no Summary tiles row — the one family with a built-in alert
  variant had no state rule. The row exists verbatim on the superseded HML page. **Lesson: when a
  standard is MIGRATED, diff it against the old copy — a lift-and-shift silently drops rows.**

## 🗄️ HML_LLC (Dad's loan servicing) — my first build

**Decisions are CANONICAL in the [HML_LLC FileMaker v1 — Decision Log] + the build-task descriptor,
not here.** Read those for the what; below is only what changes how I act.

<br/>

NOT a URITP module — private-lending servicing for Michael's dad. Schema locked June 2026:
`GLOBAL_USE_VARIABLES` · `PropertySUMMARIES` (collateral lens) · `Loans` (the true financial parent)
· `ExpectedTransactions` · `AccountTransactions` · `PaymentApplications` (join) · `Payoffs` ·
`PaymentInstructions` · `Standard_Transactions` (taxonomy). `PrimaryKey` UUID everywhere;
`fk*` / `calc_` / `g_` enforced.

- ⚠️ **RUNTIME IS FILEMAKER 19, PERMANENTLY.** Upgrading was explicitly rejected 07-29.
- 🔴 **FMP19 HAS NO NATIVE TRANSACTIONS.** `Open/Commit/Revert Transaction` are **FileMaker 2023
  (v20)** — verified against the Claris 20.1.2 release notes + the MBS step-by-version table.
  Atomicity on 19: every write in a transaction goes through **ONE relationship from a single parent
  record**, so `Revert Record` discards the whole set. `Set Error Capture [On]`, check `Get(LastError)`
  after **every** write step, and **no `Commit Records` inside the block** (the usual silent break).
  Wrapped once as `txn_*`; the names imply an engine transaction that does not exist, so **say so in
  the comments.** Michael wants rollback + error catching **throughout** — a requirement.
- **Must be atomic:** one `AccountTransactions` row applied across N `ExpectedTransactions`, and the
  `Payoffs` snapshot freeze. A half-applied payment is corrupt money data; a partial freeze is a
  quote that changes after it was sent.
- **Shape of v1:** internal instrument for Michael, scoped to the screens that carry a month. Ledgers
  go table view (a REAL user surface, so column set + formatting ARE the UI); the Loan and Property
  hubs stay layouts because they are parent-with-children. **No portal on Payoffs** — editable portal
  over frozen data defeats the freeze.

## 🔗 FMP ↔ repo correlations (the shared vocabulary)

Shape: **FMP construct → repo equivalent → where it holds → where it BREAKS.** The breaks half
matters most; a correlation with no stated limit is a slogan.

- 🔴 **C1 · Object family → repo component token set.** An FMP family is one named visual role with
  state variants; the repo equivalent is a component honoring `var(--token)` under the theme contract.
  **Holds** because both exist to stop one job being solved three ways. **Breaks at STATE:** FMP fakes
  state with stacked objects + hide-object conditions (one object per state), CSS uses a class on ONE
  element. Many-state families are cheap in the repo, expensive in FMP — never let repo
  state-richness set the FMP family count.
- 🔴 **C2 · Table view → rendering straight off the data.** FMP table view renders the schema itself,
  no layout objects; the repo analogue is rendering off the JSON with no view model between. **Holds**
  as the argument that good field/key naming IS the UI in both runtimes. **Breaks** on
  parent-with-children: table view flatly cannot, and a portal (or nested render) is the answer.
- 🔴 **C3 · Portal row → the list-item component, the CHEAPEST layout in either runtime.** One object
  set renders N records, so styling is paid once and amortized over every row — the exact inverse of
  per-state badge objects. **Holds** as why portals are the right layout spend when build time is
  scarce. **Breaks on editability:** an FMP portal is an editing surface *by default*; a repo list
  render is read-only by default. Over immutable data the repo version is safe and the FMP version is
  a footgun. **Never assume a safe default transfers across runtimes.**

## ⚠️ The lifecycle SoT rule — must not get backwards (INHERITED)

**Source-of-truth MIGRATES as a module ships.** UNBUILT (no live records) → the ClickUp planning page
IS canonical. BUILT (live records) → **FileMaker is the source of truth**, ClickUp drops to a POINTER,
never a maintained mirror. Prevents quoting a PLANNING doc as if it were live schema. Proposed tell:
a per-row **FMP Build State** field (Planned / Building / Live) + a migration trigger at completion.
Neither built yet.

**Live stale-fork I inherited:** the URITP People known-issues checklist tracks FMP-INTERNAL field
typos (`prefferedFirstName`) as ClickUp checkboxes. Fix it in FileMaker and the checklist silently
lies. **Flag, don't fix another system's internals inside ClickUp.**

## 🤝 How I work with the others

- **Dexter** — he builds repo, I build FMP. I own the **object library + the vocabulary**; he enforces
  the contract in repo code. **I consult, never edit** — keeps our build memory from becoming rivals
  (*"strictly worse than one"*). ⚠️ **07-29: Michael asked for Dexter's read rather than mine alone**
  on the FMP19 rollback method. He wants the engineering conversation between us — **reach for it
  unprompted next time** instead of waiting to be told.
- **Anna** — I bring FMP-buildability FINDINGS; she leads any formal audit.
- **Corey** — his "schema" is ClickUp fields, mine is FileMaker. We meet at the sync/mirror pattern.
- **Milo** — he runs productions, I build the tools they run on. He states the need, I state the schema.
- **Felix** — steward; built me, holds the fleet directory.

## 🧠 Michael-patterns worth carrying

- 🔴 **HE DOES NOT WANT A MENU, HE WANTS A PARTNER** (07-29): *"you convince me. less yes-man more
  developer partner…"* When the call is TECHNICAL and inside my lane, five checkboxes is dodging the
  job. **Decide, then argue it, specifically enough to be wrong.** A DL fork is for choices genuinely
  HIS (money, scope, direction, taste) or ones that change a shared standard. **All domains.**
- **He is deliberately pulling the repo toward FMP's data discipline** — the strategy behind my lane.
- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Prefers the STRUCTURAL fix over another written rule.
- Keeps reasoning, not outcomes — reversals struck through, never deleted.
- Answers fast + in bulk, **INVERTED polarity** (checked = REJECTED). ⚠️ **Zero-strikes-plus-a-note**
  is a real answer shape: the question was WRONG, not unanswered. Re-ask better; never hand the same
  menu back.

## 📌 Lineage (detail in `decision-log.md` D1–D6 + the archive)

Scaffolded 07-15 as FMP Frank → blocked ten days by a rotted stub → renamed Fiona 07-25 (slug
`fmp-frank` immutable) → **BUILT** 07-26, git track, lane pinned by Q13 → B → **first real session
07-28/29, HML_LLC v1 replan.**

## Pointers (never restate)

- My standard → **FileMaker Canonical Object Library** (under the FileMaker Home doc page)
- ⚠️ A **zARCHIVE** copy of that standard sits under `zArchive` and still says "keep HML-specific
  references here" — an archived page cannot be a maintained reference. Don't write to it; it is
  useful only as the pre-migration diff source.
- Domain canon → Patterns + Conventions · Theme System · Documentation Standard · App Index
- Corey seam → FileMaker → ClickUp Sync Mirror Pattern · Open questions → FileMaker Research Inbox
- URITP modules + lifecycle SoT → URITP fmp Solutions (list)
- **HML_LLC decisions (CANONICAL) → HML_LLC FileMaker v1 — Decision Log + the build-task descriptor**
- Dexter's side → `gates/theme-contract-gate.md` · Conduct → `_shared/super-agent-base.md` (§6)
- Audit bar → `super-agents/audit-instruction.md` · Roster → `super-agents/roster.json`
- My archive → `memory/archive/uritp-landscape-inherited.md`
