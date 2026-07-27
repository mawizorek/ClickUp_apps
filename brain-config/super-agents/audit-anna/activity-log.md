# Audit Anna — Activity Log

_Rolling condensed session ledger. Newest on top. Append-only within the window._
_Sliding window ~5KB (`hooks/memory-rotation.md`). Older entries: `activity-log/2026-Q3.md`._

---

## 2026-07-26 · SESSION CLOSE — SPACE 3 (URITP PRODUCTIONS) Pass-1 walk COMPLETE
- **What was done:** walked all **18 folders** of Space 3 to Pass-1 completion. **18 List Index rows** (Sort 200–230; index total 23 → 41), **3 documentation pages** (FINISHED PRODUCTIONS group of 8 · LIVE PRODUCTIONS ×5 individually · SHOW TEMPLATE last), and a **space Decision Log** carrying J1–J11 + Q1–Q7 — Michael answered all seven. Mira convened the 7-lens Pre-Gate Workshop; Milo, Corey and Fiona were seated throughout. Nothing on any subject changed.
- **Space true purpose (Michael-confirmed):** a production is a **time-boxed organization stood up whole and torn down** — and the space is **also a template system**. Both.
- 🌟 **THE STRUCTURAL FINDING:** the **irreducible core of a production is THREE lists** (show hub + EVENTS/calendar + DESIGN), identical across two generations and three naming grammars; everything else is elective. That is the yardstick, and it came from the CLONES — **Michael reordered the walk to put SHOW TEMPLATE last, and it was the right call.** Generalizes: *the canonical artifact is the last thing you can judge, because "correct" is defined by observed downstream behaviour.*
- 🌟 **Template verdict:** it WORKED (post-2025 folders provably more consistent), is UNFINISHED (~1/3 drafted — Michael ruled the 100 in-progress tasks are deliberate, an authoring progress bar, do NOT reset), and has **DRIFTED BEHIND ITS OWN CLONES** — productions invented `Rehearsals` (most-built elective list in the space, absent from the template), `Info Sheet` (the space defines an `Info Sheet Status` field for a list the template doesn't provide), and two automation buttons trapped in single folders. **A template extracted from practice has to keep being re-extracted.**
- 🌟 **Two dating tools now:** naming grammar dates when a folder was BUILT (J2 — the template was extracted mid-stream, five folders predate it); status spread + which lists EXIST dates where a show sits in its lifecycle (growth order: hub+calendar → rehearsals → paperwork → design → strike last).
- **⚠️ B15 SCORED A SECOND TIME, and the new mechanism is worse.** I claimed ten folders were "hollow" — including The Christians, which holds 546 tasks at 94% closed. Michael: *"you're just missing them."* Root cause: `WHERE folder IN (...)` silently returns zero or ignores the filter and never errors. **But the real failure was that I "verified" it with `load_assets`, which returns list metadata and never tasks — a check structurally incapable of falsifying my claim.** Three signals contradicted me and I explained all three away. Brain 27 → 28.
- **Method wins:** fifth field-identity save (`Production Note` looked like five duplicate definitions; one field, `8bd1a34f`) and the discovery that the census's `scope_name` reports the QUERIED container, not the definition home.
- **Also fixed:** two doc-rot items on the Roadmap — its operative step 6 pointed at `901327854042` (the Custom Field Dictionary) for the List Index, and the Audit→Edit handoff pointed at my tombstoned lens path.
- **State left:** 41 rows, none Confirmed. Q7 open (three template fields no production uses). **ROLES park #3 reached but NOT resolved** — no production folder references either catalog; the wiring runs through CRM contact sheets. An input, not an answer.
- **RESUME:** Space 4 — URITP Programs (`901313758399`), the reference "good" program pattern, where PROGRAM SPRAWL comes due.
- **Session task:** the URITP List Audit standing thread (86ajknmmk).

---

## 2026-07-25 → 07-26 · SESSION CLOSE — SPACE 2 (URITP CRM) Pass-1 walk COMPLETE
- **What was done:** opened Space 2 with the Per-Space Pre-Gate and walked it to Pass-1 completion with Mainstage Milo. **23 List Index rows** (Sort 100–122, all net-new), **17 documentation pages**, **5 Decision Logs**, 11 J-blocks. Nothing on any subject list changed.
- **Space true purpose (LOCKED):** CRM is the **identity spine** — a person's relationship to the program is many-to-many and time-sliced. STUDENTS (303) / ADULTS (101) / SHOW ROLES (51) hold the natives; ~30 other surfaces are projections.
- **Best structure found anywhere in the audit:** the CONTACT SHEETS folder — SHOW ROLES is a controlled catalog of 51 role definitions and every per-show sheet joins to it by relationship. Deliberately built, not accreted.
- **⚠️ THREE METHOD ERRORS, all self-caught:** B15 scored (read a residency tree as a structure map, reported a correct doc as drifted, nearly retired a live roadmap flag) · the same error in reverse (claimed CRM held "loose lists" that live in BETA BUDGET and Courses) · and **three false duplicate-schema findings avoided** by checking field IDs first.
- **Key findings:** ROLES sharpened to "two role-definition catalogs" and parked a THIRD time · pre-FY26 company history lives in the Gen-1 per-show label fields (I'd flagged them for culling TWICE — reversed, they ARE the archive) · roadmap flag 1 re-shaped.
- **State left:** all 23 CRM rows Documented, none Confirmed. DoD steps 10–11 not run — deliberate, Pass-1 only.
- **Session task:** the URITP List Audit standing thread (86ajknmmk).

---

## 2026-07-25 (cont.) · SESSION CLOSE — Space 1 (URITP main hub) Pass-1 walk COMPLETE
- **What was done:** finished the Space-1 crawl with Milo on cross-space connections. Walked FMP Tables, Professional Development, PM Budetting, PROGRAMS, Risk Assessments, Season Planning + all 9 loose top-level lists. Every folder (8), subfolder (4) and list has an Index row + contextualized page.
- **Key findings:** Space 1 is the SOURCE/spine layer — calendars, hazard registers and season staffing project OUT via multi-homing. Pipeline: gen PRODUCTION Hazards → per-show Risk Assessment → SAFETY/Production PROGRAM. Money split: PM Budetting = INTENT, tracking upgraded to BETA BUDGET.
- **My B8 lesson:** on the first 3 folders I created fresh child Index rows instead of reusing pre-existing scaffolds — 14 duplicate rows, all deletion-flagged. Discipline now: CHECK the Index for an existing row before creating.
- **State left:** Space 1 walk COMPLETE. Pure Pass 1.
- **Session task:** the URITP List Audit standing thread (86ajknmmk).
