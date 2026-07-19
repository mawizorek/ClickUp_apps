/* dashboard.js — pure render functions off a Day object (spec §6). No fetching here.
   Factual, meteorologist-serious voice: no injected wit. Redundant encoding
   (sign + WORD, never color alone) for the departure read (colorblind-safe). */
(function () {
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function signed(n) { if (n == null) return "\u2014"; return (n > 0 ? "+" : "") + n; }
  function word(n) {
    if (n == null) return "no baseline";
    if (Math.abs(n) < 1) return "right on normal";
    return n > 0 ? "warmer than normal" : "cooler than normal";
  }
  function fmt(n, unit) { return n == null ? "\u2014" : n + (unit || ""); }

  var VARS = (window.DayModel && DayModel.VARS) || [];

  /* ---- 1. departure hero (NEW library object: stat_hero_departure) ---- */
  function hero(day, activeVarKey) {
    var w = day.weather, v = VARS.filter(function (x) { return x.key === activeVarKey; })[0] || VARS[0];
    var a = w.anomaly ? w.anomaly[v.key] : null;
    var dir = a == null ? "flat" : (a > 0 ? "up" : (a < 0 ? "down" : "flat"));
    var today = w.today ? w.today[v.key] : null;
    var normal = w.normal ? w.normal[v.key] : null;
    return '<section class="rc-hero" data-dir="' + dir + '">' +
      '<div class="rc-hero-metric"><span class="rc-hero-num">' + signed(a) + '</span>' +
      '<span class="rc-hero-unit">' + esc(v.unit) + '</span></div>' +
      '<div class="rc-hero-word">' + esc(word(a)) + '</div>' +
      '<div class="rc-hero-sub">Today ' + fmt(today, v.unit) + ' vs. ' + fmt(normal, v.unit) + ' normal \u00b7 ' + esc(v.label.toLowerCase()) + '</div>' +
      '</section>';
  }

  /* ---- 2. credibility line (honest "as of" + sample size, spec §6.3) ---- */
  function credibility(day) {
    var w = day.weather, n = w.normal ? w.normal.sampleYears : null;
    var by = w.baselineYears || {};
    var bits = [];
    if (n != null) bits.push("based on " + n + " years (" + by.start + "\u2013" + by.end + ")");
    bits.push("ERA5 reanalysis");
    bits.push("as of " + esc(day.date));
    if (day.stale) bits.push("cached \u2014 live data unavailable");
    return '<p class="rc-cred muted">' + bits.join(" \u00b7 ") + '</p>';
  }

  /* ---- 3. this-day range band (NEW library object: viz_range_band) ---- */
  function band(day, activeVarKey) {
    var w = day.weather, v = VARS.filter(function (x) { return x.key === activeVarKey; })[0] || VARS[0];
    var sp = w.spread ? w.spread[v.key] : null;
    var today = w.today ? w.today[v.key] : null, normal = w.normal ? w.normal[v.key] : null;
    if (!sp) return '<section class="card"><h3>This day, historically</h3><p class="muted">No historical spread available for ' + esc(v.label.toLowerCase()) + '.</p></section>';
    var lo = sp.min, hi = sp.max, range = (hi - lo) || 1;
    function pct(x) { return Math.max(0, Math.min(100, ((x - lo) / range) * 100)); }
    var todayPct = today != null ? pct(today) : null, normalPct = normal != null ? pct(normal) : null;
    return '<section class="card rc-band-card"><h3>This day, historically \u00b7 ' + esc(v.label) + '</h3>' +
      '<div class="rc-band">' +
        '<span class="rc-band-track"></span>' +
        (normalPct != null ? '<span class="rc-band-normal" style="left:' + normalPct + '%" title="normal"></span>' : "") +
        (todayPct != null ? '<span class="rc-band-today" style="left:' + todayPct + '%" title="today"></span>' : "") +
      '</div>' +
      '<div class="rc-band-scale"><span>' + fmt(lo, v.unit) + '</span><span>' + fmt(hi, v.unit) + '</span></div>' +
      '<div class="rc-band-key"><span><i class="k-normal"></i>normal</span><span><i class="k-today"></i>today ' + fmt(today, v.unit) + '</span></div>' +
      '</section>';
  }

  /* ---- 4. weather twin ---- */
  function twin(day) {
    var t = day.weather.twin;
    if (!t) return "";
    return '<section class="card rc-twin"><h3>Closest match</h3>' +
      '<p class="rc-twin-year">' + esc(t.year) + '</p>' +
      '<p class="muted">This day most resembles ' + esc(t.year) + ' in the record.</p></section>';
  }

  /* ---- 5. on-this-day ribbon (NEW library object: card_ribbon) ---- */
  function ribbon(day) {
    var al = day.almanac;
    if (!al) return '<section class="card"><h3>On this day</h3><p class="muted rc-loading">Loading the historical record\u2026</p></section>';
    function cards(items, kind, render) {
      if (!items || !items.length) return "";
      return '<div class="rc-rib-group"><h4>' + kind + '</h4><div class="rc-rib" tabindex="0">' +
        items.slice(0, 12).map(render).join("") + '</div></div>';
    }
    var out = "";
    out += cards(al.holidays, "Holidays &amp; observances", function (h) { return '<article class="rc-card"><p class="rc-card-b">' + esc(h.text || h.name) + '</p></article>'; });
    out += cards(al.events, "Historical events", function (e) { return '<article class="rc-card"><p class="rc-card-y">' + esc(e.year) + '</p><p class="rc-card-b">' + esc(e.text) + '</p></article>'; });
    out += cards(al.births, "Born on this day", function (e) { return '<article class="rc-card"><p class="rc-card-y">' + esc(e.year) + '</p><p class="rc-card-b">' + esc(e.text) + '</p></article>'; });
    out += cards(al.deaths, "Died on this day", function (e) { return '<article class="rc-card"><p class="rc-card-y">' + esc(e.year) + '</p><p class="rc-card-b">' + esc(e.text) + '</p></article>'; });
    if (!out) out = '<p class="muted">A quiet day \u2014 nothing notable in the record.</p>';
    return '<section class="rc-ribbon-wrap"><h2>On this day</h2><p class="muted rc-rib-note">Notable per Wikipedia \u00b7 English-centric</p>' + out + '</section>';
  }

  /* ---- variable toggle (existing object: ctl_chip) ---- */
  function varToggle(activeVarKey) {
    return '<div class="rc-vartoggle">' + VARS.map(function (v) {
      return '<button class="rc-chip' + (v.key === activeVarKey ? " on" : "") + '" data-var="' + v.key + '">' + esc(v.label) + '</button>';
    }).join("") + '</div>';
  }

  window.Dashboard = { hero: hero, credibility: credibility, band: band, twin: twin, ribbon: ribbon, varToggle: varToggle };
})();
