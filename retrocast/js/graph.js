/* graph.js — the unified “you are here in history” chart, hand-rolled inline SVG (no Chart.js/D3;
   fits the vanilla modular repo + file budget; every stroke themed from var(--token)).

   AXES:
     x = a day window (PAST .. FUTURE around today). Left of/at today = realized; right = forecast.
     y = standardized anomaly (σ from this-day normal). Zero line = normal. Because every variable is
         in σ units, the ±1σ / ±2σ shaded bands ARE the shared historical ghost envelope for all five.
   LINES: one per variable. Realized = solid (offsets ≤ 0), forecast = dashed (offsets ≥ 0), joined at
     today so the realized→expected transition is visible. Emphasized variable rides on top with points.
   Binds ONLY to the series shape from day.js. Returns an SVG string; the dashboard re-renders on
     legend click to change emphasis. Points carry <title> for native hover/readout. */
(function () {
  var W = 760, H = 380, L = 46, R = 16, T = 18, B = 44, ZMAX = 3.5;
  var INW = W - L - R, INH = H - T - B;

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function dp(n) { return Math.round(n * 10) / 10; }

  function render(series, opts) {
    opts = opts || {};
    var offs = series.offsets, minO = offs[0], maxO = offs[offs.length - 1];
    var emphasis = opts.emphasis || (series.headline && series.headline.key) || (series.vars[0] && series.vars[0].key);
    function x(o) { return dp(L + (o - minO) / (maxO - minO) * INW); }
    function y(z) { return dp(T + (ZMAX - z) / (2 * ZMAX) * INH); }

    var parts = [];
    parts.push('<svg class="rc-graph" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Standardized weather anomaly for a day window around today">');

    // bands (ghost envelope): ±2σ then ±1σ
    parts.push('<rect class="rc-g-band2" x="' + L + '" y="' + y(2) + '" width="' + INW + '" height="' + dp(y(-2) - y(2)) + '"/>');
    parts.push('<rect class="rc-g-band1" x="' + L + '" y="' + y(1) + '" width="' + INW + '" height="' + dp(y(-1) - y(1)) + '"/>');

    // gridlines + y labels
    [2, 1, 0, -1, -2].forEach(function (z) {
      var yy = y(z);
      parts.push('<line class="' + (z === 0 ? "rc-g-zero" : "rc-g-grid") + '" x1="' + L + '" y1="' + yy + '" x2="' + (W - R) + '" y2="' + yy + '"/>');
      parts.push('<text class="rc-g-ylab" x="' + (L - 8) + '" y="' + dp(yy + 3) + '" text-anchor="end">' + (z === 0 ? "normal" : (z > 0 ? "+" : "") + z + "\u03c3") + '</text>');
    });

    // today marker + realized/forecast split
    var xt = x(0);
    parts.push('<line class="rc-g-today" x1="' + xt + '" y1="' + T + '" x2="' + xt + '" y2="' + (H - B) + '"/>');
    parts.push('<text class="rc-g-todaylab" x="' + xt + '" y="' + (T - 4) + '" text-anchor="middle">TODAY</text>');

    // x labels (relative days)
    offs.forEach(function (o) {
      if (o !== minO && o !== maxO && o % 7 !== 0) return;
      if (o === 0) return; // today already labeled
      parts.push('<text class="rc-g-xlab" x="' + x(o) + '" y="' + (H - B + 16) + '" text-anchor="middle">' + (o > 0 ? "+" + o : o) + 'd</text>');
    });

    // build a polyline points string from an array of {o,z}
    function pts(arr) { return arr.map(function (p) { return x(p.o) + "," + y(p.z); }).join(" "); }
    function collect(vo, which) {
      var out = [];
      offs.forEach(function (o, i) { var z = vo[which][i]; if (z != null) out.push({ o: o, z: z, i: i }); });
      return out;
    }

    // draw non-emphasized first, emphasized last (on top)
    var order = series.vars.slice().sort(function (a, b) { return (a.key === emphasis ? 1 : 0) - (b.key === emphasis ? 1 : 0); });
    order.forEach(function (vo) {
      var isEmp = vo.key === emphasis;
      var cls = "rc-g-line rc-g-" + vo.key + (isEmp ? " is-emph" : " is-dim");
      var real = collect(vo, "zActual");
      var fore = collect(vo, "zForecast");
      // join dashed forecast to today's realized point for continuity
      var zeroIdx = offs.indexOf(0);
      if (fore.length && vo.zActual[zeroIdx] != null) fore.unshift({ o: 0, z: vo.zActual[zeroIdx], i: zeroIdx });
      if (real.length > 1) parts.push('<polyline class="' + cls + ' rc-g-real" points="' + pts(real) + '"/>');
      if (fore.length > 1) parts.push('<polyline class="' + cls + ' rc-g-fore" points="' + pts(fore) + '"/>');
      if (isEmp) {
        real.concat(fore).forEach(function (p) {
          var isToday = p.o === 0;
          var raw = (vo.rawActual[p.i] != null ? vo.rawActual[p.i] : vo.rawForecast[p.i]);
          var t = vo.label + " " + (p.o === 0 ? "today" : (p.o > 0 ? "+" + p.o + "d" : p.o + "d")) + ": " + (raw == null ? "\u2014" : raw + vo.unit) + " (" + (p.z > 0 ? "+" : "") + p.z + "\u03c3)";
          parts.push('<circle class="rc-g-dot rc-g-' + vo.key + (isToday ? ' is-today' : '') + '" cx="' + x(p.o) + '" cy="' + y(p.z) + '" r="' + (isToday ? 5 : 3) + '"><title>' + esc(t) + '</title></circle>');
        });
      }
    });

    parts.push('</svg>');
    return parts.join("");
  }

  window.Graph = { render: render };
})();
