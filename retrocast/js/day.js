/* day.js — assembles the unified Day object (spec §5). UI binds ONLY to this shape,
   no matter the underlying source. Reads cache first (Store), live-fetches the gaps,
   writes the merged result back to cache. Honesty is load-bearing: sampleYears travels
   with every normal so a sparse day reports its true confidence, never fakes it. */
(function () {
  var VARS = [
    { key: "tempHigh", label: "High temp", unit: "\u00b0F", di: "temperature_2m_max" },
    { key: "tempLow",  label: "Low temp",  unit: "\u00b0F", di: "temperature_2m_min" },
    { key: "precip",   label: "Precip",    unit: "in",       di: "precipitation_sum" },
    { key: "wind",     label: "Wind",      unit: "mph",      di: "wind_speed_10m_max" },
    { key: "snow",     label: "Snowfall",  unit: "in",       di: "snowfall_sum" }
  ];

  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  // The LOCATION's local date drives the whole object (spec §7), not the browser's.
  function localDate(tz) {
    try {
      var parts = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
      return parts; // YYYY-MM-DD
    } catch (e) { return new Date().toISOString().slice(0, 10); }
  }
  function mean(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
  function round(n, d) { if (n == null) return null; var f = Math.pow(10, d || 1); return Math.round(n * f) / f; }

  /* Build the this-day statistics from a multi-year archive series. */
  function statsForDay(series, mmdd) {
    if (!series || !series.time) return null;
    var idx = [];
    for (var i = 0; i < series.time.length; i++) {
      if (series.time[i].slice(5) === mmdd) idx.push(i);
    }
    var normal = {}, spread = {}, records = {}, sampleYears = idx.length;
    VARS.forEach(function (v) {
      var col = series[v.di] || [];
      var vals = idx.map(function (k) { return col[k]; }).filter(function (x) { return x != null; });
      var m = mean(vals);
      normal[v.key] = round(m, 1);
      if (vals.length) {
        var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
        spread[v.key] = { min: round(lo, 1), max: round(hi, 1) };
        if (v.key === "tempHigh") { records.recordHigh = round(hi, 1); records.recordHighYear = yearOf(series, idx, col, hi); }
        if (v.key === "tempLow")  { records.recordLow  = round(lo, 1); records.recordLowYear  = yearOf(series, idx, col, lo); }
      } else { spread[v.key] = null; }
    });
    normal.sampleYears = sampleYears;
    return { normal: normal, spread: spread, records: records };
  }
  function yearOf(series, idx, col, target) {
    for (var j = 0; j < idx.length; j++) { if (col[idx[j]] === target) return +series.time[idx[j]].slice(0, 4); }
    return null;
  }

  /* Weather twin: the past year whose this-day high+low best matches today (spec §2 Q12). */
  function findTwin(series, mmdd, today) {
    if (!series || !series.time || !today) return null;
    var best = null;
    var hi = series.temperature_2m_max || [], lo = series.temperature_2m_min || [];
    for (var i = 0; i < series.time.length; i++) {
      if (series.time[i].slice(5) !== mmdd) continue;
      var y = +series.time[i].slice(0, 4);
      if (hi[i] == null || lo[i] == null) continue;
      var d = Math.abs(hi[i] - today.tempHigh) + Math.abs(lo[i] - today.tempLow);
      if (!best || d < best.score) best = { year: y, score: round(d, 1) };
    }
    return best;
  }

  function pick(daily, keyIndex) {
    if (!daily) return null;
    var o = {};
    VARS.forEach(function (v) { var arr = daily[v.di] || []; o[v.key] = round(arr[keyIndex != null ? keyIndex : arr.length - 1], 1); });
    return o;
  }

  /* Assemble the full Day for a location. endYear defaults to (thisYear-1) since ERA5 lags. */
  function build(loc) {
    var date = localDate(loc.tz);
    var mmdd = date.slice(5);
    var thisYear = +date.slice(0, 4);
    var cached = Store.getCached(loc.slug, mmdd);
    var startYear = thisYear - 30, endYear = thisYear - 1;

    return Promise.all([
      Providers.forecastToday(loc).catch(function () { return null; }),
      Providers.archiveSeries(loc, startYear, endYear).catch(function () { return null; })
    ]).then(function (res) {
      var fc = res[0], arch = res[1];
      var today = fc ? pick(fc) : (cached && cached.day.weather.today) || null;
      var stats = arch ? statsForDay(arch, mmdd) : (cached && { normal: cached.day.weather.normal, spread: cached.day.weather.spread, records: cached.day.weather.records });
      var twin = arch ? findTwin(arch, mmdd, today) : (cached && cached.day.weather.twin);

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
          baselineYears: { start: startYear, end: endYear }
        },
        almanac: null, // hydrated separately (shared MM-DD feed)
        stale: !fc && !arch
      };
      if (today || stats) Store.setCached(loc.slug, mmdd, day);
      return day;
    });
  }

  window.DayModel = { build: build, VARS: VARS, localDate: localDate };
})();
