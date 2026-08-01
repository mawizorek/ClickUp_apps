/* 08_season.js - THE SEASON DERIVATION LAYER (new 2026-08-01).

   WHY THIS FILE EXISTS. Round numbers, weekend status, the short display date and the
   current/last round pointers used to be STORED, by hand, in two different files that
   disagreed with each other. The 2026 mid-season cancellation of Bahrain and Saudi Arabia
   silently invalidated one of those numberings for eight months and nobody noticed, because
   the only thing keeping the app working was a note telling every consumer to join by slug
   instead. Michael, 2026-08-01: "rounds and order and index are backend and just need to be
   flexible for per year changes but also mid year... more data in the display should be
   derivable, especially if it has to do with state or time tracking."

   WHAT IT DOES. Loads the static vectors and derives everything time-shaped:

     WEEKENDS  season/<year>/index_weekends.json  - the calendar (one row per race weekend)
     CIRCUITS  circuits/index_circuits.json       - a slug -> file map of timeless identity
     SEATS     season/<year>/index_drivers.json   - driver x team x season
     COLOURS   ../shared/themes/colors.tsv        - the SHARED colour vector (v16, see below)

     round                     = position in date order (1-based)
     status                    = done / active / pending, from the session-date window
     date                      = "04 Oct", formatted from the ISO race date
     current_round_slug        = first weekend whose race date >= today
     last_completed_round_slug = last weekend whose race date < today

   Cancel a round, insert a round, move a date: every derived value self-heals on the next
   boot. Nothing is hand-maintained and nothing can drift.

   NEVER PERSIST A DERIVED ORDINAL. Not in a filename you are about to create, not in a
   ClickUp task title, not in a cached note. Inserting one round shifts every round after it.
   The stable handles are `slug` and `cuTaskId`.

   THE `active` WINDOW (ruled 2026-08-01, Decision Log J9 ruling 3): a weekend is active from
   00:00 on its FIRST session date to 23:59 on its RACE date, in the CIRCUIT'S OWN TIMEZONE -
   so a weekend flips live on Friday morning at the track, not at midnight wherever the viewer
   happens to be. Two passes, one implementation: this module derives a zone-less baseline (the
   circuit files are not loaded yet), and module 09 re-derives per track via statusFor() once
   the circuit's `tz` is merged.

   THE SEAT VECTOR (2026-08-01, J10). `seatFor()` resolves a driver's short display name, which
   used to be computed by splitting the display string on whitespace.

   === THE COLOUR VECTOR SWITCH (v16, 2026-08-01, Decision Log J15) ===

   Michael: "make the vector switch so any change to a 'mclaren' vector effects the colors as it
   is used to render an object or gradient."

   Team colour used to live in FIVE places (J14): this app's seat register, two base.css files,
   a third copy inside story-mode-reference.html, and the eleven shared/themes/f1/*.json
   palettes - none of which was the canonical grid sitting above all of them. They disagreed on
   every team, and on Alpine they disagreed in KIND: cyan on one screen, pink on another.

   Now: this module fetches `shared/themes/colors.tsv` - THE canonical 4-vector colour grid -
   parses the eleven team rows, and injects three custom properties per team onto :root:

     --t-<team>         accent       the identity tone
     --t-<team>-2       accent-2     the SECOND GRADIENT STOP
     --t-<team>-deep    accent-deep  the pressed / depth tone

   Both consumers now resolve from that one source. CSS keeps reading `var(--t-ferrari)`
   exactly as before - it just gets its value injected rather than hardcoded - and teamColor()
   reads the same parsed map. They can no longer disagree. And a real two-stop team gradient,
   `linear-gradient(var(--t-mclaren), var(--t-mclaren-2))`, is finally expressible: that pair
   is what the grid's accent/accent-2 columns were designed for and this app could never use.

   THE VAR NAMES ARE NOT THE TSV SLUGS. The stylesheets have always written --t-redbull,
   --t-racingbulls and --t-astonmartin with no hyphen, while the grid rows are `red-bull`,
   `racing-bulls`, `aston-martin`. TEAMS below maps display name -> tsv slug -> css var and is
   the ONLY place that translation lives. Renaming the vars to match the slugs would be a
   three-stylesheet rewrite for cosmetics; the map costs nothing.

   ONE ROW IS DELIBERATELY SWAPPED. Alpine takes accent-2 (pink) as its identity and accent
   (blue) as its second stop - Michael delegated the choice ("you design it"). Blue is the most
   crowded hue here: Williams #4a7ac8, Racing Bulls #4a52b0, and Alpine's own accent #4f9fe0 is
   byte-identical to the shared `data-1` series colour. Pink is unclaimed and is already what
   two of four surfaces render. Marked `swap: true` so it is visible, not buried.

   KNOWN, VISIBLE, AND NOT PAPERED OVER: canonical `accent` puts FOUR REDS on the board -
   ferrari #d83f38, red-bull #d5493d, audi #d0473c, haas #d0473c, the last two byte-identical.
   The accent column is a THEME accent (the actionable colour inside ONE team's theme, where
   nothing competes with it); eleven at once on a standings matrix is a use it was not designed
   for. Q15 struck the per-team override list, so an app-local exception table is exactly what
   this must not grow. The fix is now ONE LINE in a shared TSV row instead of an app change,
   which is the whole point of the switch. Michael rules on the board.

   FALLBACK ORDER for a team's colour: the TSV grid, then the seat register's `color` (the
   labelled floor), then the neutral tone WITH a one-time warning. The base.css :root blocks
   are the FIRST-PAINT floor the theme contract calls for and are overridden inline at boot.

   CONSUMERS. 12_results_store.js (round pointers), 09_app_bootstrap_and_home.js (the calendar
   + teamColor/seatFor), standings/data.js and weekend/data.js (the season join). All await
   F1Season.ready. Colour and seats are NON-BLOCKING - a failure there costs colour and short
   names, never the app.

   Loaded FIRST on every surface. Wrapped in an IIFE because the source modules are classic
   scripts sharing one global scope - the ONLY global this file adds is `window.F1Season`. */
(function () {
  'use strict';

  var YEAR = '2026';
  var WEEKENDS_URL = 'season/' + YEAR + '/index_weekends.json';
  var DRIVERS_URL = 'season/' + YEAR + '/index_drivers.json';
  var CIRCUIT_INDEX_URL = 'circuits/index_circuits.json';
  var COLORS_TSV_URL = '../shared/themes/colors.tsv';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* The neutral tone an unresolved team falls back to. Unchanged since before the vector
     switch, so a total colour outage looks exactly like the old unresolved state. */
  var NEUTRAL_TONE = '#D7DCE4';

  /* display name (as written in every classification row) -> tsv slug -> css var suffix.
     `swap` inverts accent/accent-2 for that team; Alpine is the only one, see the header. */
  var TEAMS = [
    { team: 'Mercedes',     slug: 'mercedes',     cssVar: 'mercedes' },
    { team: 'Ferrari',      slug: 'ferrari',      cssVar: 'ferrari' },
    { team: 'McLaren',      slug: 'mclaren',      cssVar: 'mclaren' },
    { team: 'Red Bull',     slug: 'red-bull',     cssVar: 'redbull' },
    { team: 'Racing Bulls', slug: 'racing-bulls', cssVar: 'racingbulls' },
    { team: 'Williams',     slug: 'williams',     cssVar: 'williams' },
    { team: 'Alpine',       slug: 'alpine',       cssVar: 'alpine', swap: true },
    { team: 'Aston Martin', slug: 'aston-martin', cssVar: 'astonmartin' },
    { team: 'Audi',         slug: 'audi',         cssVar: 'audi' },
    { team: 'Haas',         slug: 'haas',         cssVar: 'haas' },
    { team: 'Cadillac',     slug: 'cadillac',     cssVar: 'cadillac' }
  ];

  var teamTones = {};
  var teamStops = {};
  var seatsById = {};
  var warnedTeams = {};
  var colourSource = 'none';

  /* ---------- time-shaped derivation ---------- */

  /* Sorted ISO date strings for a weekend. First = weekend opens, last = the race. */
  function sessionDates(w) {
    return (w && Array.isArray(w.sessions) ? w.sessions : [])
      .map(function (s) { return s && s.date; })
      .filter(Boolean)
      .slice()
      .sort();
  }

  /* "2026-10-04" -> "04 Oct". Pure string work: no Date parsing, so no UTC off-by-one. */
  function shortDate(iso) {
    var parts = String(iso || '').split('-');
    if (parts.length < 3) return '';
    var month = MONTHS[Number(parts[1]) - 1];
    return month ? parts[2] + ' ' + month : '';
  }

  /* Today as YYYY-MM-DD in an IANA zone. en-CA formats that way natively. An unknown or
     absent zone falls back to the viewer's own, which is the honest default. */
  function todayIn(tz) {
    var opts = { year: 'numeric', month: '2-digit', day: '2-digit' };
    if (tz) opts.timeZone = tz;
    try {
      return new Intl.DateTimeFormat('en-CA', opts).format(new Date());
    } catch (err) {
      return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    }
  }

  /* done / active / pending from the weekend window, in the track's zone when known. */
  function statusFor(firstDate, raceDate, tz) {
    if (!firstDate || !raceDate) return 'pending';
    var today = todayIn(tz);
    if (today < firstDate) return 'pending';
    if (today > raceDate) return 'done';
    return 'active';
  }

  /* ---------- the colour vector ---------- */

  /* Minimal TSV reader: the header row supplies column names, every later row becomes an
     object. No quoting rules - this grid has none, and inventing a parser for a format that
     does not use them is how you get a parser bug instead of a colour bug. */
  function parseTSV(text) {
    var lines = String(text || '').split(/\r?\n/).filter(function (l) { return l.trim() !== ''; });
    if (lines.length < 2) return [];
    var head = lines[0].split('\t');
    return lines.slice(1).map(function (line) {
      var cells = line.split('\t');
      var row = {};
      head.forEach(function (key, i) { row[key.trim()] = (cells[i] || '').trim(); });
      return row;
    });
  }

  /* Inject one team's three stops as custom properties on :root, and register the identity
     tone for teamColor(). Called per team, so a grid missing one row costs that team only. */
  function injectTeam(entry, row, rootStyle) {
    var primary = entry.swap ? row['accent-2'] : row.accent;
    var second = entry.swap ? row.accent : row['accent-2'];
    var deep = row['accent-deep'];
    if (!primary) return false;

    rootStyle.setProperty('--t-' + entry.cssVar, primary);
    if (second) rootStyle.setProperty('--t-' + entry.cssVar + '-2', second);
    if (deep) rootStyle.setProperty('--t-' + entry.cssVar + '-deep', deep);

    teamTones[entry.team] = primary;
    teamStops[entry.team] = { tone: primary, stop2: second || null, deep: deep || null };
    return true;
  }

  /* Read the shared grid and wire every team from it. Returns how many teams resolved. */
  function absorbColourVector(text) {
    var rows = parseTSV(text);
    if (!rows.length) return 0;
    var bySlug = rows.reduce(function (acc, r) { if (r.slug) acc[r.slug] = r; return acc; }, {});
    var rootStyle = document.documentElement.style;
    var resolved = 0;
    TEAMS.forEach(function (entry) {
      var row = bySlug[entry.slug];
      if (row && injectTeam(entry, row, rootStyle)) resolved++;
      else console.warn('[F1Season] colour vector has no row for "' + entry.slug + '" - falling back for ' + entry.team + '.');
    });
    return resolved;
  }

  /* The seat register's colours are the FLOOR, not a source: used only for a team the grid
     did not supply, so the two can never silently disagree. */
  function absorbSeatFallback(payload) {
    if (!payload) return;
    (payload.teams || []).forEach(function (t) {
      if (t && t.team && t.color && !teamTones[t.team]) {
        teamTones[t.team] = t.color;
        console.warn('[F1Season] "' + t.team + '" resolved from the seat-register FLOOR, not the shared colour vector. Its grid row is missing or unreachable.');
      }
    });
    (payload.seats || []).forEach(function (s) {
      if (s && s.driverId) seatsById[s.driverId] = s;
    });
  }

  /* A team's identity tone. Never fails silently: an unknown team warns once. */
  function teamColor(team) {
    var key = String(team || '');
    var tone = teamTones[key];
    if (tone) return tone;
    if (key && !warnedTeams[key]) {
      warnedTeams[key] = true;
      console.warn('[F1Season] no colour for team "' + key + '" - neutral tone. Add a row to shared/themes/colors.tsv and map it in 08_season.js TEAMS.');
    }
    return NEUTRAL_TONE;
  }

  /* All three stops for a team: { tone, stop2, deep }. For a caller building a gradient or a
     pressed state in JS. CSS should read the custom properties directly instead. */
  function teamStopsFor(team) {
    return teamStops[String(team || '')] || null;
  }

  /* Ready-made two-stop team gradient. The accent/accent-2 pair is what the grid's gradient
     columns are for, and it was unusable while colour lived in a one-hex-per-team map. */
  function teamGradient(team, angle) {
    var s = teamStops[String(team || '')];
    if (!s || !s.stop2) return teamColor(team);
    return 'linear-gradient(' + (angle == null ? '135deg' : angle) + ', ' + s.tone + ', ' + s.stop2 + ')';
  }

  /* The season seat for a driverId: { driverId, driver, short, team }. Null when unknown - a
     caller that gets null falls back to what the classification row already carries. */
  function seatFor(driverId) {
    return seatsById[String(driverId || '')] || null;
  }

  /* ---------- assembly ---------- */

  function derive(payload) {
    var rows = (payload && Array.isArray(payload.weekends) ? payload.weekends : []).slice();

    rows.forEach(function (w) {
      var dates = sessionDates(w);
      w.firstDate = dates[0] || null;
      w.raceDate = dates[dates.length - 1] || null;
    });

    /* Date order IS round order. A row with no dates sorts last rather than throwing. */
    rows.sort(function (a, b) {
      return String(a.raceDate || '9999-99-99').localeCompare(String(b.raceDate || '9999-99-99'));
    });

    rows.forEach(function (w, i) {
      w.round = i + 1;
      w.date = shortDate(w.raceDate);
      w.status = statusFor(w.firstDate, w.raceDate, null);
    });

    var today = todayIn(null);
    var upcoming = rows.filter(function (w) { return w.raceDate && w.raceDate >= today; });
    var completed = rows.filter(function (w) { return w.raceDate && w.raceDate < today; });

    return {
      season: YEAR,
      weekends: rows,
      bySlug: rows.reduce(function (acc, w) { acc[w.slug] = w; return acc; }, {}),
      current_round_slug: upcoming.length ? upcoming[0].slug : null,
      last_completed_round_slug: completed.length ? completed[completed.length - 1].slug : null
    };
  }

  function getJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error(url + ' ' + res.status);
      return res.json();
    });
  }

  function getText(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error(url + ' ' + res.status);
      return res.text();
    });
  }

  /* Colour and seats are NON-BLOCKING by design: they are display sugar, the calendar is the
     app. Neither rejection may take the boot with it. */
  var coloursPromise = getText(COLORS_TSV_URL).catch(function (err) {
    console.error('[F1Season] shared colour vector unreachable - team colours fall back to the seat-register floor.', err);
    return null;
  });

  var seatsPromise = getJSON(DRIVERS_URL).catch(function (err) {
    console.error('[F1Season] seat vector unavailable - short names fall back.', err);
    return null;
  });

  var ready = Promise.all([getJSON(WEEKENDS_URL), getJSON(CIRCUIT_INDEX_URL), seatsPromise, coloursPromise])
    .then(function (all) {
      var calendar = derive(all[0]);
      var index = all[1] || {};

      /* Colour vector FIRST, then the seat register - so the register can only ever fill a
         gap the grid left, never overwrite it. The ORDER is the whole guarantee here. */
      var resolved = all[3] ? absorbColourVector(all[3]) : 0;
      colourSource = resolved === TEAMS.length ? 'vector' : (resolved > 0 ? 'vector+floor' : 'floor');
      absorbSeatFallback(all[2]);

      /* slug -> circuit file path. A weekend with no circuit file is NOT an error: the
         calendar is the calendar whether or not the layout data has been dug yet. */
      calendar.circuitFile = (index.circuits || []).reduce(function (acc, c) {
        if (c && c.slug && c.file) acc[c.slug] = c.file;
        return acc;
      }, {});
      calendar.seats = seatsById;
      calendar.teamTones = teamTones;
      calendar.teamStops = teamStops;
      calendar.colourSource = colourSource;
      return calendar;
    });

  window.F1Season = {
    ready: ready,
    statusFor: statusFor,
    shortDate: shortDate,
    todayIn: todayIn,
    teamColor: teamColor,
    teamStops: teamStopsFor,
    teamGradient: teamGradient,
    seatFor: seatFor,
    colourSource: function () { return colourSource; }
  };
})();
