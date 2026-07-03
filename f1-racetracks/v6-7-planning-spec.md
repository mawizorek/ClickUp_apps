# f1-racetracks v6–v7 — Planning Spec (Pre-Build Notes)

**Author:** Brain (session 2026-07-02/03)  
**Status:** PLANNING — not yet the active `next-build-spec.md`. Migrate into that file once v5 ships.  
**Depends on:** v5 (mobile-first responsive pass) must ship first.

> This file captures all research, brainstorm output, architecture decisions, and API contracts from the 2026-07-02 planning session. It is intentionally verbose so a cold agent can pick it up months from now with zero context loss. When v5 ships and this becomes the active spec, trim it to the standard `next-build-spec.md` format.

---

## Executive Summary

Add a **contextual live/replay data layer** to individual circuit pages using the OpenF1 API. When session data exists for the currently-viewed circuit, the page activates a position tower, race control ticker, and tyre strategy strip overlaid on the existing breakdown. When no data exists, the page is unchanged.

**v6 = Live Layer (the race companion).** Position tracker, intervals, tyre stints, race control ticker.  
**v7 = Season Analytics (the retrospective).** Championship progression, cross-circuit driver comparisons, historical replay selection.

---

## Architecture: Two-Layer Model

### Layer 1: Live/Replay (client-side, v6)
The app fetches directly from OpenF1's REST API during/after sessions. 30-second polling for positions, intervals, stints, race control. Ephemeral runtime data, not persisted.

### Layer 2: Cached (data.json, managed by Brain weekly)
After each race, Brain pulls final results and commits updated `data.json` via MCP as part of the weekly F1 refresh. The app falls back to this when offline or between sessions. This layer is already specced in the data separation (v5 territory) and documented in the F1 ops guide Step 4C.

### What Was Cut (GitHub Actions)
Originally considered a third layer (GitHub Action auto-committing data.json post-race). Removed because Brain's weekly refresh already does this manually in the same session, and adding a separate system creates maintenance burden with zero additional value for a single-user app.

---

## Data Source: OpenF1 API

**Base URL:** `https://api.openf1.org/v1`  
**Auth:** None for historical data (free, 2023 onwards). Paid subscription for real-time during live sessions.  
**Format:** JSON. All endpoints filterable by `session_key`, `driver_number`, `meeting_key`, date ranges.  
**CORS:** Confirmed friendly for GitHub Pages client-side fetch.  
**Full variable reference:** See ClickUp doc "OpenF1 API — Available Data Variables" in the Formula 1 space.

### v6 Endpoints (6 total, 4 polled per cycle)

#### `/sessions?session_key=latest` (cached on load)
Resolves current/recent session. Key fields: `session_key`, `session_name`, `date_start`, `date_end`, `circuit_short_name`, `meeting_key`, `year`.

#### `/drivers?session_key={sk}` (cached for session duration)
Driver roster with team colors. Key fields: `driver_number`, `full_name`, `name_acronym`, `team_name`, `team_colour` (hex RRGGBB), `headshot_url`.

#### `/position?session_key={sk}` (polled every 30s)
Timestamped position per driver. Key fields: `position`, `driver_number`, `date`.

Response is an array of ALL position updates for the entire session. Use `latestPerDriver()` utility to reduce to most-recent per driver.

#### `/intervals?session_key={sk}` (polled every 30s)
Gap to car ahead + gap to leader. Race sessions only. Key fields: `driver_number`, `interval` (seconds or "+1 LAP"), `gap_to_leader` (seconds, "+1 LAP", or null for leader), `date`.

Updates approximately every 4 seconds during live sessions.

#### `/stints?session_key={sk}` (polled every 30s)
Tyre strategy. Key fields: `driver_number`, `compound` (SOFT/MEDIUM/HARD/INTERMEDIATE/WET), `lap_start`, `lap_end`, `stint_number`, `tyre_age_at_start`.

#### `/race_control?session_key={sk}` (polled every 30s)
Official messages. Key fields: `category` (Flag/SafetyCar/Drs/Other), `flag` (GREEN/YELLOW/DOUBLE YELLOW/RED/CHEQUERED), `message` (free text), `driver_number` (if driver-specific), `lap_number`, `date`.

### Fetch Budget Per Poll Cycle
- Sessions + Drivers: cached (1 call each on load, then never again)
- Position + Intervals + Stints + Race Control: 4 calls per 30s
- Total sustained load: 4 fetches / 30 seconds = very light

---

## Activation Logic

```javascript
// On circuit page load:
// 1. Fetch /sessions?session_key=latest
// 2. Compare session.circuit_short_name against this circuit's slug/name
// 3. Determine state:

const sessionStart = new Date(session.date_start);
const sessionEnd = session.date_end ? new Date(session.date_end) : null;
const now = new Date();
const hoursSinceEnd = sessionEnd ? (now - sessionEnd) / 3600000 : Infinity;

if (session.circuit_short_name matches current circuit) {
  if (sessionEnd && now > sessionEnd && hoursSinceEnd < 48) {
    // REPLAY MODE: session ended recently, show historical data
    state = 'active';
  } else if (now >= sessionStart && (!sessionEnd || now <= sessionEnd)) {
    // LIVE MODE: session currently running
    state = 'active';
  } else if (now < sessionStart) {
    // AWAITING: session scheduled but not started
    state = 'awaiting';
  }
} else {
  state = 'dormant'; // different circuit, do nothing
}
```

### Three States
- **Dormant:** No relevant session. Page completely unchanged. Zero fetches after initial session check.
- **Awaiting:** Session scheduled for this circuit but no data flowing. Subtle indicator: "Session detected, awaiting data..."
- **Active:** Data available. Position tower, race control, tyres all rendering. Polling loop running.

---

## UI Components (v6)

All are **contextual overlays** that appear only when Active. When Dormant, these DOM elements don't exist (not hidden with CSS, not rendered at all). Injected on activation, removed on deactivation.

### 1. Position Tower (left edge, vertical strip)

**Desktop:** ~200px wide, fixed to the left of the circuit content. Inspired by F1 TV timing tower aesthetic.

**Content per row (20 drivers max):**
- Position number (P1-P20)
- Team-color bar (left border, 3px, using `team_colour` from `/drivers`)
- 3-letter driver abbreviation (`name_acronym`)
- Gap: show `interval` (gap to car ahead) by default, `gap_to_leader` on hover/toggle
- Purple highlight on the driver holding the fastest lap (compare best `lap_duration` from `/laps` if included)

**Mobile (≤600px):** Becomes a horizontal strip above the circuit map. Shows abbreviated version: position + team-color dot + 3-letter code + interval. Horizontally scrollable if needed, or condensed to top 5 with "expand" tap.

**Collapsible:** User can dismiss it. Remember preference in localStorage.

### 2. Race Control Ticker (bottom ribbon)

**Desktop:** Fixed-bottom ribbon, single line, full width. Chronological feed of race control messages.

**Color coding:**
- 🟡 Yellow flag: `oklch(80% 0.16 85)` (matches existing `--active` token)
- 🔴 Red flag / Safety Car: `var(--red)` (existing token)
- 🟢 Green flag / DRS enabled: `var(--done)` (existing token)
- ⚪ Other (penalties, warnings): `var(--muted)`

**Behavior:** Auto-scrolls to latest message. User can scroll back manually. Compact single line, shows `message` field truncated. Tap/hover expands to full message + lap number.

**Mobile:** Same bottom ribbon, single line. Touch-scroll horizontal.

### 3. Tyre Strategy Strip (expandable panel)

**Desktop:** Below or beside the position tower. Horizontal bar chart per driver showing stint history.

**Visual:** Each stint is a colored block:
- Soft: `#FF3333` (red)
- Medium: `#FFD700` (yellow/gold)
- Hard: `#FFFFFF` (white with border)
- Intermediate: `#39B54A` (green)
- Wet: `#0072C6` (blue)

Block width proportional to stint length (laps). Current stint pulsing/highlighted. Shows stop count per driver.

**Scope:** Top 10 by default. Expandable to full grid.

**Mobile:** Hidden by default. Accessible via "Strategy" toggle button near the position strip. When opened, shows as a full-width panel below the map.

---

## Polling Behavior

- **Interval:** 30 seconds (proven by F1 Multiviewer, matches OpenF1's update cadence)
- **Opt-in only:** Polling starts ONLY when live layer activates. Dormant pages make exactly ONE fetch (the session check) and stop.
- **Individual failure handling:** Any single endpoint 404/timeout → that component shows "Data unavailable" state. Others continue normally. No full-page error.
- **Stale detection:** If 3 consecutive cycles return byte-identical position data (timestamps haven't advanced), reduce polling to 5-minute checks and show "Session ended" indicator. Resume 30s polling if fresh data appears.
- **Cleanup on navigation:** When user navigates away from the circuit page (back to home), kill the interval, remove the DOM elements, revoke any state.

---

## API Wrapper (inline in single file)

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

All fetches return empty arrays on failure. No throws. Panels check array length before rendering.

---

## Utility Functions

```javascript
// Reduce timestamped array to most-recent entry per driver
function latestPerDriver(items) {
  const map = {};
  for (const item of items) {
    const key = item.driver_number;
    if (!map[key] || item.date > map[key].date) map[key] = item;
  }
  return map;
}

// Format seconds to M:SS.mmm
function formatLapTime(seconds) {
  if (!seconds) return '—:——.———';
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(3).padStart(6, '0');
  return `${m}:${s}`;
}

// Format interval for display
function formatInterval(val) {
  if (val === null) return 'LEADER';
  if (typeof val === 'string') return val; // "+1 LAP"
  return '+' + val.toFixed(3);
}
```

---

## Semantic Source Integration

When built, the live layer maps to the existing semantic source structure:

| Concern | File | Action |
|---------|------|--------|
| Live API + polling + rendering | `12_live_session_layer.js` | **NEW FILE** |
| Live layer CSS | `03_styles_panels_tables_footer.css.txt` | **APPEND** (or new `03b_styles_live_layer.css.txt` if budget exceeded) |
| Router hook (activation check) | `09_app_bootstrap_and_home.js` | **EXTEND** router function |
| Track view injection point | `10_track_views_and_profile.js` | **EXTEND** renderTrack to call live layer check |

The live layer JS is fully self-contained: it exports nothing, imports nothing (all inline). It reads the existing `TRACKS` array to match circuit slugs against `circuit_short_name`, and injects/removes DOM elements on the existing `#app` container.

---

## Graceful Degradation (No-API Scenario)

If OpenF1 disappears entirely (F1 blocks all third-party access):

1. Session check returns empty/fails → state stays `dormant`
2. Live layer never activates
3. Circuit page renders exactly as v5: map, elevation, DRS, sectors, weather, strategy notes
4. Zero errors, zero broken UI, zero visible difference
5. The app is the circuit breakdown app. The live layer is optional weather.

The existing TRACKS data (our own research, committed in data.json) has NO dependency on OpenF1. Weekly refresh pulls from FIA docs, formula1.com, BBC/ESPN — not from this API.

---

## Offline / file:// Behavior

- Live layer requires network (fetching from OpenF1). Offline = dormant state.
- No localStorage caching of live data (stale race data from a prior session would be confusing).
- The circuit breakdown works perfectly offline as always.
- The only localStorage used: user's "dismiss position tower" preference.

---

## Visual Integration Rules

- Use the **existing app's design tokens** (oklch palette, --red, --surface, --line, --muted, etc.). Do NOT import Multiviewer's tokens.
- Position tower and ticker use the same `border-radius`, `font-family` (IBM Plex Mono for data, Space Grotesk for labels), and surface hierarchy as existing panels.
- Team colors come from the API's `team_colour` field (hex), converted inline.
- Dark theme is inherited. No theme toggle.

---

## Mobile-First (inherits v5)

v5 establishes the responsive foundation. v6 components must follow:
- Position tower → horizontal strip above map at ≤600px
- Ticker → bottom ribbon stays, single line, scroll horizontal
- Tyre strip → hidden by default, toggle button reveals
- All touch targets ≥ 44px
- No horizontal overflow from live components
- `env(safe-area-inset-*)` on the ticker (bottom-fixed)

---

## v7 (Season Analytics) — Notes Only

Not specced in detail. Captured here so the ideas don't get lost:

- Championship progression chart (scrub through season, watch standings shift)
- Driver head-to-head comparison tool (select 2 drivers, compare across circuits)
- Historical race replay selection (pick any past 2023-2026 session for any circuit)
- Points-gained-per-race visualization
- Qualifying vs race pace delta charts
- Uses: `/championship_drivers`, `/championship_teams`, `/laps` (historical), plus our own `data.json`
- Likely a new route: `#/season` or a panel that lives on the home view
- NOT a circuit-page overlay (unlike v6). Separate view.

---

## Inspiration: F1 Multiviewer (github.com/chandra23225/f1-multiviewer)

Researched 2026-07-02. Vanilla HTML/CSS/JS, same OpenF1 API, MIT license. Key patterns adopted:

- **Session detection:** `api.session('latest')` + time-window check = our activation trigger
- **`latestPerDriver()` utility:** reduces position array to current state
- **30-second polling:** proven cadence, matches API update rate
- **Live vs Historical badge:** visual state indicator (we use three states instead of two)
- **P1-only telemetry:** confirmed we should SKIP telemetry (too noisy for circuit-page context)
- **Team-color left-border stripe:** adopted for position tower rows
- **Graceful error states:** per-panel loading/error, never full-page failure

What we do differently:
- Contextual (on circuit page) vs standalone dashboard
- Three states (dormant/awaiting/active) vs two (live/historical)
- No telemetry panel
- No standings panel (we have that in ClickUp)
- Integrated into existing dark theme vs separate color system
- Single self-contained HTML vs ES modules (we can't use imports, must work from file://)

---

## Acceptance Criteria (v6)

- [ ] Circuit page with NO matching session → completely unchanged, zero fetches after initial session check
- [ ] Circuit page WITH recent session (< 48h) → live layer activates, all three components render
- [ ] Position tower shows 20 drivers sorted by position with team colors and intervals
- [ ] Race control ticker shows color-coded messages in chronological order
- [ ] Tyre strategy strip shows compound colors and stint boundaries for top 10
- [ ] API down / 404 → each panel shows individual "unavailable" state, page doesn't break
- [ ] Mobile 320px → position strip horizontal, ticker visible, tyre hidden behind toggle
- [ ] Offline / `file://` → live layer dormant, circuit breakdown works normally
- [ ] After session ends → polling reduces to 5-min, "Session ended" indicator shown
- [ ] Desktop layout of existing circuit breakdown unchanged when live layer is dormant
- [ ] Navigation away from circuit → polling stopped, DOM cleaned up
- [ ] `APP_VERSION` bumped to v6

---

## Migration Instructions (for the agent converting this to `next-build-spec.md`)

1. Wait until v5 ships (APP_VERSION = v5, responsive footer verified).
2. Delete the current `next-build-spec.md` content.
3. Convert this planning spec into the standard format: source location, agent instructions (step-by-step), acceptance criteria, do-NOT list.
4. The source location will be the semantic files (especially `09_*`, `10_*`, `03_*`) plus a NEW `12_live_session_layer.js`.
5. Keep the API contracts and utility functions verbatim (copy into the spec as reference).
6. This file (`v6-7-planning-spec.md`) can remain in the repo as historical context or be deleted after migration.

---

## Related Resources

- **OpenF1 API docs:** https://openf1.org/docs/
- **ClickUp reference doc:** "OpenF1 API — Available Data Variables" (Formula 1 space)
- **F1 Ops Guide (Step 4C):** data.json refresh procedure documented
- **F1 Multiviewer source:** https://github.com/chandra23225/f1-multiviewer
- **Brain Reference (Apps/HTML Artifacts):** architecture rules, data separation pattern, standing footer standard
- **GitHub MCP Operating Standard:** commit workflow, agent identity
