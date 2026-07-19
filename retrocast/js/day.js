/* day.js — assembles the unified Day object (spec §5). UI binds ONLY to this shape,
   no matter the underlying source. Storage tiers (spec §4): read OUR durable floor
   (data/<slug>/baseline.tsv) FIRST for normal/spread/records, then live-fetch only the
   gaps — today's value (FORECAST endpoint) + the archive series for the weather twin.
   Cache fronts it all and is the outage fallback. Honesty is load-bearing: sampleYears
   travels with every normal so a sparse day reports its true confidence, never fakes it. */
(function () {
  var VARS = [
    { key: "tempHigh", label: "High temp", unit: "\u00b0F", di: "temperature_2m_max", col: "tempHigh" },
    { key: "tempLow",  label: "Low temp",  unit: "\u00b0F", di: "temperature_2m_min", col: "tempLow" },
    { key: "precip",   label: "Precip",    unit: "in",       di: "precipitation_sum", col: "precip" },
    { key: "wind",     label: "Wind",      unit: "mph",      di: "wind_speed_10m_max", col: "wind" },
    { key: "snow",     label: "Snowfall",  unit: "in",       di: "snowfall_sum", col: "snow" }
  ];

  // The LOCATION's local date drives the whole object (spec §7), not the browser's.
  function localDate(tz) {
    try {
      return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    } catch (e) { return new Date().toISOString().slice(0, 10); }
  }
  function mean(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
  function round(n, d) { if (n == null || isNaN(n)) return null; var f = Math.pow(10, d || 1); return Math.round(n * f) / f; }
  function num(s) { if (s == null || s === "") return null; var n = parseFloat(s); return isNaN(n) ? null : n; }

  /* ---- TIER 1: durable floor. Parse the committed baseline.tsv row for this mmdd. ---- */
  function statsFromBaseline(tsvText, mmdd) {
    if (!tsvText) return null;
    var lines = tsvText.split(/\r?\n/).filter(function (l) { return l && l[0] !== "#"; });
    if (lines.length < 2) return null;
    var head = lines[0].split("\t");
    var col = {}; head.forEach(function (h, i) { col[h] = i; });
    for (var r = 1; r < lines.length; r++) {
      var cells = lines[r].split("\t");
      if (cells[col.mmdd] !== mmdd) continue;
      var normal = {}, spread = {};
      VARS.forEach(function (v) {
        normal[v.key] = num(cells[col[v.col + "_normal"]]);
        var mn = num(cells[col[v.col + "_min"]]), mx = num(cells[col[v.col + "_max"]]);
        spread[v.key] = (mn != null && mx != null) ? { min: mn, max: mx } : null;
      });
      normal.sampleYears = num(cells[col.sampleYears]);
      var records = {
        recordHigh: num(cells[col.recordHigh]), recordHighYear: num(cells[col.recordHighYear]),
        recordLow: num(cells[col.recordLow]), recordLowYear: num(cells[col.recordLowYear])
      };
      return { normal: normal, spread: spread, records: records };
    }
    return null; // mmdd not in file (shouldn't happen for a full 366-row baseline)
  }

  /* ---- TIER 2 fallback: compute this-day stats live from a multi-year archive series. ---- */
  function statsFromArchive(series, mmdd) {
    if (!series || !series.time) return null;
    var idx = [];
    for (var i = 0; i < series.time.length; i++) if (series.time[i].slice(5) === mmdd) idx.push(i);
    var normal = {}, spread = {}, records = {};
    VARS.forEach(function (v) {
      var c = series[v.di] || [];
      var vals = idx.map(function (k) { return c[k]; }).filter(function (x) { return x != null; });
      normal[v.key] = round(mean(vals), 1);
      if (vals.length) {
        var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
        spread[v.key] = { min: round(lo, 1), max: round(hi, 1) };
        if (v.key === "tempHigh") { records.recordHigh = round(hi, 1); records.recordHighYear = yearOf(series, idx, c, hi); }
        if (v.key === "tempLow")  { records.recordLow  = round(lo, 1); records.recordLowYear  = yearOf(series, idx, c, lo); }
      } else spread[v.key] = null;
    });
    normal.sampleYears = idx.length;
    return { normal: normal, spread: spread, records: records };
  }
  function yearOf(series, idx, col, target) {
    for (var j = 0; j < idx.length; j++) if (col[idx[j]] === target) return +series.time[idx[j]].slice(0, 4);
    return null;
  }

  /* Weather twin: past year whose this-day high+low best matches today (spec Q12). Needs the series. */
  function findTwin(series, mmdd, today) {
    if (!series || !series.time || !today) return null;
    var best = null, hi = series.temperature_2m_max || [], lo = series.temperature_2m_min || [];
    for (var i = 0; i < series.time.length; i++) {
      if (series.time[i].slice(5) !== mmdd || hi[i] == null || lo[i] == null) continue;
      var d = Math.abs(hi[i] - today.tempHigh) + Math.abs(lo[i] - today.tempLow);
      if (!best || d < best.score) best = { year: +series.time[i].slice(0, 4), score: round(d, 1) };
    }
    return best;
  }

  function pick(daily) {
    if (!daily) return null;
    var o = {};
    VARS.forEach(function (v) { var arr = daily[v.di] || []; o[v.key] = round(arr[arr.length - 1], 1); });
    return o;
  }

  function loadBaseline(slug) {
    return fetch("./data/" + slug + "/baseline.tsv", { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw 0; return r.text(); })
      .catch(function () { return null; }); // no committed baseline yet = fine, archive covers it
  }

  /* Assemble the full Day. Baseline floor is preferred for stats; archive is twin + stats fallback. */
  function build(loc) {
    var date = localDate(loc.tz);
    var mmdd = date.slice(5);
    var thisYear = +date.slice(0, 4);
    var cached = Store.getCached(loc.slug, mmdd);
    var startYear = thisYear - 30, endYear = thisYear - 1;

    return Promise.all([
      Providers.forecastToday(loc).catch(function () { return null; }),
      loadBaseline(loc.slug),
      Providers.archiveSeries(loc, startYear, endYear).catch(function () { return null; })
    ]).then(function (res) {
      var fc = res[0], baselineText = res[1], arch = res[2];
      var today = fc ? pick(fc) : (cached && cached.day.weather.today) || null;

      // Tier 1 (baseline file) preferred; Tier 2 (live archive) fills in; cache is last resort.
      var stats = statsFromBaseline(baselineText, mmdd)
        || (arch ? statsFromArchive(arch, mmdd) : null)
        || (cached && { normal: cached.day.weather.normal, spread: cached.day.weather.spread, records: cached.day.weather.records })
        || null;
      var source = statsFromBaseline(baselineText, mmdd) ? "baseline" : (arch ? "archive" : (cached ? "cache" : null));

      var twin = arch ? findTwin(arch, mmdd, today) : (cached && cached.day.weather.twin) || null;

      var anomaly = {};
      if (today && stats && stats.normal) {
        VARS.forEach(function (v) {
          if (today[v.key] != null && stats.normal[v.key] != null) anomaly[v.key] = round(today[v.key] - stats.normal[v.key], 1);
        });
      }

      var day = {
        date: date,
        location: loc,
        weather: {
          today: today,
          normal: stats ? stats.normal : null,
          spread: stats ? stats.spread : null,
          records: stats ? stats.records : null,
          anomaly: anomaly,
          twin: twin,
          baselineYears: { start: startYear, end: endYear },
          source: source
        },
        almanac: null, // hydrated separately (shared MM-DD feed)
        stale: !fc && !arch && !baselineText
      };
      if (today || stats) Store.setCached(loc.slug, mmdd, day);
      return day;
    });
  }

  window.DayModel = { build: build, VARS: VARS, localDate: localDate };
})();
