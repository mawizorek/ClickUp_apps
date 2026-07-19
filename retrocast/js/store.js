/* store.js — Retrocast persistence layer.
   Owns (1) the user's location list + active location and (2) the client cache
   that fronts our stored data table. The app reads from here, NEVER the API
   directly at render (spec §4). Cache is also the outage fallback. */
(function () {
  var LS_LOC = "retrocast_locations";
  var LS_ACTIVE = "retrocast_active";
  var LS_CACHE = "retrocast_cache";

  // Seed locations (spec §2). Current-location geolocate is added on top at runtime.
  var SEEDS = [
    { name: "Rochester, NY",   slug: "rochester-ny",   lat: 43.1566, lng: -77.6088, tz: "America/New_York", country: "US" },
    { name: "Chattanooga, TN", slug: "chattanooga-tn", lat: 35.0456, lng: -85.3097, tz: "America/New_York", country: "US" },
    { name: "Ogunquit, ME",    slug: "ogunquit-me",    lat: 43.2492, lng: -70.5989, tz: "America/New_York", country: "US" }
  ];

  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function locations() {
    var list = read(LS_LOC, null);
    if (!list || !list.length) { list = SEEDS.slice(); write(LS_LOC, list); }
    return list;
  }
  function setLocations(list) { write(LS_LOC, list); }
  function addLocation(loc) {
    var list = locations();
    if (list.some(function (l) { return l.slug === loc.slug; })) return list;
    list.push(loc); setLocations(list); return list;
  }
  function removeLocation(slug) {
    var list = locations().filter(function (l) { return l.slug !== slug; });
    setLocations(list);
    if (activeSlug() === slug && list[0]) setActive(list[0].slug);
    return list;
  }

  function activeSlug() {
    var s = read(LS_ACTIVE, null);
    var list = locations();
    if (s && list.some(function (l) { return l.slug === s; })) return s;
    return list[0] ? list[0].slug : null;
  }
  function setActive(slug) { write(LS_ACTIVE, slug); }
  function activeLocation() {
    var s = activeSlug();
    return locations().filter(function (l) { return l.slug === s; })[0] || null;
  }

  /* ---- cache: keyed by location slug + local mmdd ---- */
  function cacheKey(slug, mmdd) { return slug + "|" + mmdd; }
  function getCached(slug, mmdd) {
    var c = read(LS_CACHE, {});
    return c[cacheKey(slug, mmdd)] || null;
  }
  function setCached(slug, mmdd, day) {
    var c = read(LS_CACHE, {});
    c[cacheKey(slug, mmdd)] = { day: day, storedAt: new Date().toISOString() };
    write(LS_CACHE, c);
  }

  window.Store = {
    SEEDS: SEEDS,
    locations: locations, setLocations: setLocations,
    addLocation: addLocation, removeLocation: removeLocation,
    activeSlug: activeSlug, setActive: setActive, activeLocation: activeLocation,
    getCached: getCached, setCached: setCached
  };
})();
