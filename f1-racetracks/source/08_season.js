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
     SEATS     season/<year>/index_drivers.json   - driver x team x season, plus the team register

     round                     = position in date order (1-based)
     status                    = done / active / pending, from the session-date window
     date                      = "04 Oct", formatted from the ISO race date
     current_round_slug        = first weekend whose race date >= today
     last_completed_round_slug = last weekend whose race date < today

   Cancel a round, insert a round, move a date: every derived value self-heals on the next
   boot. Nothing is hand-maintained and nothing can drift.

   🚨 NEVER PERSIST A DERIVED ORDINAL. Not in a filename you are about to create, not in a
   ClickUp task title, not in a cached note. Inserting one round shifts every round after it.
   The stable handles are `slug` and `cuTaskId`.

   THE `active` WINDOW (ruled 2026-08-01, Decision Log J9 ruling 3): a weekend is active from
   00:00 on its FIRST session date to 23:59 on its RACE date, in the CIRCUIT'S OWN TIMEZONE -
   so a weekend flips live on Friday morning at the track, not at midnight wherever the viewer
   happens to be. Sessions are stored date-only, so the comparison is done on YYYY-MM-DD
   strings against "today" rendered in that zone. Two passes, one implementation:
     · this module derives a zone-less baseline (the circuit files are not loaded yet), and
     · module 09 re-derives per track via F1Season.statusFor() once the circuit's `tz` is merged.
   The zone-less pass can only ever be off by a few hours at a day boundary, and it is never
   the value the user sees on a circuit card.

   THE SEAT VECTOR (added 2026-08-01, Decision Log J10). `teamColor()` and `seatFor()` resolve
   the two things every surface was previously deriving from display strings: a team's colour
   (was a hand-keyed literal map inside module 09 that resolved 7 of 11 teams) and a driver's
   short name (was `name.split(/\s+/).slice(-1)`). Loaded INSIDE `ready` but behind a catch, so
   a drivers-vector failure costs colour and short names and never the app itself.

   🎨 An unresolved team colour WARNS ONCE and falls back to the neutral tone. It never fails
   silently - a silent fallback is how four teams rendered grey on this surface with nothing
   saying so. As of v15 all eleven resolve, so that warning firing now means a NEW team has
   appeared in the results data and nobody has added it to the seat vector's team register.

   ⚠️ THIS IS NOT THE ONLY TEAM-COLOUR TABLE (found v15, Decision Log J13). source/standings/
   base.css and source/weekend/base.css each declare a full --t-<team> custom-property set, and
   they disagree with the seat register on every team - on Alpine they disagree in kind (cyan
   here, pink there). Those two surfaces resolve colour through CSS and never call teamColor().
   The duplication is structural, not lazy: CSS cannot read JSON at parse time, so unifying means
   injecting the custom properties at boot from the register. That is an aesthetic change to
   seven teams and it is Michael's call. Do not "tidy" it in passing.

   CONSUMERS. 12_results_store.js (current/last round pointers) and 09_app_bootstrap_and_home.js
   (the whole calendar, plus teamTone/lastName). Both await F1Season.ready.

   Loaded FIRST in circuits.html, before 12 and 09. Everything is wrapped in an IIFE because the
   source modules are classic scripts sharing one global scope - the ONLY global this file adds
   is `window.F1Season`. */
(function () {
  'use strict';

  var YEAR = '2026';
  var WEEKENDS_URL = 'season/' + YEAR + '/index_weekends.json';
  var DRIVERS_URL = 'season/' + YEAR + '/index_drivers.json';
  var CIRCUIT_INDEX_URL = 'circuits/index_circuits.json';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* The neutral tone an unresolved team falls back to. Matches the pre-2026-08-01 behaviour
     exactly, so this change moves WHERE colour comes from without changing what renders. */
  var NEUTRAL_TONE = '#D7DCE4';

  var teamTones = {};
  var seatsById = {};
  var warnedTeams = {};

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

  /* Today as YYYY-MM-DD in an IANA zone. en-CA is the locale that formats that way natively.
     An unknown/absent zone falls back to the viewer's own, which is the honest default. */
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

  /* Team colour from the SEAT vector's team register. Returns whatever string the register
     holds - hex for seven teams, oklch() for the four resolved on 2026-08-01 (copied verbatim
     from the stylesheets rather than hand-converted; see that file's colour_format_note). Both
     are valid CSS and go straight into a style attribute.

     An unresolved team warns ONCE and takes the neutral tone. All eleven currently resolve, so
     a warning here means the results store has a team the register does not. */
  function teamColor(team) {
    var key = String(team || '');
    var tone = teamTones[key];
    if (tone) return tone;
    if (key && !warnedTeams[key]) {
      warnedTeams[key] = true;
      console.warn('[F1Season] no colour for team "' + key + '" - using the neutral tone. Add it to season/' + YEAR + '/index_drivers.json ▸ teams.');
    }
    return NEUTRAL_TONE;
  }

  /* The season seat for a driverId: { driverId, driver, short, team }. Null when unknown - a
     caller that gets null should fall back to what the classification row already carries,
     never invent one. */
  function seatFor(driverId) {
    return seatsById[String(driverId || '')] || null;
  }

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

  /* Fill the two lookup tables from the seat vector. Only truthy colours are registered, so a
     null stays a genuine miss and still trips the warning in teamColor(). */
  function absorbSeats(payload) {
    if (!payload) return;
    (payload.teams || []).forEach(function (t) {
      if (t && t.team && t.color) teamTones[t.team] = t.color;
    });
    (payload.seats || []).forEach(function (s) {
      if (s && s.driverId) seatsById[s.driverId] = s;
    });
  }

  function getJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error(url + ' ' + res.status);
      return res.json();
    });
  }

  /* The seat vector is NON-BLOCKING by design: colour and short names are display sugar, the
     calendar is the app. A rejection here must never take the whole boot with it. */
  var seatsPromise = getJSON(DRIVERS_URL).catch(function (err) {
    console.error('[F1Season] seat vector unavailable - team colours and short names fall back.', err);
    return null;
  });

  var ready = Promise.all([getJSON(WEEKENDS_URL), getJSON(CIRCUIT_INDEX_URL), seatsPromise])
    .then(function (all) {
      var calendar = derive(all[0]);
      var index = all[1] || {};
      absorbSeats(all[2]);
      /* slug -> circuit file path. A weekend with no circuit file is NOT an error: the
         calendar is the calendar whether or not the layout data has been dug yet. */
      calendar.circuitFile = (index.circuits || []).reduce(function (acc, c) {
        if (c && c.slug && c.file) acc[c.slug] = c.file;
        return acc;
      }, {});
      calendar.seats = seatsById;
      calendar.teamTones = teamTones;
      return calendar;
    });

  window.F1Season = {
    ready: ready,
    statusFor: statusFor,
    shortDate: shortDate,
    todayIn: todayIn,
    teamColor: teamColor,
    seatFor: seatFor
  };
})();
