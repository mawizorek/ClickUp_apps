# Doc Schema Import — standards collection surface manifest

> **A MANIFEST for `reconcile-engine.md`.** Surfaces, source-of-truth, join key, normalization,
> routing. It does NOT restate the engine's passes or guardrails (Constitution §2-§3) — load the
> engine with it or you have half a tool.

**v1, 2026-09-21.** Steward: **Mainstage Milo** (URITP/production domain). A formal, scoped,
reported full-surface pass IS an audit and SEIZES to **Audit Anna**.

**Front door: `reconcile-engine.md` + this file, nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Born from** the 2026-09-20/21 port of the legacy `Standards` list (93 rows) into the SCHEMA
document model. Fold-in Frank verdict at open: `FOLD-IN`, named for the destination.

---

## 🔑 What this manifest is FOR, and what it is not

🔴 **Read this before invoking it.** The one-time PORT is **CLOSED and unrepeatable** — its source
list is archived and every row is retired. This manifest does **not** re-run that port and must
never be read as a recipe for one.

What it reconciles is the thing the port **exposed**: the collection drifts from the published
library **forever**, because ESTA revises, reaffirms and withdraws standards continuously. That is
a permanent two-surface loop, and it is what the engine is for.

⚠️ **The port also sat OUTSIDE the engine's law, deliberately.** A port's entire job is to CREATE
counterparts — 252 tasks were created — and the engine's guardrail is 🚫 `NEVER auto-create a
missing counterpart`. Those are opposites. **Any future bulk creation against these surfaces is
not a reconcile pass and does not inherit this manifest's permission to run read-only.** It needs
its own gated approval, per batch, from Michael.

---

## Invocation + Trigger

- `/reconcile standards` · `/standards currency` · `/doc-schema-import`
- "are our standards current", "check the standards against ESTA", "is this citation still good"
- Fires naturally **before anyone cites a standard in a safety document, rider, or bid.**

---

## Surfaces (ordered)

| # | Surface | Where | Read how | Kind |
|---|---|---|---|---|
| 1 | **ESTA TSP published documents** | `https://tsp.esta.org/tsp/documents/published_docs.php` | web fetch | STATIC (authoritative snapshot) |
| 2 | **ESTA working-group publication lists** | `https://tsp.esta.org/tsp/working_groups/index.html` | web fetch | STATIC — confirms a DESIGNATION exists and is spelled right |
| 3 | **ESTA public-review drafts + WG minutes** | `.../public_review_docs.php` · RIG minutes PDF | web fetch | STATIC — the FORWARD signal: reaffirm/revise/withdraw deadlines, i.e. a citation about to move |
| 4 | **SCHEMA `DOCUMENTS / TEXTS / BOOKS`** | ClickUp list `901328990106` | `query_tasks` | LIVE (Michael edits) |
| 5 | **SCHEMA `INSTANCES / VERSIONS / PARTS`** | ClickUp list `901328990016` | `query_tasks` | LIVE — carries `🌐 Year` + `🌐 Attachments`, so this is where CURRENCY actually lives |
| 6 | **SCHEMA `>STANDARDS` joins** | ClickUp list (see `>STANDARDS`) | `query_tasks` | LIVE — carries `Scope \| Abstract` |
| 7 | **Legacy `Standards` list** | ClickUp `901317099964` — **ARCHIVED 2026-09-21** | `query_tasks`, archived scope | STATIC · historical · 🚫 **READ-ONLY FOREVER** |

**Read freshest-last** (engine P1): the ESTA surfaces are snapshots and go first; the ClickUp
surfaces are live and go last.

---

## 🔑 SOURCE OF TRUTH declaration

**Split by fact class. Neither surface is SoT for everything, and that is the whole point.**

| Fact | SoT | Why |
|---|---|---|
| Designation spelling (`ANSI E1.36`) | **ESTA (surface 1-2)** | ESTA assigns designations. Our row is a transcription and transcriptions drift. |
| Official title | **ESTA** | Same. |
| **Current edition year** | **ESTA** | 🔴 The load-bearing one. Holding a PDF is not evidence it is current. |
| Withdrawal / reaffirmation status | **ESTA** | Only the publisher can retire a standard. |
| **Which documents Michael HOLDS** | **ClickUp (surfaces 4-6)** | ESTA's library is not an inventory of what we own. |
| Abstracts, enrichment, cross-references | **ClickUp** | Curated here, authored by us. Never overwritten from ESTA. |
| TAGS / subject axes | **ClickUp** | Our taxonomy, not ESTA's. |
| PARTS decomposition | **ClickUp** | Our modelling decision. |
| Publisher entity + sourcing notes | **ClickUp** (`PUBLISHERS.🌐 Notes`) | See Routing. |

⚠️ **This declaration is a TIEBREAKER, not an auto-resolve** (engine Q1 precedence law). Per-item
freshness still overrides, and a genuine conflict surfaces to Michael.

---

## Join key

**The bare designation**, normalized: `ANSI E1.34`, `ANSI ES1.18`, `IFC 2024`.

- Match on the **normalized designation**, never the raw name string — the raw names carried typos
  (`NSI E1.36`, `ANSI 1.4-2`, `E1.48`) and baked-in editions (`ANSI E1.32 - 2012 (r2022)`).
- Documents with **no ESTA designation** (companion guides, explanatory notes, external exemplars)
  have **no join key on surfaces 1-3** and are therefore permanently `UNVERIFIABLE` against ESTA.
  🚫 **That is correct behaviour, not a defect — do not invent a designation to make one joinable.**
- Parts join to their parent `Book` by the `BOOK` relationship, never by name.

---

## Normalization rules

1. **Designation:** strip nothing but whitespace; correct a missing prefix character only against
   surface 2 (`NSI E1.36` → `ANSI E1.36`, verified on the Photometrics WG list). Never guess.
2. **Editions are NEVER part of a name.** `🌐 Year` on the VERSION row is the only home for an
   edition (ruling: year lives only on VERSION). Strip `- 2012 (r2022)` style suffixes from names.
3. **Reaffirmation ≠ revision.** `2014 (R2024)` is the 2014 text, unchanged. A revision may change
   scope, title AND section numbering — `ANSI E1.42` is the standing example (2023 revision changed
   title and widened scope from orchestra-pit lifts to all entertainment lifts).
4. **Publisher is prefix-derived, then verified:** `E1.x`/`ES1.x` → `[ ESTA ]`; `IBC`/`IFC` →
   `[ ICC ]`; `NFPA` → `[ NFPA ]`; ICOPER → `[ PLASA ]`; ADA → `[ DOJ ]`. ⚠️ ANSI is an
   **accreditor, not a publisher** — never wire a document to an `ANSI` publisher row.
5. **Source category → subject TAG** is a mapping, not a copy. Multi-category sources produce
   MULTIPLE tags (`Stage Machinary, Control Protocols` → `STAGE MACHINERY` + `CONTROL PROTOCOL`).
   Source typos are fixed in the TAG, never propagated (`Stage Machinary` → `STAGE MACHINERY`).
6. **Forward-only naming law:** new rows take the bare designation. Pre-existing names stand unless
   Michael rules otherwise per row.

---

## Routing (which fact lives on which row — the port's hardest lesson)

🔑 **A fact belongs to the entity it is ABOUT, not to the document that mentioned it.** The legacy
doc failed because everything was prose on one page; the port's real work was placing each fact.

| Fact class | Destination |
|---|---|
| How to OBTAIN a publisher's documents; their currency/withdrawal conventions | `PUBLISHERS.🌐 Notes` — **once**, inherited by every document pointing at it |
| Scope, cross-references, edition traps, enrichment | The document's `>STANDARDS` join, `Scope \| Abstract` |
| Edition year + the PDF | The VERSION row (`🌐 Year`, `🌐 Attachments`) |
| A section/chapter of a larger work | A `Paperwork` PART row under the parent `Book` |
| A whole work | A `Book` row in DOCUMENTS |
| External documents we measure against but do not own | ONE `Reference` row holding the set — 🚫 never one `Book` + one publisher per external venue |
| A process rule | This repo. 🚫 Never a ClickUp doc page. |

---

## The four findings, in this domain

The engine's verb, instantiated. **Finding 3 is the reason this manifest exists.**

1. **NAME/TITLE** — designation or title disagrees with ESTA. *Live instances found: `NSI E1.36`,
   `ANSI 1.4-2`, `E1.48`, `ANSI E1.32 - 2012 (r2022)` — all four corrected 2026-09-21.*
2. **PRESENCE** — an ESTA-published standard with no DOCUMENT row; a DOCUMENT with no VERSION
   (the `⚠️ NO VERSION (migration gate)` view is the standing report for this half); a join row
   pointing at a deleted document (reverse orphan).
3. 🔴 **DRIFT — EDITION CURRENCY. The port could not catch this and neither can any gate we had.**
   The retire gate verified *that* a PDF moved, never *which edition it was*. Compare VERSION
   `🌐 Year` against surface 1 per document. **Open instance: `ANSI E1.56` holds the 2018 edition,
   which is superseded.** Also check surface 3 for a revision in flight.
4. **UNVERIFIABLE** — no PDF captured; no abstract captured; no ESTA designation to join on;
   withdrawn standards (and 🔑 **the withdrawal REASON matters**: `E1.30-10` was withdrawn as
   obsolete, `E1.48` was withdrawn as *rarely used* with its technical argument intact).

---

## Known platform limits (measured, 7 batches, 2026-09-20/21)

These are tool facts, not domain facts. They cost real defects; they are cheap to re-learn here.

1. 🔴 **`merge_tasks` does NOT carry custom field values.** Diff both rows and copy anything the
   survivor lacks BEFORE merging. Verified twice.
2. 🔴 **`merge_tasks` DOES carry scoped `list_relationship` values to the DESTINATION.** A merge of
   any row holding one needs a follow-up `rem` pass on the surviving side. Verified across 7
   documents; a first read said otherwise and was wrong **twice** in both directions.
3. **No task-delete tool exists in this toolset.** Deletion is either Michael by hand, or
   merge-into-a-designated-trash-task (works, but see limit 2, and it is one-way).
4. ⚠️ **"Custom field values were not applied" warnings are FALSE ALARMS — 5 for 5.** Verify by
   query. 🚫 **Never blind-retry**: a retry on a relationship field doubles the value.
5. ⚠️ **Index lag returns stale field values AND ghost references to deleted rows.** 🔑 **`updated_at`
   is the tell** — if it has not moved, the row was not re-indexed and its values are not evidence.
   Do not diagnose off one read; **read the same field across several rows** (one row misled a pass
   three times; seven rows settled it instantly).
6. **Write-after-create needs the task URL, not a bare ID.** A join created moments earlier is not
   yet resolvable by ID and the write fails with "task not found."
7. 🔴 **NEVER assemble an asset URL.** Read it from a tool result. Fabricated-but-valid IDs resolve
   to **real wrong rows** — silent corruption, where lag at least errors loudly.
8. **Batch isolation: filter `created_at >= <cut>` and `ORDER BY created_at DESC`.** 🚫 Not `OFFSET`
   — an offset without a date filter drifts into unrelated rows.
9. **Text custom fields reject `CASE` batch updates** ("must be a constant value") — one write per
   row. **Number fields cannot be bulk-set to NULL** — use `update_task` with `value: null`.
10. **PARTS CANNOT NEST.** `BOOK` is scoped to the DOCUMENTS list, so a part cannot point at
    another part. A multi-level source hierarchy FLATTENS, with parentage stated in prose.

---

## The port, as history (closed 2026-09-21)

93/93 source rows retired · 84/84 PDFs carried, each under a **fresh attachment ID** (real copies,
not references into the source — the single property that made archiving non-destructive) · zero
inbound references from outside the list (every schema relationship field is list-scoped) · 7
batches, every one reconciling exactly · source list archived, never deleted.

🔑 **The two lessons worth more than the counts:**

- **Document what was DONE, not what was described.** Most defects in the port came from writing
  down the procedure as narrated instead of diffing the rows already finished.
- **A preview's blast radius is data, not ceremony.** An approved archive was HELD because the
  preview named `93 tasks and 1 doc` and the doc had never been described to Michael — it held 13
  pages of live reference material updated the day before. **One unread line was the whole gap
  between "approved" and "correct."**

---

## Composes with

- `reconcile-engine.md` — **required**; this file is inert without it.
- `task-dedup-gate.md` — before proposing any new DOCUMENT, PUBLISHER or TAG. Skipping it
  duplicated `[ ICC ]` against an existing `IBC` row during the port.
- `custom-field-gate.md` · `multi-edit-batch-gate.md` — on any write pass.
- `source-freshness-gate.md` — the ESTA surfaces are snapshots and go stale.
- `naming-proposal-guard.md` — designation corrections are naming proposals.

## Known gaps (honest list)

1. **This manifest has never run as a reconcile.** Its surfaces, join key and normalization are
   lifted from a completed port, and finding 3 has exactly one known instance (`E1.56`). A cold
   session that finds no run history SAYS SO.
2. **No automated currency check exists.** Finding 3 is a manual per-document comparison against
   surface 1. ~90 documents is too many for a casual pass; scope it by axis or by citation urgency.
3. **Jurisdiction is unmodelled.** `ANSI E1.51` is Canada-only (CEC, not NEC) and `ANSI E1.80`
   spans North American AND European pinouts. Both facts live in prose; neither is queryable.
4. **`IBC 1030, 1015` carries no edition**, and I-Code section numbering is edition-dependent
   (Assembly is §1030 in 2021, §1029 in 2015/2018). The row cannot be safely cited as-is.
5. **Duplicate `OSHA 1910` documents** (`86akmh6um`, `86akmhvb4`) and an **`ANSI E1.4-3` edition
   conflict** (document 2022, source said 2020) are open from the port.
6. **`OSHA 1926` / `OSHA 1926.59` are stored as unrelated siblings** but are a part-section pair.
   Now a clear PARTS candidate, since ADA/IFC set that pattern.
7. This is a NEW manifest file — `doc-rot-sweep` + `fleet-fact-sweep` must police it (Enzo's rule).
