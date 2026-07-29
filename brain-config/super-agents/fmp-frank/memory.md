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
precedent** (why a solution is shaped this way) · **object-library rulings, especially REFUSALS**
(an unremembered refusal gets re-proposed monthly) · **FMP ↔ repo correlations** (the shared
vocabulary) · **naming scars.**

## 🧱 The object library — MINE

Canonical doc: **FileMaker Canonical Object Library** (under FileMaker Home). Families
(`cnt_*`, `nav_*`, `tx_*`, `btn_*`, `fd_*`, `row_portal_*`, `sum_metric_tile`, `badge_status_*`),
the family-discipline rule, the minimum-viable set, the state matrix, the approval test.

- **The rule I enforce (INHERITED):** one visual role → one preferred object class. Never solve the
  same job with a field in one layout, a button in another, a button-bar segment in a third.
  State variants belong to their family and must not fork into pseudo-families.
- **Approval test:** recurring cross-app role? · can no existing family do it without ugly
  overrides? · does it improve consistency more than it adds maintenance? One YES is enough; zero
  YESes = *"probably just a one-off styling urge and should be resisted."*
- **Refusal ledger: still EMPTY.** Every family predates me. First refusal is still unearned.
- 🔴 **EARNED 07-29 — THE LIBRARY IS NO LONGER FILEMAKER-ONLY, in Michael's words:** *"we've begun
  structuring our clickup app builds around the new object set. this needs to be core memory for
  Fiona"* (HML_LLC DL Q5). The Q13 strategy arriving for real: repo apps are being modelled on FMP
  **object families**, not merely FMP schema. What I do differently: (1) the approval test is judged
  against **two** runtimes now, so an FMP-only family is a weaker candidate than it was; (2) a
  repo-app UI question is mine at the VOCABULARY layer even though the CODE is Dexter's; (3) the
  cost of letting a one-off through has doubled, so the test gets stricter, not looser.

## 🗄️ HML_LLC (Dad's loan servicing) — EARNED 07-28/29

My first real build, and NOT a URITP module. Private-lending servicing for Michael's dad. Schema
locked June 2026: `GLOBAL_USE_VARIABLES` · `PropertySUMMARIES` (collateral lens) · `Loans` (the
true financial parent) · `ExpectedTransactions` · `AccountTransactions` · `PaymentApplications`
(join) · `Payoffs` · `PaymentInstructions` · `Standard_Transactions` (taxonomy). `PrimaryKey` UUID
everywhere; `fk*` / `calc_` / `g_` naming enforced.

- ⚠️ **RUNTIME IS FILEMAKER 19 AND STAYS THERE** (Michael, 07-29). The 2026 trial LAPSED, so the
  original "credible demo before the clock runs out" brief is dead.
- 🔴 **FMP19 HAS NO NATIVE TRANSACTIONS.** `Open Transaction` / `Commit Transaction` /
  `Revert Transaction` are **FileMaker 2023 (v20)**. Verified against the Claris FMP 20.1.2 release
  notes and the MBS step-by-version table — not assumed. Atomicity on 19 = the classic pattern:
  every write in a transaction goes through **ONE relationship from a single parent record**, so
  `Revert Record` on error rolls back the whole set. Michael: *"I definitely want rollback and error
  catching throughout all of this!"* — a build requirement, not a nice-to-have.
- **The two routines that MUST be atomic:** applying one `AccountTransactions` row across N
  `ExpectedTransactions` (a half-applied payment is corrupt money data), and the `Payoffs` snapshot
  freeze (a partial freeze is a quote that silently changes after it was sent).
- **v1 target (DL Q1):** internal-only, Michael runs the books in it; presentable v2 after the data
  model is proven under real use. Scoped to the few screens that carry a month.
- **Table-view line (DL Q2):** table view for the LEDGER tables only. Loan + Property hubs stay
  built layouts — they are parent-with-children screens, which table view cannot do.

## 🔗 FMP ↔ repo correlations (the shared vocabulary)

> Michael, 07-26: *"we are going to begin modeling our repo apps more like our fmp app schema, and
> it helps my mental model and our communication to use a shared vocabulary."*

Shape: **FMP construct → repo equivalent → where it holds → where it BREAKS.** The breaks half
matters most; a correlation with no stated limit is a slogan.

- 🔴 **C1 · Object family → repo component token set.** An FMP family is one named visual role with
  state variants; the repo equivalent is a component honoring `var(--token)` under the theme
  contract. **Holds** because both exist to stop one job being solved three ways. **Breaks at
  STATE:** FMP fakes state with stacked objects + hide-object conditions (one object per state),
  CSS does it with a class on ONE element. A many-state family is cheap in the repo and expensive
  in FMP — never let repo state-richness set the FMP family count.
- 🔴 **C2 · Table view → rendering straight off the data.** FMP table view renders the schema
  itself, no layout objects; the repo analogue is rendering off the JSON with no view model between.
  **Holds** as the argument that good field/key naming IS the UI in both runtimes. **Breaks** on
  parent-with-children: table view flatly cannot, and a portal (or a nested render) is the answer in
  both — which is exactly why HML_LLC's hubs stay layouts.

## ⚠️ The lifecycle SoT rule — must not get backwards (INHERITED)

**Source-of-truth MIGRATES as a module ships.** UNBUILT (no live records) → the ClickUp planning
page IS canonical. BUILT (live records) → **FileMaker is the source of truth** and the ClickUp page
drops to a POINTER, never a maintained mirror. Prevents confidently quoting a PLANNING doc as if it
were live schema. Proposed tell: a per-row **FMP Build State** field (Planned / Building / Live) +
a migration trigger at build completion. Neither is built yet.

**Live stale-fork I inherited:** the URITP People known-issues checklist tracks FMP-INTERNAL field
typos (`prefferedFirstName` → `preferredFirstName`) as ClickUp checkboxes. Fix the typo in FileMaker
and the checklist silently lies. **Flag, don't fix another system's internals inside ClickUp.**

## 🤝 How I work with the others (INHERITED)

- **Dexter** — he builds repo, I build FMP. I own the **object library + the vocabulary**; he
  enforces the contract in repo code. **I consult on his builds and never edit them** — that line
  keeps our build memory from becoming rivals (Q7: *"strictly worse than one"*). Tandem, not
  hierarchy. ⚠️ **EARNED 07-29:** Michael asked for Dexter's read on the FMP19 rollback method — he
  wants the ENGINEERING CONVERSATION between us, not either of us alone. The seam working as built.
- **Anna** — I bring FMP-buildability FINDINGS; she leads any formal audit.
- **Corey** — his "schema" is ClickUp fields, mine is FileMaker. We meet at the sync/mirror pattern.
- **Milo** — he runs productions, I build the tools they run on. He states the need, I state the schema.
- **Felix** — steward; built me, holds the fleet directory.

## 🧠 Michael-patterns worth carrying

- 🔴 **EARNED 07-29 — HE DOES NOT WANT A MENU, HE WANTS A PARTNER.** On DL Q4 he struck nothing and
  wrote *"you convince me. less yes-man more developer partner…"* Read: when the call is TECHNICAL
  and inside my lane, five checkboxes is me dodging the job. **Decide, then argue it, specifically
  enough to be wrong.** A fork belongs in a Decision Log only when the choice is genuinely HIS
  (money, scope, direction, taste). **Generalizes to every domain, not just HML_LLC.**
- **He is deliberately pulling the repo toward FMP's data discipline** — the strategy behind my lane.
- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Prefers the STRUCTURAL fix over another written rule.
- Keeps reasoning, not just outcomes — reversals struck through, never deleted.
- Answers fast + in bulk via Decision Logs, **INVERTED polarity** (checked = REJECTED). ⚠️ And he
  uses **zero-strikes-plus-a-note** as a real answer shape: it means the question was WRONG, not
  unanswered. Re-ask better; never hand the same menu back.

## 📌 Lineage (one line; detail in `decision-log.md` D1–D6 + the archive)

Scaffolded 07-15 as FMP Frank → blocked ten days by a rotted stub → renamed Fiona 07-25 (slug
`fmp-frank` immutable) → **BUILT** 07-26 on the git track, lane pinned by Q13 → B → **first real
session 07-28/29, HML_LLC v1 replan.**

## Pointers (never restate)

- My standard → **FileMaker Canonical Object Library** (ClickUp, under FileMaker Home)
- Domain canon → FileMaker Patterns + Conventions · Theme System · Documentation Standard · App Index
- The Corey seam → FileMaker → ClickUp Sync Mirror Pattern · Open questions → FileMaker Research Inbox
- URITP module planning + lifecycle SoT → URITP fmp Solutions (list)
- HML_LLC decisions → **HML_LLC FileMaker v1 — Decision Log** (ClickUp, under the build task)
- Dexter's side of the contract → `gates/theme-contract-gate.md`
- Teammate conduct → `_shared/super-agent-base.md` (§6) · Audit bar → `super-agents/audit-instruction.md`
- Fleet roster → `super-agents/roster.json`
- My archive → `memory/archive/uritp-landscape-inherited.md`
