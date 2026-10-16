/* sync.js — talks to the Throughline worker. Local-first: SignalDB is always the source the UI reads;
   this module pushes the outbox and pulls server changes.
   States: local (no API configured) | nokey | bootstrap | syncing | synced | pending | offline | error
   Key: localStorage "sd_key" (arrives via #invite=KEY link). API base: config.json "api" or localStorage "sd_api". */
var Sync = (function () {
  var state = "local", detail = "", api = "", me = null, timer = null, pushT = null, busy = false, listeners = [];
  var PULL_MS = 20000;

  function key() { try { return localStorage.getItem("sd_key") || ""; } catch (e) { return ""; } }
  function setKey(k) { try { if (k) localStorage.setItem("sd_key", k); else localStorage.removeItem("sd_key"); } catch (e) {} }
  function setApi(u) { try { if (u) localStorage.setItem("sd_api", u.replace(/\/+$/, "")); else localStorage.removeItem("sd_api"); } catch (e) {} }
  function set(s, d) { state = s; detail = d || ""; listeners.forEach(function (f) { try { f(state, detail); } catch (e) {} }); }

  function call(path, opts) {
    opts = opts || {};
    return fetch(api + path, {
      method: opts.method || "GET",
      headers: { "x-key": key(), "Content-Type": "application/json" },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var e = new Error(j.error || ("HTTP " + r.status)); e.status = r.status; throw e; }
        return j;
      });
    });
  }

  function init(cfg) {
    var h = location.hash || "";
    var m = h.match(/invite=([A-Za-z0-9_\-]+)/);
    if (m) { setKey(m[1]); history.replaceState(null, "", location.pathname + location.search + "#home"); }
    var override = null; try { override = localStorage.getItem("sd_api"); } catch (e) {}
    api = (override || (cfg && cfg.api) || "").replace(/\/+$/, "");
    if (!api) { set("local"); return Promise.resolve(); }
    if (!key()) { set("nokey"); return Promise.resolve(); }
    window.addEventListener("online", function () { tick(); });
    document.addEventListener("visibilitychange", function () { if (!document.hidden) tick(); });
    return connect();
  }

  function connect() {
    set("syncing", "connecting");
    return call("/me").then(function (j) {
      var changed = !me || me.grants_sig !== j.grants_sig;
      me = j; SignalDB.meta("me", j);
      if (me.actor.admin && SignalDB.hasLocalOnlyRows() && !SignalDB.meta("cursor")) { set("bootstrap"); return; }
      if (changed && SignalDB.meta("grants_sig") !== j.grants_sig) SignalDB.meta("cursor", null);
      SignalDB.meta("grants_sig", j.grants_sig);
      schedule(); return tick();
    }).catch(onErr);
  }
  function onErr(e) {
    if (e && e.status === 401) { set("error", "Access key rejected. Ask the admin for a new invite link."); return; }
    if (!navigator.onLine || (e && e.name === "TypeError")) { set("offline", "Offline. Edits are saved here and will sync."); schedule(); return; }
    set("error", (e && e.message) || String(e)); schedule();
  }
  function schedule() { clearInterval(timer); timer = setInterval(function () { if (!document.hidden) tick(); }, PULL_MS); }

  function tick() {
    if (!api || !key() || state === "bootstrap" || busy) return Promise.resolve();
    busy = true;
    return push().then(pull).then(function () {
      busy = false; var n = SignalDB.pending().length;
      set(n ? "pending" : "synced", n ? n + " pending" : "");
    }).catch(function (e) { busy = false; onErr(e); });
  }
  function kick() { // debounced push after a local edit
    if (state === "local") { SignalDB.pending().forEach(function (p) { SignalDB.ack(p, { status: "ok" }); }); return; }
    var n = SignalDB.pending().length; if (n && state !== "bootstrap") set("pending", n + " pending");
    clearTimeout(pushT); pushT = setTimeout(tick, 700);
  }

  function pull() {
    var since = SignalDB.meta("cursor");
    return call("/sync" + (since ? "?since=" + encodeURIComponent(since) : "")).then(function (j) {
      if (j.full) SignalDB.replaceAll(j.tables);
      else { var any = false; SignalDB.TABLES.forEach(function (t) { (j.tables[t] || []).forEach(function (r) { any = true; SignalDB.applyServer(t, r); }); }); if (any) notify({ pulled: true }); }
      SignalDB.meta("cursor", j.cursor);
    });
  }

  function opFor(p) {
    var row = p.op === "delete" ? { id: p.id } : SignalDB.get(p.table, p.id);
    if (!row) return null;
    var clean = {}; Object.keys(row).forEach(function (k) { if (["rev","created_by","updated_at","updated_by","deleted_at"].indexOf(k) === -1) clean[k] = row[k]; });
    return { table: p.table, op: p.op, row: clean, base_rev: p.base_rev };
  }
  var problems = [];
  function push() {
    var all = SignalDB.pending(); if (!all.length) return Promise.resolve();
    var chunks = []; for (var i = 0; i < all.length; i += 200) chunks.push(all.slice(i, i + 200));
    return chunks.reduce(function (pr, c) { return pr.then(function () { return send(c); }); }, Promise.resolve()).then(function () {
      if (problems.length) { notify({ problems: problems.slice() }); problems = []; }
    });
  }
  function send(entries, force) {
    var ops = [], live = [];
    entries.forEach(function (p) { var o = opFor(p); if (o) { ops.push(o); live.push(p); } else SignalDB.ack(p, { status: "ok" }); });
    if (!ops.length) return Promise.resolve();
    return call("/batch", { method: "POST", body: { ops: ops, force: !!force } }).then(function (j) {
      j.results.forEach(function (r, k) {
        SignalDB.ack(live[k], r);
        if (r.status !== "ok") problems.push({ table: live[k].table, id: live[k].id, status: r.status, error: r.error });
      });
      notify({ pushed: true });
    }).catch(function (e) {
      if (e.status !== 409) throw e;      // network etc: keep outbox, retry later
      if (live.length === 1) {            // isolated the bad op: drop it, restore server copy
        SignalDB.ack(live[0], { status: "failed" }); problems.push({ table: live[0].table, id: live[0].id, status: "failed", error: e.message });
        return;
      }
      var mid = Math.ceil(live.length / 2);
      return send(live.slice(0, mid), force).then(function () { return send(live.slice(mid), force); });
    });
  }

  // admin bootstrap: upload every local row (force) or discard local and take the server copy
  function bootstrap(choice) {
    if (choice === "discard") { SignalDB.wipe(); SignalDB.meta("cursor", null); set("syncing"); return connect(); }
    var entries = [];
    SignalDB.TABLES.forEach(function (t) { SignalDB.getAll(t).forEach(function (r) { entries.push({ table: t, id: r.id, op: "upsert", seq: 0, base_rev: undefined }); }); });
    set("syncing", "uploading " + entries.length + " rows");
    var chunks = []; for (var i = 0; i < entries.length; i += 400) chunks.push(entries.slice(i, i + 400));
    return chunks.reduce(function (pr, c) { return pr.then(function () { return send(c, true); }); }, Promise.resolve())
      .then(function () { SignalDB.meta("cursor", null); state = "syncing"; schedule(); return tick(); })
      .then(function () { if (problems.length) notify({ problems: problems.slice() }); problems = []; })
      .catch(onErr);
  }

  function notify(ev) { listeners.forEach(function (f) { try { f(state, detail, ev); } catch (e) {} }); }

  // ---------- client-side permission mirror (UI only; the worker is authoritative) ----------
  function isAdmin() { return state === "local" || !!(me && me.actor && me.actor.admin); }
  function sigDept(id) { var s = SignalDB.get("signal_types", id); return s ? s.dept : null; }
  function owner(ep) {
    var u = SignalDB.where("units", function (r) { return r.endpoint_id === ep; })[0]; if (u) return ["units", u];
    var c = SignalDB.where("control_points", function (r) { return r.endpoint_id === ep; })[0]; if (c) return ["control_points", c];
    return null;
  }
  function depts(t, r, d) {
    var out = []; d = d || 0; if (!r || d > 3) return out;
    var add = function (x) { if (x && out.indexOf(x) === -1) out.push(x); };
    var addAll = function (a) { a.forEach(add); };
    if (t === "signal_types") add(r.dept);
    else if (t === "fixture_types") add(sigDept(r.primary_signal));
    else if (t === "type_interfaces") { add(sigDept(r.signal_type)); addAll(depts("fixture_types", SignalDB.get("fixture_types", r.type_id), d + 1)); }
    else if (t === "units") addAll(depts("fixture_types", SignalDB.get("fixture_types", r.type_id), d + 1));
    else if (t === "control_points") { add(sigDept(r.signal_type)); addAll(depts("units", SignalDB.get("units", r.parent_unit_id), d + 1)); }
    else if (t === "network_interfaces") addAll(depts("units", SignalDB.get("units", r.unit_id), d + 1));
    else if (t === "connections" || t === "assignments") {
      if (r.signal_type) add(sigDept(r.signal_type));
      [r.source_endpoint, r.dest_endpoint].forEach(function (ep) { var o = owner(ep); if (o) addAll(depts(o[0], o[1], d + 1)); });
    }
    return out;
  }
  function showOf(t, r) { if (!r) return null; if (t === "shows") return r.id; if (SCHEMA.isShowScoped(t) || t === "positions") return r.show_id || null; return null; }
  // can(kind, table, row?) — row omitted = "could I ever do this on this table?"
  function can(kind, t, r) {
    if (isAdmin()) return true;
    if (!me) return false;
    var rs = r ? showOf(t, r) : null;
    if (rs) { var s = SignalDB.get("shows", rs); if (s && s.locked) return false; }
    return me.grants.some(function (g) {
      var sc = g.perms && g.perms[kind] && g.perms[kind][t];
      if (!sc) return false;
      if (!r) return true;
      if (rs && g.show_id !== "*" && g.show_id !== rs) return false;
      if (sc === "show" && t !== "endpoints" && !rs) return false;
      if (sc === "dept") return !!g.dept && depts(t, r).indexOf(g.dept) !== -1;
      return true;
    });
  }

  return {
    init: init, connect: connect, tick: tick, kick: kick, call: call, bootstrap: bootstrap, can: can, isAdmin: isAdmin,
    setKey: setKey, setApi: setApi, key: key,
    me: function () { return me; }, state: function () { return state; }, detail: function () { return detail; },
    api: function () { return api; }, on: function (f) { listeners.push(f); }
  };
})();
