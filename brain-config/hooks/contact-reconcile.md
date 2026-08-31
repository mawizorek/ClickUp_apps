# Contact Reconcile — production-contact surface reconciliation

> **PROPOSE-ONLY. This hook NEVER edits a Dropbox file and NEVER mass-writes the master matrix.**
> It MAY write a master-row field (`Contact Name`, `Contact Email`, `PM STATUS`, etc.) ONLY when
> Michael has ruled on that specific row. Same contract as `gcal-reconcile`, one surface-set over.

**v1, 2026-08-31** — written from ONE live manual run (5 current-season shows, 2 with a built
contact sheet). Unlike gcal-reconcile v1, this is grounded in a real pass, but it is still a
single sample: a cold session that finds no further run history **says so**, and every ⚠️ marked
`inference` below has NOT yet been proven across a second show. Steward: **Mainstage Milo** (house
contacts are house context). The tool is ownerless for a one-off pass; a formal, scoped, reported
full-season pass IS an audit and seizes to **Audit Anna**. PII half of the read is Milo's; a cited
role/standard is never in scope here.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

## Invocation + Trigger

- `/contact-reconcile` · `/reconcile-contacts` · `/contact-sheet-reconcile`
- Scoped: `/contact-reconcile <show>` · `--show BL` · `--all`
- Plain language: "reconcile the contact sheets," "do a production contact reconciliation," "who's
  listed where," "is the master right for <show>."
- 🚫 Does NOT fire on a single "add <name> to the contact sheet" (one hand edit).

---

## 🔴 THE DIRECTION RULE — read this before anything else

**This is the contact analog of gcal-reconcile's freshness pair. A reconciliation compares MOVING
surfaces, and the fresher truth is NOT always the same surface.** Direction is decided **per show,
per role**, never globally.

- The master is fresher on one show and the Dropbox sheet is fresher on the next — **proven in the
  founding run:** on **Big Love** the master led the 17 Aug PDF (roles filled in ClickUp, blank on
  the printed sheet); on **Becoming Curious** the 24 Aug PDF led the master (design stack + people
  the master never had).
- 🔴 **Never assume "the master is the source of truth" or "the sheet is what went out, so it
  wins." Both are false half the time.** Read all three surfaces, stamp each with its own date,
  and let the STAMP break ties — but a stamp is a tiebreaker, not an authority.
- **The hook decides NOTHING.** On every disagreement it prints all three values and their dates;
  Michael rules. *Plausible is not authority.* (Milo already lived this: an unconfirmed Assistant
  Director identity was left blank rather than written on a guess.)

---

## The three surfaces

| Surface | Home | Role in the lifecycle |
|---|---|---|
| **Master matrix** | Contact Sheet list `901328115174` (URITP PRODUCTIONS ▸ Production STAFFING), per-show views, one task per role | The ClickUp SoT that SHOULD aggregate everyone; drives `PM STATUS` / `Access Status` / `Pay Status` |
| **Contact-sheet PDF/DOCX** | `…/PRODUCTIONS/URITP 26-27/<Show>/_Contact Sheets/` — newest file = LIVE, `zOld/` + `zEDIT/` are archive | The distributed operational sheet: phones, emails, rooms, call/report flags. Built once people onboard |
| **Info Sheet** | `…/<Show>/<CODE>.Info Sheet.<TERM>.docx` at show root | The EARLIEST surface: design team + SM + key dates, drafted before a contact sheet exists |

**The Info Sheet is the lead indicator.** It carries names months before a contact sheet is built,
so a show with "no contact sheet yet" is NOT "nothing to reconcile" — the master is just behind the
Info Sheet. **Founding run: T.I.M.E. (staged) had a full design + SM team on its Info Sheet and
almost none of it in the master.** Always read the Info Sheet even when a PDF exists; they drift
from each other too.

### Show short codes + Dropbox folders (URITP 26-27)

`BL` Big Love · `BC` Becoming Curious (folder `2.1 Becoming Curious`, cast/design list `Kali`) ·
`TIM-D` T.I.M.E. Development · `TIME` T.I.M.E. staged (`4 T.I.M.E. PRODUCTION`) ·
`TS` The Secretary · `OA` One Acts (`2.5 OA #24`). Never invent a code; an unknown one is a
FINDING, not a typo (same rule as gcal Pass D).

---

## Section map (align these; the surfaces label them differently)

| Master `Contact Sheet HEADER` | Contact-sheet PDF section | Info Sheet |
|---|---|---|
| `CAST` | CAST | (cast size only; names rare) |
| `STAGE MANAGERS, Run Crew` | STAGE MANAGEMENT & RUN CREW | PSM / APSM / ASM block |
| `Creatives` | ARTISTIC | Director + designer block |
| `Program` | PROGRAM & PRODUCTION STAFF | resident staff (often implicit) |
| `Shop Staffs` | PRODUCTION CREW | rarely listed |

---

## Normalization — apply BEFORE comparing

**1 · MATCH ON PERSON, FLAG THE SPELLING.** Names are typo'd across surfaces and the master is not
immune. Founding examples: `Ales`/`Alex Sapounov`, `Seth Resier`/`Reiser`, `ELENOR`/`Eleanor`, a
stray-colon email `:padra.crisa@…`. Resolve to the same human, then report the spelling delta as a
fix — never treat a misspelling as a second person.

**2 · A ROLE-TITLE MISMATCH IS A FINDING, NOT AN AUTO-FIX.** The same person carries different
role labels across surfaces and that is real information, not noise. Founding: `J Simmons` =
Voice & Acting (master) vs Fight Choreographer (BL sheet) vs Voice & Acting (TS/TIME info);
`Sara Penner` = Resident Intimacy Coordinator (master) vs Producer/Curator/Mentor (OA info);
`Casey McNamara` = Costume Shop Manager (master) vs Design Mentor (OA info). Print both; Michael
rules on which the role actually is for that show.

**3 · ONE PERSON, MANY ROLES.** A single human can hold several rows. Founding: **Kāli Quinn** was
Director + Scenic + Costume + Sound Designer on the BC sheet while the master had only a Director
row and NO Costume/Sound rows at all. A missing role row is a `MASTER MISSING ROW` finding, not a
rename.

**4 · ALLCAPS + abbreviations on Info Sheets** (`AVE`, `AHE`, `PSM`). Expand against the master's
role vocabulary before matching. `?NAME?` / `TBD` / `maybe` on an Info Sheet = **tentative**;
carry the qualifier, never promote it to confirmed.

**5 · The master row set is a TEMPLATE.** Every show view instantiates the same role skeleton, so
blank rows are expected. A blank master row against a named surface is `MASTER MISSING PERSON`; a
named surface role with no master row at all is `MASTER MISSING ROW`. Different fixes.

---

## The passes

### Pass A — surface inventory (no verdicts yet)

For the show, locate all three surfaces and STAMP each with its date: contact sheet from the
`Updated <DD Month YYYY>` footer AND the filename date; Info Sheet from its term header; master
from the per-show view. Report which surfaces exist. **A show with only an Info Sheet still gets
reconciled** (Info Sheet ↔ master).

### Pass B — person reconciliation

Walk every named person across the three surfaces. Per person emit ONE of:
`ALIGNED` · `SPELLING (surface values)` · `ROLE MISMATCH (surface: role)` ·
`MASTER MISSING PERSON (role filled on <surface>, blank in master)` ·
`MASTER MISSING ROW (<surface> role has no master row)` ·
`STALE ON <surface> (master fresher)`. Direction per the Direction Rule — cite the stamps.

### Pass C — field completeness (master-side)

For confirmed people, flag master fields the surfaces can fill: blank `Contact Email` where the
PDF has one, `PM STATUS = NEED` on someone clearly onboard per a dated sheet, missing `Pay Status`.
**Propose; do not write.** Founding: BC master had emails blank for nearly all program staff the
sheet listed.

### Pass D — 🎯 SURFACE ORPHANS (the reason this hook exists)

Anyone on a Dropbox surface with NO master presence at all — the contact analog of a calendar
orphan. Founding: **Mica** (Creative Consultant) and **Kelly Quinn** (Emotional Support) on the BC
sheet, the whole TIME SM/AVE/VE team on its Info Sheet. 🚫 **NEVER auto-create a master row** — it
may be a one-off, a support person, or a not-yet-hired slot. Report with a proposed section + role.

### Pass E — the write (gated)

After Michael rules per row, apply master-field writes in one batch (`query_tasks` UPDATE →
preview → APPLY). ⚠️ **Count the rows the batch will touch and state the number before writing**
(gcal #12 discipline). Dropbox files are NEVER written here — a stale PDF is re-exported by hand,
not patched by an agent.

---

## Output shape

```
CONTACT RECONCILE — <show(s)> — <timestamp ET>
Surfaces:  master <view> · sheet <date | none> · info sheet <date | none>
Aligned:   <n>
Spelling:  <n>   Role mismatch: <n>
Master missing: <n> person · <n> row
Orphans:   <n> on a surface, no master presence
Field gaps: <n> (email / status / pay)

B · PERSON RECONCILIATION   (person · role · master | sheet | info · verdict)
C · MASTER FIELD GAPS       (row · field · proposed value · source surface + date)
D · SURFACE ORPHANS         (name · role · surface · proposed section)
```

**Reconcile the counts** — aligned + flagged + orphaned must account for every named person across
all three surfaces. An unexplained gap means a query filter lied (most likely the closed/subtask
default: carry `is_subtask IN (true, false) AND is_closed IN (true, false)`).

---

## Guardrails

- 🚫 **PII IS THE HARD ONE. `ClickUp_apps` is PUBLIC.** Contact sheets carry student cell numbers
  and personal emails. Real phone numbers, personal emails and home rooms NEVER enter this repo, a
  public channel, or a shipped artifact — reports name roles and discrepancies, not raw contact
  values. Student participation is FERPA-adjacent; when in doubt, keep the value in ClickUp only.
- 🚫 **Never invent a name, email, phone, or role.** Unknown is an answer; a plausible value is
  not. A tentative surface value (`?…?`, `TBD`, `maybe`) is carried as tentative, never confirmed.
- 🚫 **Never write a Dropbox file, never cull/merge/rename a master row** found during a pass.
- ⚠️ **Direction is per show, never global** (the Direction Rule). Never carry a verdict between
  shows or between passes.
- ✅ **Read-only reconciliation needs no permission** (gcal precedent). Do the pass, report it; the
  master WRITE is what waits on Michael's ruling.

---

## Composes with

- **`gcal-reconcile.md`** — its structural twin (this reconciles CONTACT surfaces, that reconciles
  CALENDAR surfaces). Same steward, same propose-only contract, same "two moving surfaces" premise.
- **`cross-space-research-gate.md`** — locate every surface before comparing.
- **`task-dedup-gate.md`** — before proposing any new master row for an orphan.
- **`secrets-pii-guard.md` / `commit-pre-flight.md`** — fire on any write touching this domain.

---

## Known gaps (honest list)

1. **One real sample only** (2026-08-31): BL + BC had contact sheets; TS/TIME/OA were Info-Sheet
   only; TIM-D holds per-participant PDFs, not a company sheet — its shape is unmodeled here.
2. TIM-D participant files (Adults/Children/facility rosters) are a DIFFERENT surface type; whether
   they reconcile against the master at all is unresolved.
3. No join key between a Dropbox sheet and a master row — matching is name+role, so a rename on one
   side reads as add+drop (same weakness gcal solved with `eventId`, unavailable here).
4. Master ↔ Info-Sheet ↔ PDF freshness has no stamp convention beyond the sheet footer date.
5. Whether the master's `Contact Sheet` list-relationship fields should point at anything is
   unsettled (Michael has been nulling them) — out of scope until ruled.
