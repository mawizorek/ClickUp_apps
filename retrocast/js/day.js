/* day.js — assembles the unified Day SERIES. Everything the dashboard binds to comes from ONE
   normalized shape so all five variables share a single graph. Core idea: plot STANDARDIZED
   ANOMALY (σ from each variable's own this-day normal), so °F / inches / mph become comparable
   and the ±1σ band is the shared historical envelope.

   Window: offsets PAST..FUTURE around today's LOCAL date, fetched WIDE so the 3-day zoom can
   chevron across weeks with NO refetch (the whole span lives in memory; the graph renders a slice).
   Left of/at today = realized (forecast endpoint past_days actuals); right = forecast. Deep history
   (per-calendar-day normal + sd) from the ARCHIVE endpoint. Two-endpoint truth kept.
   Honesty: sampleYears travels with the series; raw values kept for the readout; sd floored per var. */
(function () {
  var PAST = 30, FUTURE = 14; // wide fetch = free day-stepping within these bounds
  var VARS = [
    { key: "tempHigh", label: "High",  unit: "\u00b0F", di: "temperature_2m_max", floor: 1.5 },
    { key: "tempLow",  label: "Low",   unit: "\u00b0F", di: "temperature_2m_min", floor: 1.5 },
    { key: "precip",   label: "Precip",unit: "in",       di: "precipitation_sum", floor: 0.15 },
    { key: "wind",     label: "Wind",  unit: "mph",      di: "wind_speed_10m_max", floor: 2 },
    { key: "snow",     label: "Snow",  unit: "in",       di: "snowfall_sum", floor: 0.3 }
  ];
  var CLAMP = 3.4;

  function localDate(tz) {
    try { return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
    catch (e) { return new Date().toISOString().slice(0, 10); }
  }
  function offsetDate(iso, off) {
    var p = iso.split("-"); var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], 12));
    d.setUTCDate(d.getUTCDate() + off);
    return d.toISOString().slice(0, 10);
  }
  function mean(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
  function sd(a, m) {
    if (a.length < 2 || m == null) return null;
    var s = a.reduce(function (t, x) { return t + (x - m) * (x - m); }, 0) / (a.length - 1);
    return Math.sqrt(s);
  }
  function round(n, d) { if (n == null || isNaN(n)) return null; var f = Math.pow(10, d || 1); return Math.round(n * f) / f; }
  function clampZ(z) { return z == null ? null : Math.max(-CLAMP, Math.min(CLAMP, z)); }

  function indexArchive(series) {
    var map = {};
    if (!series || !series.time) return map;
    for (var i = 0; i < series.time.length; i++) {
      var mmdd = series.time[i].slice(5);
      if (!map[mmdd]) { map[mmdd] = {}; VARS.forEach(function (v) { map[mmdd][v.di] = []; }); }
      VARS.forEach(function (v) { var val = (series[v.di] || [])[i]; if (val != null) map[mmdd][v.di].push(val); });
    }
    return map;
  }
  function indexForecast(fc) {
    var map = {};
    if (!fc || !fc.time) return map;
    for (var i = 0; i < fc.time.length; i++) {
      map[fc.time[i]] = {};
      VARS.forEach(function (v) { map[fc.time[i]][v.di] = (fc[v.di] || [])[i]; });
    }
    return map;
  }

  function twinYear(series, mmdd, todayHi, todayLo) {
    if (!series || !series.time || todayHi == null || todayLo == null) return null;
    var hi = series.temperature_2m_max || [], lo = series.temperature_2m_min || [], best = null;
    for (var i = 0; i < series.time.length; i++) {
      if (series.time[i].slice(5) !== mmdd || hi[i] == null || lo[i] == null) continue;
      var dd = Math.abs(hi[i] - todayHi) + Math.abs(lo[i] - todayLo);
      if (!best || dd < best.d) best = { year: +series.time[i].slice(0, 4), d: dd };
    }
    return best ? best.year : null;
  }

  function buildSeries(loc) {
    var today = localDate(loc.tz);
    var thisYear = +today.slice(0, 4), startYear = thisYear - 30, endYear = thisYear - 1;

    return Promise.all([
      Providers.forecastWindow(loc, PAST, FUTURE).catch(function () { return null; }),
      Providers.archiveSeries(loc, startYear, endYear).catch(function () { return null; })
    ]).then(function (res) {
      var fc = res[0], arch = res[1];
      var aMap = indexArchive(arch), fMap = indexForecast(fc);

      var offsets = [], windowRows = [];
      for (var o = -PAST; o <= FUTURE; o++) offsets.push(o);

      var varsOut = VARS.map(function (v) {
        return { key: v.key, label: v.label, unit: v.unit, floor: v.floor,
          normal: [], sd: [], zActual: [], zForecast: [], rawActual: [], rawForecast: [] };
      });

      offsets.forEach(function (o) {
        var d = offsetDate(today, o), mmdd = d.slice(5), isFuture = d > today;
        windowRows.push({ offset: o, date: d, mmdd: mmdd, isFuture: isFuture });
        VARS.forEach(function (v, vi) {
          var vals = (aMap[mmdd] && aMap[mmdd][v.di]) || [];
          var m = round(mean(vals), 2), s = round(sd(vals, mean(vals)), 3);
          varsOut[vi].normal.push(m); varsOut[vi].sd.push(s);
          var fval = fMap[d] ? fMap[d][v.di] : null;
          var raw = (fval == null ? null : round(fval, 2));
          var z = (raw != null && m != null && s != null) ? clampZ((raw - m) / Math.max(s, v.floor)) : null;
          if (isFuture) { varsOut[vi].rawForecast.push(raw); varsOut[vi].zForecast.push(z == null ? null : round(z, 2)); varsOut[vi].rawActual.push(null); varsOut[vi].zActual.push(null); }
          else { varsOut[vi].rawActual.push(raw); varsOut[vi].zActual.push(z == null ? null : round(z, 2)); varsOut[vi].rawForecast.push(null); varsOut[vi].zForecast.push(null); }
        });
      });

      var mmdd0 = today.slice(5);
      var sampleYears = (aMap[mmdd0] && aMap[mmdd0].temperature_2m_max) ? aMap[mmdd0].temperature_2m_max.length : null;

      var series = {
        date: today, location: loc, offsets: offsets, window: windowRows, vars: varsOut,
        bounds: { minFocus: -PAST + 1, maxFocus: FUTURE - 1 },
        meta: { sampleYears: sampleYears, start: startYear, end: endYear, stale: (!fc && !arch), hasArchive: !!arch, hasForecast: !!fc, archive: arch }
      };
      // analog for today (snapshot uses per-focus, but the header caption anchors on today)
      var t0 = snapshotAt(series, 0);
      series.analog = twinYear(arch, mmdd0, t0.perVar.tempHigh.value, t0.perVar.tempLow.value);
      return series;
    });
  }

  /* Extract a per-variable snapshot for ANY focused offset in the window (drives the chevron nav:
     headline + readout reflect the centered day, not just today). */
  function snapshotAt(series, offset) {
    var idx = series.offsets.indexOf(offset);
    if (idx < 0) idx = series.offsets.indexOf(0);
    var row = series.window[idx] || { date: series.date, isFuture: false };
    var perVar = {}, headline = null;
    series.vars.forEach(function (vo) {
      var raw = vo.rawActual[idx]; if (raw == null) raw = vo.rawForecast[idx];
      var z = vo.zActual[idx]; if (z == null) z = vo.zForecast[idx];
      var m = vo.normal[idx];
      var dev = (raw != null && m != null) ? round(raw - m, 1) : null;
      perVar[vo.key] = { value: raw, normal: m, sd: vo.sd[idx], z: z, dev: dev, unit: vo.unit, label: vo.label };
      if (z != null && (!headline || Math.abs(z) > Math.abs(headline.z))) headline = { key: vo.key, label: vo.label, z: z, dev: dev, value: raw, normal: m, unit: vo.unit };
    });
    return { offset: offset, date: row.date, isFuture: row.isFuture, perVar: perVar, headline: headline };
  }

  window.DayModel = { buildSeries: buildSeries, snapshotAt: snapshotAt, VARS: VARS, localDate: localDate, PAST: PAST, FUTURE: FUTURE };
})();
