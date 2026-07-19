/* app.js — orchestration. Listens for the router's page:render hook, builds the
   home dashboard for the active location, hydrates the shared MM-DD almanac feed,
   and wires the switcher / variable toggle / refresh / add-location. Per-feed
   loading + empty + error states, never all-or-nothing (spec §7). */
(function () {
  var activeVar = "tempHigh";
  var almanacCache = null; // shared across locations (keyed MM-DD only)

  function q(id) { return document.getElementById(id); }

  function switcherHTML() {
    var list = Store.locations(), active = Store.activeSlug();
    return '<div class="rc-switch">' +
      list.map(function (l) {
        return '<button class="rc-loc' + (l.slug === active ? " on" : "") + '" data-slug="' + l.slug + '">' + l.name + '</button>';
      }).join("") +
      '<button class="rc-loc rc-addbtn" data-add="1" aria-label="Add location">+ add</button>' +
      '</div>';
  }

  function skeleton() {
    var loc = Store.activeLocation();
    return '<section class="page rc-page">' +
      '<div id="rcSwitch">' + switcherHTML() + '</div>' +
      '<h1 class="rc-title">' + (loc ? loc.name : "Retrocast") + '</h1>' +
      '<div id="rcHero"><section class="rc-hero"><div class="rc-hero-word rc-loading">Reading the record\u2026</div></section></div>' +
      '<div id="rcCred"></div>' +
      '<div id="rcTools"></div>' +
      '<div id="rcBand"></div>' +
      '<div id="rcTwin"></div>' +
      '<div id="rcRibbon"></div>' +
      '<button class="btn btn-secondary rc-refresh" id="rcRefresh">Refresh</button>' +
      '</section>';
  }

  function renderWeather(day) {
    q("rcHero").innerHTML = Dashboard.hero(day, activeVar);
    q("rcCred").innerHTML = Dashboard.credibility(day);
    q("rcTools").innerHTML = Dashboard.varToggle(activeVar);
    q("rcBand").innerHTML = Dashboard.band(day, activeVar);
    q("rcTwin").innerHTML = Dashboard.twin(day);
    q("rcTools").querySelectorAll(".rc-chip").forEach(function (b) {
      b.addEventListener("click", function () {
        activeVar = b.getAttribute("data-var");
        renderWeather(day); // re-bind same Day, no refetch
      });
    });
  }

  function renderAlmanac(day) {
    q("rcRibbon").innerHTML = Dashboard.ribbon(day);
  }

  function loadAlmanac(day) {
    var mmdd = day.date.slice(5), mm = mmdd.slice(0, 2), dd = mmdd.slice(3);
    var loc = day.location;
    var year = +day.date.slice(0, 4);
    var wiki = almanacCache && almanacCache.mmdd === mmdd
      ? Promise.resolve(almanacCache.data)
      : Providers.onThisDay(mm, dd).then(function (d) { almanacCache = { mmdd: mmdd, data: d }; return d; }).catch(function () { return null; });
    var hol = Providers.holidays(loc.country || "US", year).catch(function () { return []; });
    return Promise.all([wiki, hol]).then(function (r) {
      var w = r[0] || { events: [], births: [], deaths: [], holidays: [] };
      var todaysHolidays = (r[1] || []).filter(function (h) { return h.mmdd === mmdd; });
      day.almanac = {
        events: w.events, births: w.births, deaths: w.deaths,
        holidays: (todaysHolidays.length ? todaysHolidays : w.holidays)
      };
      renderAlmanac(day);
    }).catch(function () {
      q("rcRibbon").innerHTML = '<section class="card rc-err"><h3>On this day</h3><p class="muted">Couldn\u2019t load the historical record. Try refresh.</p></section>';
    });
  }

  function loadActive() {
    var loc = Store.activeLocation();
    if (!loc) return;
    DayModel.build(loc).then(function (day) {
      renderWeather(day);
      renderAlmanac(day); // shows loading state
      loadAlmanac(day);
    }).catch(function () {
      q("rcHero").innerHTML = '<section class="rc-hero rc-err"><div class="rc-hero-word">Data unavailable</div><div class="rc-hero-sub">No live data and nothing cached for this location yet.</div></section>';
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
        var n = parseInt(window.prompt("Multiple matches \u2014 pick one:\n" + menu, "1"), 10);
        if (n >= 1 && n <= results.length) pick = results[n - 1];
      }
      Store.addLocation(pick); Store.setActive(pick.slug); build();
    }).catch(function () { alert("Location lookup failed. Check your connection."); });
  }

  function build() {
    var view = q("view");
    if (!view) return;
    view.innerHTML = skeleton();
    wireSwitcher();
    q("rcRefresh").addEventListener("click", function () {
      almanacCache = null; loadActive();
    });
    loadActive();
  }

  // Router hook: fires after the shell injects a page into #view.
  window.addEventListener("page:render", function (e) {
    if (!e.detail || e.detail.route === "home") build();
  });
})();
