# Design Decisions — maw-budget

_Decision log (ADR-style). Each entry is a call we've committed to, why, and its status. This is the "why" record; the "what" lives in `../next-build-spec.md` and `architecture-notes.md`. The chronological "what changed when" trail lives in `changelog.md`. New decisions append here; never silently reverse a LOCKED one without a superseding entry._

**Status key:** `LOCKED` = decided, build on it · `PROVISIONAL` = defaulted, confirm before it hardens · `OPEN` = still being interrogated (see spec).

---

## DD-001 — Double-entry ledger `LOCKED` (2026-07-15)

maw-budget is a double-entry ledger, not a single-row expense list. A transaction is an **event** (`TransactionGroup`) of balanced **legs** (`TransactionLines`) that sum to zero.

**Why:** every serious reference tool (QuickBooks, Firefly III, GnuCash, Actual) is double-entry. It is the only model that represents transfers between your own accounts (bank→bank, checking→card) without double-counting or losing the transfer, and net worth falls out of it for free. Cost is a little more scaffolding now; the payoff is never rebuilding.

**Supersedes:** the v0 "double-entry vs single-entry" open fork. Ruled by Michael 2026-07-15.

## DD-002 — Signed-amount legs; account TYPE is first-class `LOCKED` (2026-07-15)

Each leg stores a **signed amount** against an account. Whether `+` is "good" depends on the account's **type** (asset vs liability), so type is a first-class field, not a label.

**Why:** "balance went up" is good on checking (asset) and bad on a Visa (liability). The sign + type pair is what lets net worth roll up correctly. Debit/credit are just left/right of an entry (debit raises assets & expenses, credit raises liabilities/income/equity) — we encode that as sign×type, not as user-facing jargon.

## DD-003 — Balances and net worth are DERIVED, never stored `LOCKED` (2026-07-15)

Account balance = sum of its legs (plus the latest `Valuation` for feed-less assets). Net worth = sum of account balances. Nothing summable is persisted.

**Why:** stored balances drift out of sync the moment anything is edited. Derived balances can't lie.

**Refinement (DD-016):** a periodic **net-worth snapshot** is the ONE exception — it is a deliberate historical record, not a live balance, so it does not violate this rule.

## DD-004 — UI vocabulary: money-in / money-out, never "debit/credit" `LOCKED` (2026-07-15)

The interface speaks in plain money-in / money-out. The double-entry balancing happens underneath; the user never types a debit or a credit.

**Why:** debit/credit is the #1 thing that scares people off accounting tools. The correctness lives in the engine, not in the vocabulary.

## DD-005 — Feed-less assets via point-in-time Valuations `LOCKED` (2026-07-15)

Assets with no transaction stream (house, car) carry point-in-time `Valuation` snapshots rather than a running ledger.

**Why:** Maybe's pattern. You don't transact your house monthly; you re-estimate its worth occasionally. A snapshot models that honestly.

## DD-006 — Bloomberg / market data is OUT OF SCOPE `LOCKED` (2026-07-15)

maw-budget tracks a household ledger, not markets. No live quotes, no portfolio analytics, no market feed.

**Why:** Bloomberg Terminal is a different species (real-time market data + trading, ~$30k/yr, B-Unit 2FA). If a live portfolio view is ever wanted, it is a **separate app** with its own feed and folder, never folded in here. Named explicitly so the scope line stays honest.

## DD-007 — Phasing: spine → bills → budgeting `LOCKED` (2026-07-15)

Phase 1 = the ledger spine (accounts, balances, net worth, transfers, spend-by-category). Phase 2 = bills/subscriptions + bill↔actual match. Phase 3 = envelope budgeting on top of the existing ledger. Each phase is built so the next never forces a rebuild.

**Why:** budgeting is a derived layer, not a second ledger. Building the correct spine first means the envelope layer is additive, not surgical.

## DD-008 — Naming convention: HML_LLC house style `LOCKED` (2026-07-15)

**RULED by Michael 2026-07-15: HML style.** Primary keys `PrimaryKey` (UUID text), foreign keys `fk<Parent>` (e.g. `fkAccount`, `fkParentCategory`), calc fields `calc_`, globals `g_` (`gLIST_` for value-list globals), audit fields `CreationTimestamp / CreatedBy / ModificationTimestamp / ModifiedBy`. Clean PascalCase; no legacy SCREAMING names. URITP style (`pk_`/`fk_`) is rejected for this app.

**This was the last open gate.** With it locked, the field-articulation session can write `tables/` + `schema/tables.json` with no open naming question. `schema/tables.json` `_meta.conventions` already encodes this; `conventionNote` updated from "defaulted" to "LOCKED."

## DD-009 — Single user `LOCKED` (2026-07-15)

Michael only. No sharing/permissions model, no household split.

## DD-010 — Repo is source of truth; one file per object; PR workflow `LOCKED` (inherited)

Git-first app. Every object is one file, edited by branch → PR → self-merge. Calc formulas live inline in their owning table file (per `../../DOCUMENTATION-STANDARD.md`).

## DD-011 — Full account-type coverage `LOCKED` (2026-07-15)

The model must support every account class Michael holds: checking, savings, each credit card, cash, loans/mortgage, retirement, house, car. (Answer to inquiry A.)

**Why:** Michael wants all of them tracked. Implication: a single `Account` table with a **type** field (asset/liability + a sub-type detail) and an **on-budget boolean** covers the spread; we do NOT make a table per account class. Feed-less assets (house, car) use Valuations per DD-005. Actual counts and the on-budget flag per account are data set at entry time, not structure.

## DD-012 — CSV import + manual entry, ~weekly cadence `LOCKED` (2026-07-15)

Primary intake is **CSV import**, with **manual entry and manual post-import cleanup** as first-class steps. Cadence: aiming every other day, realistically ~weekly. (Answer to inquiry B.)

**Why:** FileMaker has no live bank feed, and Michael will drive intake by hand on a roughly weekly rhythm. Implications: (1) `ImportSessions` + a CSV mapper are **Phase 1**, not deferred; (2) `Account` needs a **per-account CSV column-mapping** (banks differ); (3) a **dedup key** (`rawHash`) prevents double-posting overlapping re-imports; (4) manual entry is a peer path, not a fallback. Sample CSV per bank gathered when the mapper is built.

**Prior art — CORRECTED (2026-07-15):** the real, dense precursor for maw-budget is the **Budgeting | Shopping** ClickUp space (space id `4026860067684899417`), NOT the URITP BETA BUDGET space. Per Michael: **BETA BUDGET has different use cases and its own separate FileMaker plan — it is NOT this build.** Do not treat BETA BUDGET as maw-budget prior art.

The **Budgeting | Shopping** space is the model-validation + first-migration source. Its structure (as of 2026-07-15):
- **Statements** (folder) + **Statement Imports** (list) — the real CSV/statement intake pattern; primary Phase-1 CSV mapping target.
- **Budget** (list) + **Budget** (folder) — the existing rough budgeting workflow (feeds DD-019 target-vs-actual).
- **Subscriptions** (list) — recurring outflows; direct feed for DD-017 Bills.
- **Vendors** (list) — payee/party precursor (feeds the DD-013 Party concept).
- **Wish List / Gifts / Family Gifts / Thank Yous / out shopping / home life / Print Machines / (dog) folder** — shopping-side lists; mostly OUT of maw-budget's ledger scope (shopping intent, not posted transactions). Flag at migration: decide per-list what is ledger data vs shopping-list data. Some (e.g. a paid gift) become transactions; most stay shopping.

**Migration note:** the field-articulation + migration session pulls from **Budgeting | Shopping**, not BETA BUDGET. Look at Statement Imports + Budget + Subscriptions + Vendors first; those map most directly onto Accounts/Transactions/Bills/Parties. maw-budget (FileMaker) is the long-term home.

**Open (deferred to interaction/interface session):** the manual-entry-vs-CSV-import UX and the **dedup interaction** (how a freshly-imported row that overlaps an existing/manual entry is surfaced, merged, or rejected AT the ledger). The `rawHash` mechanism is decided; the *interface* for reviewing/resolving dupes is a Phase 1 UI design task, its own session.

## DD-013 — Reimbursements & receivables ("owed to me") `LOCKED`; packaging RESOLVED (2026-07-15)

maw-budget must track money Michael fronts that someone else pays back: **dad, U of R, gig-work payers, one-offs.** Model this as a **receivable**, not a special expense flag.

**Mechanic:** in double-entry this is a textbook receivable. Fronting $100 for dad: `+100` expense (or the real category) and a `+100` balance owed on "Due from Dad"; when dad pays back, `-100` the receivable, `+100` checking. The receivable nets to zero and net worth is never overstated.

**RESOLVED (inquiry L, 2026-07-15):** Michael wants a **live "who owes me / how much" view**, in **Phase 1**. That resolves the packaging to **option (a): party-as-receivable-account.** Each reimbursing party is an `Account` of sub-type **receivable**; its live balance IS the "owed" number, so the view is just a filtered account list — no separate status/match machinery needed for the basic case. (Option (b) status+match is retired as the default; a Phase 2 match layer can still auto-clear receivables against incoming payments as a convenience.)

**Design implications:**
- **Parties** are real entities (a `Party` concept, or receivable `Account`s) you carry a running balance against — not free-text. The Budgeting|Shopping **Vendors** list is the party precursor.
- Adds a **receivable** account sub-type to the type taxonomy under DD-011.
- A **"Who owes me" view** = receivable accounts with non-zero balance. Phase 1.
- **Gig-work income is distinct from a reimbursement:** gig pay is real income, not money paid back. Confirmed against real data (Venmo: Alarm Will Sound performance fees, drafting gigs = income; dad's Venmo transfers = the reimbursement/support pattern). "Gig payer" is a party; the money is income, not a receivable clearing.

## DD-014 — Hierarchical categories (parent → child) `LOCKED` (2026-07-15)

Categories are **hierarchical**: a self-referencing tree (parent → child), not a flat list. (Answer to inquiry C.)

**Why:** matches how every reference tool does it (QuickBooks sub-accounts, YNAB category groups, Firefly categories). A tree gives **rollups for free** — spend on Food = the sum of Food → Groceries + Food → Dining + Food → Coffee — so reports can zoom out to a parent or drill into a child without re-tagging anything. It also sets up the Phase 3 envelope layer cleanly (assign at whatever level you budget at). Structurally it's the same self-reference we already sketched (`fkParentCategory`), so it costs nothing to support now.

**Implications:**
- `Category` carries `fkParentCategory` (null = top-level) + its income/expense type. A parent's type constrains its children.
- Reports roll up the tree; the ledger still tags each leg to a single (usually leaf) category.
- Depth: **2 levels** (parent → child) is the working assumption — enough for real rollups, shallow enough to stay sane. Confirm if you want arbitrary depth. Exact category list is data, gathered at entry time, not structure.

## DD-015 — Multi-category splits `LOCKED` (2026-07-15)

A single purchase can be **split across multiple categories** (Target run = Groceries + Household + Clothing on one receipt). (Answer to inquiry D.)

**Why:** this is the payoff of the double-entry choice — a split isn't a special feature, it's just **more legs on the same event.** One `TransactionGroup` (the Target purchase, `-120` on the Visa) with three category legs (`+60` Groceries, `+40` Household, `+20` Clothing) that still sum to zero. No new table, no schema change; the model already supports N legs per group.

**Implications:**
- Confirms `TransactionGroup` → `TransactionLines` is **1-to-many with N > 2** allowed (not just a 2-leg pair). The zero-sum rule holds regardless of leg count.
- The **UI needs a split editor** (add category rows to one transaction, live remainder that must reach zero before save). This is a Phase 1 layout concern.
- Reports and category rollups (DD-014) already handle this for free — each split leg tags its own category and rolls up its own tree branch.
- Reinforces: the ledger tags **legs**, not transactions, to categories. A "transaction category" is just the common case of a single-leg split.

## DD-016 — Net worth over time (trend, via snapshots) `LOCKED` (2026-07-15)

Michael wants to **watch net worth grow over time**, not just see today's number. (Answer to inquiry E.)

**How:** a `NetWorthSnapshot` table — one row = {date, total net worth, optionally per-account balances at that moment}. The trend chart reads snapshots. This is the single sanctioned exception to DD-003 (stored vs derived): a snapshot is a deliberate historical record, not a live balance, so it can't "drift" — it's meant to be frozen.

**Why snapshots vs full re-derivation:** you *can* re-derive any past net worth from the ledger, but feed-less assets (house/car) only have sparse valuations and back-dated edits would silently rewrite history. A frozen snapshot captures "what net worth was on this date" honestly and makes the chart cheap to draw.

**Capture cadence:** manual/one-tap in Phase 1. **Autonomous capture (on app open, or every Monday 9a) is explicitly TABLED** — nice-to-have automation, Futures, not a v1 blocker. The table is built Phase 1 so the automation can be added later without a schema change.

## DD-017 — Bills: expected-vs-actual, variable, soft forecasting `LOCKED` (direction) (2026-07-15)

**What a "bill" is (proposed & accepted as the working definition):** a **recurring expected outflow on a schedule** — rent, utilities, subscriptions, insurance. The distinction from a normal transaction: a bill is something you *expect ahead of time* on a cadence, so it carries an **expected amount + a due schedule** and then gets **matched to the actual transaction** once paid. A one-off purchase is just a transaction; a bill is a transaction you saw coming. (Answer to inquiry G.)

**Decisions:**
- **Variable amounts, not fixed-only.** A `Bill` carries an **expected/forecast amount** (for planning) that can differ from the **actual amount** posted when paid (utilities swing month to month). Both are tracked; the variance is meaningful.
- **Soft forecasting.** Upcoming bills surface as **visual flags on a clear schedule** (what's due, when, expected amount) — not a heavy reminders/notifications engine. "Softly for now," not the whole point of the app.
- **Phase 2.** Bills + the bill↔actual match layer stay Phase 2 (per DD-007). The expected-vs-actual variance pattern is the HML `ExpectedTransactions` → `PaymentApplications` shape. The Budgeting|Shopping **Subscriptions** list is the seed data.

**Implications:** `Bill` = {payee/party, category, expected amount, schedule/cadence, next-due date}; a match links the paid transaction back to its bill so "expected vs actual" and "paid vs upcoming" both compute. Reminders/push = Futures.

## DD-018 — Feed-less asset valuation cadence: on-demand, softly nudged `PROVISIONAL` (2026-07-15)

House/car re-valuation has **no rigid schedule**. Michael re-values **whenever** (a new estimate, a Kelley Blue Book check, a refi). The app **softly nudges** if a valuation is stale (e.g. >6–12 months old) rather than forcing a cadence. (Answer to inquiry F — Michael was unsure; this is the sensible default.)

**Why:** you don't get a house/car statement, so there's no natural cadence. Forcing quarterly re-valuation is busywork; never prompting lets net worth quietly rot on stale numbers. On-demand + a gentle staleness flag is the honest middle. Marked PROVISIONAL — revisit once Michael has felt the rhythm in real use.

**Plain-English note ("finance for idiots"):** a valuation is just *"what's this worth today, roughly?"* You're not tracking every gas fill-up on the car; you occasionally say "the car's worth ~$18k now" and that number feeds net worth until you update it. Same for the house. That's all a `Valuation` row is.

## DD-019 — Budgeting: start target-vs-actual, grow toward envelope `LOCKED` (direction) (2026-07-15)

Phase 3 budgeting starts as **simple target-vs-actual per category** (set a monthly target per category, compare to actual spend), with a **deliberate path to grow into full YNAB-style envelopes later**. (Answer to inquiry H.)

**Why:** Michael leans simpler now but wants the door open. Target-vs-actual is the lighter-upkeep entry point; the full envelope model (assign every dollar, available = assigned - activity + rollover) is a superset. Building the simple version on the same `BudgetAllocations` shape (category + month + amount) means envelopes are an ADD, not a rebuild — rollover + "assign every dollar" become extra columns/rules on the existing table. The Budgeting|Shopping **Budget** list/folder is the existing rough workflow this replaces.

**Rollover:** deferred sub-decision. Target-vs-actual v1 does NOT need month-to-month rollover; envelopes do. Design `BudgetAllocations` so a `rollover` concept can be added without migration. Confirm rollover behavior when the envelope upgrade is actually built.

## DD-020 — Priority reports (v1 set) `LOCKED` (2026-07-15)

The three reports Michael will actually open, ranked (answer to inquiry I):
1. **Spend by category** (with the DD-014 rollups — zoom parent, drill child).
2. **Account register** (the ledger view for one account: running list of transactions + balance).
3. **"Who owes me"** (receivable accounts with a non-zero balance — DD-013).

**Why it matters for the build:** these three are the Phase 1 layout priority order. Net-worth trend (DD-016) still ships in Phase 1 as the headline number + chart, but Michael's *working* reports are these three — build/polish them first. Cash-flow in/out is NOT in the top set; treat as a Futures report.

## DD-021 — Reconciliation: cleared vs pending, in scope `LOCKED` (direction) (2026-07-15)

Transactions carry a **cleared / pending** state so Michael can reconcile against real statements. (Answer to inquiry J — leaned "definitely bother.")

**Why:** reconciliation is what keeps the ledger honest against reality — it's how you catch a missed import, a duplicate, or a bank error. It also pairs directly with the CSV-import dedup flow (DD-012): a freshly imported row lands **pending**, and clearing it is the human confirmation step.

**Shape:** a `cleared` status on the transaction (or line) — at minimum pending → cleared; optionally a `reconciledDate` / statement reference later. Phase 1 gets the flag + a way to mark cleared; full statement-balance reconciliation ("does my cleared total match the statement's closing balance?") can be a Phase 1.5 polish. Exact placement (group vs line) is a field-articulation call.

## DD-022 — Platform: desktop + FileMaker Go, receipts wanted, sync is the open risk `PROVISIONAL` (2026-07-15)

Michael wants **both FileMaker Pro (desktop) and FileMaker Go (iPhone/iPad)**, ideally **serverless**, and wants to **track receipts** (images). (Answer to inquiry K.) These three pull against each other and the tension is NOT yet resolved — flagged honestly rather than hand-waved.

**The real tension:**
- **Serverless + multi-device is the hard part.** FileMaker Go opening a *single local file* means desktop and phone hold separate copies that diverge. True live multi-device sync normally wants **FileMaker Server / FileMaker Cloud** (i.e. NOT serverless). Options to explore in an architecture session: (a) host the single file on FileMaker Cloud (drops "serverless" but solves sync cleanly); (b) a one-file-hosted-on-a-Mac-mini self-host; (c) mobile as a capture-only satellite that syncs deltas to the desktop master (more build, keeps serverless-ish).
- **Receipts amplify it.** Storing receipt images *inside* the file (container fields) bloats it fast — painful for any move/sync of a single file, and heavy on FileMaker Go. Mitigation: **externally-stored container data** (references, not embedded blobs) or a light "receipt = a file path / cloud link" approach. Michael already flagged wanting to minimize image tracking while still keeping receipts — that instinct is right.

**Provisional stance:** design the schema to be **sync-agnostic and receipt-light** — UUID PKs everywhere (DD-010 already), no auto-enter serials that collide across devices, and a `Receipt` concept that stores a *reference* (external container or link) rather than embedding by default. That keeps every hosting/sync path open. **The hosting/sync model itself is a dedicated architecture decision, deferred to its own session** — do not let it block field articulation, but do not pretend it's solved.

---

## Inquiry status: A–L COMPLETE, all gates cleared (2026-07-15)

All twelve goal-interrogation items (A–L) are answered and logged (DD-011 through DD-022). **DD-008 naming is now LOCKED (HML).** There is NO open gate left before field articulation.

**Next action:** a fresh field-articulation session writes `tables/` + `schema/tables.json` off DD-001–022, in HML naming. The decision log + spec are the complete brief; a cold agent should run it without re-interviewing Michael.

**Deferred to their own later sessions (do NOT block field articulation):**
- Interaction/interface design, including the **manual-vs-CSV dedup review UX** (DD-012).
- The **hosting/sync architecture** for desktop + FileMaker Go, and the **receipt-storage** approach (DD-022).
- **Rollover** behavior for the envelope upgrade (DD-019).
- One-time **migration** from the **Budgeting | Shopping** space (DD-012 prior art) — NOT from BETA BUDGET, which is a separate build.
