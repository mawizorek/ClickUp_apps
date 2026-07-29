# Fiona — Memory (the schema + correlation precedent ledger)

> CONTEXT, not process. The object library, the patterns doc and the documentation standard are
> TOOLS I point at — never restated here.
>
> **INHERITED vs EARNED is labelled per line.** Everything was seeded at build 2026-07-26 by Fleet
> Felix. **My first EARNED lines landed 2026-07-29.** An unconfirmed INHERITED line is a LEAD, not
> a fact — especially any record COUNT.
>
> **Budget ~10KB hot cap** (`hooks/memory-rotation.md`). **Rotated 2026-07-29** — inherited URITP
> landscape + full lineage now in `memory/archive/uritp-landscape-inherited.md`.

---

## 🎯 Why I hold memory

A schema answer given cold is a guess dressed as expertise. What compounds here: **schema
precedent** · **object-library rulings, especially REFUSALS** (an unremembered refusal gets
re-proposed monthly) · **FMP ↔ repo correlations** · **naming scars.**

## 🧱 The object library — MINE

✅ **VERIFIED 07-29** (was inherited, now opened myself): the live page is **FileMaker Canonical
Object Library**, a child of the **FileMaker Home** doc page, and it does carry all four things my
bundle claimed — families, family discipline, minimum-viable set, state matrix, approval test.
Families: `cnt_*`, `nav_*`, `tx_*`, `btn_*`, `fd_*`, `row_portal_*`, `sum_metric_tile`,
`badge_status_*`, `card_modal_standard`.

- **The rule I enforce:** one visual role → one preferred object class. Never solve the same job with
  a field in one layout, a button in another, a button-bar segment in a third. State variants belong
  to their family and must not fork into pseudo-families.
- **Approval test:** recurring cross-app role? · can no existing family do it without ugly
  overrides? · does it improve consistency more than it adds maintenance? One YES is enough.
- 🔴 **EARNED 07-29 — THE LIBRARY IS NO LONGER FILEMAKER-ONLY, in Michael's words:** *"we've begun
  structuring our clickup app builds around the new object set. this needs to be core memory for
  Fiona"* (HML_LLC DL Q5). Q13 arriving for real: repo apps are modelled on FMP **object families**,
  not merely FMP schema. (1) the approval test is judged against **two** runtimes, so an FMP-only
  family is a weaker candidate; (2) a repo-app UI question is mine at the VOCABULARY layer even
  though the CODE is Dexter's; (3) the cost of a one-off has doubled — the test gets STRICTER.
- 🔴 **EARNED 07-29 — THE LIBRARY IS THE BACKLOG HOME** (DL Q6). Unbuilt families are tracked *on the
  Library page*, per family, never as a checklist under an app build task. Rejected: a separate task,
  leaving backlog on a `done` task, splitting it. Corollary that generalizes: **a task whose job was
  to DEFINE a standard is done when the definition is done** — the unbuilt items were never task
  backlog, they were standard backlog in the wrong container.
- 🔴 **EARNED 07-29 — the real build baseline is NOTHING.** Of 63 items on the originating task only
  the 3 Typography Setup boxes were ticked (fonts installed + render-tested). Fonts are a
  PREREQUISITE for `tx_*`, not the family. **No object family in this library is actually built.**
- 🔴 **EARNED 07-29 — TABLE VIEW DEFERS THE BADGE FAMILIES, and it is a standing rule not a choice.**
  In a table view, conditional formatting does a status badge's job with zero objects. So any surface
  that goes table-view-first automatically defers `badge_status_*`.
- ⚠️ **Vocabulary gap I found and did NOT paper over:** HML's document-type pills (Balloon Note /
  Settlement Statement / Interest Payment / Check Received) express **KIND**, while `badge_status_*`
  semantics are neutral/good/warn/alert, i.e. **CONDITION**. A type label is not a status badge, and
  forcing it into one is exactly how a family drifts. Unresolved, recorded on the Library page.

### Ruling ledger (my own calls on the standard — the thing that must compound)

- **Refusals: still EMPTY.** Every existing family predates me.
- 🔬 **PENDING · `tbl_*` (table-view columns), proposed 07-29, NOT added.** The library has **no
  table-view vocabulary at all**, and DL Q2 made table view a *primary user surface*, so the gap is
  load-bearing. Test passes 3/3: recurring cross-app role incl. repo apps · no existing family covers
  it (`fd_*` are layout fields, `row_portal_*` is a portal row) · small and consistency-positive.
  **I proposed rather than added** because a new family now changes a standard governing two
  runtimes. → HML_LLC DL Q7. **If he says yes this is my first authored family; if no, my first
  refusal — either way it belongs here.**
- ✅ **FIXED 07-29 · Summary tiles state row restored.** The Library declared `sum_metric_tile` +
  `sum_metric_tile_alert` while its state matrix had no Summary tiles row, so the one family with a
  built-in alert variant had no state rule. The row existed verbatim on the superseded HML page and
  was lost when the standard was lifted across. **Lesson that generalizes: when a standard is
  MIGRATED, diff it against the old copy — a lift-and-shift silently drops rows.**

## 🗄️ HML_LLC (Dad's loan servicing) — EARNED 07-28/29

My first real build, and NOT a URITP module. Private-lending servicing for Michael's dad. Schema
locked June 2026: `GLOBAL_USE_VARIABLES` · `PropertySUMMARIES` (collateral lens) · `Loans` (the
true financial parent) · `ExpectedTransactions` · `AccountTransactions` · `PaymentApplications`
(join) · `Payoffs` · `PaymentInstructions` · `Standard_Transactions` (taxonomy). `PrimaryKey` UUID
everywhere; `fk*` / `calc_` / `g_` naming enforced.

- ⚠️ **RUNTIME IS FILEMAKER 19 AND STAYS THERE** (Michael, 07-29). The 2026 trial LAPSED; the
  original "credible demo before the clock runs out" brief is dead.
- 🔴 **FMP19 HAS NO NATIVE TRANSACTIONS.** `Open/Commit/Revert Transaction` are **FileMaker 2023
  (v20)**. Verified against the Claris FMP 20.1.2 release notes + the MBS step-by-version table.
  Atomicity on 19 = every write in a transaction goes through **ONE relationship from a single parent
  record**, so `Revert Record` rolls back the whole set. Michael: *"I definitely want rollback and
  error catching throughout all of this!"* — a requirement, not a nice-to-have. Wrapped once as
  `txn_*` (Dexter's call: mechanism + packaging, not either/or), and the wrapper names imply an
  engine transaction that does not exist, so **say so in the script comments.**
- **Must be atomic:** applying one `AccountTransactions` row across N `ExpectedTransactions` (a
  half-applied payment is corrupt money data), and the `Payoffs` snapshot freeze (a partial freeze is
  a quote that silently changes after it was sent).
- **v1 target (Q1):** internal-only, Michael runs the books in it; presentable v2 after real use
  proves the model. Scoped to the few screens that carry a month. Mobile/Go is OUT.
- **Table-view line (Q2):** table view for the LEDGER tables only, and it is a **real user surface**,
  so column set / field order / formatting ARE the UI. Loan + Property hubs stay built layouts.
- **Portals (Q4, my call):** Loan hub `ExpectedTransactions` + `AccountTransactions` first, then
  Property hub → `Loans`. **NO portal on Payoffs** — an editable portal over a frozen snapshot
  defeats the freeze; it wants read-only print. Documents deferred.

## 🔗 FMP ↔ repo correlations (the shared vocabulary)

Shape: **FMP construct → repo equivalent → where it holds → where it BREAKS.** The breaks half
matters most; a correlation with no stated limit is a slogan.

- 🔴 **C1 · Object family → repo component token set.** An FMP family is one named visual role with
  state variants; the repo equivalent is a component honoring `var(--token)` under the theme
  contract. **Holds** because both exist to stop one job being solved three ways. **Breaks at
  STATE:** FMP fakes state with stacked objects + hide-object conditions (one object per state), CSS
  does it with a class on ONE element. A many-state family is cheap in the repo and expensive in FMP
  — never let repo state-richness set the FMP family count.
- 🔴 **C2 · Table view → rendering straight off the data.** FMP table view renders the schema itself,
  no layout objects; the repo analogue is rendering off the JSON with no view model between.
  **Holds** as the argument that good field/key naming IS the UI in both runtimes. **Breaks** on
  parent-with-children: table view flatly cannot, and a portal (or nested render) is the answer in
  both — which is why HML_LLC's hubs stay layouts.
- 🔴 **C3 · Portal row → the list-item component, and it is the CHEAPEST layout in either runtime.**
  One object set renders N records, so styling cost is paid once and amortized over every row —
  the exact inverse of per-state badge objects, which cost one object each. **Holds** as the reason
  portals are the right layout investment when build time is scarce. **Breaks** on editability: an
  FMP portal is an editing surface *by default*, where a repo list render is read-only by default.
  Consequence with teeth: over immutable data (a frozen payoff) the repo version is safe and the
  FMP version is a footgun. **Never assume the safe default transfers across runtimes.**

## ⚠️ The lifecycle SoT rule — must not get backwards (INHERITED)

**Source-of-truth MIGRATES as a module ships.** UNBUILT (no live records) → the ClickUp planning page
IS canonical. BUILT (live records) → **FileMaker is the source of truth** and the ClickUp page drops
to a POINTER, never a maintained mirror. Prevents quoting a PLANNING doc as if it were live schema.
Proposed tell: a per-row **FMP Build State** field (Planned / Building / Live) + a migration trigger
at build completion. Neither is built yet.

**Live stale-fork I inherited:** the URITP People known-issues checklist tracks FMP-INTERNAL field
typos (`prefferedFirstName` → `preferredFirstName`) as ClickUp checkboxes. Fix the typo in FileMaker
and the checklist silently lies. **Flag, don't fix another system's internals inside ClickUp.**

## 🤝 How I work with the others

- **Dexter** — he builds repo, I build FMP. I own the **object library + the vocabulary**; he enforces
  the contract in repo code. **I consult and never edit** — that keeps our build memory from becoming
  rivals (*"strictly worse than one"*). ⚠️ **EARNED 07-29:** Michael asked for Dexter's read on the
  FMP19 rollback method — he wants the ENGINEERING CONVERSATION between us, not either of us alone.
  The seam working as built, and worth reaching for unprompted next time.
- **Anna** — I bring FMP-buildability FINDINGS; she leads any formal audit.
- **Corey** — his "schema" is ClickUp fields, mine is FileMaker. We meet at the sync/mirror pattern.
- **Milo** — he runs productions, I build the tools they run on. He states the need, I state the schema.
- **Felix** — steward; built me, holds the fleet directory.

## 🧠 Michael-patterns worth carrying

- 🔴 **EARNED 07-29 — HE DOES NOT WANT A MENU, HE WANTS A PARTNER.** On DL Q4 he struck nothing and
  wrote *"you convince me. less yes-man more developer partner…"* When the call is TECHNICAL and
  inside my lane, five checkboxes is me dodging the job. **Decide, then argue it, specifically enough
  to be wrong.** A fork belongs in a DL only when the choice is genuinely HIS (money, scope,
  direction, taste) — or when it changes a shared standard. **Generalizes to every domain.**
- **He is deliberately pulling the repo toward FMP's data discipline** — the strategy behind my lane.
- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Prefers the STRUCTURAL fix over another written rule.
- Keeps reasoning, not just outcomes — reversals struck through, never deleted.
- Answers fast + in bulk via Decision Logs, **INVERTED polarity** (checked = REJECTED). ⚠️ And
  **zero-strikes-plus-a-note** is a real answer shape: the question was WRONG, not unanswered.
  Re-ask better; never hand the same menu back.

## 📌 Lineage (detail in `decision-log.md` D1–D6 + the archive)

Scaffolded 07-15 as FMP Frank → blocked ten days by a rotted stub → renamed Fiona 07-25 (slug
`fmp-frank` immutable) → **BUILT** 07-26 on the git track, lane pinned by Q13 → B → **first real
session 07-28/29, HML_LLC v1 replan.**

## Pointers (never restate)

- My standard → **FileMaker Canonical Object Library** (ClickUp, under the FileMaker Home doc page)
- ⚠️ A **zARCHIVE** copy of the same standard exists under `zArchive` and still says "keep
  HML-specific references here" — an archived page cannot be a maintained reference. Don't write to
  it; it is useful only as the pre-migration diff source.
- Domain canon → FileMaker Patterns + Conventions · Theme System · Documentation Standard · App Index
- The Corey seam → FileMaker → ClickUp Sync Mirror Pattern · Open questions → FileMaker Research Inbox
- URITP module planning + lifecycle SoT → URITP fmp Solutions (list)
- HML_LLC decisions → **HML_LLC FileMaker v1 — Decision Log** (ClickUp, under the build task)
- Dexter's side of the contract → `gates/theme-contract-gate.md`
- Teammate conduct → `_shared/super-agent-base.md` (§6) · Audit bar → `super-agents/audit-instruction.md`
- Fleet roster → `super-agents/roster.json` · My archive → `memory/archive/uritp-landscape-inherited.md`
