/**
 * Throughline — Cloudflare Worker (v1.0)
 *
 * Relational backend over D1 for the Throughline (throughline/ on GitHub Pages).
 * 14 domain tables + 4 system tables (_roles, _users, _grants, _changes). See migrations/0001_init.sql.
 *
 * AUTH: every request (reads included) needs header x-key.
 *   ADMIN_KEY secret      = break-glass root admin (Michael). Always admin, never stored in D1.
 *   _users.key_hash       = SHA-256 of each invited user's key. Plaintext is returned ONCE at create/rekey.
 *   Permissions are DATA: _grants (user + role + show|'*' + dept) -> _roles.perms JSON. Edit roles, not code.
 *
 * SYNC (local-first client, optimistic concurrency):
 *   GET  /me                       who am I: actor, grants, depts, server time
 *   GET  /sync?since=ISO           every visible row changed since cursor (tombstones included)
 *   POST /batch {ops:[...]}        [{table, op:"upsert"|"delete", row, base_rev}] -> per-op results.
 *                                  base_rev must match the server rev or the op returns "conflict" + the
 *                                  server row (first to the server wins; the loser is told, never silently lost).
 *                                  All accepted ops commit in ONE D1 transaction.
 *   GET  /trace?unit=ID            live recursive signal trace (connections + assignments). Never stored.
 *
 * ADMIN:
 *   POST /shows/clone {from, title, season}       copy a show (units, CPs, NIs, connections, assignments, show positions)
 *   GET  /admin/users                             users + grants
 *   POST /admin/users {op:create|revoke|restore|rekey|update, ...}
 *   POST /admin/grants {op:add|remove, ...}
 *   GET  /admin/roles | POST /admin/roles {id,name,perms}
 *   GET  /admin/changes?tbl=&row_id=&limit=      audit log (who changed what, before/after)
 *   POST /admin/snapshot | GET /admin/snapshots  JSON dumps to R2 (BACKUPS binding). Also nightly via cron.
 *
 * Bindings: D1 'DB', R2 'BACKUPS'. Secrets: ADMIN_KEY.
 * NOTE: deploy target (Workers Builds, root dir throughline/worker). NOT served by GitHub Pages.
 */

const VERSION = "1.0";

// ---------- schema registry: the ONLY tables + columns the generic API will touch ----------
// order matters: parents before children (upserts are applied in this order inside a batch).
const TABLES = {
  signal_types:       { cols: ["name","protocol","connector","dept","notes"], scope: "library" },
  fixture_types:      { cols: ["name","category","mfr","model","wattage","weight","primary_signal","notes"], scope: "library" },
  type_interfaces:    { cols: ["type_id","label","signal_type","direction","connector","required","sort","notes"], scope: "library" },
  venues:             { cols: ["name","abbr","notes"], scope: "venue" },
  shows:              { cols: ["title","season","venue_id","opening","designer_snd","designer_lx","designer_vid","locked","is_template","notes"], scope: "show-root" },
  positions:          { cols: ["venue_id","show_id","name","type","notes"], scope: "position" },
  endpoints:          { cols: ["class"], scope: "endpoint" },
  infrastructure:     { cols: ["venue_id","endpoint_id","label","type","endpoint_a","endpoint_b","notes"], scope: "venue" },
  networks:           { cols: ["venue_id","name","protocol","subnet","vlan","notes"], scope: "venue" },
  units:              { cols: ["show_id","endpoint_id","type_id","unit_num","position_id","direction","purpose","channel","dimmer","dmx_addr","role","asset_tag","label","notes"], scope: "show" },
  control_points:     { cols: ["show_id","endpoint_id","parent_unit_id","label","cp_type","signal_type","direction","channel_num","notes"], scope: "show" },
  network_interfaces: { cols: ["show_id","unit_id","network_id","ip","hostname","port_label","mac","notes"], scope: "show" },
  connections:        { cols: ["show_id","source_endpoint","dest_endpoint","connection_type","signal_type","cable_label","cable_color","length","notes"], scope: "show" },
  assignments:        { cols: ["show_id","source_endpoint","dest_endpoint","level","pre_post","group_name","notes"], scope: "show" },
};
const ORDER = Object.keys(TABLES);
const SNAPSHOT_KEEP = 60;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-key",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(request.url);
    const p = url.pathname.replace(/\/+$/, "") || "/";
    const M = request.method;
    try {
      if (p === "/" || p === "/health") return json({ ok: true, app: "throughline", version: VERSION });
      const actor = await authenticate(request, env);

      if (p === "/me" && M === "GET") return json(await me(env, actor));
      if (p === "/sync" && M === "GET") return json(await sync(env, actor, url.searchParams.get("since")));
      if (p === "/batch" && M === "POST") return json(await batch(env, actor, await body(request)));
      if (p === "/trace" && M === "GET") return json(await trace(env, actor, url.searchParams.get("unit")));

      if (p === "/shows/clone" && M === "POST") { needAdmin(actor); return json(await cloneShow(env, actor, await body(request))); }
      if (p === "/admin/users" && M === "GET") { needAdmin(actor); return json(await listUsers(env)); }
      if (p === "/admin/users" && M === "POST") { needAdmin(actor); return json(await writeUser(env, actor, await body(request))); }
      if (p === "/admin/grants" && M === "POST") { needAdmin(actor); return json(await writeGrant(env, actor, await body(request))); }
      if (p === "/admin/roles" && M === "GET") { needAdmin(actor); return json(await listRoles(env)); }
      if (p === "/admin/roles" && M === "POST") { needAdmin(actor); return json(await writeRole(env, actor, await body(request))); }
      if (p === "/admin/changes" && M === "GET") { needAdmin(actor); return json(await listChanges(env, url)); }
      if (p === "/admin/snapshot" && M === "POST") { needAdmin(actor); return json(await snapshot(env, actor.name)); }
      if (p === "/admin/snapshots" && M === "GET") { needAdmin(actor); return json(await listSnapshots(env)); }

      return json({ error: "not found" }, 404);
    } catch (err) {
      const code = (err && err.status) || 500;
      return json({ error: String((err && err.message) || err) }, code);
    }
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(snapshot(env, "nightly").catch((e) => console.error("snapshot", e)));
  },
};

/* ================= helpers ================= */
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...CORS } });
}
function fail(msg, status = 400) { const e = new Error(msg); e.status = status; throw e; }
async function body(request) { try { return await request.json(); } catch (e) { fail("body must be JSON"); } }
function nowISO() { return new Date().toISOString(); }
function uuid() { return crypto.randomUUID(); }
async function sha256(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function newKey() {
  const b = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function parsePerms(s) { try { return JSON.parse(s || "{}"); } catch (e) { return {}; } }
function needAdmin(actor) { if (!actor.admin) fail("admin only", 403); }

/* ================= auth ================= */
async function authenticate(request, env) {
  const key = request.headers.get("x-key") || "";
  if (!key) fail("unauthorized: missing x-key", 401);
  if (env.ADMIN_KEY && key === env.ADMIN_KEY) return { id: "root", name: "admin", admin: true, grants: [] };
  const hash = await sha256(key);
  const u = await env.DB.prepare("SELECT * FROM _users WHERE key_hash=?1").bind(hash).first();
  if (!u || u.revoked_at) fail("unauthorized: bad or revoked key", 401);
  const g = await env.DB.prepare(
    "SELECT g.id, g.role_id, g.show_id, g.dept, r.name AS role_name, r.perms FROM _grants g JOIN _roles r ON r.id=g.role_id WHERE g.user_id=?1"
  ).bind(u.id).all();
  const grants = (g.results || []).map((r) => ({ id: r.id, role_id: r.role_id, role_name: r.role_name, show_id: r.show_id, dept: r.dept, perms: parsePerms(r.perms) }));
  // touch last_seen at most every ~5 min (cheap; avoids a write per request)
  if (!u.last_seen_at || Date.now() - Date.parse(u.last_seen_at) > 300000) {
    await env.DB.prepare("UPDATE _users SET last_seen_at=?2 WHERE id=?1").bind(u.id, nowISO()).run();
  }
  return { id: u.id, name: u.name, email: u.email, admin: grants.some((x) => x.perms.admin === true), grants };
}

async function me(env, actor) {
  const d = await env.DB.prepare("SELECT DISTINCT dept FROM signal_types WHERE dept IS NOT NULL AND deleted_at IS NULL ORDER BY dept").all();
  const sig = await sha256(JSON.stringify(actor.grants.map((g) => [g.role_id, g.show_id, g.dept, g.perms])));
  return {
    version: VERSION, now: nowISO(),
    actor: { id: actor.id, name: actor.name, email: actor.email || null, admin: actor.admin },
    grants: actor.grants, grants_sig: sig,
    depts: (d.results || []).map((r) => r.dept),
  };
}

/* ================= row context (batch overlay + DB lookups, cached) ================= */
function makeCtx(env) {
  const overlay = {}; const cache = {};
  async function get(table, id) {
    if (!id) return null;
    if (overlay[table] && overlay[table][id]) return overlay[table][id];
    const ck = table + ":" + id;
    if (ck in cache) return cache[ck];
    const r = await env.DB.prepare(`SELECT * FROM ${table} WHERE id=?1`).bind(id).first();
    cache[ck] = r || null;
    return cache[ck];
  }
  function stage(table, row) { (overlay[table] = overlay[table] || {})[row.id] = row; }
  async function endpointOwner(epId) {
    if (!epId) return null;
    for (const t of ["units", "control_points"]) {
      for (const r of Object.values(overlay[t] || {})) if (r.endpoint_id === epId) return { table: t, row: r };
    }
    let r = await env.DB.prepare("SELECT * FROM units WHERE endpoint_id=?1").bind(epId).first();
    if (r) return { table: "units", row: r };
    r = await env.DB.prepare("SELECT * FROM control_points WHERE endpoint_id=?1").bind(epId).first();
    if (r) return { table: "control_points", row: r };
    return null;
  }
  return { get, stage, endpointOwner };
}

async function sigDept(ctx, sigId) { const s = await ctx.get("signal_types", sigId); return s ? s.dept : null; }

// Which departments does a row belong to? (signal type is the department; see schema notes)
async function deptsOf(ctx, table, row, depth = 0) {
  const out = new Set();
  const add = (d) => { if (d) out.add(d); };
  const addAll = (s) => s.forEach(add);
  if (!row || depth > 3) return out;
  switch (table) {
    case "signal_types": add(row.dept); break;
    case "fixture_types": add(await sigDept(ctx, row.primary_signal)); break;
    case "type_interfaces": {
      add(await sigDept(ctx, row.signal_type));
      addAll(await deptsOf(ctx, "fixture_types", await ctx.get("fixture_types", row.type_id), depth + 1));
      break;
    }
    case "units": addAll(await deptsOf(ctx, "fixture_types", await ctx.get("fixture_types", row.type_id), depth + 1)); break;
    case "control_points": {
      add(await sigDept(ctx, row.signal_type));
      addAll(await deptsOf(ctx, "units", await ctx.get("units", row.parent_unit_id), depth + 1));
      break;
    }
    case "network_interfaces": addAll(await deptsOf(ctx, "units", await ctx.get("units", row.unit_id), depth + 1)); break;
    case "connections":
    case "assignments": {
      if (row.signal_type) add(await sigDept(ctx, row.signal_type));
      for (const ep of [row.source_endpoint, row.dest_endpoint]) {
        const o = await ctx.endpointOwner(ep);
        if (o) addAll(await deptsOf(ctx, o.table, o.row, depth + 1));
      }
      break;
    }
  }
  return out;
}

function showOf(table, row) {
  if (!row) return null;
  if (table === "shows") return row.id;
  if (TABLES[table].scope === "show" || table === "positions") return row.show_id || null;
  return null;
}

// Can actor perform kind ("write"|"delete") on this row?
async function allowed(ctx, actor, kind, table, row) {
  if (actor.admin) return true;
  const rowShow = showOf(table, row);
  if (rowShow) {
    const s = await ctx.get("shows", rowShow);
    if (s && s.locked) return false; // locked shows are admin-only
  }
  let depts = null;
  for (const g of actor.grants) {
    const scope = g.perms && g.perms[kind] && g.perms[kind][table];
    if (!scope) continue;
    if (rowShow && g.show_id !== "*" && g.show_id !== rowShow) continue;
    if (scope === "show" && table !== "endpoints" && !rowShow) continue; // e.g. venue positions
    if (scope === "dept") {
      if (!g.dept) continue;
      if (!depts) depts = await deptsOf(ctx, table, row);
      if (!depts.has(g.dept)) continue;
    }
    return true;
  }
  return false;
}

// Read visibility (sync + trace)
function readable(actor, table, row) {
  if (actor.admin) return true;
  const rowShow = showOf(table, row);
  return actor.grants.some((g) => {
    const hidden = (g.perms && g.perms.hidden) || [];
    if (hidden.includes(table)) return false;
    if (!rowShow) return true;
    return g.show_id === "*" || g.show_id === rowShow;
  });
}

/* ================= sync ================= */
async function sync(env, actor, since) {
  // cursor overlaps 5s back so a write stamped just before a concurrent read is never skipped;
  // the client dedupes by rev.
  const cursor = new Date(Date.now() - 5000).toISOString();
  const tables = {};
  for (const t of ORDER) {
    const q = since
      ? env.DB.prepare(`SELECT * FROM ${t} WHERE updated_at > ?1 ORDER BY updated_at`).bind(since)
      : env.DB.prepare(`SELECT * FROM ${t} ORDER BY updated_at`);
    const res = await q.all();
    tables[t] = (res.results || []).filter((r) => readable(actor, t, r));
  }
  return { cursor, full: !since, tables };
}

/* ================= batch writes ================= */
function clean(table, row) {
  const out = { id: String(row.id) };
  for (const c of TABLES[table].cols) {
    if (!(c in row)) continue;
    let v = row[c];
    if (v === "" || v === undefined) v = null;
    if (typeof v === "boolean") v = v ? 1 : 0;
    if (v !== null && typeof v === "object") v = JSON.stringify(v);
    out[c] = v;
  }
  return out;
}

async function batch(env, actor, b) {
  const ops = Array.isArray(b && b.ops) ? b.ops : fail("batch requires ops[]");
  if (ops.length > 500) fail("max 500 ops per batch");
  const force = !!b.force && actor.admin; // admin bootstrap upload: skip rev conflicts
  const ctx = makeCtx(env);
  const now = nowISO();
  const results = new Array(ops.length);
  const stmts = [];

  // stable order: upserts parent->child, then deletes
  const idx = ops.map((o, i) => i).sort((a, z) => {
    const oa = ops[a], oz = ops[z];
    const da = oa.op === "delete" ? 1 : 0, dz = oz.op === "delete" ? 1 : 0;
    if (da !== dz) return da - dz;
    return ORDER.indexOf(oa.table) - ORDER.indexOf(oz.table);
  });

  for (const i of idx) {
    const o = ops[i] || {};
    const t = o.table;
    if (!TABLES[t]) { results[i] = { status: "invalid", error: "unknown table " + t }; continue; }
    if (!o.row || !o.row.id) { results[i] = { table: t, status: "invalid", error: "row.id required" }; continue; }
    const id = String(o.row.id);
    const existing = await ctx.get(t, id);

    if (!force && existing && o.base_rev !== existing.rev) {
      results[i] = { table: t, id, status: "conflict", row: existing }; continue;
    }

    if (o.op === "delete") {
      if (!existing || existing.deleted_at) { results[i] = { table: t, id, status: "ok", row: existing }; continue; }
      if (!(await allowed(ctx, actor, "delete", t, existing))) { results[i] = { table: t, id, status: "denied", error: "no delete permission" }; continue; }
      const rev = existing.rev + 1;
      stmts.push(env.DB.prepare(`UPDATE ${t} SET deleted_at=?2, rev=?3, updated_at=?2, updated_by=?4 WHERE id=?1`).bind(id, now, rev, actor.name));
      stmts.push(logChange(env, now, actor.name, t, id, "delete", existing, null));
      const after = { ...existing, deleted_at: now, rev, updated_at: now, updated_by: actor.name };
      ctx.stage(t, after);
      results[i] = { table: t, id, status: "ok", row: after };
      continue;
    }

    // upsert
    const incoming = clean(t, o.row);
    // derive show_id for children when the client left it blank
    if ((t === "control_points" || t === "network_interfaces") && !incoming.show_id) {
      const parent = await ctx.get("units", t === "control_points" ? incoming.parent_unit_id : incoming.unit_id);
      if (parent) incoming.show_id = parent.show_id;
    }
    const merged = existing ? { ...existing, ...incoming } : incoming;
    if (existing && !(await allowed(ctx, actor, "write", t, existing))) { results[i] = { table: t, id, status: "denied", error: "no write permission on current row" }; continue; }
    if (!(await allowed(ctx, actor, "write", t, merged))) { results[i] = { table: t, id, status: "denied", error: "no write permission" }; continue; }

    const cols = TABLES[t].cols.filter((c) => c in incoming);
    if (existing) {
      const rev = existing.rev + 1;
      const sets = cols.map((c, k) => `${c}=?${k + 2}`);
      const n = cols.length;
      const sql = `UPDATE ${t} SET ${sets.concat([`rev=?${n + 2}`, `updated_at=?${n + 3}`, `updated_by=?${n + 4}`, "deleted_at=NULL"]).join(", ")} WHERE id=?1`;
      stmts.push(env.DB.prepare(sql).bind(id, ...cols.map((c) => incoming[c]), rev, now, actor.name));
      const after = { ...merged, rev, updated_at: now, updated_by: actor.name, deleted_at: null };
      stmts.push(logChange(env, now, actor.name, t, id, "update", existing, after));
      ctx.stage(t, after);
      results[i] = { table: t, id, status: "ok", row: after };
    } else {
      const all = ["id"].concat(cols, ["rev", "created_by", "updated_at", "updated_by"]);
      const vals = [id].concat(cols.map((c) => incoming[c]), [1, actor.name, now, actor.name]);
      const sql = `INSERT INTO ${t} (${all.join(",")}) VALUES (${all.map((_, k) => "?" + (k + 1)).join(",")})`;
      stmts.push(env.DB.prepare(sql).bind(...vals));
      const after = { ...incoming, rev: 1, created_by: actor.name, updated_at: now, updated_by: actor.name, deleted_at: null };
      stmts.push(logChange(env, now, actor.name, t, id, "insert", null, after));
      ctx.stage(t, after);
      results[i] = { table: t, id, status: "ok", row: after };
    }
  }

  if (stmts.length) {
    try { await env.DB.batch(stmts); }
    catch (e) {
      // nothing committed (D1 batch is one transaction). Report why so the client can isolate the bad op.
      fail("batch rolled back: " + String((e && e.message) || e), 409);
    }
  }
  return { now, results };
}

function logChange(env, at, actor, tbl, rowId, op, before, after) {
  return env.DB.prepare("INSERT INTO _changes (at,actor,tbl,row_id,op,before,after) VALUES (?1,?2,?3,?4,?5,?6,?7)")
    .bind(at, actor, tbl, rowId, op, before ? JSON.stringify(before) : null, after ? JSON.stringify(after) : null);
}

/* ================= trace (computed live, never stored) ================= */
async function trace(env, actor, unitId) {
  if (!unitId) fail("trace requires ?unit=");
  const unit = await env.DB.prepare("SELECT * FROM units WHERE id=?1 AND deleted_at IS NULL").bind(unitId).first();
  if (!unit || !readable(actor, "units", unit)) fail("unit not found", 404);
  const res = await env.DB.prepare(`
    WITH RECURSIVE
    seeds(ep) AS (
      SELECT endpoint_id FROM units WHERE id=?1
      UNION SELECT endpoint_id FROM control_points WHERE parent_unit_id=?1 AND deleted_at IS NULL
    ),
    edges(src, dst, kind, edge_id, info) AS (
      SELECT source_endpoint, dest_endpoint, 'connection', id, COALESCE(notes, connection_type) FROM connections WHERE deleted_at IS NULL
      UNION ALL
      SELECT source_endpoint, dest_endpoint, 'assignment', id, COALESCE(level,'') || ' ' || COALESCE(notes, group_name, '') FROM assignments WHERE deleted_at IS NULL
    ),
    walk(src, dst, kind, edge_id, info, depth, path) AS (
      SELECT e.src, e.dst, e.kind, e.edge_id, e.info, 0, ',' || e.src || ',' || COALESCE(e.dst,'') || ','
        FROM edges e JOIN seeds s ON e.src = s.ep
      UNION ALL
      SELECT e.src, e.dst, e.kind, e.edge_id, e.info, w.depth + 1, w.path || COALESCE(e.dst,'') || ','
        FROM walk w JOIN edges e ON e.src = w.dst
        WHERE w.kind = 'connection' AND w.depth < 16 AND instr(w.path, ',' || COALESCE(e.dst,'~') || ',') = 0
    )
    SELECT * FROM walk ORDER BY path`).bind(unitId).all();
  const ctx = makeCtx(env);
  const steps = [];
  for (const r of res.results || []) {
    const o = await ctx.endpointOwner(r.dst);
    let label = null;
    if (o && o.table === "units") label = `#${o.row.unit_num} ${o.row.purpose || ""}`.trim();
    else if (o && o.table === "control_points") label = o.row.label;
    else if (r.dst) { const inf = await env.DB.prepare("SELECT label FROM infrastructure WHERE endpoint_id=?1").bind(r.dst).first(); label = inf ? inf.label : r.dst; }
    steps.push({ depth: r.depth, kind: r.kind, edge_id: r.edge_id, info: (r.info || "").trim(), to: r.dst, to_label: label });
  }
  return { unit: { id: unit.id, unit_num: unit.unit_num, purpose: unit.purpose }, steps };
}

/* ================= show clone (template = clone, not inheritance) ================= */
async function cloneShow(env, actor, b) {
  if (!b || !b.from) fail("clone requires from");
  const src = await env.DB.prepare("SELECT * FROM shows WHERE id=?1").bind(b.from).first();
  if (!src) fail("source show not found", 404);
  const now = nowISO(), who = actor.name;
  const map = {}; const m = (id) => (id && map[id]) || id;
  const fresh = (id) => (map[id] = uuid());
  const newShow = fresh(src.id);
  const stmts = [];
  const ins = (t, row) => {
    const cols = ["id"].concat(TABLES[t].cols, ["rev", "created_by", "updated_at", "updated_by"]);
    const vals = cols.map((c) => c === "rev" ? 1 : c === "created_by" || c === "updated_by" ? who : c === "updated_at" ? now : (row[c] === undefined ? null : row[c]));
    stmts.push(env.DB.prepare(`INSERT INTO ${t} (${cols.join(",")}) VALUES (${cols.map((_, k) => "?" + (k + 1)).join(",")})`).bind(...vals));
  };
  ins("shows", { ...src, id: newShow, title: b.title || src.title + " (copy)", season: b.season || src.season, locked: 0, is_template: 0 });
  const rows = async (t) => ((await env.DB.prepare(`SELECT * FROM ${t} WHERE show_id=?1 AND deleted_at IS NULL`).bind(src.id).all()).results || []);
  const pos = await rows("positions"), units = await rows("units"), cps = await rows("control_points");
  const nis = await rows("network_interfaces"), conns = await rows("connections"), asg = await rows("assignments");
  for (const r of pos) ins("positions", { ...r, id: fresh(r.id), show_id: newShow });
  for (const r of units.concat(cps)) if (r.endpoint_id) { const old = r.endpoint_id; ins("endpoints", { id: fresh(old), class: units.includes(r) ? "physical" : "virtual" }); }
  for (const r of units) ins("units", { ...r, id: fresh(r.id), show_id: newShow, endpoint_id: m(r.endpoint_id), position_id: m(r.position_id) });
  for (const r of cps) ins("control_points", { ...r, id: fresh(r.id), show_id: newShow, endpoint_id: m(r.endpoint_id), parent_unit_id: m(r.parent_unit_id) });
  for (const r of nis) ins("network_interfaces", { ...r, id: fresh(r.id), show_id: newShow, unit_id: m(r.unit_id) });
  for (const r of conns) ins("connections", { ...r, id: fresh(r.id), show_id: newShow, source_endpoint: m(r.source_endpoint), dest_endpoint: m(r.dest_endpoint) });
  for (const r of asg) ins("assignments", { ...r, id: fresh(r.id), show_id: newShow, source_endpoint: m(r.source_endpoint), dest_endpoint: m(r.dest_endpoint) });
  stmts.push(logChange(env, now, who, "shows", newShow, "insert", null, { cloned_from: src.id }));
  await env.DB.batch(stmts);
  return { ok: true, show_id: newShow, counts: { positions: pos.length, units: units.length, control_points: cps.length, network_interfaces: nis.length, connections: conns.length, assignments: asg.length } };
}

/* ================= admin: users / grants / roles ================= */
async function listUsers(env) {
  const u = await env.DB.prepare("SELECT id,name,email,created_at,created_by,revoked_at,last_seen_at FROM _users ORDER BY name").all();
  const g = await env.DB.prepare("SELECT * FROM _grants ORDER BY created_at").all();
  return { users: u.results || [], grants: g.results || [] };
}
async function writeUser(env, actor, b) {
  const op = (b && b.op) || "create";
  const now = nowISO();
  if (op === "create") {
    if (!b.name) fail("name required");
    const id = uuid(), key = newKey();
    const stmts = [env.DB.prepare("INSERT INTO _users (id,name,email,key_hash,created_at,created_by) VALUES (?1,?2,?3,?4,?5,?6)")
      .bind(id, b.name, b.email || null, await sha256(key), now, actor.name)];
    if (b.role_id) {
      stmts.push(env.DB.prepare("INSERT INTO _grants (id,user_id,role_id,show_id,dept,created_at,created_by) VALUES (?1,?2,?3,?4,?5,?6,?7)")
        .bind(uuid(), id, b.role_id, b.show_id || "*", b.dept || null, now, actor.name));
    }
    stmts.push(logChange(env, now, actor.name, "_users", id, "insert", null, { name: b.name, email: b.email || null, role_id: b.role_id || null }));
    await env.DB.batch(stmts);
    return { ok: true, id, key };
  }
  if (!b.id) fail("id required");
  if (op === "revoke" || op === "restore") {
    await env.DB.batch([
      env.DB.prepare("UPDATE _users SET revoked_at=?2 WHERE id=?1").bind(b.id, op === "revoke" ? now : null),
      logChange(env, now, actor.name, "_users", b.id, op, null, null),
    ]);
    return { ok: true };
  }
  if (op === "rekey") {
    const key = newKey();
    await env.DB.batch([
      env.DB.prepare("UPDATE _users SET key_hash=?2, revoked_at=NULL WHERE id=?1").bind(b.id, await sha256(key)),
      logChange(env, now, actor.name, "_users", b.id, "rekey", null, null),
    ]);
    return { ok: true, id: b.id, key };
  }
  if (op === "update") {
    await env.DB.prepare("UPDATE _users SET name=COALESCE(?2,name), email=?3 WHERE id=?1").bind(b.id, b.name || null, b.email || null).run();
    return { ok: true };
  }
  fail("unknown op " + op);
}
async function writeGrant(env, actor, b) {
  const now = nowISO();
  if (b.op === "remove") {
    if (!b.id) fail("id required");
    await env.DB.batch([env.DB.prepare("DELETE FROM _grants WHERE id=?1").bind(b.id), logChange(env, now, actor.name, "_grants", b.id, "delete", null, null)]);
    return { ok: true };
  }
  if (!b.user_id || !b.role_id) fail("user_id and role_id required");
  const id = uuid();
  await env.DB.batch([
    env.DB.prepare("INSERT INTO _grants (id,user_id,role_id,show_id,dept,created_at,created_by) VALUES (?1,?2,?3,?4,?5,?6,?7)")
      .bind(id, b.user_id, b.role_id, b.show_id || "*", b.dept || null, now, actor.name),
    logChange(env, now, actor.name, "_grants", id, "insert", null, b),
  ]);
  return { ok: true, id };
}
async function listRoles(env) {
  const r = await env.DB.prepare("SELECT * FROM _roles ORDER BY name").all();
  return { roles: (r.results || []).map((x) => ({ ...x, perms: parsePerms(x.perms) })), tables: ORDER };
}
async function writeRole(env, actor, b) {
  if (!b || !b.id || !b.name || !b.perms) fail("id, name, perms required");
  const perms = typeof b.perms === "string" ? parsePerms(b.perms) : b.perms;
  if (b.id === "admin" && perms.admin !== true) fail("the admin role must keep admin:true");
  for (const k of ["write", "delete"]) for (const [t, v] of Object.entries(perms[k] || {})) {
    if (!TABLES[t]) fail(`unknown table in ${k}: ${t}`);
    if (![true, false, "show", "dept"].includes(v)) fail(`bad scope for ${k}.${t}: ${v}`);
  }
  const now = nowISO();
  const before = await env.DB.prepare("SELECT * FROM _roles WHERE id=?1").bind(b.id).first();
  await env.DB.batch([
    env.DB.prepare("INSERT INTO _roles (id,name,perms,updated_at,updated_by) VALUES (?1,?2,?3,?4,?5) ON CONFLICT(id) DO UPDATE SET name=excluded.name, perms=excluded.perms, updated_at=excluded.updated_at, updated_by=excluded.updated_by")
      .bind(b.id, b.name, JSON.stringify(perms), now, actor.name),
    logChange(env, now, actor.name, "_roles", b.id, before ? "update" : "insert", before, { name: b.name, perms }),
  ]);
  return { ok: true, id: b.id };
}
async function listChanges(env, url) {
  const where = [], binds = [];
  for (const k of ["tbl", "row_id", "actor"]) { const v = url.searchParams.get(k); if (v) { binds.push(v); where.push(`${k}=?${binds.length}`); } }
  const limit = Math.min(500, parseInt(url.searchParams.get("limit") || "100", 10) || 100);
  const sql = "SELECT * FROM _changes" + (where.length ? " WHERE " + where.join(" AND ") : "") + ` ORDER BY seq DESC LIMIT ${limit}`;
  const r = await env.DB.prepare(sql).bind(...binds).all();
  return { changes: r.results || [] };
}

/* ================= backups (R2 'BACKUPS') ================= */
async function snapshot(env, who) {
  if (!env.BACKUPS) fail("no BACKUPS bucket bound", 501);
  const out = { app: "throughline", version: VERSION, created_at: nowISO(), by: who, tables: {} };
  for (const t of ORDER.concat(["_roles", "_users", "_grants"])) out.tables[t] = (await env.DB.prepare(`SELECT * FROM ${t}`).all()).results || [];
  const key = `snapshots/${out.created_at.replace(/[:.]/g, "-")}_${who}.json`;
  await env.BACKUPS.put(key, JSON.stringify(out), { httpMetadata: { contentType: "application/json" } });
  const l = await env.BACKUPS.list({ prefix: "snapshots/", limit: 1000 });
  const old = (l.objects || []).map((o) => o.key).sort().reverse().slice(SNAPSHOT_KEEP);
  for (const k of old) await env.BACKUPS.delete(k);
  return { ok: true, key, counts: Object.fromEntries(Object.entries(out.tables).map(([k, v]) => [k, v.length])) };
}
async function listSnapshots(env) {
  if (!env.BACKUPS) fail("no BACKUPS bucket bound", 501);
  const l = await env.BACKUPS.list({ prefix: "snapshots/", limit: 1000 });
  return { snapshots: (l.objects || []).map((o) => ({ key: o.key, size: o.size, uploaded: o.uploaded })).sort((a, b) => (a.key < b.key ? 1 : -1)) };
}
