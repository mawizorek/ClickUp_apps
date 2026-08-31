# Contact Reconcile — CONTACTS manifest for the reconcile engine

> **This is a MANIFEST. The loop, the four findings, the passes, and every guardrail live in
> `reconcile-engine.md` — read it FIRST.** This file is DATA: the contact surfaces, their
> source-of-truth, normalization, and section map. It never restates the engine.

**Rewritten as a manifest 2026-08-31** (was a standalone hook, v1 same day). Steward: **Mainstage
Milo**; a formal full-season pass seizes to **Audit Anna** (engine rule). All domain knowledge is
preserved from contact-reconcile v1 and its 5-show manual run. Structural twin of
`prod-cal-reconcile.md` — same engine, the Info Sheet is a surface in BOTH.

## Invocation + Trigger

- `/contact-reconcile` · `/reconcile-contacts` · `/contact-sheet-reconcile`
- Scoped: `<show>` · `--show BL` · `--all`
- Plain: "reconcile the contact sheets," "production contact reconciliation," "who's listed where."
- 🚫 Not a single "add <name> to the contact sheet" (one hand edit).

---

## Surfaces (ordered; engine reads freshest-LAST)

| # | Surface | Where | LIVE / STATIC |
|---|---|---|---|
| 1 | **Contact-sheet PDF/DOCX** | `…/PRODUCTIONS/URITP 26-27/<Show>/_Contact Sheets/` — newest = live, `zOld/` + `zEDIT/` archive | STATIC (footer `Updated <date>` + filename date) |
| 2 | **Info Sheet** | `…/<Show>/<CODE>.Info Sheet.<TERM>.docx` at show root | STATIC (term stamp); the EARLIEST surface — design + SM team land here first |
| 3 | **Master matrix** | Contact Sheet list `901328115174` (URITP PRODUCTIONS ▸ Production STAFFING), per-show views, one task per role | LIVE — **Michael edits during a pass, READ LAST** |

## 🔑 SOURCE OF TRUTH declaration (engine Q1)

**No single fixed SoT — direction flips per show/role, and the manifest says so explicitly.** Proven
day one: Big Love's MASTER led its stale 17-Aug PDF; Becoming Curious's 24-Aug PDF led the master.
The Info Sheet LEADS for design/SM team on a show with no contact sheet yet (T.I.M.E. staged had a
full team on its Info Sheet, almost none in the master). **The engine uses per-item freshness
(surface stamp) as the tiebreaker and surfaces every genuine conflict to Michael — never auto-writes
the losing side.** "Master is the SoT" and "the sheet is what went out so it wins" are BOTH false
half the time.

## Join key

Name + role (there is no id across a Dropbox sheet and a master row). A rename on one side reads as
add+drop — match on PERSON identity first (finding 1 handles the spelling delta).

---

## Normalization (engine P2 — apply BEFORE comparing)

1. **Match on PERSON, flag the SPELLING.** Names typo across surfaces, master included:
   `Ales`/`Alex Sapounov`, `Seth Resier`/`Reiser`, `ELENOR`/`Eleanor`, stray-colon `:padra.crisa@`.
2. **Role-title mismatch is a FINDING, not an auto-fix.** Same person, different label: `J Simmons`
   Voice/Acting vs Fight Choreographer; `Sara Penner` Intimacy vs Producer/Curator (OA);
   `Casey McNamara` Costume Shop Mgr vs Design Mentor (OA). Print both; Michael rules.
3. **One person, many roles** — Kāli Quinn = Director + Scenic + Costume + Sound on the BC sheet
   while the master had only a Director row. A missing role = `MASTER MISSING ROW`, not a rename.
4. **ALLCAPS + abbreviations on Info Sheets** (`AVE`, `AHE`, `PSM`) — expand against master role
   vocab. `?NAME?` / `TBD` / `maybe` = tentative, never promoted to confirmed.
5. **The master row set is a TEMPLATE** — every show view instantiates the same skeleton; blank rows
   are expected. Blank master row vs named surface = `MASTER MISSING PERSON`; named surface role
   with no master row = `MASTER MISSING ROW`.

## Section map (surfaces label sections differently)

| Master `Contact Sheet HEADER` | PDF section | Info Sheet |
|---|---|---|
| `CAST` | CAST | cast size only |
| `STAGE MANAGERS, Run Crew` | STAGE MANAGEMENT & RUN CREW | PSM/APSM/ASM block |
| `Creatives` | ARTISTIC | Director + designer block |
| `Program` | PROGRAM & PRODUCTION STAFF | resident staff (often implicit) |
| `Shop Staffs` | PRODUCTION CREW | rarely listed |

## Show short codes

`BL` Big Love · `BC` Becoming Curious (folder `2.1 Becoming Curious`, cast/design list `Kali`) ·
`TIM-D` T.I.M.E. Development · `TIME` T.I.M.E. staged · `TS` The Secretary · `OA` One Acts. Never
invent a code; an unknown one is a FINDING.

---

## 🧷 SHOW OVERLAY (engine Q2 — thin, never a full manifest per show)

- **URITP Mainstage (BL / BC / TS / TIME):** surfaces = all three above; standard section map.
- **TIM-D (T.I.M.E. Development):** 🔴 DIFFERENT surface shape — holds per-participant PDFs
  (`Participants/Adults/<Name>/`, `Children/`, facility rosters), NOT a company contact sheet.
  Whether those reconcile against the master at all is UNRESOLVED — do not force the Mainstage map
  onto it. This is the canonical case for why overlays exist.

---

## Domain findings (map onto engine findings 1–4)

- **Person reconciliation** — per named person: `ALIGNED` · `SPELLING` · `ROLE MISMATCH` ·
  `MASTER MISSING PERSON` · `MASTER MISSING ROW` · `STALE ON <surface>`. Direction per the SoT
  declaration + per-item stamps.
- **Master field gaps** — blank `Contact Email` the PDF can fill, `PM STATUS = NEED` on someone
  clearly onboard per a dated sheet, missing `Pay Status`. Propose; the write is gated.
- **Surface orphans (finding 2)** — on a sheet, no master presence at all: Mica (Creative
  Consultant) + Kelly Quinn (Emotional Support) on the BC sheet; the whole TIME SM/AVE/VE team on
  its Info Sheet. Report with a proposed section + role; NEVER auto-create.

## Known gaps

1. One real sample (2026-08-31): BL + BC had contact sheets; TS/TIME/OA Info-Sheet only; TIM-D per
   participant. 2. TIM-D participant files unmodeled (overlay flags it). 3. No join key beyond
   name+role. 4. Master `Contact Sheet` list-relationship fields — whether they should point at
   anything is unsettled (Michael has been nulling them), out of scope until ruled.
