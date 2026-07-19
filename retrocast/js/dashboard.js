/* dashboard.js — pure render off the day.js SERIES. The graph is the centerpiece; everything
   else supports it. Factual voice. All five variables are visible AT ONCE (the graph + the
   readout card), so there is no click-through-one-at-a-time. Legend = emphasis control, not a
   filter (nothing is hidden). Score removed; weather-twin demoted to a small analog caption. */
(function () {
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function sgn(n, d) { if (n == null) return "\u2014"; var v = (d != null ? n.toFixed(d) : n); return (n > 0 ? "+" : "") + v; }
  function fmt(n, u) { return n == null ? "\u2014" : n + (u || ""); }
  function dir(z) { return z == null ? "flat" : (z > 0.15 ? "up" : (z < -0.15 ? "down" : "flat")); }

  var MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function prettyDate(iso) { var p = (iso || "").split("-"); return p.length < 3 ? iso : MON[(+p[1] - 1) % 12] + " " + (+p[2]) + ", " + p[0]; }

  /* ---- headline: name today's standout variable (the honest “was today weird” answer) ---- */
  function headline(s) {
    var loc = s.location || {}, h = s.headline;
    var eyebrow = '<div class="rc-eyebrow">' + esc(loc.name || "") + '<span class="rc-eyebrow-d">' + esc(prettyDate(s.date)) + '</span></div>';
    if (!h) return '<section class="rc-head">' + eyebrow + '<h1 class="rc-lead-line">No live reading available.</h1></section>';
    if (Math.abs(h.z) < 1) {
      return '<section class="rc-head" data-dir="flat">' + eyebrow +
        '<h1 class="rc-lead-line">Close to normal across the board today.</h1>' +
        '<p class="rc-lead-sub">Nothing more than 1\u03c3 off the 30-year normal for this date.</p></section>';
    }
    return '<section class="rc-head" data-dir="' + dir(h.z) + '">' + eyebrow +
      '<h1 class="rc-lead-line">' + esc(h.label) + ' is today\u2019s standout: <b>' + sgn(h.z, 1) + '\u03c3</b></h1>' +
      '<p class="rc-lead-sub">' + fmt(h.value, h.unit) + ' against ' + fmt(h.normal, h.unit) + ' normal · ' + sgn(h.dev) + h.unit + ' departure</p></section>';
  }

  /* ---- graph + legend (emphasis control) ---- */
  function graph(s, emphasis) { return '<div class="rc-graph-wrap">' + Graph.render(s, { emphasis: emphasis }) + '</div>'; }

  function legend(s, emphasis) {
    var caption = s.analog ? '<span class="rc-analog">closest analog: <b>' + esc(s.analog) + '</b></span>' : "";
    return '<div class="rc-legend-row">' +
      '<div class="rc-legend" role="tablist" aria-label="Emphasize variable">' +
      s.vars.map(function (v) {
        var on = v.key === emphasis;
        return '<button class="rc-leg rc-g-' + v.key + (on ? " on" : "") + '" role="tab" aria-selected="' + on + '" data-var="' + v.key + '">' +
          '<span class="rc-leg-dot"></span>' + esc(v.label) + '</button>';
      }).join("") + '</div>' + caption + '</div>' +
      '<p class="rc-graph-note">solid = realized · dashed = forecast · band = ±1σ / ±2σ historical range for each day</p>';
  }

  /* ---- deviation readout: every variable's real numbers as data points below the graph ---- */
  function readout(s) {
    var rows = s.vars.map(function (v) {
      var t = s.today[v.key] || {}, z = t.z, d = dir(z);
      var barPct = z == null ? 50 : Math.max(2, Math.min(98, 50 + (z / 3.5) * 48));
      var bar = '<span class="rc-dv-track"><span class="rc-dv-zero"></span>' +
        (z == null ? "" : '<span class="rc-dv-fill" data-dir="' + d + '" style="' + (z >= 0 ? 'left:50%;width:' + (barPct - 50) + '%' : 'left:' + barPct + '%;width:' + (50 - barPct) + '%') + '"></span>') +
        '</span>';
      return '<div class="rc-dv" data-dir="' + d + '">' +
        '<span class="rc-dv-key rc-g-' + v.key + '"><span class="rc-leg-dot"></span>' + esc(v.label) + '</span>' +
        '<span class="rc-dv-val">' + fmt(t.value, v.unit) + '</span>' +
        '<span class="rc-dv-norm">/ ' + fmt(t.normal, v.unit) + '</span>' +
        bar +
        '<span class="rc-dv-sigma">' + (z == null ? "\u2014" : sgn(z, 1) + "\u03c3") + '</span>' +
      '</div>';
    }).join("");
    var m = s.meta || {};
    var cred = [];
    if (m.sampleYears != null) cred.push(m.sampleYears + " yrs " + m.start + "\u2013" + m.end);
    cred.push("ERA5 · forecast"); cred.push("as of " + esc(s.date));
    if (m.stale) cred.push("cached");
    return '<section class="rc-readout">' +
      '<div class="rc-readout-head"><span>today</span><span>normal</span><span>departure</span><span>\u03c3</span></div>' +
      rows +
      '<p class="rc-readout-cred">' + cred.join(" \u00b7 ") + '</p></section>';
  }

  /* ---- ON THIS DAY: dense feed (unchanged model) ---- */
  function almanac(al) {
    if (!al) return '<section class="rc-alm"><h2 class="rc-h2">On this day</h2><p class="muted rc-loading">Reading the record\u2026</p></section>';
    function feed(label, items) {
      if (!items || !items.length) return "";
      var rows = items.slice(0, 8).map(function (e, i) {
        return '<li class="rc-row" style="--i:' + i + '"><span class="rc-row-yr">' + esc(e.year || "") + '</span><span class="rc-row-tx">' + esc(e.text) + '</span></li>';
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
    return '<section class="rc-alm"><div class="rc-alm-top"><h2 class="rc-h2">On this day</h2><span class="rc-alm-note">notable per Wikipedia · English-centric</span></div>' + out + '</section>';
  }

  window.Dashboard = { headline: headline, graph: graph, legend: legend, readout: readout, almanac: almanac };
})();
