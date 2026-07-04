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

### Race Weekend Schedule Panel

**Version target:** v6
**Theme:** Each circuit page shows the full race weekend timetable (all series, all sessions) so the app becomes a weekend companion, not just a static reference.

---

#### What it adds

- A **Schedule panel** on each circuit detail view showing every session for that venue's race weekend.
- Series covered: F1 (FP1/FP2/FP3/Qualifying/Race), F2 (Practice/Qualifying/Sprint/Feature), Porsche Supercup, F1 Academy, and Sprint-format sessions (SQ/Sprint) where applicable.
- Sessions grouped by day, with series badge + session name + local time.
- Visual status indicators: `done` (muted), `upcoming` (normal), `live` (highlighted).
- "Next up" highlight when viewing a circuit whose weekend is imminent.
- Collapsible or tabbed if session count is high (sprint weekends have 8+ sessions).

---

#### Data schema

Add a `schedule` array to each track object in `data.json`:

```json
"schedule": [
  {
    "series": "F1",
    "session": "FP1",
    "datetime": "2026-07-04T13:30:00+01:00",
    "status": "upcoming"
  },
  {
    "series": "F2",
    "session": "Practice",
    "datetime": "2026-07-04T10:05:00+01:00",
    "status": "upcoming"
  }
]
```

**Field definitions:**
- `series`: `"F1"` | `"F2"` | `"F3"` | `"Porsche"` | `"F1Academy"` | `"Sprint"`
- `session`: session name (e.g. `"FP1"`, `"Qualifying"`, `"Race"`, `"Sprint"`, `"Feature"`, `"SQ"`)
- `datetime`: ISO 8601 with timezone offset (so UI can show local track time)
- `status`: `"upcoming"` | `"live"` | `"done"`

---

#### Population strategy

1. **Bulk seed at v6 launch:** Research and commit the FULL remaining 2026 season schedule (all 24 rounds, all support series) from the FIA provisional calendar + series-specific calendars. Every circuit page has value from day one.
2. **Pre-weekend verification pass (new weekly step):** ~Tue/Wed before race week, verify the upcoming round's schedule against the latest FIA event timetable. Fix any shifted session times or added/cancelled support races. Data-only commit.
3. **Post-weekend recap pass (existing weekly refresh):** Flip completed sessions to `status: "done"`.
4. **Ad-hoc:** "Update the schedule" = research latest FIA notes + data.json commit. No engine touch, no version bump.

---

#### Data sources

- FIA official event calendar (session times, weekend format)
- formula1.com race weekend schedule
- fiaformula2.com / fiaformula3.com calendars
- Porsche Supercup schedule (porsche.com/motorsport)

---

#### Engine requirements (source file changes)

- New source file: `source/12_schedule_panel.js` (keep under budget, target ~10-12KB)
- New CSS: add to `source/03c_live_session_panel.css.txt` if it fits within budget, otherwise create `source/03d_schedule_panel.css.txt`
- Schedule panel renders on each circuit detail view, below or beside the existing breakdown sections
- Sessions grouped by day with clear visual hierarchy
- Series badges with distinct colors/icons per series
- Mobile-first: stacks cleanly at 320px, touch targets ≥44px

---

#### Notes

- F2/F3/Porsche don't race at every venue. Only include series that actually appear at each circuit.
- Sprint weekend detection: 2026 sprint rounds are published on the FIA calendar. The schedule array simply includes SQ + Sprint sessions for those rounds.
- Schedule data lives in `data.json`, not in source files. Adding/updating schedule = data commit only (no version bump).
- Check `source/10_track_views_and_profile.js` (~18KB) before integrating the panel call. If integration pushes it past 15KB budget, the panel should self-render from its own module and be called with a single hook.
- The `index.html` shell may need a `<script src="./source/12_schedule_panel.js">` added to the loader list.

---

#### Acceptance criteria

- [ ] Every circuit with a populated `schedule` array shows the schedule panel.
- [ ] Sessions grouped by day, sorted chronologically.
- [ ] Series badge + session name + local time displayed per row.
- [ ] Status styling: done (muted/grey), upcoming (normal), live (highlighted/pulse).
- [ ] "Next up" indicator on the upcoming session when weekend is imminent.
- [ ] Circuits with no `schedule` array show no panel (graceful absence, not an empty box).
- [ ] Mobile: panel stacks cleanly at 320px, no overflow.
- [ ] New source file(s) under budget (~10-12KB each).
- [ ] `data.json` includes full 2026 season schedule for all 24 rounds.
- [ ] App version bumped to v6.

---

#### Brainstorm gate reminder

This spec was brainstormed in a Brain session (2026-07-03). Penelope: if you see architectural questions or edge cases not covered here, surface them to Michael via the seven-team gate before building. Don't silently resolve ambiguities.

## In review

- _Empty._

## Futures

- _Empty._

## Known guardrails

- Spot edits should start from `/source`, not from `index.html`.
- Keep semantic source files near the ~10–12 KB soft target and split at ~15 KB unless explicitly approved otherwise.
- Current budget-watch files:
  - `source/10_track_views_and_profile.js` (~18KB, first split target on next structural touch)
- Schedule data maintenance is a data-only commit (no version bump, no engine changes).
- Pre-weekend verification pass becomes a standing weekly step in the F1 refresh cadence.
