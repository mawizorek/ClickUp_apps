# Prod-Cal Reconcile — CALENDAR manifest for the reconcile engine

> **This is a MANIFEST. The loop, the four findings, the passes, and every guardrail live in
> `reconcile-engine.md` — read it FIRST.** This file is DATA: the calendar surfaces, their routing,
> their normalization, and the declared source-of-truth. It never restates the engine.

**Renamed from `gcal-reconcile.md` 2026-08-31** (it reconciles ClickUp + Google + Info Sheet, not
just gcal). The dead name is a tombstone stub pointing here. Steward: **Mainstage Milo**; a formal
full-space pass seizes to **Audit Anna** (engine rule). All domain knowledge below is preserved
from gcal-reconcile v3 and its 2026-08-11 live run — the engine changed the FRAME, not the facts.

## Invocation + Trigger

- `/prod-cal-reconcile` · `/gcal-reconcile` (legacy alias) · `/cal-reconcile` · `/reconcile-calendar`
- Scoped: `<calendar>` · `<list>` · `--window <n>d`
- Plain: "reconcile the calendar," "what's out of sync with Google," "align the info sheet dates,"
  "do the info sheet dates match the calendar."
- 🚫 Not "put this on the calendar" (a single hand publish).

---

## Surfaces (ordered; engine reads freshest-LAST)

| # | Surface | Where | LIVE / STATIC |
|---|---|---|---|
| 1 | **Google Calendar** | the target calendars in the routing table | LIVE (human-edited) |
| 2 | **Info Sheet** | `…/PRODUCTIONS/URITP 26-27/<Show>/<CODE>.Info Sheet.<TERM>.docx` | STATIC (term/export stamp) |
| 3 | **ClickUp event tasks** | URITP PRODUCTIONS space `901313768203`, home-list routing below | LIVE — **Michael edits during a pass, so READ IT LAST** |

## 🔑 SOURCE OF TRUTH declaration (engine Q1)

**ClickUp is the leaning SoT for SCHEDULE** (it drives the publish + the automations). BUT per-item
freshness overrides: a Google-side edit or a newer Info Sheet can be the true value. The Info Sheet
is STATIC — when it disagrees with the ClickUp↔Google pair it is almost always the stale side
(re-export by hand), but "almost always" is not "always." **On any genuine conflict the engine
proposes and Michael rules — no auto-write of the losing side.**

## Join key

Google `eventId` WITHIN a pass (titles get renamed: `[BC] Light & Sound Strike` → `[BC] LX Strike`,
same id). No `eventId` is stored in ClickUp (a manual field was proposed + REJECTED), so the id
joins within a pass, not across runs. Cross-run + Info-Sheet join = show short code + occasion KIND.

---

## Normalization (engine P2 — apply BEFORE comparing)

1. **All-day events return UTC-midnight-shifted** (8pm EDT / 7pm EST). Detect the UTC-midnight
   boundary, never a literal time. Shift BOTH boundaries +1 day: first day = displayed start + 1,
   last day = displayed end. `Nov 6 7pm→Nov 7 7pm` = Nov 7 only; `Nov 14 7pm→Nov 16 7pm` = Nov 15–16.
2. **Write-side timezone:** every timed write carries an explicit offset (`-05:00` EST / `-04:00`
   EDT). A bare time is read as UTC — silent 4–5h shift.
3. **Strip the short-code prefix before title compare:** Google carries `[BC] ` `[OA] ` `[TS] `,
   ClickUp does not. Prefix typos are live: `[BX]` `[OA}` `[BC}`.
4. **Info Sheet dates are PROSE** — `Fri & Sat, December 11 & 12`, ranges, often no year. Resolve
   year from the term header (`Spring 2027`/`Fall 2026`); match to a ClickUp occasion by KIND
   (audition, callback, first reh, meet & greet, designer's run, tech, dress, opening, run, pickup,
   strike, deliverable due). `(all dates tentative)` / `TBD` / `?` = tentative, never firm.

---

## Routing: home list → target calendar

| Home list | Target | Confidence |
|---|---|---|
| `Production Calendar`* · `Production Cal (BL)` · `Prod Cal (TIME)` | URITP Production | HIGH |
| `Rehearsals (KL)` · `Rehearsals (TIME)` · `[BL] Rehearsals` | URITP Rehearsals | HIGH |
| `Events (OA)` · `Other Events (OA)` · `One Acts 2026` | **see OA grain rule** | — |
| `SPAC EVENTS` | SPAC Use Calendar | MED |
| `Recurring Academic Events` · `[123] Course Schedule` | URITP Classes | MED |
| `DANCE Dept shows` · `Other Events (KF)` | URITP Other Events | LOW |
| **`TRIPS`** | **travel calendar this fleet CANNOT SEE** | 🔴 blocked |
| `Prod Cal & Reh (TIM-D)` | splits by KIND, discriminator unwritten | 🔴 |

*⚠️ `Production Calendar` (`list-159`) is **BECOMING CURIOUS** (code `BC`), not Big Love — third
name on that slot (Kayfabe → Kali → Becoming Curious); its trips still live in the `Kali` list.

**OA GRAIN RULE:** an OA item publishes to **URITP Production** when a production department must
ACT on it (riser set, designer run, tech, strike, performances); stays **OA-only** for
festival-organizer grain (submission deadlines, reading nights, admin). Deliberate audience
fan-out, not duplication. **Multi-home rows:** one `GCal STATUS` may cover several publications —
report `AMBIGUOUS ROUTE` naming every candidate, never guess precedence. 🔴 `TRIPS` = ~40% of the
queue and its calendar is unreachable (likely `rochester.edu`, not a connected credential) — report
`UNVERIFIABLE`, counted separately. `26-27 PRODUCTION CALENDAR` is a second prod calendar with no
list pointing at it.

---

## The automations (VERIFIED 2026-08-11 — Michael's screenshots; agents cannot read CU automations)

Seven active on URITP PRODUCTIONS. **ClickUp-side drift detection is DONE — do not rebuild it.**

| Trigger | Condition | Action |
|---|---|---|
| due date changed | `GCal STATUS` = `CURRENT` | → `OUTDATED` |
| start date changed | `GCal STATUS` = `CURRENT` | → `OUTDATED` |
| `Calendar COLOR` changed | `GCal STATUS` NOT SET | → `NEW` |
| due date changed | `Info Sheet Status` set | → `OUT OF DATE` |
| start date changed | `Info Sheet Status` set | → `OUT OF DATE` |
| due date changed (EVENT) | is EVENT | updates `Event Ends` |
| start date changed (EVENT) | is EVENT | updates `Event Begins` |

**A single date write can flip BOTH `GCal STATUS`→`OUTDATED` AND `Info Sheet Status`→`OUT OF DATE`;
count both before a batch write** (engine P5). The automation cannot tell an agent write from a
human one — a write on a `CURRENT` row is inherently write + flip-back.

### Field model

`GCal STATUS`: `NEW` (in lifecycle, unconfirmed · QUEUE) · `CONFIRMING` (published, unsettled) ·
`CURRENT` (published + believed accurate · STAMP) · `OUTDATED` (ClickUp moved under a published
event · QUEUE) · `CLOSED (N/A)` (never an event · TERMINAL). `Info Sheet Status`: `Key Date` /
`Other Date` (STAMP) · `OUT OF DATE` (QUEUE) · `n/a` (TERMINAL). 🔴 **N/A TRAP:** both terminals
silence a row permanently; the engine's KIND test applies — dateless real events (`SND Hang`,
`LX Strike`, `Production Photos`) are NOT `N/A`. **`Calendar COLOR` is the admission gate** —
setting it stamps `NEW`; the value is FileMaker render styling (→ FMP Fiona). `Event Begins/Ends`
are LIVE mirrors, re-synced on every date change — they cannot tell you what a row USED to say.

---

## Domain passes (map onto the engine's P1–P5; findings 1–4)

- **Backfill queue** — for every `NEW` row, LOOK FOR AN EXISTING GOOGLE EVENT before assuming
  absence (`NEW` = not-yet-CONFIRMED, not not-yet-published; most already exist). Survives a
  blocked calendar.
- **Collapse candidates** — same production + dates + occasion = usually ONE event; propose a
  keeper (`CURRENT`), siblings `N/A`. Propose only, never automate.
- **Verify the stamp** — `CURRENT` rows vs Google (finding 3/4). A `CURRENT` row edited on the
  Google side reports clean forever otherwise. First live hit: `Show strike` `CURRENT` at 4–6p
  while Google said 5–8p.
- **Orphans (finding 2)** — Google events with no ClickUp row (3 in one two-week sample). Ladder:
  short code + date (`BL` `TS` `TIM-D` `TIME` `OA` `KL` `BC`; never invent) → title after prefix
  strip → date + occasion → UNMATCHED. An unknown short code is a FINDING.
- **Info Sheet date alignment** — each Info Sheet Key/Other date ↔ ClickUp event ↔ Google, by
  occasion KIND. `MISSING EVENT` (a designer-facing date with no task) outranks a drift. A Pass F
  drift prints all THREE dates.
- **Flip-back** — after Michael confirms, bulk-set worked rows to `CURRENT` (+ any `Info Sheet
  Status` reset). The bookkeeping half; pairs with any date write.

## Output payload (engine P4)

`MISSING ON GOOGLE` prints title WITH target prefix · date · start · end · target calendar.
`DRIFTED` prints every surface's value. Reconcile counts: queue + verified + info-sheet +
unverifiable = every row in scope.

## Known gaps

1. Travel calendar unreachable → ~40% unverifiable. 2. Multi-home rows: one status, several
publications (→ Corey). 3. `Prod Cal & Reh (TIM-D)` kind-split discriminator unwritten.
4. `26-27 PRODUCTION CALENDAR` unaccounted. 5. Milestone vs timed-event convention absent
(`SPAC Reservations End`). 6. `Calendar COLOR` carries two jobs. 7. `BASELINE_` frozen-ness
UNVERIFIED. 8. Passes have one real sample (URITP Production, Nov 2026, 2026-08-11); Info Sheet
date alignment has NEVER run live.
