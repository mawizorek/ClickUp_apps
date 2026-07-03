# f1-racetracks — next build brief

## Source location

- Runtime app: `f1-racetracks/index.html`
- Runtime data: `f1-racetracks/data.json`
- Live-tracking companion: `f1-racetracks/live-tracker.html`
- Preferred edit surface: `f1-racetracks/source/`
- Current live version: `v5`

## Scratch intake

- _Empty._

## Next build

- _Empty._

## In review

- _Empty._

## Futures

### Race Weekend Schedule Panel

**Theme:** Each circuit page shows the full race weekend timetable (all series, all sessions) so the app becomes a weekend companion, not just a static reference.

**What it adds:**
- Schedule panel on each circuit detail view: F1 (FP1/FP2/FP3/Quali/Race), F2 (Practice/Qualifying/Sprint/Feature), Porsche Supercup, F1 Academy, Sprint-format sessions (SQ/Sprint) where applicable.
- Sessions grouped by day, series badge + session name + local time.
- Visual status: `done` (muted), `upcoming` (normal), `live` (highlighted).

**Data schema** (in data.json, per track):
```json
"schedule": [
  { "series": "F1", "session": "FP1", "datetime": "2026-07-04T13:30:00+01:00", "status": "upcoming" }
]
```

**Population strategy:**
- **Bulk seed at launch:** Research and commit the FULL remaining 2026 season schedule (all 24 rounds, all support series) from the FIA provisional calendar + series-specific calendars. Every circuit page has value from day one.
- **Pre-weekend verification pass (weekly step):** ~Tue/Wed before race week, verify the upcoming round's schedule against the latest FIA event timetable. Fix shifted times or added/cancelled support races. Data-only commit.
- **Post-weekend recap pass (existing):** Flip completed sessions to `status: "done"`.
- **Ad-hoc:** "Update the schedule" = research + data.json commit. No engine touch, no version bump.

**Data sources:**
- FIA official event calendar (session times, format)
- formula1.com race weekend schedule
- fiaformula2.com / fiaformula3.com calendars
- Porsche Supercup schedule (porsche.com/motorsport)

**Engine requirements:**
- Schedule panel on circuit detail view, below or beside existing breakdown sections.
- Collapsible or tabbed if session count is high (sprint weekends have 8+ sessions).
- Mobile-first: stacks cleanly at 320px.
- "Next up" highlight when viewing a circuit whose weekend is imminent.

**Notes:**
- F2/F3/Porsche don't race at every venue. Only include series that actually appear at each circuit.
- Datetime includes timezone offset so the UI can show local track time.
- Sprint weekend detection: 2026 sprint rounds are on the FIA calendar. The schedule array simply includes SQ + Sprint for those rounds.
- Schedule data lives in `data.json`, not source files. If the panel UI requires new JS, check target file size before adding (budget: ~10-12KB soft, ~15KB hard split). Create a new source file (e.g. `12_schedule_panel.js`) rather than bloating an existing one past threshold.

## Known guardrails

- Spot edits should start from `/source`, not from `index.html`.
- Keep semantic source files near the ~10–12 KB soft target and split at ~15 KB unless explicitly approved otherwise.
- Current budget-watch files:
  - `source/06_track_data_rounds_06_09.js`
  - `source/07_track_data_rounds_10_13.js`
  - `source/08_track_data_rounds_14_24.js`
