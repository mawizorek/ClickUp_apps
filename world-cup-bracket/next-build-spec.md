# World Cup 2026 Bracket — Next Build Spec

**Version target:** v2 (engine bump) + companion data.json fill
**Current shipped:** v1 (engine + data.json)
**Live:** https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/

## Source pins (commit-locked at spec time)

- Commit ref: `24efb82b8b3e587acbfd434400e4bea539bde145`
- `index.html` blob SHA: `96e94927c009a8eaad76813375edfc752873d0a2` (21,986 bytes, under 30KB, reads whole)
- `data.json` blob SHA: `4ea1c58c57038a01a45ea342772200571393fffc`

> Note: README still self-describes as single-file (stale). The app IS data-separated (`index.html` engine + `data.json`). Fix the README Infrastructure table on the next ship.

---

## Scratch intake

**Raw request (Michael, 2026-07-04):** "Populate future games with accurate dates and times and POTENTIAL current matchups."

Breaks into two distinct pieces with different handling:

### Piece A — Future-round dates/times/venues (DATA, data.json)

QF (ids 25-28), SF (29-30), and Final (31) currently carry `"time": "TBD"` and mostly `"venue": "TBD"`. FIFA fixes these kickoff dates, times, and host venues in advance, independent of who qualifies. Same for the lingering R32/R16 TBD venues/times (ids 12-16, 22-24).

- **What:** fill real dates, kickoff times (ET, matching existing `"time"` string format e.g. `"5:00 PM"`), and venues for every scheduled future match.
- **How:** `data.json` commit only. No version bump, no engine change. Datestamp the `version` field.
- **Source:** FIFA official match centre → cross-verify vs ESPN/BBC (per World Cup Refresh guide priority order). Source links mandatory; use `TBD` only where genuinely unconfirmed, never fabricate.
- **Blocker:** none. Can ship independent of Piece B.

### Piece B — Potential matchups (ENGINE, index.html, v2 bump)

Instead of rendering `TBD vs TBD` for future-round slots whose feeder matches haven't resolved, dynamically compute and display the still-alive contenders for each slot by walking the `feedsTo` wiring backward.

- **Example:** QF match 25 is fed by R16 match 9 (Canada/Morocco) and R16 match 10 (Paraguay/France). Render as `Canada/Morocco winner  vs  Paraguay/France winner` (or a contender pool for slots two+ rounds out), collapsing to the actual pairing as feeders go final.
- **Bracket wiring (current, for reference):**
  - QF 25 ← R16 9, 10  |  QF 26 ← R16 11, 12  |  QF 27 ← R16 13, 14  |  QF 28 ← R16 15, 16
  - SF 29 ← QF 25, 26  |  SF 30 ← QF 27, 28
  - Final 31 ← SF 29, 30
- **Logic sketch:** for a match with `home`/`away` == `"TBD"` (or `tbd:true`), find feeder matches (those whose `feedsTo` == this id). If a feeder is final, use its winner; if not, surface both feeder teams as "X/Y winner" or recurse further back to a contender set. Purely computed from existing `feedsTo` + `status`/`winner` data — no new data fields required.
- **Design questions for the brainstorm gate:** how many rounds of potential to show (immediate feeder only vs full contender pool to the Final)? Visual treatment (dashed cards? contender chips? muted styling vs confirmed)? Does this render in both Schedule and Bracket views or just one? Mobile legibility of "X/Y winner" labels at 320px.
- **Live-over-hardcoded:** the potential resolution must be computed at runtime from data.json state, never hardcoded per-slot.

---

## Next build

_Pending Brainstorm Gate (7 lenses)._ Piece B is an engine/logic change touching committed source, so it does NOT get promoted here until the gate runs and Michael rules. Piece A can move to a data.json commit without the gate (pure data update).

---

## In review

_None._

---

## Futures (parked, from README roadmap)

- Flag emoji / small SVG flags per country.
- Tap-to-expand match cards with goal scorers / key moments.
- Auto-highlight "today's matches" from system date.

---

## Known guardrails

- **Data separation is live.** Data changes = `data.json` commit only, no version bump, no engine rebuild. Engine changes = `index.html` version bump.
- **ClickUp World Cup list custom fields are `short_text`** (Home/Away Team, Hype Level) — pass type `short_text` or the write bounces. See World Cup Refresh guide.
- **Live-over-hardcoded (LOCKED):** dates, "today" highlighting, and potential-matchup resolution all computed at runtime.
- **Mobile-first is a hard requirement:** test at 320-390px. Contender labels must not overflow or clip.
- **Two surfaces stay in sync:** ClickUp World Cup list (id `4026855117172647364`) + this app. A refresh touches both.
- **⏳ Ephemeral:** tournament ends Sun Jul 19, 2026. This spec + the app + the refresh guide archive/retire after the Final.
