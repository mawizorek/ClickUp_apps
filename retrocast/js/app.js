/* app.js — orchestration. Builds the unified-graph dashboard for the active location from the
   day.js SERIES, hydrates the shared MM-DD almanac, and wires switcher / legend-emphasis /
   refresh / add-location. Legend emphasis re-renders only the graph (all vars stay visible). */
(function () {
  var emphasis = null;
  var currentSeries = null;
  var almanacCache = null; // shared across locations (keyed MM-DD only)

  function q(id) { return document.getElementById(id); }

  function switcherHTML() {
    var list = Store.locations(), active = Store.activeSlug();
    return '<div class="rc-switch" role="tablist" aria-label="Location">' +
      list.map(function (l) {
        return '<button class="rc-loc' + (l.slug === active ? " on" : "") + '" role="tab" aria-selected="' + (l.slug === active) + '" data-slug="' + l.slug + '">' + l.name + '</button>';
      }).join("") +
      '<button class="rc-loc rc-addbtn" data-add="1" aria-label="Add location">+</button>' +
      '</div>';
  }

  function skeleton() {
    return '<section class="page rc-page">' +
      '<div id="rcSwitch">' + switcherHTML() + '</div>' +
      '<div id="rcHead"><section class="rc-head"><h1 class="rc-lead-line rc-loading">Reading the record\u2026</h1></section></div>' +
      '<div id="rcGraph"></div>' +
      '<div id="rcLegend"></div>' +
      '<div id="rcReadout"></div>' +
      '<div id="rcAlmanac"></div>' +
      '<div class="rc-actions"><button class="btn btn-secondary rc-refresh" id="rcRefresh">Refresh</button></div>' +
      '</section>';
  }

  function paintGraph() {
    q("rcGraph").innerHTML = Dashboard.graph(currentSeries, emphasis);
    q("rcLegend").innerHTML = Dashboard.legend(currentSeries, emphasis);
    q("rcLegend").querySelectorAll(".rc-leg").forEach(function (b) {
      b.addEventListener("click", function () { emphasis = b.getAttribute("data-var"); paintGraph(); });
    });
  }

  function renderSeries(s) {
    currentSeries = s;
    emphasis = (s.headline && s.headline.key) || (s.vars[0] && s.vars[0].key);
    q("rcHead").innerHTML = Dashboard.headline(s);
    paintGraph();
    q("rcReadout").innerHTML = Dashboard.readout(s);
  }

  function renderAlmanac(al) { q("rcAlmanac").innerHTML = Dashboard.almanac(al); }

  function loadAlmanac(s) {
    var mmdd = s.date.slice(5), mm = mmdd.slice(0, 2), dd = mmdd.slice(3);
    var loc = s.location, year = +s.date.slice(0, 4);
    var wiki = almanacCache && almanacCache.mmdd === mmdd
      ? Promise.resolve(almanacCache.data)
      : Providers.onThisDay(mm, dd).then(function (d) { almanacCache = { mmdd: mmdd, data: d }; return d; }).catch(function () { return null; });
    var hol = Providers.holidays(loc.country || "US", year).catch(function () { return []; });
    return Promise.all([wiki, hol]).then(function (r) {
      var w = r[0] || { events: [], births: [], deaths: [], holidays: [] };
      var todays = (r[1] || []).filter(function (h) { return h.mmdd === mmdd; });
      renderAlmanac({ events: w.events, births: w.births, deaths: w.deaths, holidays: (todays.length ? todays : w.holidays) });
    }).catch(function () {
      q("rcAlmanac").innerHTML = '<section class="rc-alm"><h2 class="rc-h2">On this day</h2><p class="muted rc-alm-empty">Couldn\u2019t load the historical record. Try refresh.</p></section>';
    });
  }

  function loadActive() {
    var loc = Store.activeLocation();
    if (!loc) return;
    renderAlmanac(null); // loading
    DayModel.buildSeries(loc).then(function (s) {
      renderSeries(s);
      loadAlmanac(s);
    }).catch(function () {
      q("rcHead").innerHTML = '<section class="rc-head rc-err"><div class="rc-eyebrow">' + (loc.name || "") + '</div><h1 class="rc-lead-line">Data unavailable</h1><p class="rc-lead-sub">No live data and nothing cached for this location yet.</p></section>';
    });
  }

  function wireSwitcher() {
    var host = q("rcSwitch");
    if (!host) return;
    host.querySelectorAll(".rc-loc").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute("data-add")) return addLocationFlow();
        Store.setActive(b.getAttribute("data-slug"));
        build();
      });
    });
  }

  function addLocationFlow() {
    var query = window.prompt("Add a location (city name):");
    if (!query) return;
    Providers.geocode(query).then(function (results) {
      if (!results.length) { alert("No match found for \u201c" + query + "\u201d."); return; }
      var pick = results[0];
      if (results.length > 1) {
        var menu = results.map(function (r, i) { return (i + 1) + ". " + r.name; }).join("\n");
        var nn = parseInt(window.prompt("Multiple matches \u2014 pick one:\n" + menu, "1"), 10);
        if (nn >= 1 && nn <= results.length) pick = results[nn - 1];
      }
      Store.addLocation(pick); Store.setActive(pick.slug); build();
    }).catch(function () { alert("Location lookup failed. Check your connection."); });
  }

  function build() {
    var view = q("view");
    if (!view) return;
    view.innerHTML = skeleton();
    wireSwitcher();
    q("rcRefresh").addEventListener("click", function () { almanacCache = null; loadActive(); });
    loadActive();
  }

  window.addEventListener("page:render", function (e) {
    if (!e.detail || e.detail.route === "home") build();
  });
})();
