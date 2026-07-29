# Fiona — Memory (the schema + correlation precedent ledger)

> CONTEXT, not process. The object library, the patterns doc and the documentation
> standard are TOOLS I point at — never restated here.
>
> **INHERITED vs EARNED is labelled per section.** Everything was seeded at build
> 2026-07-26 by Fleet Felix (from the URITP fmp Solutions audit page, the FileMaker
> Canonical Object Library, and the Fleet Build Queue Decision Log). **My first EARNED
> lines landed 2026-07-29** — the HML_LLC section, the cross-runtime object-set fact, and
> the first correlation entry. Treat an unconfirmed INHERITED line as a lead, not a fact,
> especially any record COUNT, which drifts.
>
> **Budget: ~10KB hot cap** (`hooks/memory-rotation.md`, enforced by Maggie at close).
> Warm archives go to `memory/archive/`. ⚠️ Near the cap as of 07-29 — next write rotates.

---

## 🎯 Why I hold memory (the thing that compounds)

A schema answer given cold is a guess dressed as expertise. What accumulates here:

1. **Schema precedent** — why a solution is shaped the way it is, so a change is deliberate rather than accidental.
2. **Object-library rulings** — which families exist, and *which were REFUSED and why*. A refusal nobody remembers gets re-proposed every month.
3. **FMP ↔ repo correlations** — the actual point of Michael's shared vocabulary.
4. **Naming scars** — the typos and inconsistencies that shipped, and what they cost.

## 🧱 The object library — MINE

Canonical doc: **FileMaker Canonical Object Library** (under FileMaker Home). It carries the
families (`cnt_*` containers, `nav_*`, `tx_*` type, `btn_*`, `fd_*` fields, `row_portal_*`,
`sum_metric_tile` / `badge_status_*`), the family-discipline rule, the minimum-viable set to build
before a new app, the state matrix, and **the approval test for a new family.**

- **The rule I enforce (INHERITED):** one visual role → one preferred object class. Do not solve the
  same job with a field in one layout, a button in another and a button-bar segment in a third.
- **State variants belong to their family** and must not fork into pseudo-families.
- **The approval test (three questions):** recurring cross-app role? · can no existing family do it
  without ugly overrides? · does it improve consistency more than it adds maintenance? One YES is
  enough. Zero YESes = *"probably just a one-off styling urge and should be resisted."*
- **Refusal ledger: still EMPTY.** Every family predates me. First refusal is still unearned.
- 🔴 **EARNED 2026-07-29 — THE LIBRARY IS NO LONGER FILEMAKER-ONLY, AND MICHAEL SAID SO IN THOSE
  WORDS:** *"we've begun structuring our clickup app builds around the new object set. this needs to
  be core memory for Fiona"* (HML_LLC DL Q5 note). This is the Q13 strategy arriving for real — the
  repo apps are being modelled on FMP **object families**, not merely FMP schema. Consequences I act
  on: (1) the approval test now has to be judged against **two** runtimes, so "recurring cross-app
  role" includes repo apps and a family that only works in FMP is a weaker candidate than it was;
  (2) a repo-app UI question is legitimately mine to answer at the VOCABULARY layer even though the
  CODE is Dexter's — his `gates/theme-contract-gate.md` is the enforcement twin; (3) this is the
  strongest reason yet not to let a one-off styling urge through, because the cost now doubles.

## 🗄️ HML_LLC (Dad's loan servicing, FileMaker) — EARNED 2026-07-28/29

My first real build, and it is NOT a URITP module. Private-lending servicing for Michael's dad.
Schema locked June 2026: `GLOBAL_USE_VARIABLES` · `PropertySUMMARIES` (collateral lens) ·
`Loans` (the true financial parent) · `ExpectedTransactions` · `AccountTransactions` ·
`PaymentApplications` (join) · `Payoffs` · `PaymentInstructions` · `Standard_Transactions`
(taxonomy). `PrimaryKey` UUID everywhere, `fk*` / `calc_` / `g_` naming enforced.

- ⚠️ **RUNTIME IS FILEMAKER 19 AND STAYS THERE** (Michael, 07-29). The 2026 trial LAPSED, so the
  original "credible demo before the clock runs out" brief is dead.
- 🔴 **FMP19 HAS NO NATIVE TRANSACTIONS.** `Open Transaction` / `Commit Transaction` /
  `Revert Transaction` are **FileMaker 2023 (v20)** steps. Verified against the Claris FMP 20.1.2
  release notes and the MBS step-by-version table — *not* assumed, and worth re-stating because it
  is the kind of fact that gets "remembered" wrong. Atomicity on 19 = the classic pattern: every
  write in one transaction goes through **ONE relationship from a single parent record**, so a
  `Revert Record` on error rolls back the whole set. Michael: *"I definitely want rollback and error
  catching throughout all of this!"* — that is a build requirement, not a nice-to-have.
- **The two routines that MUST be atomic:** applying one `AccountTransactions` row across N
  `ExpectedTransactions` (a half-applied payment is corrupt money data), and the `Payoffs` snapshot
  freeze (a partial freeze is a quote that silently changes after it was sent).
- **v1 target (DL Q1):** internal-only, Michael runs the books in it; presentable v2 comes after the
  data model is proven under real use. Scoped down to the few screens that carry a month.
- **Table-view line (DL Q2):** table view for the LEDGER tables only. The Loan and Property hubs
  stay built layouts because they are parent-with-children screens, which table view cannot do.

## 🔗 FMP ↔ repo correlations (the shared vocabulary)

> Michael, 2026-07-26: *"we are going to begin modeling our repo apps more like our fmp app schema,
> and it helps my mental model and our communication to use a shared vocabulary."*

Shape: **FMP construct → repo equivalent → where it holds → where it breaks.** The *breaks* half
matters most; a correlation with no stated limit is a slogan.

- 🔴 **C1 (EARNED 07-29) · Object family → repo component token set.** An FMP object family is one
  named visual role with state variants; the repo equivalent is a component honoring
  `var(--token)` under the theme contract. **Holds** because both exist to stop one job being solved
  three ways, and Michael has now explicitly pointed the repo at the families. **Breaks** at STATE:
  FMP fakes state with stacked objects + hide-object conditions (one object per state), CSS does it
  with a class or a pseudo-selector on ONE element. So a family with many states is cheap in the
  repo and expensive in FMP — never let repo state-richness set the FMP family count.
- 🔴 **C2 (EARNED 07-29) · Table view → rendering straight off the data.** FMP table view renders the
  schema itself, no layout objects; the repo analogue is rendering off the JSON with no view model
  in between. **Holds** as the argument that good field/key naming IS the UI in both runtimes.
  **Breaks** on parent-with-children: table view flatly cannot, and a portal (or a nested render) is
  the answer in both — which is why HML_LLC's hubs stay layouts.

## ⚠️ The lifecycle SoT rule — the thing I must not get backwards (INHERITED)

**Source-of-truth MIGRATES as a module ships.** UNBUILT (no live FMP records) → the ClickUp planning
page IS canonical. BUILT (live records) → **FileMaker is the source of truth** and the ClickUp page
drops to a POINTER, never a maintained mirror. The failure this prevents: confidently quoting a
PLANNING doc as if it were a live schema. Proposed tell: a per-row **FMP Build State** field
(Planned / Building / Live) plus a migration trigger at build completion. Neither is built yet.

**Live stale-fork I inherited:** the URITP People known-issues checklist tracks FMP-INTERNAL field
typos (`prefferedFirstName` → `preferredFirstName`) as ClickUp checkboxes. Fix the typo in FileMaker
and the checklist silently lies. It should POINT at FMP. **Flag, don't fix another system's
internals inside ClickUp.**

## 🗄️ URITP FMP solution landscape (INHERITED — verify before quoting)

Modules planned or in build on the URITP fmp Solutions list: **Production Calendar · Inventory
(+ GOBO) · Signage · Budget · People · Global Setup · Safety Programs · Risk Assessments
(+ Builder) · House Reports · Paperwork Archive · Patchbay Doc · Contact Sheets · Labour/Hours
Worked.** Big modules are milestones; build steps are tasks under them.

- **People is the deepest and most instructive:** a 7-table map around `PEOPLE_setup`, with
  STUDENTS / ADULTS / EMPLOYEES as extensions, a name-display cascade, and a known-issues list.
  **FMP People is the canonical people system-of-record;** the ClickUp "URITP People" CRM is the
  projection. (Inherited record count ~341 — stale until I check it.)
- **Safety Suite has an explicit split:** ClickUp = public intake truth, FileMaker = private internal
  reporting truth. A shape to reuse, not a one-off.
- Intake arrives as forwarded emails becoming subtasks (scanned PDFs, class-year updates).

## 🤝 How I work with the others (INHERITED)

- **Dexter** — he builds repo, I build FMP. I own the **object library + the vocabulary**; he enforces
  the contract in repo code. **I consult on his builds and never edit them** — that line keeps our
  build memory from becoming rivals (Q7: *"strictly worse than one"*). Tandem, not hierarchy.
  ⚠️ Michael asked for Dexter's read on the FMP19 rollback method (07-29) — he wants the ENGINEERING
  conversation between us, not one of us alone. That is the seam working as designed.
- **Anna** — I bring FMP-buildability FINDINGS; she leads any formal audit.
- **Corey** — his "schema" is ClickUp fields, mine is FileMaker. We meet at the sync/mirror pattern.
- **Milo** — he runs productions, I build the tools they run on. He states the need, I state the schema.
- **Felix** — steward; he built me and holds the fleet directory.

## 🧠 Michael-patterns worth carrying

- 🔴 **EARNED 2026-07-29 — HE DOES NOT WANT A MENU, HE WANTS A PARTNER.** On DL Q4 he struck nothing
  and wrote: *"you convince me. less yes-man more developer partner…"* Read: when the call is
  TECHNICAL and inside my lane, offering five checkboxes is me dodging the job. **Decide, then argue
  it, and be specific enough to be wrong.** A fork belongs in a Decision Log only when the choice is
  genuinely HIS (money, scope, direction, taste) — not when it is mine and I am hedging. This
  generalizes to every domain, not just HML_LLC.
- **He is deliberately pulling the repo toward FMP's data discipline** — the strategy behind my lane.
- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Prefers the STRUCTURAL fix over another written rule.
- Keeps reasoning, not just outcomes — reversals get struck through, never deleted.
- Answers fast and in bulk via Decision Logs with **INVERTED polarity** (checked = REJECTED).
  ⚠️ And he uses **zero-strikes-plus-a-note** as a real answer shape: it means the question was
  wrong, not unanswered. Re-ask better; never hand the same menu back.

## 📌 Lineage (INHERITED — full reasoning in `decision-log.md` D1–D6)

Scaffolded 2026-07-15 as **FMP Frank**, then **blocked TEN DAYS** by a stub demanding a verbatim
paste of a live native config nobody was going to make. Renamed **Frank → Fiona** 07-25 (display
only; slug `fmp-frank` immutable) so bare "Frank" resolves to Fold-in Frank. **BUILT** 07-26 on the
git track, trigger scaffolding waived (*"he's no native agent"*), lane pinned by Q13 → B. First live
teammate whose lane includes cross-runtime consulting. **First real session 2026-07-28/29** —
HML_LLC v1 replan.

## Pointers (never restate)

- My standard → **FileMaker Canonical Object Library** (ClickUp, under FileMaker Home)
- Domain canon → FileMaker Patterns + Conventions · Theme System · Documentation Standard · App Index
- The Corey seam → FileMaker → ClickUp Sync Mirror Pattern
- Open FMP questions → FileMaker Research Inbox
- Module planning + lifecycle SoT → URITP fmp Solutions (list)
- HML_LLC decisions → **HML_LLC FileMaker v1 — Decision Log** (ClickUp, under the build task)
- Dexter's side of the contract → `gates/theme-contract-gate.md`
- How to BE a teammate → `_shared/super-agent-base.md` (§6)
- Audit bar → `super-agents/audit-instruction.md` → git-teammate track
- Fleet roster → `super-agents/roster.json`
