# Script Breakdown · AI Toolkit

**Purpose:** turn a play script into two queryable surfaces a production manager can work from — a French-scene SPINE and a DEMAND ledger — so the script is read ONCE and every later question is a query instead of a re-read.

**Steward:** Mainstage Milo.

**Mode:** On-demand routine.

**Invocation:** `/script-breakdown` · `/breakdown` · "break down the script" · "dictate units from part N" · "start the demand ledger for <SHOW>".

**Trigger:** a production needs its script converted into trackable production obligations. Typically at script receipt, before design deadlines land.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-11** by Mainstage Milo + Maestro Mira's Workshop, proven end-to-end on Big Love (F26).

Companion: `hooks/script-breakdown.notes.md` (scars, measured grain, worked example). Decision record: **Script Breakdown Schema — Decision Log** (ClickUp, Brain Reference Library).

---

## The model — three layers, and fusing them is the failure

1. **SPINE** — French-scene units. Thin, boring, a JOIN KEY. Nobody reads a key.
2. **DEMANDS** — one row per obligation the script creates. The actual instrument.
3. **EVIDENCE** — page clip / annotation, attached to a DEMAND, never floating on a canvas.

🎯 **The boundary that keeps this from becoming a cue book: a row exists IF AND ONLY IF the script obligates a resource.** People, time, money, space, safety. No themes, no beats of intention, no directorial reading. **Interpretation gets no column because it gets no table.**

🔴 **A DEMAND is a REQUIREMENT; a Design Element is a SOLUTION. They link, they never merge.** A design gets redrawn three times and the demand never moves. Two rows describing one bathtub diverge, and then nobody knows which one the designer read.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Breakdown home** | URITP PRODUCTIONS ▸ `<Show>` ▸ **Breakdowns** (subfolder) |
| **Spine list** | `Script Beats (<CODE>)` — Big Love: `901328148568` |
| **Demand list** | `Script Demands (<CODE>)` — Big Love: `901328148330` |
| **Coverage truth** | `Production STAFFING` / Contact Sheet — list `901328115174` |
| **Hazard destination** | `Risk Assessment (<SHOW>)` |
| **Department vocabulary** | `Production Note` labels field — ⚠️ list-scoped to Show Design; promote to FOLDER scope, never rebuild |

Production short codes are fixed vocabulary — see `hooks/trip-triage.md`.

---

## Schema (v1 — six new fields, one reused)

**`Script Beats (<CODE>)`**

| Field | Type | Note |
| --- | --- | --- |
| `Unit ID` | short text | `BL-U01`. **Immutable, never renumbered, never reused.** Separate from the task name so a rename cannot break it. |
| `Page Number` | number | Start page only. The next unit's start implies this one's end. |
| `On Stage` | labels | One option per CHARACTER, from the CAST SHEET not the script's cast list. |
| status | native | `active` / `cut`. No custom set for a lookup table. |

🚫 **No assignees, no due dates, no priority on the spine.** The moment a unit is assigned it has stopped being a spine.
Task name = the human label (`the tomato monologue`). `Unit ID` is the handle.

**`Script Demands (<CODE>)`**

| Field | Type | Note |
| --- | --- | --- |
| `Unit` | list relationship → Beats | The only join. **Holds MULTIPLE units** — one demand can span the whole play with no duplicate rows. |
| `Demand Type` | dropdown | 💰 Money · 🧯 Hazard · 🤝 People · ⏱️ Time · 📄 Rights |
| `Production Note` | labels | REUSED, never rebuilt. |
| status | native | `raised → confirmed → covered → satisfied / waived / cut` |

🔴 **`waived` is the status a Design Element structurally cannot have.** A design never gets waived, it quietly never gets made and later nobody can tell whether that was a decision or a miss. **The stack of waivers IS the document you hand the director.**

---

## Procedure

### 0 · Before reading a single page

1. **State the repo/production coordinate** and confirm which SHOW and which CODE.
2. **Establish the version.** Who is editing the script, when does the next draft land, is the copy in hand current? ⚠️ **If a director is mid-cut, everything you emit is `raised` and cannot honestly advance.** Say so up front.
3. **Read the CAST SHEET before the script.** It sets the `On Stage` options and it overrides the script's cast list — a slash in a published cast list (`Bella/Eleanor`) is an OPTION the production has already ruled on. **Doubling the production did not take is a `waived` demand, not a flag.**
4. **Check the show folder against SHOW TEMPLATE.** A live show can be partially instantiated and does not announce it. If `Risk Assessment (<SHOW>)` is missing, hazard demands have nowhere to point.
5. **Clean the file.** Free downloads carry corruption (half-stripped `&quot;` entities, live typos). Never quote a mangled line back as if it were the text.

### 1 · The unit pass (the spine)

**Read in PAGE ORDER, start to finish.** Sequential IDs require sequential reading; break order and every downstream ID is provisional.

**THE RULE: a new unit every time a character ENTERS or EXITS. Strict. Entrances and exits only.**

- ✅ Reproducible — a second person derives the identical breakdown.
- ✅ It doubles as the entrance/exit plot stage management already needs.
- 🚫 **Do NOT add "or when the stage picture changes."** It was considered and rejected: it reintroduces a judgement call on every page, and the spine's job is to be a boring join key. A wordless dance is a `⏱️ Time` demand pointing at the unit it lives inside.
- ⚠️ **Accept the size spread.** Strict produces 2-line units and 15-page units in the same list. That is correct. **The spine does not show you where the work is; the demands do.**
- 🚫 **No minimum unit size.** Folding a 2-line unit means deciding by feel where a unit is "big enough" — exactly the judgement strict exists to remove. A minimum is a RULE CHANGE and gets logged as one.

**Create `<CODE>-U00 · PRODUCTION` first**, page 0, no characters. Production-wide demands hang there; an empty relationship reads as an error, a deliberate row reads as a decision.

**Each unit body carries three things:** boundary IN · what happens · boundary OUT. A unit whose boundary out is unknown (the part file ended) says so explicitly and gets closed on the next pass.

🔴 **UNMARKED MOVEMENTS ARE GUARANTEED — expect roughly one per 20 pages.** A character speaks with no entrance written, or is gone with no exit. **Place them by inference, and write the inference INTO the unit body as a flagged judgement call.** Never resolve one silently. This is why the pass cannot be mechanical.

### 2 · The demand pass (the ledger)

Emit while reading, not afterwards. **You are not reading to understand the play** — you are hunting nouns that cost money and verbs that create obligation. Never stop to consider what it MEANS.

| Type | Hunt for |
| --- | --- |
| 💰 **Money** | Anything built, bought, rented, or **consumed per performance**. Consumables are the rows nobody prices: breakables, food, practical liquids, anything destroyed nightly. |
| 🧯 **Hazard** | Fire, water, blood, height, flying, firearms, edged props, thrown objects, breakage, haze, food, impact, falls, minors, nudity. |
| 🤝 **People** | Anyone with a fee who is not in the cast: intimacy director, fight/movement director, choreographer, dialect coach, musician, specialist. **These are the rows most often missing from every other list.** |
| ⏱️ **Time** | Timed scenes, long dances, design deadlines, anything needing calendar rather than staging. |
| 📄 **Rights** | Songs sung LIVE, named recordings (a PD composition is not a PD recording), the play's own performance rights. |

**Two things only an ORDERED ledger surfaces, and they are the highest-value output:**

- **Consumable chains** — restock × run length.
- 🔴 **SEQUENCING HAZARDS.** Track what accumulates on the deck across the show. Glass in one unit, wet food three units later, a barefoot dance after that. **No single-axis list produces this; only units in order do.**

### 3 · Coverage, not assumption

🔴 **NEVER assert a staffing or coverage gap without reading the Contact Sheet.** A demand derived from a text is a REQUIREMENT; only the live record says whether it is COVERED. A demand whose person is already seated goes straight to `covered`.

⚠️ **"Not on the contact sheet" is a finding, NOT proof of absence.** Say "I cannot verify" and ask. And a stated intention is not a confirmation — `NEED` on a seat stays `NEED` until it is filled.

### 4 · The director's cost view (the reason this exists)

> **`SCRIPT COST — read before you cut`** · filter `Demand Type` = Money or Hazard · group by Unit · sort by Page.

🔴 **This is an INPUT, not a report.** A director trimming "unnecessary stage directions" is editing the cost of the show without knowing it — **in a devised or physical piece the stage directions ARE the budget.** Deliver it while the cut is still open.

Two more views, free once the data exists: **By Department** (group by `Production Note`) and **Who's On Stage** (Beats grouped by `On Stage`, which is the entrance/exit plot).

---

## Guardrails

- 🚫 **The ledger RAISES a hazard and NEVER assesses one.** Analysis and standards → Hazard Hawthorne. Welfare, training status and THE CALL → Mainstage Milo. The assessment lives in `Risk Assessment (<SHOW>)`. **A mitigation typed into a script row builds a second, unqualified safety register.**
- 🚫 **Never merge a demand into a Design Element.** Link only.
- 🚫 **Never delete a cut unit or a cut demand.** Mark it; rows point at it.
- ⚠️ **Content and welfare flags are not hazards.** Sexual-violence text, nudity, and self-harm imagery aimed at student actors need the intimacy director and the director in a room, plus a trigger-warning decision, regardless of whether anyone is touched.
- ⚠️ **A menu is not a script.** When a playwright writes "things like these," somebody has to CHOOSE. Surface it as a decision with a hazard budget attached, before design, not after.
- 🔴 **NEVER price the build off a partial read.** A ledger from some of the pages is not a small version of the real one — **it is systematically wrong about SCALE**, because the largest set-pieces cluster and can sit entirely inside the pages you skipped.
- ⚠️ **Estimate grain from a real sample, never cold.** Count one page before quoting a number.

---

## Composes with

- `hooks/cross-space-research-gate.md` — map what exists before proposing.
- `hooks/custom-field-gate.md` — dropdown/label options get approved before they exist.
- `hooks/trip-triage.md` — production short codes.
- `gates/craft-guardrails.md` — the never-certify line.
- **Decision Logs — Gold Standard** — schema decisions go to the DL, not into this file.

---

## Changelog

- **v1 (2026-08-11)** — Established by Mainstage Milo, ClickUp Coach Corey and Maestro Mira's Workshop (7 lenses + Domain Dara + Style Stu), after a full end-to-end run on Big Love (F26): 30 spine units across 99 pages. Strict entrances/exits locked by Michael; the stage-picture variant considered and rejected.
