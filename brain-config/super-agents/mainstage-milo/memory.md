# Milo — Memory (PATTERNS + CORE PREFERENCES ONLY)

> **Scope, ruled by Michael 2026-07-30:** patterns I have found, core preferences, and the durable URITP knowledge that makes me useful. Things that change how I ACT tomorrow.
> 🚫 **NOT project state.** Which spaces are walked, Index counts, what's parked, what I owe him, what resumes next → **`activity-log.md`.**
> **always memory. never process.** Placement law: `_shared/super-agent-base.md` §4. **~10KB hot**, warm archives in `memory/archive/`.
> 🔴 **THIS FILE IS ~22KB AGAINST A ~10KB TARGET.** Condense pass owed; nothing culled without Michael.

## How Michael works (standing context)

- Theatre program side of URITP, not the dance department side.
- Wants clean, singular roles — one identity, no foreign lanes bolted on.
- Values the honest structure over a tidy fiction: show him the real (sometimes sloppy) shape.
- Prefers collaborators over hard walls between agents — agents call each other in, they don't gate each other.
- Decision logs, not prose chat. Inverted polarity (checked = rejected). Read answers back decoded before acting. **A log is a FEED — newest on top.**
- **Purpose > coverage:** documenting what a list CONTAINS isn't the job; naming what it's FOR is.
- **His v1→v2 pattern (confirmed 5×).** Builds a mechanism cheaply, graduates it to a real structure, leaves v1 as history. The older copy is usually a **PREDECESSOR**, not muck. 🌟 The 4th was caught MID-MIGRATION — **he writes the migration note into the task body itself.** 🌟 **The 5th (2026-08-07) is the doc-specs fork and it stalled: `maw-prose/guides/doc-specs/` has 5 specs, `uritp-docs/doc-specs/` has 2, both live, neither mentioning the other.** ⚠️ **A stalled migration looks exactly like duplication. Check which copy is GROWING before calling either one dead.**
- **He reorders the walk and he's right.** SHOW TEMPLATE went LAST: **the canonical artifact is the last thing you can judge, because "correct" is defined by observed downstream behaviour.**
- 🌟 **WHEN HE PUSHES BACK, THE PUSHBACK IS THE FINDING — not an objection to answer. FOUR INSTANCES IN 24 HOURS (2026-08-06/07), which promotes this from a habit to a law:** (1) *"it's deliberate drift"* → the whole Show Design convention I'd failed to read · (2) *"have you even read all the hazards?"* → I hadn't; reading them found four species, ~42 unscored rows and an uncomputed matrix · (3) *"the controls definitely switch per show"* → the library-vs-instance split I'd been circling for two days · (4) *"we literally have a URITP docs tree"* → the wrong-repo write. **His one-line pushback consistently contains more structure than my paragraph did. Stop defending, start reading.**
- ⚠️ **He audits WHERE a lesson was written, not just whether it was learned** (2026-08-04): *"whose repo, agent, decision store, backlog or memory did you write each of those into?"* **A correction that lives only in a session transcript is lost.** 🔴 **SECOND INSTANCE 2026-08-06:** *"are you updating your activity or your memory at all?"* — four hours of advisory work, zero commits until he asked. **Advisory output feels like work and leaves no artifact. Write it as you go.**
- 🌟 **HE CLAIMS LANES HE WANTS, AND A GUARDRAIL ON ME IS NOT A LIMIT ON HIM (2026-08-06).** I wrote "Charlie owns the code read and I don't certify" and he pushed back: *"I would like to be the code guy through support and documentation from you."* **When I name a guardrail, say whose it is.** Never let "I can't do X" imply "you shouldn't."
- **When he asks "what do we prioritize," check WHICH frame** — 2026-08-06 I answered a two-week triage when he meant an implementation roadmap. **A near-term question can be a strategy question wearing a deadline.**
- **A "maybe" in his prose is a genuine open question, not a soft ruling.** Log the firm half as a J block, ASK the maybe.
- 🔊 **He DICTATES via speech-to-text.** An unresolvable name is a transcription error before it is an intent — name it, give your candidate, ask. ⚠️ *"Nick Greene"* in an agent-seating context means **Hazard Hawthorne**; the real Nick Greene is his partner (Ogunquit Playhouse, a live Person task) and is **never culled**. Replies are HEARD: converse as if speaking, never restate settled ground (`team-standard.md` Spoken Voice).

## 🚧 MY SCOPE (his ruling, 2026-07-26)

The workspace has **22+ spaces**; **mine are the seven URITP-prefixed ones.** The unprefixed same-named spaces — **`Theatre`, `CRM`, `Inventory`, `Work`** — are Michael's work life **OUTSIDE URITP.** NOT deprecated predecessors, NOT audit subjects. Cross-board pattern notes are **Corey's** lane.

⚠️ **"Out of scope" ≠ "disconnected."** `Theatre ▸ People` is multi-homed with CRM ▸ ADULTS and six live contact sheets. **NAME a cross-boundary wire, hand it to Corey, don't chase it.**

## 🗺️ THE URITP REPO MAP (verified live 2026-08-07 — do not quote from memory again)

🔴 **I got this wrong once already; that is why it is a table now.**

| Repo | Holds | ⚠️ |
|---|---|---|
| **`mawizorek/uritp-docs`** | **THE URITP DOCS TREE — the published program site.** `safety/` (+ `programs/`) · `courses/` · `production/` · `roles/` · `guides/` (ave · designers · one-acts · pm) · `doc-specs/` · `00-authoring` · `01-media` · `01-utility` | **Every URITP program document goes here.** Frontmatter contract + `@id` cross-links; re-author, never paste. |
| **`mawizorek/ClickUp_apps`** ▸ `brain-config` | **FLEET MACHINERY ONLY** — gates, hooks, agent bundles, orchestration, team-standard | 🚫 **No URITP program docs. Ever.** |
| **`mawizorek/maw-prose`** | `guides/doc-specs/` (5 specs + template) · `guides/production-management/` · `guides/production-phases/` | ⚠️ **Forks with `uritp-docs/doc-specs/` — UNRESOLVED, see below.** |
| **`mawizorek/uritp-doc-archive`** | exists, but **NOT the course home** | 🔴 **`02-courses/` DOES NOT EXIST.** |
| `maw-themes` · `doc-render-engine` | rendering machinery | Not content. |

🔴 **CORRECTED 2026-08-07: THE COURSE CANON IS `uritp-docs/courses/`** — `course-index.tsv`, `course-info/`, `requirements/`, `index.md`. ~~`uritp-doc-archive` → `02-courses/`~~ **was wrong in this file for three days** and would have routed a future session into a repo that has no such path. **ClickUp `Course List` is still the CURRENT-TERM surface, not the definition home.** Course questions seat **Tutor Tate**.

🔴 **UNRESOLVED, Michael's call: TWO REPOS CLAIM THE DOC SPECS.** `maw-prose/guides/doc-specs/` (info-sheet 2,828b · contact-sheet · crew-call · letterhead · production-calendar) vs `uritp-docs/doc-specs/` (info-sheet **3,081b** · brochure-review · vectorworks). **Both live, both indexed, both claiming an exclusive folder contract, and the two `info-sheet` files differ.** ⚠️ **`hooks/production-doc-audit.md` resolves specs to `maw-prose`** — if `uritp-docs` wins, that hook audits every production doc against the wrong spec and reports clean. **The `Spec URL` field on the `Document TEMPLATES` list (`901319214267`) is the tiebreaker and nobody has read it.**

⚠️ **`uritp-docs/safety/programs/` holds ONE 208-byte stub (`mewp-program.md`) while ClickUp holds ~25 Program records.** The docs tree does not look live for this domain. That is why the safety pipeline felt homeless.

## URITP workspace knowledge (durable)

- **My 7 spaces:** URITP (main hub) `90131524916` · URITP CRM `901313786071` · URITP PRODUCTIONS `901313768203` · URITP Programs `901313758399` · URITP Courses `901313847910` · **URITP Inventories** · **URITP BETA BUDGET** (▸ LABOR holds the shop/crew staffing lists).
- **Season shape:** recurring P1–P4 slots + a distinct One Acts slot. **Michael decides the SHAPE; I run the work inside it.**
- **Where things actually live, against instinct:** `PM Availablity` is in PRODUCTIONS ▸ The Christians · the shop lists are in BETA BUDGET ▸ LABOR · `MY ROSTERS` is in Courses. **Don't assume a list lives in the space its subject belongs to.**
- **CRM is the identity spine.** STUDENTS/ADULTS/SHOW ROLES hold the natives; ~30 surfaces are the same person projected into a context. **Status on a people list = LIFECYCLE, not workflow.** 🗄️ **The Gen-1 per-show label fields are the entire pre-FY26 company archive — DO NOT CULL.**
- **A production is a time-boxed organization stood up whole and torn down**, and a finished folder **converts to an archive in place**. **The irreducible core is THREE lists** — hub + EVENTS + DESIGN. **Growth order:** hub+calendar → rehearsals → paperwork → design → **strike/risk last.**
- **A cancelled show leaves residue in its replacement's folder** (Kayfabe → KALI). **An unexplained suffix is a lineage clue, not sloppiness.**
- 🔴 **MULTI-HOME IS THE SAME TASK OBJECT IN TWO LISTS, NOT A COPY — a DATA rule, not trivia (2026-08-07).** Editing any field **changes it everywhere at once, including in a closed show's record.** Correct for sharing a *reference*; **catastrophic for anything carrying per-instance values.** ⚠️ **A multi-home carries NO attributes of its own.** The moment a relationship must hold data, you need an **instance object with a relationship field**. Applies to every URITP domain.
- 🌟 **LIBRARY vs INSTANCE (Michael, 2026-08-07).** *"I definitely like the ability to reuse the tasks, but the controls definitely switch per show."* **The NOUN is reusable; what we DID about it is a fact about one production.** Storing both on one task is why duplicates appear. **Before proposing reuse of anything, ask which half is the definition and which half is the instance.**
- 🌟 **TEMPLATE ≠ PRODUCTION.** `Show Design (P0)` = template; `Show Design (BL)` = Big Love's instance. **Never route active correspondence, real deadlines or person-specific data to a `(P0)` task.** See `_shared/template-production-guardrail.md`. ⚠️ **The ADULTS list contains CLOSED tasks.**
- 🌟 **THE SHOW DESIGN TREE — HIS CONVENTION ("it's deliberate drift", 2026-08-06).** Two species side by side, intentionally:
  - **`[ BRACKETED DISCIPLINE ]` = REPRESENTATIVE GLOBAL STAND-INS**, top-level, from the template.
  - **REAL elements are STANDALONE TOP-LEVEL tasks ALONGSIDE them** with plain names (`CEILING`, `AUDIENCE RISERS`, Thought/Crime's `truss adds`). **Sub-elements nest under their element.**
  - **Type `Task` = an ACTION on an element** · `Design Element` = the thing · `Paperwork` = the artifact · `Event` = the date.
  - **`<angle brackets>` carry the OPEN QUESTION** in a title. Punctuation is load-bearing — thesis 2.
  - **Every element gets a department stamp → the list becomes a Design Dashboard.** Field is **`Production Note`** (labels, 25 options, `8bd1a34f-ded0-472a-8185-3b6d5bd3b3ff`). ⚠️ **Its NAME says "Note", its JOB is "Department" — that mismatch is why he reaches for a new field.** **Check it before ever proposing a department field.**
  - **Richest precedent: `show design (T/CM)`.** Read it before building any new show's tree.
- 🌟 **THE PAPERWORK FAMILY IS FULLY SCAFFOLDED AND ALMOST ENTIRELY EMPTY.** Every production gets `Paperwork (<SHOW>)` cloned from `(P0)`, so the task **already exists before you think to make it** — `| budget at a glance |` has NINE instances. ⚠️ **CHECK `Paperwork (<SHOW>)` BEFORE CREATING ANY PRODUCTION DOCUMENT TASK.** **A scaffolded empty task reads as "not started" and is actually "nobody wrote down where the file is."**
- 🌟 **DROPBOX IS THE ARTIFACT HOME; CLICKUP IS THE TRACKING HOME.** Files at `/PRODUCTIONS/URITP <season>/<N> <Show>/` (older seasons collapse to `/PRODUCTIONS/z24-25/`). **Blank masters in `/PROGRAM/Guest Artist Documents/`, superseded revisions in its `Old Versions/`** — the v1→v2 pattern in a filesystem. Per-show copies at the folder ROOT as `<Doc>.<SHOW>.pdf`. ⚠️ **Filename casing drifts between seasons**, so search both.
- 🌟 **`BEGIN`/`END` ARE A FROZEN MIRROR OF START/DUE (Michael, 2026-08-05).** Folder-scoped on PRODUCTIONS ▸ CALENDARS, a **hard-coded copy** of native start/due, time included. Native dates move when a schedule slips; the mirror does not — that is the point, it is what exports, GCal pushes and printed calendars read. **Fill on create AND on every reschedule.** No source date → leave empty. ⚠️ **No bulk path:** a date custom field rejects both `SET = start_date` and a `CASE` map, so backfill is **one write per task**. Automation is **Corey's**.
- Deep detail: `memory/archive/uritp-crm-space2.md`, `uritp-productions-space3.md`.

## 🌟 Production task archetypes (confirmed 2026-08-04)

1. **Season Planning / Onboarding** — finite checklist. NOT an ongoing coordination home.
2. **Production Cal milestone** — calendar date anchor. Marks WHEN.
3. **Show Design work task** — the artifact/deliverable home. Tracks WHAT. **Where merged inbox items land.**
4. **CRM Person task** — canonical human record. WHO + contact + availability.

**Web:** work task **blocks** → milestone · **linked** → onboarding · **linked** → Person.

## Org chart, team & budget (confirmed 2026-08-04)

**Direct reports:** Charlie Lawler (TD) · Mary Reiser (Props) · Casey McNamara (Company Manager) · Katie (Costume Shop).
**Peers:** Sara Penner (Acting & Intimacy, reports to Nigel) · Chris Schneider (SPAC staff). **Superior:** Nigel Maister — Artistic Director.

**~9 professional staff · 19-person production leadership team · 25–40 student positions/year · 10 craft disciplines.** **Budget** ~$50K/production, 4–5 shows/year = **$200–250K annual**. ⚠️ **That is the PRODUCTION envelope, not the SET line — Big Love's set budget is $5,500. Never quote the production number at a designer.** Role framing: actual scope ≈ Director of Production.

## 🌟 MY TWO THESES

**1 · STEADY STATE IS WELL-BUILT; TRANSIENT STATE HAS NO MECHANISM.** Open position → a placeholder task · meeting poll → permanent schema · production phase → a cloned list family · enrollment per term → nine custom fields · three record systems with no ARCHIVE verb · **a design package with a due-date task, an artifact task and NO RECEIVING PROCEDURE** · **an excellent risk-assessment apparatus with no TRIGGER at prelim receipt.** **ONE missing pattern, not ten problems.**

**2 · CONTAINER = MATURITY STATE.** A thing MOVES BETWEEN CONTAINERS AS IT MATURES. **Location is a lifecycle field nobody declared, and emptiness is information.** Pairs with thesis 1: **URITP encodes state in STRUCTURE because it has no field for it** — in punctuation (`{ braces }`, `[124]`, `|pipes|`, `<angles>`, `[ brackets ]`), **in duplicate rows** (`Steps onstage (no railing)` / `(railing)` = one hazard at two control states), **and in which repo a file sits in.**

**Corollary I keep proving:** the audit's reversals all came from misreading **intent**, never data.

## ⚠️ Method rules + proven tooling defects

- 🔴 **RE-DERIVE THE REPO COORDINATE WHEN THE SUBJECT CHANGES, NOT WHEN THE SESSION OPENS (2026-08-07).** I stated the coordinate correctly at open — for a session about agent config — then the subject moved to URITP safety for hours and the coordinate never moved with it. **Twelve consecutive correct writes to one repo made the thirteenth feel correct.** ⭐ **A run of correct writes to one repo is not evidence the next one belongs there.** 🌟 **Identical shape to the seating rule locked the same afternoon (check at subject-turn, not session-open) — every "check at open" gate in this fleet has the same hole.**
- 🔴 **A STAMP PROVES *WHEN* SOMETHING WAS MEASURED, NOT THAT IT IS STILL TRUE (2026-08-04).** I quoted a five-day-old count as fact; the real number was 82 rows higher. *Re-query before it leaves my mouth.*
- 🔴 **READ THE ROWS, NOT JUST THE SCHEMA (2026-08-07).** I described a list off its FIELD DEFINITIONS having never opened its 85 records. **A schema says what CAN be stored. Only the rows say what IS.**
- 🔴 **"THERE IS NO PROCESS FOR X" DOES NOT LICENSE "THERE IS NO X" (2026-08-06).** Nearly recommended building something URITP built in Oct 2024. **Check for the artifact separately from the process.**
- 🔴 **TWO SURFACES AGREEING CAN ALSO BE A DEFECT (2026-08-07).** Listing `uritp-doc-archive` returned a tree **byte-identical** to `uritp-docs`; I nearly reported it. **Identical results from two different sources is a tooling artifact to verify, not a finding.** Sibling of the 08-06 rule (two surfaces DISAGREEING about a field is a defect to name, not a fact to report).
- 🔴 **DUPLICATES CAN BE THE ONLY RECORD OF SOMETHING (2026-08-07).** Check whether near-identical rows differ in a per-instance VALUE before merging. **Reclassify, never cull** — the general form of his never-cull rule: **what looks redundant is often the workaround that preserved something.**
- **A residency/hierarchy tree is NOT a structure map** — open the live container.
- **Read the task BODY before calling anything duplication.** Titles describe shape; only the body says intent.
- **Every aggregate view is a projection with a blind spot. A count of 1 is more dangerous than a count of 0.** ⚠️ **A row count is not a coverage measure.**
- **Census status TYPES** — a status's type ≠ its label (`in stock`, `cancelled` are done-types).
- **Proven defects:** `WHERE folder IN (...)` silently returns zero OR ignores the filter · unscoped workspace `GROUP BY` caps ~5,000 rows and reports partial as complete · the SQL field census drops fields intermittently · a date CUSTOM FIELD takes constants only, so backfill is per-task · `query_tasks` rejects `parent_id`, the column is **`parent_task`** · `custom_fields` `scope` reports the QUERIED container, not the definition home · **`search_workspace` silently scopes to the focused task when a request-scope is set** · **the GitHub MCP can return one repo's tree under another repo's name** — verify with a path unique to the target.
- 🌟 **VERIFY LIST IDENTITY before routing.** `homeListName` IS the disambiguation.
- ⚠️ **I cannot reliably count small repeated symbols on a scaled drafting plate and must say so** rather than produce a number. The exact count lives in the designer's source file.

## 🦺 Safety knowledge that travels (mine: the PEOPLE side)

- 🌟 **SAFETY STASIS — Michael's principle, 2026-08-07, a DESIGN REQUIREMENT not a preference.** *"We actually get into safety stasis if we rely on existing things and assume they cover our bases."* **Reusing a CONTROL without re-assessing it is itself a hazard. Reusing a hazard DEFINITION is not.** Consequence: **a pre-filled assessment is worse than a blank one — a blank row gets filled in and a filled row gets skipped.** Re-assessment must be structurally mandatory. ⚠️ **I recommended exactly the wrong thing 12 hours before he said this.** The instinct to reuse is strong and it is the thing to distrust.
- **AUDIENCE ON BUILT PLATFORMING IS OCCUPANCY, NOT SCENERY.** **100 psf**, not the 50 a performance deck gets; re-opens occupant load, egress, posted capacity and AHJ signoff. ⚠️ **That figure is UNCITED in our documentation — Hawthorne flagged it. Do not repeat it as a citation.**
- **ADA assembly seating, 2010 Standards §221:** 4–25 → 1 wheelchair space · 26–50 → 2 · **51–150 → 4** · 151–300 → 5. **One companion seat per space** (§221.3), **5% of aisle seats** (§221.4), **36″ single / 33″ paired**, no overlap with another space or the circulation path (§802.1). Spaces come **OUT of** the seat count. §221.2 scopes to *fixed* seating; a flexible room is arguable — **do not argue it.**
- **ANSI E1.46 is FREE** (`tsp.esta.org/freestandards`). §4.1 four-step risk assessment · §4.2 hierarchy of controls · **§4.4 review triggers include "whenever a fall occurs or almost occurs"** (the near-miss requirement) · **§3.4.1.3 the plan must cover EVERY operating mode incl. public/audience access** · **§3.4.1.1 the duty sits on venue/production MANAGEMENT, in writing** · §3.1 it is **NOT** a compliance document. Annexes B and C are copyable worked models. ⚠️ **Everything we hold is the 2016 edition; the 2018 revision is UNREAD.**
- **A designer's own disclaimer ("unqualified to determine structural appropriateness") is doing REAL WORK the moment audience is on the structure.** Read the title block, not just the drawing.
- **In the round there is no offstage.** Crossover, quick-change, prop tables, crew position and masking become one problem, timed before blocking.
- 🌟 **THE CODE LANE IS MICHAEL'S (2026-08-06).** *"I would like to be the code guy through support and documentation from you."* **He is the authority; I am the apparatus** — citation, edition, clause, live link, and the paper trail he hands to EH&S or a fire marshal. Charlie owns the shop-side buildability read, a different question.
- 🚫 **I still do not CERTIFY** (`gates/craft-guardrails.md`) — a limit on MY authority, not a hole in his. **Sourcing and documenting a code position is not certifying it.** I can STOP the work; that call stays mine.

## Fleet / role context

- Me = **URITP Production Manager Assistant** (git-teammate, 2026-07-21). Day-to-day production ops + knowing and documenting the messy URITP structures. **`update-uritp` retired — I did NOT inherit a doc-builder hat.**
- **Collaborators, not walls:** **Corey** (ClickUp structure) · **Fiona** (FileMaker + the shared object library; consults, never edits other repos' apps) · **Hawthorne** (craft safety — he owns the hazard and the standard, I own welfare, training status and THE CALL) · **Anna** (audit lead) · **Mira** (orchestrator, seats everyone) · **Felix** (fleet directory) · **Tate** (course↔production seam, PEERS).
- 🪑 **SEATING IS NOT MICHAEL'S JOB** (`team-standard.md` v1.9). Mira seats, Felix owns the directory, **and I carry a duty to CATCH a missing voice at SUBJECT-TURN.** 🔴 **A craft head is easiest to omit exactly when the generalists are doing well** — Hawthorne sat out a twelve-hour safety session before Michael named him.
- **The Production Office heads are a different AXIS, not a tier.** I chair their meeting; I do not manage them.
