# Contact Reconcile — CONTACTS manifest for the reconcile engine

> **This is a MANIFEST. The loop, the four findings, the passes, and every guardrail live in
> `reconcile-engine.md` — read it FIRST.** This file is DATA: the contact surfaces, their
> source-of-truth, normalization, section map, and the ASSIGNMENT LINK. It never restates the engine.

**Rewritten as a manifest 2026-08-31** (was a standalone hook, v1 same day). Steward: **Mainstage
Milo**; a formal full-season pass seizes to **Audit Anna** (engine rule). All domain knowledge is
preserved from contact-reconcile v1 and its 5-show manual run. Structural twin of
`prod-cal-reconcile.md` — same engine, the Info Sheet is a surface in BOTH.

## Invocation + Trigger

- `/contact-reconcile` · `/reconcile-contacts` · `/contact-sheet-reconcile`
- Scoped: `<show>` · `--show BL` · `--all`
- Plain: "reconcile the contact sheets," "production contact reconciliation," "who's listed where,"
  "link the people to their assignments."
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
   ⚠️ One person can also hold TWO rows in one show (Callen Silverberg = AAVE + A1 on Big Love) —
   BOTH rows link to the SAME person record.
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

## 🔗 THE ASSIGNMENT LINK — the relational core (Michael, 2026-08-31: *"that's the whole reconciliation you do"*)

**A filled `Contact Name` string is not the finished job — the row must be LINKED to the person's
record.** Free-text names re-drift the instant an email or spelling changes; the link is the
normalized join that makes the person canonical once and the role-row point at it. This is the
reconcile's highest-value output, not an extra.

### 🧭 HOW THIS LIST ACTUALLY WORKS — read BEFORE you touch a link (born from a real cold-agent miss, 2026-08-31)

**The link is the POINT of the master, and on an established show it is LARGELY ALREADY DONE.** A
cold agent's job is to find the GAP (filled rows whose person link is still empty), not to re-link
what is already wired. The reconcile is a diff, never a rebuild.

🔴 **THE TRAP THAT ACTUALLY HAPPENED (do not repeat it):** an agent concluded Big Love was "36 rows
to link" — it was almost fully linked. Two false signals caused it, and BOTH are noise:

1. **Activity history is FULL of `set Contact Sheet to null`.** That is NOT evidence the link is
   empty. The `Relate Role` button + the `Relate ROLE` / `Connecting Production STUDENT Emails`
   automations cycle that field, so the log churns while the live value stays populated. **NEVER
   infer link state from history — the history lies about this field.**
2. **A `query_tasks` SELECT cannot cleanly return the link.** THREE custom fields are all named
   `"Contact Sheet"` (the STUDENTS, ADULTS, and SHOW-ROLES relationships share the display name), so
   `SELECT "custom:Contact Sheet"` is ambiguous and a role-view query silently omits it. A row that
   looks blank in a query is NOT a blank link.

✅ **The ONLY reliable read: LOAD THE TASK and inspect `populatedCustomFields` by FIELD ID**
(`fd65d68f…` = STUDENTS, `bb073d11…` = ADULTS). A row is `LINKED` if either id carries a value.
Verify the live field per row before proposing ANY link write — reading the field IS the gate, and
it is exactly the step that was skipped.

### Where the person lives — route by DIRECTORY, not by role

| Person is a… | Directory list | `Contact Sheet` relationship field (subcategory-scoped) |
|---|---|---|
| student (cast, most SM/run crew, student electrics) | **STUDENTS** `901305646880` | field id `fd65d68f-0b72-440d-8cf9-9b29705d28b7` |
| adult staff / faculty / guest designer | **ADULTS** `901313504035` | field id `bb073d11-588b-48cc-a8ba-7523381f72f8` |
| (role template itself) | **SHOW ROLES (canonical)** `901327011063` | field id `80b46457-b3a5-411a-97fe-e5c99ce95ea5` |

⚠️ **Route by where the PERSON lives, not by their role** — Lena Spivak (Asst Director) and the SM
team are STUDENTS records; guest designers are ADULTS. Check the directory, don't assume from the
role header. ⚠️ The SHOW-ROLES link (`80b46457…`) is set on essentially every row already and is
NOT the assignment — do not mistake its presence for a person link.

**Procedure (engine P3 finding + P5 write):** for each GAP row (filled `Contact Name`, no person
link per the reliable read above), find the ONE matching person record → populate the correct
relationship field with `add: [personId]` via `update_task` (list_relationship is NOT writable
through `query_tasks` UPDATE — one call per row).
🔴 **Matching rules, because the directories are full of near-collisions** (`Wang` ×12, two
`Segal`s — Dahlia vs Melody, several `Clark`/`Clarke`): match on FULL NAME, and an ambiguous or
multi-hit name is a FINDING (`⚠️ AMBIGUOUS LINK`), never a guess. 🚫 **NEVER auto-create a missing
person record** — a name with no directory record is `NO PERSON RECORD` and is reported, not
created (a missing STUDENT routes to `roster-reconcile.md`; a missing adult is Michael's add).
Founding flag: Big Love Movement Director **Darren Stevenson** had no record in either list.

---

## Domain findings (map onto engine findings 1–4)

- **Person reconciliation** — per named person: `ALIGNED` · `SPELLING` · `ROLE MISMATCH` ·
  `MASTER MISSING PERSON` · `MASTER MISSING ROW` · `STALE ON <surface>`. Direction per the SoT
  declaration + per-item stamps.
- **🔗 Assignment link** — per filled row: `LINKED` (already points at the person — the COMMON case
  on an established show) · `TO LINK` (name resolves to one record, propose the link) ·
  `⚠️ AMBIGUOUS LINK` (multiple hits, flag) · `NO PERSON RECORD` (flag, never create). This is
  finding 2's relational half, and the pass reports it as a GAP diff, never a re-link of everyone.
- **Master field gaps** — blank `Contact Email` the PDF can fill, `PM STATUS = NEED` on someone
  clearly onboard per a dated sheet, missing `Pay Status`. Propose; the write is gated.
- **Surface orphans (finding 2)** — on a sheet, no master presence at all: Kelly Quinn (Emotional
  Support) on the BC sheet; the whole TIME SM/AVE/VE team on its Info Sheet. Report with a proposed
  section + role; NEVER auto-create.

## Known gaps

1. One real sample (2026-08-31): BL + BC had contact sheets; TS/TIME/OA Info-Sheet only; TIM-D per
   participant. 2. TIM-D participant files unmodeled (overlay flags it). 3. No join key beyond
   name+role BETWEEN surfaces (the person-record link is the join WITHIN ClickUp — see the
   Assignment Link). 4. ✅ RESOLVED 2026-08-31 — the `Contact Sheet` relationship fields ARE the
   assignment link and are core. ⚠️ CORRECTED same day: an earlier note here called BL's link state
   "un-normalized" — WRONG, BL was already largely linked. The `set…to null` history is automation
   churn, not an empty link (see 🧭 HOW THIS LIST ACTUALLY WORKS). The pass links only the true GAP.
