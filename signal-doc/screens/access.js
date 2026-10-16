/* screens/access.js — connection + sign-in for everyone; user / role / backup admin for admins.
   Roles are data (_roles.perms) so permissions are edited here, not in code. */
window.Screens = window.Screens || {};
Screens.access = (function () {
  var esc = UI.esc, view = null, cache = { users: null, roles: null, changes: null, snaps: null }, lastInvite = null;
  var SCOPES = [["", "none"], ["show", "show"], ["dept", "dept"], ["true", "all"]];

  function inviteUrl(key) { return location.origin + location.pathname + "#invite=" + key; }
  function card(title, body, cls) { return '<section class="card sig-card' + (cls ? " " + cls : "") + '"><h3>' + title + '</h3>' + body + '</section>'; }
  function roleName(id) { var r = (cache.roles || []).filter(function (x) { return x.id === id; })[0]; return r ? r.name : id; }
  function showName(id) { if (id === "*") return "All shows"; var s = SignalDB.get("shows", id); return s ? SCHEMA.T.shows.show(s) : id; }

  function render(v) {
    view = v || view; if (!view) return;
    var s = Sync.state(), me = Sync.me(), admin = me && me.actor && me.actor.admin && s !== "local";
    var h = '<div class="page sig-access"><h1>Access</h1>';

    // ---- connection ----
    var cb = '<div class="sig-field"><span class="sig-field-lbl">Status</span><span class="sig-field-val">' + esc(s) + (Sync.detail() ? " \u00b7 " + esc(Sync.detail()) : "") + '</span></div>';
    cb += '<div class="sig-field"><span class="sig-field-lbl">Server</span><span class="sig-field-val">' + esc(Sync.api() || "not configured (local only)") + '</span></div>';
    if (me && me.actor) {
      cb += '<div class="sig-field"><span class="sig-field-lbl">You</span><span class="sig-field-val">' + esc(me.actor.name) + (me.actor.admin ? " \u00b7 Admin" : "") + '</span></div>';
      (me.grants || []).forEach(function (g) { cb += '<div class="sig-field"><span class="sig-field-lbl">Access</span><span class="sig-field-val">' + esc(g.role_name) + (g.dept ? " \u00b7 " + esc(g.dept) : "") + " \u00b7 " + esc(showName(g.show_id)) + '</span></div>'; });
    }
    if (s === "local") cb += '<p class="muted">Everything stays in this browser until a server is connected. Back up with JSON export.</p>';
    cb += '<div class="sig-fld"><label for="acKey">' + (Sync.key() ? "Switch key" : "Sign in with your invite link or key") + '</label><input id="acKey" type="text" autocomplete="off" placeholder="Paste invite link or key"></div>';
    cb += '<div class="sig-form-acts"><button class="sig-btn sig-btn-pri" data-a="signin">Sign in</button>' + (Sync.key() ? '<button class="sig-btn" data-a="sync">Sync now</button><button class="sig-btn sig-btn-bad" data-a="signout">Sign out</button>' : "") + '</div>';
    cb += '<details class="sig-adv"><summary>Advanced: server URL</summary><div class="sig-fld"><input id="acApi" type="url" placeholder="https://signal-doc.<you>.workers.dev" value="' + esc(Sync.api()) + '"></div><div class="sig-form-acts"><button class="sig-btn" data-a="api">Save URL</button></div></details>';
    h += card("Connection", cb);

    if (s === "bootstrap") {
      h += card("Finish setup", '<p>This browser has data the server has never seen (probably the Big Love sample or work you did offline). Pick one:</p>' +
        '<div class="sig-form-acts"><button class="sig-btn sig-btn-pri" data-a="boot-up">Upload this browser\u2019s data</button><button class="sig-btn sig-btn-bad" data-a="boot-discard">Discard it, use the server</button></div>', "sig-card-warn");
    }

    if (admin) {
      // ---- users ----
      var ub = "";
      if (lastInvite) ub += '<div class="callout"><b>Invite link for ' + esc(lastInvite.name) + '</b> (shown once; copy it now)<code class="sig-code">' + esc(inviteUrl(lastInvite.key)) + '</code><div class="sig-form-acts"><button class="sig-btn sig-btn-pri" data-a="copy">Copy link</button><button class="sig-btn" data-a="dismiss">Done</button></div></div>';
      if (!cache.users) ub += '<p class="muted">Loading\u2026</p>';
      else {
        cache.users.users.forEach(function (u) {
          var gs = cache.users.grants.filter(function (g) { return g.user_id === u.id; });
          ub += '<div class="sig-user' + (u.revoked_at ? " is-revoked" : "") + '"><div class="sig-user-hd"><b>' + esc(u.name) + '</b>' + (u.email ? ' <span class="sig-soft">' + esc(u.email) + '</span>' : "") +
            (u.revoked_at ? ' <span class="sig-bad">revoked</span>' : "") + (u.last_seen_at ? ' <span class="sig-muted">seen ' + esc(new Date(u.last_seen_at).toLocaleDateString()) + '</span>' : ' <span class="sig-muted">never signed in</span>') + '</div>';
          gs.forEach(function (g) { ub += '<div class="sig-grant">' + esc(roleName(g.role_id)) + (g.dept ? " \u00b7 " + esc(g.dept) : "") + " \u00b7 " + esc(showName(g.show_id)) + ' <button class="sig-x" data-a="ungrant" data-id="' + esc(g.id) + '" aria-label="Remove access">\u2715</button></div>'; });
          ub += '<div class="sig-user-acts"><button class="sig-pill" data-a="addgrant" data-id="' + esc(u.id) + '">+ Access</button><button class="sig-pill" data-a="rekey" data-id="' + esc(u.id) + '" data-name="' + esc(u.name) + '">New link</button>' +
            (u.revoked_at ? '<button class="sig-pill" data-a="restore" data-id="' + esc(u.id) + '">Restore</button>' : '<button class="sig-pill sig-danger" data-a="revoke" data-id="' + esc(u.id) + '">Revoke</button>') + '</div></div>';
        });
        if (!cache.users.users.length) ub += '<p class="muted">No users yet. You\u2019re signed in with the root admin key.</p>';
      }
      ub += '<div class="sig-form-acts"><button class="sig-btn sig-btn-pri" data-a="newuser">+ Invite user</button></div>';
      h += card("Users", ub);

      // ---- roles ----
      var rb = "";
      if (cache.roles) cache.roles.forEach(function (r) {
        if (r.perms.admin) { rb += '<div class="sig-role"><b>' + esc(r.name) + '</b> <span class="sig-muted">full access (locked)</span></div>'; return; }
        rb += '<div class="sig-role"><div class="sig-role-hd"><b>' + esc(r.name) + '</b><button class="sig-pill" data-a="editrole" data-id="' + esc(r.id) + '">Edit permissions</button></div><div class="sig-muted">' +
          'writes ' + Object.keys(r.perms.write || {}).length + ' tables \u00b7 deletes ' + Object.keys(r.perms.delete || {}).length + ' \u00b7 hidden: ' + esc((r.perms.hidden || []).join(", ") || "none") + '</div></div>';
      });
      h += card("Roles", rb || '<p class="muted">Loading\u2026</p>');

      // ---- shows + backups + activity ----
      var shows = SignalDB.getAll("shows");
      h += card("Shows", '<p class="muted">Clone copies every unit, control point, IP, connection, assignment and show position into a new show. Venue + library rows are shared, not copied.</p>' +
        '<div class="sig-fld"><label for="clFrom">Clone from</label><select id="clFrom">' + shows.map(function (x) { return '<option value="' + esc(x.id) + '">' + esc(SCHEMA.T.shows.show(x)) + '</option>'; }).join("") + '</select></div>' +
        '<div class="sig-fld"><label for="clTitle">New title</label><input id="clTitle" type="text"></div><div class="sig-fld"><label for="clSeason">Season</label><input id="clSeason" type="text" placeholder="S27"></div>' +
        '<div class="sig-form-acts"><button class="sig-btn sig-btn-pri" data-a="clone">Clone show</button></div>');
      var sn = cache.snaps;
      h += card("Backups", '<p class="muted">Nightly snapshot to storage (keeps 60). Point-in-time restore (30 days) lives in Cloudflare. JSON export on Units is your third copy.</p>' +
        (sn ? '<div class="sig-field"><span class="sig-field-lbl">Snapshots</span><span class="sig-field-val">' + sn.length + (sn[0] ? " \u00b7 newest " + esc(new Date(sn[0].uploaded).toLocaleString()) : "") + '</span></div>' : "") +
        '<div class="sig-form-acts"><button class="sig-btn" data-a="snap">Snapshot now</button></div>');
      var ch = cache.changes;
      var cbx = ch ? ch.slice(0, 40).map(function (c) { return '<div class="sig-chg"><span class="sig-muted">' + esc(new Date(c.at).toLocaleString()) + '</span> <b>' + esc(c.actor || "?") + '</b> ' + esc(c.op) + ' <span class="sig-soft">' + esc(c.tbl) + '</span> ' + esc(changeLabel(c)) + '</div>'; }).join("") : '<p class="muted">Loading\u2026</p>';
      h += card("Recent activity", cbx || '<p class="muted">Nothing yet.</p>');
    }
    h += '</div>';
    view.innerHTML = h;
    bind();
    if (admin && !cache.users) loadAdmin();
  }

  function changeLabel(c) {
    try { var r = JSON.parse(c.after || c.before || "{}"); if (SCHEMA.T[c.tbl]) return SCHEMA.T[c.tbl].show(Object.assign({}, r)); return r.name || r.title || c.row_id; } catch (e) { return c.row_id; }
  }

  function loadAdmin() {
    Promise.all([Sync.call("/admin/users"), Sync.call("/admin/roles"), Sync.call("/admin/changes?limit=60"), Sync.call("/admin/snapshots").catch(function () { return { snapshots: null }; })])
      .then(function (r) { cache.users = r[0]; cache.roles = r[1].roles; cache.changes = r[2].changes; cache.snaps = r[3].snapshots; render(); })
      .catch(function (e) { UI.toast("Admin load failed: " + e.message, "bad"); });
  }
  function reload() { cache.users = null; render(); }
  function err(e) { UI.toast(e.message || String(e), "bad"); }

  function grantForm(userId, title, onDone, withUser) {
    var me = Sync.me(), shows = SignalDB.getAll("shows");
    var b = '<form class="sig-form">';
    if (withUser) b += '<div class="sig-fld"><label for="gName">Name <b class="sig-req">*</b></label><input id="gName" required></div><div class="sig-fld"><label for="gEmail">Email</label><input id="gEmail" type="email"></div>';
    b += '<div class="sig-fld"><label for="gRole">Role</label><select id="gRole">' + (cache.roles || []).map(function (r) { return '<option value="' + esc(r.id) + '"' + (r.id === "dept_head" ? " selected" : "") + '>' + esc(r.name) + '</option>'; }).join("") + '</select></div>';
    b += '<div class="sig-fld"><label for="gShow">Show</label><select id="gShow"><option value="*">All shows</option>' + shows.map(function (s) { return '<option value="' + esc(s.id) + '"' + (s.id === UI.showId() ? " selected" : "") + '>' + esc(SCHEMA.T.shows.show(s)) + '</option>'; }).join("") + '</select></div>';
    b += '<div class="sig-fld"><label for="gDept">Department (dept-scoped roles)</label><select id="gDept"><option value="">\u2014</option>' + ((me && me.depts) || []).map(function (d) { return '<option>' + esc(d) + '</option>'; }).join("") + '</select></div>';
    b += '<p class="muted">Guests should be per-show. Dept heads need a department.</p><div class="sig-form-acts"><button class="sig-btn sig-btn-pri" type="submit">' + (withUser ? "Create + get link" : "Add access") + '</button></div></form>';
    var p = UI.panel(title, b);
    p.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      var role = p.querySelector("#gRole").value, show = p.querySelector("#gShow").value, dept = p.querySelector("#gDept").value;
      if (role === "dept_head" && !dept) { UI.toast("Pick a department for a dept head", "bad"); return; }
      if (role === "guest" && show === "*" && !confirm("Guest on ALL shows? Usually guests are per-show.")) return;
      var body = { role_id: role, show_id: show, dept: dept || null };
      if (withUser) { body.op = "create"; body.name = p.querySelector("#gName").value.trim(); body.email = p.querySelector("#gEmail").value.trim(); if (!body.name) { UI.toast("Name required", "bad"); return; } }
      else { body.op = "add"; body.user_id = userId; }
      Sync.call(withUser ? "/admin/users" : "/admin/grants", { method: "POST", body: body }).then(function (r) { UI.close(true); onDone(r, body); }).catch(err);
    });
  }

  function roleEditor(id) {
    var r = (cache.roles || []).filter(function (x) { return x.id === id; })[0]; if (!r) return;
    var P = r.perms, hidden = P.hidden || [];
    var b = '<form class="sig-form"><div class="sig-fld"><label for="rName">Role name</label><input id="rName" value="' + esc(r.name) + '"></div>' +
      '<p class="muted">show = rows in a show they\u2019re granted \u00b7 dept = rows whose signal type is in their department \u00b7 all = every row. Hidden tables never reach this role.</p>' +
      '<div class="sig-matrix"><div class="sig-mx-row sig-mx-hd"><span>Table</span><span>Write</span><span>Delete</span><span>Hide</span></div>';
    SCHEMA.ORDER.forEach(function (t) {
      var sel = function (kind) { var cur = P[kind] && P[kind][t]; cur = cur === true ? "true" : (cur || "");
        return '<select data-k="' + kind + '" data-t="' + t + '">' + SCOPES.map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === cur ? " selected" : "") + '>' + s[1] + '</option>'; }).join("") + '</select>'; };
      b += '<div class="sig-mx-row"><span>' + esc(SCHEMA.T[t].label) + '</span>' + sel("write") + sel("delete") + '<input type="checkbox" data-hide="' + t + '"' + (hidden.indexOf(t) !== -1 ? " checked" : "") + ' aria-label="Hide ' + esc(t) + '"></div>';
    });
    b += '</div><div class="sig-form-acts"><button class="sig-btn sig-btn-pri" type="submit">Save role</button></div></form>';
    var p = UI.panel("Permissions: " + r.name, b);
    p.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      var perms = { admin: false, hidden: [], write: {}, delete: {} };
      p.querySelectorAll("select[data-k]").forEach(function (s) { if (s.value) perms[s.dataset.k][s.dataset.t] = s.value === "true" ? true : s.value; });
      p.querySelectorAll("[data-hide]").forEach(function (c) { if (c.checked) perms.hidden.push(c.dataset.hide); });
      Sync.call("/admin/roles", { method: "POST", body: { id: r.id, name: p.querySelector("#rName").value.trim() || r.name, perms: perms } })
        .then(function () { UI.close(true); UI.toast("Saved " + r.name + ". Users pick it up on their next sync."); reload(); }).catch(err);
    });
  }

  function bind() {
    view.querySelectorAll("[data-a]").forEach(function (b) { b.addEventListener("click", function () { act(b.dataset.a, b); }); });
  }
  function act(a, b) {
    var id = b.dataset.id;
    if (a === "signin") {
      var v = view.querySelector("#acKey").value.trim(); var m = v.match(/invite=([A-Za-z0-9_\-]+)/); var k = m ? m[1] : v;
      if (!k) { UI.toast("Paste your invite link or key", "bad"); return; }
      if (Sync.key() && Sync.key() !== k) { SignalDB.wipe(); }
      Sync.setKey(k); SignalDB.meta("cursor", null); location.reload();
    } else if (a === "signout") {
      if (!confirm("Sign out and clear this browser's copy? Unsynced edits (" + SignalDB.pending().length + ") will be lost.")) return;
      Sync.setKey(null); SignalDB.wipe(); location.reload();
    } else if (a === "sync") Sync.tick().then(function () { UI.toast("Synced"); render(); });
    else if (a === "api") { Sync.setApi(view.querySelector("#acApi").value.trim()); location.reload(); }
    else if (a === "boot-up") Sync.bootstrap("upload").then(function () { UI.toast("Uploaded. You\u2019re live."); render(); });
    else if (a === "boot-discard") { if (confirm("Throw away this browser's data and load the server copy?")) Sync.bootstrap("discard").then(render); }
    else if (a === "copy") { var u = inviteUrl(lastInvite.key); (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(function () { UI.toast("Link copied"); }).catch(function () { prompt("Copy this link", u); }); }
    else if (a === "dismiss") { lastInvite = null; render(); }
    else if (a === "newuser") grantForm(null, "Invite user", function (r, body) { lastInvite = { name: body.name, key: r.key }; reload(); }, true);
    else if (a === "addgrant") grantForm(id, "Add access", function () { UI.toast("Access added"); reload(); });
    else if (a === "ungrant") { if (confirm("Remove this access?")) Sync.call("/admin/grants", { method: "POST", body: { op: "remove", id: id } }).then(reload).catch(err); }
    else if (a === "revoke" || a === "restore") Sync.call("/admin/users", { method: "POST", body: { op: a, id: id } }).then(reload).catch(err);
    else if (a === "rekey") { if (confirm("Make a new link for " + b.dataset.name + "? Their old link stops working.")) Sync.call("/admin/users", { method: "POST", body: { op: "rekey", id: id } }).then(function (r) { lastInvite = { name: b.dataset.name, key: r.key }; reload(); }).catch(err); }
    else if (a === "editrole") roleEditor(id);
    else if (a === "snap") Sync.call("/admin/snapshot", { method: "POST" }).then(function () { UI.toast("Snapshot saved"); reload(); }).catch(err);
    else if (a === "clone") {
      var from = view.querySelector("#clFrom").value, title = view.querySelector("#clTitle").value.trim();
      if (!from || !title) { UI.toast("Pick a show and a title", "bad"); return; }
      Sync.call("/shows/clone", { method: "POST", body: { from: from, title: title, season: view.querySelector("#clSeason").value.trim() } })
        .then(function (r) { SignalDB.meta("cursor", null); return Sync.tick().then(function () { UI.setShow(r.show_id); UI.toast("Cloned: " + r.counts.units + " units"); location.hash = "#home"; }); }).catch(err);
    }
  }
  return { render: render, refresh: function () { if (view && document.body.contains(view) && !document.getElementById("sigPanelWrap")) render(); } };
})();
