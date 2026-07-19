/* graph.js — the unified “you are here in history” chart, hand-rolled inline SVG (no Chart.js/D3).
   ZOOMED: renders only a focused SPAN of days (default 3: focus-1 / focus / focus+1) from the wide
   in-memory series, so the app can chevron day-by-day with no refetch. Each of the 3 columns is a
   real calendar day, dated on the x-axis.

   AXES: x = the focused day window; y = standardized anomaly (σ from this-day normal). Zero = normal.
   Because every variable is in σ, the ±1σ / ±2σ shaded bands ARE the shared historical ghost
   envelope for all five at once. Realized days (offset ≤ 0) draw solid; forecast (offset ≥ 0) dashed;
   joined at today. The emphasized variable rides on top with labeled value points. */
(function () {
  var W = 760, H = 380, L = 46, R = 18, T = 26, B = 46, ZMAX = 3.5;
  var INW = W - L - R, INH = H - T - B;
  var MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function dp(n) { return Math.round(n * 10) / 10; }
  function shortDate(iso) { var p = (iso || "").split("-"); return p.length < 3 ? iso : MON[(+p[1] - 1) % 12] + " " + (+p[2]); }

  function render(series, opts) {
    opts = opts || {};
    var span = opts.span || 3, half = Math.floor(span / 2);
    var focus = opts.focus == null ? 0 : opts.focus;
    var emphasis = opts.emphasis || (series.vars[0] && series.vars[0].key);

    var offAll = series.offsets;
    var slice = offAll.filter(function (o) { return o >= focus - half && o <= focus + half; });
    var minO = slice[0], maxO = slice[slice.length - 1];
    var winMap = {}; series.window.forEach(function (r) { winMap[r.offset] = r; });

    function x(o) { return slice.length <= 1 ? dp(L + INW / 2) : dp(L + (o - minO) / (maxO - minO) * INW); }
    function y(z) { return dp(T + (ZMAX - z) / (2 * ZMAX) * INH); }
    function idxOf(o) { return offAll.indexOf(o); }

    var parts = [];
    parts.push('<svg class="rc-graph" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Standardized weather anomaly, ' + span + '-day focus">');

    // bands (ghost envelope)
    parts.push('<rect class="rc-g-band2" x="' + L + '" y="' + y(2) + '" width="' + INW + '" height="' + dp(y(-2) - y(2)) + '"/>');
    parts.push('<rect class="rc-g-band1" x="' + L + '" y="' + y(1) + '" width="' + INW + '" height="' + dp(y(-1) - y(1)) + '"/>');

    // gridlines + y labels
    [2, 1, 0, -1, -2].forEach(function (z) {
      var yy = y(z);
      parts.push('<line class="' + (z === 0 ? "rc-g-zero" : "rc-g-grid") + '" x1="' + L + '" y1="' + yy + '" x2="' + (W - R) + '" y2="' + yy + '"/>');
      parts.push('<text class="rc-g-ylab" x="' + (L - 8) + '" y="' + dp(yy + 3) + '" text-anchor="end">' + (z === 0 ? "normal" : (z > 0 ? "+" : "") + z + "\u03c3") + '</text>');
    });

    // per-day vertical guide + date labels; today gets the emphasized marker line
    slice.forEach(function (o) {
      var xx = x(o), row = winMap[o] || {}, isToday = o === 0;
      parts.push('<line class="' + (isToday ? "rc-g-today" : "rc-g-daytick") + '" x1="' + xx + '" y1="' + T + '" x2="' + xx + '" y2="' + (H - B) + '"/>');
      parts.push('<text class="rc-g-xlab' + (isToday ? ' is-today' : '') + '" x="' + xx + '" y="' + (H - B + 18) + '" text-anchor="middle">' + esc(shortDate(row.date)) + '</text>');
      if (isToday) parts.push('<text class="rc-g-todaylab" x="' + xx + '" y="' + (T - 10) + '" text-anchor="middle">TODAY</text>');
    });

    function pts(arr) { return arr.map(function (p) { return x(p.o) + "," + y(p.z); }).join(" "); }
    function collect(vo, which) {
      var out = [];
      slice.forEach(function (o) { var i = idxOf(o); var z = vo[which][i]; if (z != null) out.push({ o: o, z: z, i: i }); });
      return out;
    }

    var order = series.vars.slice().sort(function (a, b) { return (a.key === emphasis ? 1 : 0) - (b.key === emphasis ? 1 : 0); });
    order.forEach(function (vo) {
      var isEmp = vo.key === emphasis;
      var cls = "rc-g-line rc-g-" + vo.key + (isEmp ? " is-emph" : " is-dim");
      var real = collect(vo, "zActual"), fore = collect(vo, "zForecast");
      var zi = idxOf(0);
      if (fore.length && zi >= 0 && vo.zActual[zi] != null && slice.indexOf(0) >= 0) fore.unshift({ o: 0, z: vo.zActual[zi], i: zi });
      if (real.length > 1) parts.push('<polyline class="' + cls + ' rc-g-real" points="' + pts(real) + '"/>');
      if (fore.length > 1) parts.push('<polyline class="' + cls + ' rc-g-fore" points="' + pts(fore) + '"/>');
      // markers: emphasized var on every slice day, dimmed vars only get a small dot
      var allPts = real.concat(fore);
      allPts.forEach(function (p) {
        var isToday = p.o === 0;
        var raw = (vo.rawActual[p.i] != null ? vo.rawActual[p.i] : vo.rawForecast[p.i]);
        var t = vo.label + " " + esc(shortDate((winMap[p.o] || {}).date)) + ": " + (raw == null ? "\u2014" : raw + vo.unit) + " (" + (p.z > 0 ? "+" : "") + p.z + "\u03c3)";
        var rr = isEmp ? (isToday ? 6 : 5) : (isToday ? 4 : 3);
        parts.push('<circle class="rc-g-dot rc-g-' + vo.key + (isToday ? ' is-today' : '') + (isEmp ? ' is-emph' : ' is-dim') + '" cx="' + x(p.o) + '" cy="' + y(p.z) + '" r="' + rr + '"><title>' + t + '</title></circle>');
        if (isEmp && raw != null) {
          var above = p.z >= 0;
          parts.push('<text class="rc-g-ptlab" x="' + x(p.o) + '" y="' + dp(y(p.z) + (above ? -12 : 18)) + '" text-anchor="middle">' + esc(raw + vo.unit) + '</text>');
        }
      });
    });

    parts.push('</svg>');
    return parts.join("");
  }

  window.Graph = { render: render };
})();
