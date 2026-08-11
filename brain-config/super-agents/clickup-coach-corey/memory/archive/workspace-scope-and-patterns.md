# Archive: ClickUp Coach Corey / workspace scope detail + cross-board watch list

> **WARM.** Rotated out of `memory.md` 2026-08-11 by Memory Maggie under `hooks/memory-rotation.md`.
> Load on demand for a cross-space claim, a space inventory question, or when working the cross-board
> pattern-notes assignment. **Append-only — never edit, never reorganize.**
>
> **The seam:** the hot file keeps the RULE (prefixed URITP spaces are the audit's subject; unprefixed
> same-named spaces are Michael's life outside URITP; the relationship is stylistic ancestry, never
> lineage of the same records). This file keeps the ENUMERATION and the four watch-items behind it —
> reference detail that is needed when the question actually arrives, not on every seating.
> Content verbatim from `memory.md` at blob `0c3a12abdcb7bd9cfcce87c290cc50df1417c173`.

---

## 🗺️ WORKSPACE SCOPE MAP (Michael's ruling, 2026-07-26 — load before any cross-space claim)

The workspace has **22+ spaces**, not the 7 the URITP audit walks. The split is by LIFE DOMAIN,
and getting it wrong sends an audit chasing someone else's job:

- **The URITP-prefixed spaces are the audit's subject** — URITP (main hub) · URITP CRM ·
  URITP PRODUCTIONS · URITP Programs · URITP Inventories · URITP Courses · URITP BETA BUDGET.
- **The UNPREFIXED same-named spaces are Michael's work life OUTSIDE URITP** — `Theatre`,
  `CRM`, `Inventory`, `Work`. ⚠️ **They are NOT deprecated predecessors of the URITP spaces**,
  and they are NOT audit subjects. `Theatre` holds his own theatre career and outside gigs
  (Production History = 40+ Show-typed credits back to 2023, Paper Pianos, Rochester Fringe,
  `Ripple Sheets ▸ ALD: Till There Was You`, Theater gigs). A second `CRM` space and an
  `Inventory` space (~854 tasks, far larger than URITP Inventories) sit in the same category.
- **Personal/other:** Home · Family · Food · Travel|POIs · Budgeting|Shopping · GARAGE ·
  Dad LLC · DAD LLC PROPERTIES · CV and Applications · MAW Documents · Formula 1 · _LIBRARY.

**The framing Michael gave, verbatim in substance:** *assume the prefixed URITP spaces are
PURPOSE-BUILT VERSIONS OF OTHER STYLES.* So the relationship between `Theatre` and
URITP PRODUCTIONS is **stylistic ancestry, not lineage of the same records** — he built a way of
working for his own theatre life, then built a purpose-built URITP version of it. Read the
unprefixed spaces as the STYLE SOURCE, never as the same data one generation back.

**Live wiring exists across the boundary** — the `Theatre ▸ People` list is multi-homed with
CRM ▸ ADULTS and six current FY26/FY27 contact sheets. So "out of audit scope" does NOT mean
"disconnected." A person can be in both lives at once, which is correct and not drift.

## 🎯 The cross-board pattern-notes assignment — what I am watching for

Michael's call, 2026-07-26: **"Corey can note the patterns … we'll take notes across the board from
Corey though Milo needn't care too much about those other lists."** The lane is mine and explicitly
not Milo's. Across every space regardless of domain:

- **The purpose-built-version pattern at the SPACE tier.** Where an unprefixed space's style got
  rebuilt as a URITP-prefixed one, what changed in the rebuild, and what the rebuild dropped.
- **The naming-grammar lineage.** Bracket-prefix style (`[BL] Rehearsals`, `[LX Plot]`,
  `[DOCUMENT ARCHIVE]`, `[Auditions]`) traces to the older `Theatre CU Templates` convention;
  suffix style (`Rehearsals (TS)`, `Paperwork (T/CM)`) is the current URITP grammar. Both run
  concurrently in URITP PRODUCTIONS, which is why no view/filter/automation can reliably target
  "this show's lists" by name. That is a real structural cost, not a cosmetic gripe.
- **The same-concept-in-two-spaces shape:** two CRMs, two Inventories, two Labor surfaces
  (CRM ▸ PEOPLE ▸ Labor empty vs BETA BUDGET ▸ LABOR populated), two role-definition catalogs.
  Some of these are the domain split above (legitimate); some are genuine URITP-internal
  duplication. **Tell them apart before flagging** — the domain split is not a defect.
- **Template generations.** How a template system gets cloned, where placeholder names survive
  into live use (`Show Name`, bare `Production Calendar`), and what a clone inherits by default.

## 📎 Space IDs (reference)

URITP Courses `901313847910` · URITP `90131524916` · URITP PRODUCTIONS `901313768203` ·
URITP CRM `901313786071` · URITP Programs `901313758399` · URITP Inventories · URITP BETA BUDGET
(holds ▸ LABOR with the shop/crew staffing lists). URITP Programs is the reference "good" program
pattern.

## 📎 Frozen Date Mirror field ids (D5, 2026-08-05)

Live in URITP PRODUCTIONS ▸ CALENDARS. `BEGIN` `f3abf7f3-287a-40e2-9916-59bb8b9066ea` ·
`END` `8bea38fd-7e19-4291-9903-a9ad5e957e43`. Folder-scoped DATE fields that hard-copy native
start/due, time included, filled on create and on every reschedule; empty source → empty mirror.
**The one Derived Field case where Q2 is deliberately never re-drive, because surviving a reschedule
IS the feature.** Reasoning → `decision-log.md` D5.

## 📎 The `URITP Productions` label field, in full (EARNED 2026-08-08)

It is a **labels** field, so one task can carry two shows and **no export view can reliably scope to
one production.** Harmless while everything is read inside ClickUp; the moment a downstream system
imports off a view, the ambiguity becomes that system's problem — one row that legitimately belongs to
two shows, meeting a receiving key that assumes one.

- The FMP side mitigated it with **per-production export views + a compound key** (`TaskID` +
  `fkProduction`). That works, and it costs **one hand-maintained view per show** plus a new view
  before any new show's first import.
- 🚦 **Michael wants ONE view with the production passed as a runtime parameter — that is API-ONLY.**
  A CSV export is a static file with nothing to pass, so per-show views are the CSV-era stopgap.
