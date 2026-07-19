/* dashboard.js — pure render off a Day (spec §6). Bold instrument dashboard, NOT a card wall.
   Design laws honored: no side-stripe borders, no boxed-card-per-item, no hero-metric template.
   Hierarchy from scale/weight/surface/space, not from outlining everything. Factual voice;
   redundant sign + WORD encoding (colorblind-safe); the big number's color is DATA-driven
   (warm above normal / cool below), meaningful not decorative. */
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
  function pickVar(k) { return VARS.filter(function (x) { return x.key === k; })[0] || VARS[0]; }

  var MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function prettyDate(iso) {
    if (!iso) return "";
    var p = iso.split("-"); if (p.length < 3) return iso;
    return MON[(+p[1] - 1) % 12] + " " + (+p[2]) + ", " + p[0];
  }

  /* ---- DEPARTURE GAUGE: eyebrow (place + date) + huge data-colored number + word, the
     distribution fused in as its baseline with a legible legend, then a quiet credibility
     footnote. One block, no border, no card. ---- */
  function departure(day, activeVarKey) {
    var w = day.weather, v = pickVar(activeVarKey), loc = day.location || {};
    var a = w.anomaly ? w.anomaly[v.key] : null;
    var dir = a == null ? "flat" : (a > 0 ? "up" : (a < 0 ? "down" : "flat"));
    var today = w.today ? w.today[v.key] : null, normal = w.normal ? w.normal[v.key] : null;
    var sp = w.spread ? w.spread[v.key] : null;

    var dist = "";
    if (sp && sp.min != null && sp.max != null) {
      var lo = sp.min, hi = sp.max, range = (hi - lo) || 1;
      var pct = function (x) { return Math.max(0, Math.min(100, ((x - lo) / range) * 100)); };
      var tPct = today != null ? pct(today) : null, nPct = normal != null ? pct(normal) : null;
      var fillL = null, fillW = null;
      if (tPct != null && nPct != null) { fillL = Math.min(tPct, nPct); fillW = Math.abs(tPct - nPct); }
      dist =
        '<div class="rc-dist">' +
          '<div class="rc-dist-bar">' +
            (fillL != null ? '<span class="rc-dist-fill" style="left:' + fillL + '%;width:' + fillW + '%"></span>' : "") +
            (nPct != null ? '<span class="rc-dist-normal" style="left:' + nPct + '%"></span>' : "") +
            (tPct != null ? '<span class="rc-dist-today" style="left:' + tPct + '%"></span>' : "") +
          '</div>' +
          '<div class="rc-dist-ends"><span>' + fmt(lo, v.unit) + '</span><span>' + fmt(hi, v.unit) + '</span></div>' +
          '<div class="rc-dist-legend">' +
            '<span class="rc-lg rc-lg-today">today ' + fmt(today, v.unit) + '</span>' +
            '<span class="rc-lg rc-lg-normal">normal ' + fmt(normal, v.unit) + '</span>' +
            '<span class="rc-lg-cap">' + esc(v.label.toLowerCase()) + ' · 30-year range for this day</span>' +
          '</div>' +
        '</div>';
    }

    var n = w.normal ? w.normal.sampleYears : null, by = w.baselineYears || {};
    var cred = [];
    if (n != null) cred.push(n + " yrs " + by.start + "\u2013" + by.end);
    cred.push("ERA5"); cred.push("as of " + esc(day.date));
    if (day.stale) cred.push("cached");

    var eyebrow = esc(loc.name || "");
    if (day.date) eyebrow += '<span class="rc-dep-date">' + esc(prettyDate(day.date)) + '</span>';

    return '<section class="rc-departure" data-dir="' + dir + '">' +
      '<div class="rc-dep-eyebrow">' + eyebrow + '</div>' +
      '<div class="rc-dep-read">' +
        '<span class="rc-dep-num">' + signed(a) + '</span>' +
        '<span class="rc-dep-unit">' + esc(v.unit) + '</span>' +
        '<span class="rc-dep-word">' + esc(word(a)) + '</span>' +
      '</div>' +
      dist +
      '<div class="rc-dep-cred">' + cred.join(" \u00b7 ") + '</div>' +
    '</section>';
  }

  /* ---- INSTRUMENT STAT STRIP: key figures as a cluster on ONE panel, hairline-divided cells
     (no per-cell border, no rail). Record hi/lo carry a subtle direction tint. Sparse-safe. ---- */
  function stats(day) {
    var w = day.weather, r = w.records || {}, t = w.twin, cells = [];
    function cell(label, val, sub, tone) {
      return '<div class="rc-stat' + (tone ? ' rc-stat-' + tone : '') + '"><div class="rc-stat-lab">' + esc(label) + '</div>' +
        '<div class="rc-stat-val">' + esc(val) + '</div>' +
        '<div class="rc-stat-sub">' + esc(sub == null ? "" : sub) + '</div></div>';
    }
    if (r.recordHigh != null) cells.push(cell("Record high", r.recordHigh + "\u00b0", r.recordHighYear || "", "up"));
    if (r.recordLow != null)  cells.push(cell("Record low", r.recordLow + "\u00b0", r.recordLowYear || "", "down"));
    if (t && t.year)          cells.push(cell("Closest match", t.year, "most like today"));
    if (w.normal && w.normal.sampleYears != null) cells.push(cell("Sample", w.normal.sampleYears, "years on record"));
    if (!cells.length) return "";
    return '<section class="rc-stats">' + cells.join("") + '</section>';
  }

  /* ---- variable selector (segmented control) ---- */
  function varToggle(activeVarKey) {
    return '<div class="rc-vartoggle" role="tablist">' + VARS.map(function (v) {
      return '<button class="rc-seg' + (v.key === activeVarKey ? " on" : "") + '" role="tab" aria-selected="' + (v.key === activeVarKey) + '" data-var="' + v.key + '">' + esc(v.label) + '</button>';
    }).join("") + '</div>';
  }

  /* ---- ON THIS DAY: a dense FEED, not a card grid. Hairline rows, mono year + text, no boxes,
     no rails. Holidays = inline chips. Staggered reveal. Sparse day reads as designed. ---- */
  function almanac(day) {
    var al = day.almanac;
    if (!al) return '<section class="rc-alm"><h2 class="rc-h2">On this day</h2><p class="muted rc-loading">Reading the record\u2026</p></section>';
    function feed(label, items) {
      if (!items || !items.length) return "";
      var rows = items.slice(0, 8).map(function (e, i) {
        return '<li class="rc-row" style="--i:' + i + '"><span class="rc-row-yr">' + esc(e.year || "") + '</span>' +
          '<span class="rc-row-tx">' + esc(e.text) + '</span></li>';
      }).join("");
      return '<div class="rc-alm-sec"><h3 class="rc-alm-h">' + esc(label) + '</h3><ul class="rc-feed">' + rows + '</ul></div>';
    }
    var out = "";
    if (al.holidays && al.holidays.length) {
      out += '<div class="rc-alm-sec"><h3 class="rc-alm-h">Holidays &amp; observances</h3><div class="rc-chips">' +
        al.holidays.slice(0, 10).map(function (h) { return '<span class="rc-chip-lite">' + esc(h.text || h.name) + '</span>'; }).join("") + '</div></div>';
    }
    out += feed("Historical events", al.events);
    out += feed("Born", al.births);
    out += feed("Died", al.deaths);
    if (!out) out = '<p class="muted rc-alm-empty">A quiet day. Nothing notable in the record for this date.</p>';
    return '<section class="rc-alm">' +
      '<div class="rc-alm-top"><h2 class="rc-h2">On this day</h2><span class="rc-alm-note">notable per Wikipedia · English-centric</span></div>' +
      out + '</section>';
  }

  window.Dashboard = { departure: departure, stats: stats, varToggle: varToggle, almanac: almanac };
})();
