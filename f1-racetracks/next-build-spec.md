# f1-racetracks v6 — Build Spec

**Cycle:** v5 → v6  
**Theme:** Contextual live/replay data layer using OpenF1 API. When session data exists for the currently-viewed circuit, the page activates a position tower, race control ticker, and tyre strategy strip overlaid on the existing breakdown. When no data exists, the page is unchanged.

---

## Source location

- **App source:** `f1-racetracks/index.html` (~126KB, single inline `<script>` block)
- **Semantic source (preferred edit surface):** `f1-racetracks/source/`
- **Repo:** `mawizorek/ClickUp_apps` (branch `main`)
- **Entry point for reading:** `f1-racetracks/source/source_index.md`

### Files to touch

| Concern | File | Action |
|---------|------|--------|
| Live API + polling + rendering | `source/12_live_session_layer.js` | **NEW FILE** |
| Live layer CSS | `source/03_styles_panels_tables_footer.css.txt` | **APPEND** responsive live-layer styles |
| Router hook (activation) | `source/09_app_bootstrap_and_home.js` | **EXTEND** router to call live layer check |
| Track view injection | `source/10_track_views_and_profile.js` | **EXTEND** renderTrack to trigger activation |
| Version bump | `source/09_app_bootstrap_and_home.js` | `APP_VERSION` → `"v6"` |

---

## Data source

**OpenF1 REST API** (free tier, historical data, no auth)  
**Base URL:** `https://api.openf1.org/v1`  
**CORS:** Confirmed friendly for GitHub Pages.  
**Full reference:** ClickUp doc "OpenF1 API — Available Data Variables" (Formula 1 space).

### Endpoints used (6 total, 4 polled per cycle)

| Endpoint | Polled? | Key fields |
|----------|---------|------------|
| `/sessions?session_key=latest` | Once on load | `session_key`, `session_name`, `date_start`, `date_end`, `circuit_short_name` |
| `/drivers?session_key={sk}` | Once on load | `driver_number`, `name_acronym`, `team_name`, `team_colour`, `headshot_url` |
| `/position?session_key={sk}` | Every 30s | `position`, `driver_number`, `date` |
| `/intervals?session_key={sk}` | Every 30s | `driver_number`, `interval`, `gap_to_leader`, `date` |
| `/stints?session_key={sk}` | Every 30s | `driver_number`, `compound`, `lap_start`, `lap_end`, `stint_number`, `tyre_age_at_start` |
| `/race_control?session_key={sk}` | Every 30s | `category`, `flag`, `message`, `driver_number`, `lap_number`, `date` |

---

## Activation logic

On every circuit page load:

1. Fetch `/sessions?session_key=latest`
2. Compare `session.circuit_short_name` against the current track's slug/name
3. Determine state:

```javascript
// State machine
const sessionStart = new Date(session.date_start);
const sessionEnd = session.date_end ? new Date(session.date_end) : null;
const now = new Date();
const hoursSinceEnd = sessionEnd ? (now - sessionEnd) / 3600000 : Infinity;

if (circuitMatches) {
  if (sessionEnd && now > sessionEnd && hoursSinceEnd < 48) state = 'active'; // replay
  else if (now >= sessionStart && (!sessionEnd || now <= sessionEnd)) state = 'active'; // live
  else if (now < sessionStart) state = 'awaiting';
} else {
  state = 'dormant';
}
```

**Three states:**
- **Dormant:** No relevant session. Page unchanged. Zero fetches after session check.
- **Awaiting:** Session scheduled, no data yet. Subtle "Session detected, awaiting data..." indicator.
- **Active:** Data available. All components render. Polling loop running.

---

## UI components

All contextual overlays: injected when Active, removed from DOM when Dormant. Never hidden with CSS.

### 1. Position Tower (left edge)

**Desktop (~200px wide, left of circuit content):**
- 20 rows sorted by position
- Per row: position number | team-color bar (3px left border, `team_colour` hex) | 3-letter abbreviation (`name_acronym`) | interval (gap to car ahead)
- `gap_to_leader` shown on hover/toggle
- Purple highlight on fastest lap holder
- Collapsible (dismiss preference in localStorage)

**Mobile (≤600px):**
- Horizontal strip above circuit map
- Abbreviated: position + team-color dot + 3-letter code + interval
- Top 5 default, expandable

### 2. Race Control Ticker (bottom ribbon)

**Full width, fixed bottom, single line, chronological.**

Color coding (using existing tokens):
- Yellow flag: `var(--active)` / `oklch(80% 0.16 85)`
- Red flag / SC: `var(--red)`
- Green / DRS: `var(--done)`
- Other: `var(--muted)`

Auto-scrolls to latest. User can scroll back. Tap/hover expands full message + lap number.

**Mobile:** Same ribbon, horizontal touch-scroll.

### 3. Tyre Strategy Strip (expandable)

**Horizontal bar chart per driver showing stint history.**

Compound colors:
- Soft: `#FF3333`
- Medium: `#FFD700`
- Hard: `#FFFFFF` (with border)
- Intermediate: `#39B54A`
- Wet: `#0072C6`

Block width proportional to stint length. Current stint highlighted. Stop count shown. Top 10 default, expandable.

**Mobile:** Hidden by default. "Strategy" toggle button reveals as full-width panel.

---

## Polling behavior

- **Interval:** 30 seconds
- **Opt-in:** Only starts when state = active. Dormant pages make ONE fetch and stop.
- **Individual failure:** Each endpoint fails independently. Panel shows "Data unavailable", others continue.
- **Stale detection:** 3 consecutive identical position data → reduce to 5-min checks, show "Session ended".
- **Cleanup on navigation:** Kill interval, remove DOM, revoke state when leaving circuit page.

---

## API wrapper

```javascript
const F1_API = 'https://api.openf1.org/v1';

const liveApi = {
  session: () => fetch(`${F1_API}/sessions?session_key=latest`).then(r => r.ok ? r.json() : []),
  drivers: (sk) => fetch(`${F1_API}/drivers?session_key=${sk}`).then(r => r.ok ? r.json() : []),
  positions: (sk) => fetch(`${F1_API}/position?session_key=${sk}`).then(r => r.ok ? r.json() : []),
  intervals: (sk) => fetch(`${F1_API}/intervals?session_key=${sk}`).then(r => r.ok ? r.json() : []),
  stints: (sk) => fetch(`${F1_API}/stints?session_key=${sk}`).then(r => r.ok ? r.json() : []),
  raceControl: (sk) => fetch(`${F1_API}/race_control?session_key=${sk}`).then(r => r.ok ? r.json() : []),
};
```

All fetches return empty arrays on failure. No throws.

---

## Utility functions

```javascript
function latestPerDriver(items) {
  const map = {};
  for (const item of items) {
    const key = item.driver_number;
    if (!map[key] || item.date > map[key].date) map[key] = item;
  }
  return map;
}

function formatInterval(val) {
  if (val === null) return 'LEADER';
  if (typeof val === 'string') return val; // "+1 LAP"
  return '+' + val.toFixed(3);
}
```

---

## Visual integration

- Use existing design tokens (oklch palette, --red, --surface, --line, --muted)
- Same border-radius, font-family (IBM Plex Mono for data, Space Grotesk for labels)
- Team colors from API `team_colour` field (hex), converted inline
- Dark theme inherited. No theme toggle.
- Position tower + ticker use same panel/surface hierarchy as existing cards

---

## Offline / file:// behavior

- Live layer requires network. Offline = dormant (activation check fails gracefully).
- No localStorage for live data (stale session data would be confusing).
- Only localStorage: "dismiss tower" preference.
- Circuit breakdown works perfectly offline as always.

---

## Graceful degradation

If OpenF1 disappears entirely:
1. Session check fails/returns empty → dormant
2. Live layer never activates
3. Circuit page is exactly v5: map, elevation, DRS, sectors, weather, strategy
4. Zero errors, zero broken UI

---

## Agent instructions

1. Read the semantic source files via `source/source_index.md` (entry point).
2. Create `source/12_live_session_layer.js` containing: API wrapper, activation logic, polling loop, all three component renderers (position tower, race control ticker, tyre strip), cleanup functions.
3. Extend `source/09_app_bootstrap_and_home.js`: in the `router()` function, after `renderTrack(bySlug[slug])`, call `initLiveLayer(bySlug[slug])`. On home navigation, call `teardownLiveLayer()`.
4. Append live-layer CSS to `source/03_styles_panels_tables_footer.css.txt` (or create `source/03b_styles_live_layer.css.txt` if appending would exceed ~15KB).
5. Bump `APP_VERSION` to `"v6"` and `APP_DATE` to ship date.
6. Test: circuit page with no matching session = unchanged. Circuit page with recent session = components render. API failure = graceful per-panel degradation. Mobile 320px = no overflow.
7. Deliver complete modified source as a ClickUp artifact. Do NOT commit (file >30KB).

### Do NOT
- Touch the existing TRACKS data array or circuit breakdown rendering
- Add ES module imports (must work from file://)
- Use external libraries (no D3 for this, vanilla only)
- Cache live data in localStorage
- Add telemetry (speed/gear/RPM) — explicitly out of scope
- Add championship standings — v7 territory
- Poll when state is dormant

---

## Acceptance criteria

- [ ] Circuit page with NO matching session → completely unchanged, zero fetches after session check
- [ ] Circuit page WITH recent session (< 48h) → live layer activates, all 3 components render
- [ ] Position tower: 20 drivers, sorted by position, team colors, intervals displayed
- [ ] Race control ticker: color-coded messages, chronological, auto-scroll
- [ ] Tyre strategy strip: compound colors, stint boundaries, top 10 default
- [ ] API down / 404 → per-panel "unavailable" state, page doesn't break
- [ ] Mobile 320px → position strip horizontal, ticker visible, tyre behind toggle
- [ ] Offline / `file://` → live layer dormant, circuit breakdown normal
- [ ] Session ended → polling reduces to 5-min, indicator shown
- [ ] Desktop breakdown layout unchanged when dormant
- [ ] Navigate away → polling stopped, DOM cleaned
- [ ] `APP_VERSION` = `"v6"`

---

## Standing rules (apply to ALL apps)

- Mobile-first: no horizontal overflow at 320px, touch targets ≥44px, safe-area insets.
- Single self-contained HTML. All CSS/JS inline. No backend.
- Offline-first for core features. Live features degrade gracefully.
- Blob on click only for downloads, never parked in DOM.
- Pre-ship Syntax Gate + Runtime/Sandbox Gate before delivery.

---

## Futures (v7, not this build)

- Championship progression chart (scrub through season)
- Driver head-to-head comparison
- Historical replay selection (pick any 2023-2026 session)
- Points-per-race visualization
- Qualifying vs race pace deltas
- Separate route (`#/season`), not a circuit-page overlay

---

## References

- OpenF1 docs: https://openf1.org/docs/
- ClickUp doc: "OpenF1 API — Available Data Variables" (Formula 1 space)
- Inspiration: https://github.com/chandra23225/f1-multiviewer (vanilla JS, same API)
- Planning notes: `f1-racetracks/v6-7-planning-spec.md` (verbose session transcript)
