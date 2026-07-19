/* providers.js — thin adapters over the free, keyless, CORS-ready sources (spec §3).
   Each returns normalized fragments; day.js assembles them into the Day object.
   TWO-ENDPOINT TRUTH: today = FORECAST endpoint, history = ARCHIVE endpoint. Never blur.
   All sources: Open-Meteo (CC BY 4.0), Wikimedia, Nager.Date. */
(function () {
  var GEO   = "https://geocoding-api.open-meteo.com/v1/search";
  var ARCH  = "https://archive-api.open-meteo.com/v1/archive";
  var FCAST = "https://api.open-meteo.com/v1/forecast";
  var WIKI  = "https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all";
  var NAGER = "https://date.nager.at/api/v4/Holidays";

  var DAILY = ["temperature_2m_max","temperature_2m_min","precipitation_sum","wind_speed_10m_max","snowfall_sum"];

  function getJSON(url) {
    return fetch(url, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }

  /* ---- geocoding: returns a LIST to disambiguate duplicates (spec §7) ---- */
  function geocode(query) {
    var u = GEO + "?name=" + encodeURIComponent(query) + "&count=8&language=en&format=json";
    return getJSON(u).then(function (d) {
      return (d.results || []).map(function (r) {
        return {
          name: r.name + (r.admin1 ? ", " + r.admin1 : "") + (r.country_code ? ", " + r.country_code : ""),
          slug: (r.name + "-" + (r.admin1 || r.country_code || "")).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          lat: r.latitude, lng: r.longitude, tz: r.timezone, country: r.country_code
        };
      });
    });
  }

  /* ---- today's value: FORECAST endpoint (covers today + recent days archive lags) ---- */
  function forecastToday(loc) {
    var u = FCAST + "?latitude=" + loc.lat + "&longitude=" + loc.lng +
      "&daily=" + DAILY.join(",") +
      "&timezone=" + encodeURIComponent(loc.tz) +
      "&past_days=7&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch";
    return getJSON(u).then(function (d) { return d.daily || null; });
  }

  /* ---- history: ARCHIVE endpoint (ERA5, ~5-day lag). Pull a multi-year daily
     series so day.js can compute the this-day normal, spread, records, twin. ---- */
  function archiveSeries(loc, startYear, endYear) {
    var start = startYear + "-01-01";
    var end = endYear + "-12-31";
    var u = ARCH + "?latitude=" + loc.lat + "&longitude=" + loc.lng +
      "&start_date=" + start + "&end_date=" + end +
      "&daily=" + DAILY.join(",") +
      "&timezone=" + encodeURIComponent(loc.tz) +
      "&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch";
    return getJSON(u).then(function (d) { return d.daily || null; });
  }

  /* ---- "on this day": Wikimedia feed, keyed MM/DD only (fetch once, shared) ---- */
  function onThisDay(mm, dd) {
    var u = WIKI + "/" + mm + "/" + dd;
    return getJSON(u).then(function (d) {
      function trim(arr, n) { return (arr || []).slice(0, n).map(function (e) { return { year: e.year, text: e.text || (e.pages && e.pages[0] && e.pages[0].title) }; }); }
      return {
        events: trim(d.events, 40),
        births: trim(d.births, 40),
        deaths: trim(d.deaths, 40),
        holidays: (d.holidays || []).slice(0, 20).map(function (e) { return { text: e.text }; })
      };
    });
  }

  /* ---- public holidays by country + year (Nager) ---- */
  function holidays(country, year) {
    return getJSON(NAGER + "/" + year + "/" + country).then(function (list) {
      return (list || []).map(function (h) { return { date: h.date, name: h.localName || h.name, mmdd: (h.date || "").slice(5) }; });
    });
  }

  window.Providers = {
    geocode: geocode,
    forecastToday: forecastToday,
    archiveSeries: archiveSeries,
    onThisDay: onThisDay,
    holidays: holidays,
    DAILY: DAILY
  };
})();
