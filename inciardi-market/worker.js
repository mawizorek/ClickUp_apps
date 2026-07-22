/**
 * Inciardi Mini Print Market Tracker — Cloudflare Worker (v1.4)
 *
 * Relational backend over D1 (catalog / inventory / images / history / machines) + R2 (image bytes),
 * plus the live eBay market feed. This is the API the terminal front-end reads.
 *
 * READS (open):
 *   GET /market              live eBay listings, diffed vs KV snapshot
 *   GET /catalog             master print universe from D1, each print + its images
 *   GET /inventory           owned copies (D1), joined to catalog + primary image
 *   GET /history?print_id=   per-print trend points + gone events
 *   GET /machines            vending machines (D1); filter by ?state= &city= &status= &collection=; or ?print_id= for machines carrying a print
 *   GET /usage               R2 storage used vs cap (for the storage meter)
 *   GET /img?key= &w=        serve a stored image from R2 (primary path)
 *   GET /img?u= &w=          allowlisted CDN passthrough (transient preview / pre-store)
 *
 * WRITES (gated: header x-write-key matches WRITE_KEY [michael] or WRITE_KEY_NICK [nick]):
 *   POST /catalog                upsert a print (manual add / edit); dedupe is client-side
 *   POST /catalog/image          upload an image (base64 body) -> R2 -> print_image row
 *   POST /catalog/image/scrub    fetch an allowlisted CDN url server-side -> store in R2
 *   POST /catalog/image/state    { image_id, op: primary | archive | restore | delete }
 *   POST /inventory              { op: upsert | delete } one physical owned copy
 *   POST /machines               { op: upsert | delete } one vending machine
 *   POST /machines/stock         { machine_id, status, source, notes } flip status + log a machine_event
 *   POST /machines/print         { op: link | unlink, machine_id, print_id, in_stock, last_seen_at } M:N print<->machine
 *
 * BACKUPS (gated) — the everyday safety net (D1 Time Travel is the deeper 30-day platform restore):
 *   GET  /snapshots              list saved snapshots (newest first) from R2 snapshots/
 *   POST /snapshot               dump catalog + aliases + inventory (+ image metadata) to R2 as JSON
 *   POST /restore  { key }       SOFT restore: full-replace inventory + upsert catalog + add aliases
 *                                from a snapshot. Never DELETEs catalog (so print_image / machine_print
 *                                cascades stay intact) and auto-takes a pre-restore snapshot first.
 *
 * scheduled() cron: banks market_point + print_point + gone_event into D1 each run.
 *
 * STORAGE CAP: R2 has no native write-blocking quota. We enforce our own: every image
 * write checks total stored bytes (tracked in D1) and refuses to cross STORAGE_CAP_BYTES.
 *
 * Bindings: KV 'SNAPSHOTS', D1 'DB', R2 'IMAGES'.
 * Secrets: EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, WRITE_KEY, (optional) WRITE_KEY_NICK.
 * NOTE: deploy target. NOT served by GitHub Pages.
 */
// redeploy nonce 2026-07-13: force Workers Builds to rebind IMAGES after the inciardi-images bucket was created.

const SEARCH_QUERY = "inciardi mini print";
const MARKETPLACE = "EBAY_US";
const RETAIL_DEFAULT = 14;
const UNDERPRICED_PCT = 0.85;
const EXCLUSIVE_TOKENS = ["nyc", "lacma", "grand central", "holiday", "exclusive"];
const PACK_TOKENS = ["pack", "set", "lot", "bundle"];

// GET /img may only fetch/store from these hosts (keeps it from being an open proxy).
const IMG_HOST_ALLOW = ["cdn.shopify.com"];
const IMG_CACHE_TTL = 604800; // 7 days at the edge

// HARD R2 storage ceiling. R2's free tier is 10GB-month and egress is free, but there is
// NO native quota that blocks writes, so we enforce our own well under Michael's 5GB line.
// Archived images still occupy R2 (their blob is kept for restore); only delete frees space.
const STORAGE_CAP_BYTES = 4.5 * 1024 * 1024 * 1024; // 4.5 GB

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-write-key",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(request.url);
    const p = url.pathname;
    const base = url.origin;
    try {
      if ((p === "/market" || p === "/") && request.method === "GET") return json(await buildMarket(env));
      if (p === "/img" && request.method === "GET") return serveImage(url, env);
      if (p === "/catalog" && request.method === "GET") return json(await readCatalog(env, base));
      if (p === "/inventory" && request.method === "GET") return json(await readInventory(env, base));
      if (p === "/history" && request.method === "GET") return json(await readHistory(env, url));
      if (p === "/machines" && request.method === "GET") return json(await readMachines(env, url, base));
      if (p === "/usage" && request.method === "GET") return json(await readUsage(env));

      if (p === "/catalog" && request.method === "POST") { gate(request, env); return json(await upsertCatalog(env, await request.json())); }
      if (p === "/catalog/image" && request.method === "POST") { gate(request, env); return json(await uploadImage(env, await request.json())); }
      if (p === "/catalog/image/scrub" && request.method === "POST") { gate(request, env); return json(await scrubImage(env, await request.json())); }
      if (p === "/catalog/image/state" && request.method === "POST") { gate(request, env); return json(await imageState(env, await request.json())); }
      if (p === "/inventory" && request.method === "POST") { gate(request, env); return json(await writeInventory(env, await request.json())); }
      if (p === "/machines" && request.method === "POST") { gate(request, env); return json(await writeMachine(env, await request.json())); }
      if (p === "/machines/stock" && request.method === "POST") { gate(request, env); return json(await machineStock(env, await request.json())); }
      if (p === "/machines/print" && request.method === "POST") { gate(request, env); return json(await machinePrint(env, await request.json())); }

      // ---- backups ----
      if (p === "/snapshots" && request.method === "GET") { gate(request, env); return json(await listSnapshots(env)); }
      if (p === "/snapshot" && request.method === "POST") { const who = gate(request, env); return json(await createSnapshot(env, who)); }
      if (p === "/restore" && request.method === "POST") { gate(request, env); return json(await restoreSnapshot(env, await request.json())); }

      return json({ error: "not found" }, 404);
    } catch (err) {
      const code = (err && err.status) || 502;
      return json({ error: String((err && err.message) || err) }, code);
    }
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runCron(env).catch((e) => console.error("cron", e)));
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), { status, headers: { "Content-Type": "application/json", ...CORS } });
}
// Multi-key auth. Returns the ACTOR name for the supplied key, or throws 401.
// WRITE_KEY = michael (back-compat: this was the single original key). WRITE_KEY_NICK = nick (optional).
function gate(request, env) {
  const supplied = request.headers.get("x-write-key") || "";
  const map = {};
  if (env.WRITE_KEY) map[env.WRITE_KEY] = "michael";
  if (env.WRITE_KEY_NICK) map[env.WRITE_KEY_NICK] = "nick";
  const actor = supplied && map[supplied];
  if (!actor) { const e = new Error("unauthorized: bad or missing x-write-key"); e.status = 401; throw e; }
  return actor;
}
function uuid() { return (crypto.randomUUID && crypto.randomUUID()) || (Date.now().toString(36) + Math.random().toString(36).slice(2)); }
function nowISO() { return new Date().toISOString(); }
function norm(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
function slug(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || ("print-" + uuid().slice(0, 8)); }
function extFor(ct) { return ct && ct.includes("png") ? "png" : ct && ct.includes("webp") ? "webp" : ct && ct.includes("gif") ? "gif" : "jpg"; }

/* ================= backups (snapshot / restore) ================= */
// A snapshot is a JSON export of the owner-authored data (catalog + aliases + inventory + image metadata)
// written to R2 under snapshots/. It's the everyday, in-app undo for a fat-finger. D1 Time Travel is the
// deeper platform net (point-in-time restore up to 30 days) and is documented in the README.
async function createSnapshot(env, actor) {
  const [cat, alias, inv, img] = await Promise.all([
    env.DB.prepare("SELECT * FROM catalog").all(),
    env.DB.prepare("SELECT * FROM catalog_alias").all(),
    env.DB.prepare("SELECT * FROM inventory").all(),
    env.DB.prepare("SELECT * FROM print_image").all(),
  ]);
  const payload = {
    version: 1, created_at: nowISO(), by: actor || "unknown",
    counts: {
      catalog: (cat.results || []).length, catalog_alias: (alias.results || []).length,
      inventory: (inv.results || []).length, print_image: (img.results || []).length,
    },
    catalog: cat.results || [], catalog_alias: alias.results || [],
    inventory: inv.results || [], print_image: img.results || [],
  };
  const stamp = nowISO().replace(/[:.]/g, "-");
  const key = `snapshots/${stamp}_${actor || "unknown"}.json`;
  await env.IMAGES.put(key, JSON.stringify(payload), { httpMetadata: { contentType: "application/json" } });
  return { ok: true, key, by: payload.by, created_at: payload.created_at, counts: payload.counts };
}
async function listSnapshots(env) {
  const l = await env.IMAGES.list({ prefix: "snapshots/", limit: 200 });
  const snapshots = (l.objects || [])
    .map((o) => ({ key: o.key, size: o.size, uploaded: o.uploaded }))
    .sort((a, b) => (a.key < b.key ? 1 : -1)); // newest first (timestamped keys)
  return { count: snapshots.length, snapshots };
}
// SOFT restore: never DELETE catalog (that would cascade-wipe print_image + machine_print). Instead:
//  - inventory: full replace (it has no children) = the owned ledger is reinstated exactly.
//  - catalog: UPSERT every snapshot row = renamed/edited/deleted prints come back, added-since stay.
//  - catalog_alias: additive.
// Auto-snapshots the CURRENT state first, so a restore is itself undoable.
async function restoreSnapshot(env, body) {
  if (!body || !body.key) throw new Error("restore requires a snapshot key");
  const obj = await env.IMAGES.get(body.key);
  if (!obj) throw new Error("snapshot not found: " + body.key);
  let snap; try { snap = JSON.parse(await obj.text()); } catch (e) { throw new Error("snapshot is not valid JSON"); }
  if (!snap || !Array.isArray(snap.catalog) || !Array.isArray(snap.inventory)) throw new Error("snapshot payload missing catalog/inventory");

  const safety = await createSnapshot(env, "pre-restore");
  const now = nowISO();
  const stmts = [];
  // full-replace inventory
  stmts.push(env.DB.prepare("DELETE FROM inventory"));
  for (const v of snap.inventory) {
    stmts.push(env.DB.prepare(
      "INSERT INTO inventory (inv_id,print_id,provisional_label,disposition,condition,framed,qty,acquired_price,acquired_where,acquired_at,sold_price,sold_at,notes,created_at,updated_at) " +
      "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15)"
    ).bind(v.inv_id, v.print_id ?? null, v.provisional_label ?? null, v.disposition || "own", v.condition ?? null,
      v.framed ? 1 : 0, v.qty ?? 1, v.acquired_price ?? null, v.acquired_where ?? null, v.acquired_at ?? null,
      v.sold_price ?? null, v.sold_at ?? null, v.notes ?? null, v.created_at || now, v.updated_at || now));
  }
  // upsert catalog (no delete -> no cascade)
  for (const r of snap.catalog) {
    stmts.push(env.DB.prepare(
      "INSERT INTO catalog (print_id,title,category,exclusive,retail,in_print,pack_of,pack_from,source,locked,notes,created_at,updated_at) " +
      "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13) " +
      "ON CONFLICT(print_id) DO UPDATE SET title=excluded.title, category=excluded.category, exclusive=excluded.exclusive, " +
      "retail=excluded.retail, in_print=excluded.in_print, pack_of=excluded.pack_of, pack_from=excluded.pack_from, " +
      "source=excluded.source, locked=excluded.locked, notes=excluded.notes, updated_at=excluded.updated_at"
    ).bind(r.print_id, r.title, r.category ?? null, r.exclusive ?? null, r.retail ?? null, r.in_print ? 1 : 0,
      r.pack_of ?? null, r.pack_from ?? null, r.source || "manual", r.locked ? 1 : 0, r.notes ?? null,
      r.created_at || now, r.updated_at || now));
  }
  // aliases additive
  for (const a of (snap.catalog_alias || [])) {
    stmts.push(env.DB.prepare("INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES (?1,?2,?3)").bind(a.print_id, a.alias, a.norm));
  }
  await env.DB.batch(stmts);
  return { ok: true, from: body.key, restored: snap.counts || null, safety_snapshot: safety.key,
    note: "inventory full-replaced; catalog upserted (prints added after the snapshot were kept). images & machines untouched." };
}

/* ================= storage cap (D1-tracked bytes vs R2 ceiling) ================= */
async function storedBytes(env) {
  const r = await env.DB.prepare("SELECT COALESCE(SUM(bytes),0) AS b FROM print_image WHERE r2_key IS NOT NULL").first();
  return (r && r.b) || 0;
}
// Refuse a write that would cross the cap. Called before every env.IMAGES.put.
async function assertRoom(env, incoming) {
  const used = await storedBytes(env);
  if (used + (incoming || 0) > STORAGE_CAP_BYTES) {
    const gb = (n) => (n / (1024 * 1024 * 1024)).toFixed(2);
    const e = new Error(`storage cap reached: ${gb(used)}GB stored of ${gb(STORAGE_CAP_BYTES)}GB cap. Delete images to free space.`);
    e.status = 507; throw e;
  }
}
async function readUsage(env) {
  const used = await storedBytes(env);
  const cnt = await env.DB.prepare("SELECT COUNT(*) AS c FROM print_image WHERE r2_key IS NOT NULL").first();
  return {
    used_bytes: used, cap_bytes: STORAGE_CAP_BYTES,
    used_gb: +(used / (1024 * 1024 * 1024)).toFixed(3), cap_gb: +(STORAGE_CAP_BYTES / (1024 * 1024 * 1024)).toFixed(1),
    pct: Math.round((used / STORAGE_CAP_BYTES) * 100), images: (cnt && cnt.c) || 0,
  };
}

/* ================= image storage (R2) ================= */
async function serveImage(url, env) {
  const key = url.searchParams.get("key");
  if (key) {
    const obj = await env.IMAGES.get(key);
    if (!obj) return json({ error: "not found" }, 404);
    const h = new Headers(CORS);
    h.set("Content-Type", (obj.httpMetadata && obj.httpMetadata.contentType) || "image/jpeg");
    h.set("Cache-Control", `public, max-age=${IMG_CACHE_TTL}, immutable`);
    return new Response(obj.body, { status: 200, headers: h });
  }
  // CDN passthrough (allowlisted) for transient preview / not-yet-stored images.
  const target = url.searchParams.get("u");
  if (!target) return json({ error: "img requires ?key= or ?u=" }, 400);
  let up; try { up = new URL(target); } catch { return json({ error: "bad url" }, 400); }
  if (up.protocol !== "https:" || !IMG_HOST_ALLOW.includes(up.hostname)) return json({ error: "host not allowed" }, 403);
  const w = url.searchParams.get("w");
  if (w && /^\d{2,4}$/.test(w) && !up.searchParams.has("width")) up.searchParams.set("width", w);
  const res = await fetch(up.toString(), { cf: { cacheEverything: true, cacheTtl: IMG_CACHE_TTL }, headers: { Accept: "image/*" } });
  if (!res.ok) return json({ error: `upstream ${res.status}` }, 502);
  const h = new Headers(CORS);
  h.set("Content-Type", res.headers.get("Content-Type") || "image/jpeg");
  h.set("Cache-Control", `public, max-age=${IMG_CACHE_TTL}, immutable`);
  return new Response(res.body, { status: 200, headers: h });
}

function b64ToBytes(b64) {
  const clean = String(b64).replace(/^data:[^,]+,/, "");
  const bin = atob(clean);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}
async function clearPrimary(env, print_id) {
  await env.DB.prepare("UPDATE print_image SET is_primary=0 WHERE print_id=?1 AND is_primary=1").bind(print_id).run();
}
async function insertImageRow(env, r) {
  await env.DB.prepare(
    "INSERT INTO print_image (image_id,print_id,r2_key,source_url,kind,content_type,bytes,width,height,is_primary,status,sort,created_at) " +
    "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,'active',?11,?12)"
  ).bind(r.image_id, r.print_id, r.r2_key || null, r.source_url || null, r.kind, r.content_type || null,
    r.bytes || null, r.width || null, r.height || null, r.is_primary ? 1 : 0, r.sort || 0, nowISO()).run();
}

// POST /catalog/image { print_id, data (base64), content_type, make_primary, width, height }
async function uploadImage(env, body) {
  if (!body || !body.print_id || !body.data) throw new Error("upload requires print_id and data");
  const image_id = uuid();
  const ct = body.content_type || "image/jpeg";
  const bytes = b64ToBytes(body.data);
  await assertRoom(env, bytes.length); // enforce the cap BEFORE writing to R2
  const r2_key = `prints/${body.print_id}/${image_id}.${extFor(ct)}`;
  await env.IMAGES.put(r2_key, bytes, { httpMetadata: { contentType: ct } });
  const makePrimary = body.make_primary !== false; // default new uploads to primary
  if (makePrimary) await clearPrimary(env, body.print_id);
  await insertImageRow(env, { image_id, print_id: body.print_id, r2_key, kind: "upload", content_type: ct, bytes: bytes.length, width: body.width, height: body.height, is_primary: makePrimary });
  return { ok: true, image_id, r2_key };
}

// POST /catalog/image/scrub { print_id, source_url, make_primary }
// Fetch the CDN image server-side and STORE it in R2 (not just hotlink).
async function scrubImage(env, body) {
  if (!body || !body.print_id || !body.source_url) throw new Error("scrub requires print_id and source_url");
  let up; try { up = new URL(body.source_url); } catch { throw new Error("bad source_url"); }
  if (up.protocol !== "https:" || !IMG_HOST_ALLOW.includes(up.hostname)) { const e = new Error("host not allowed"); e.status = 403; throw e; }
  const res = await fetch(up.toString(), { headers: { Accept: "image/*" } });
  if (!res.ok) { const e = new Error(`upstream ${res.status}`); e.status = 502; throw e; }
  const ct = res.headers.get("Content-Type") || "image/jpeg";
  const buf = new Uint8Array(await res.arrayBuffer());
  await assertRoom(env, buf.length); // enforce the cap BEFORE writing to R2
  const image_id = uuid();
  const r2_key = `prints/${body.print_id}/${image_id}.${extFor(ct)}`;
  await env.IMAGES.put(r2_key, buf, { httpMetadata: { contentType: ct } });
  const makePrimary = body.make_primary === true;
  if (makePrimary) await clearPrimary(env, body.print_id);
  await insertImageRow(env, { image_id, print_id: body.print_id, r2_key, source_url: body.source_url, kind: "scrub", content_type: ct, bytes: buf.length, is_primary: makePrimary });
  return { ok: true, image_id, r2_key, bytes: buf.length };
}

// POST /catalog/image/state { image_id, op: primary | archive | restore | delete }
async function imageState(env, body) {
  if (!body || !body.image_id || !body.op) throw new Error("state requires image_id and op");
  const row = await env.DB.prepare("SELECT image_id,print_id,r2_key,is_primary FROM print_image WHERE image_id=?1").bind(body.image_id).first();
  if (!row) throw new Error("image not found");
  if (body.op === "primary") {
    await clearPrimary(env, row.print_id);
    await env.DB.prepare("UPDATE print_image SET is_primary=1, status='active', archived_at=NULL WHERE image_id=?1").bind(body.image_id).run();
    return { ok: true, primary: body.image_id };
  }
  if (body.op === "archive") {
    await env.DB.prepare("UPDATE print_image SET status='archived', is_primary=0, archived_at=?2 WHERE image_id=?1").bind(body.image_id, nowISO()).run();
    return { ok: true, archived: body.image_id };
  }
  if (body.op === "restore") {
    await env.DB.prepare("UPDATE print_image SET status='active', archived_at=NULL WHERE image_id=?1").bind(body.image_id).run();
    return { ok: true, restored: body.image_id };
  }
  if (body.op === "delete") {
    if (row.r2_key) { try { await env.IMAGES.delete(row.r2_key); } catch (e) { /* blob may already be gone */ } }
    await env.DB.prepare("DELETE FROM print_image WHERE image_id=?1").bind(body.image_id).run();
    return { ok: true, deleted: body.image_id };
  }
  throw new Error("unknown op: " + body.op);
}

async function imagesFor(env, print_id, base, includeArchived) {
  const q = includeArchived
    ? "SELECT * FROM print_image WHERE print_id=?1 ORDER BY is_primary DESC, sort ASC, created_at ASC"
    : "SELECT * FROM print_image WHERE print_id=?1 AND status='active' ORDER BY is_primary DESC, sort ASC, created_at ASC";
  const res = await env.DB.prepare(q).bind(print_id).all();
  return (res.results || []).map((r) => ({
    image_id: r.image_id, kind: r.kind, is_primary: !!r.is_primary, status: r.status,
    content_type: r.content_type, bytes: r.bytes, width: r.width, height: r.height,
    source_url: r.source_url,
    url: r.r2_key ? `${base}/img?key=${encodeURIComponent(r.r2_key)}`
      : (r.source_url ? `${base}/img?u=${encodeURIComponent(r.source_url)}` : null),
  }));
}

/* ================= catalog (D1) ================= */
async function readCatalog(env, base) {
  const cat = await env.DB.prepare("SELECT * FROM catalog ORDER BY category, title").all();
  const prints = [];
  for (const r of cat.results || []) {
    const aliasRes = await env.DB.prepare("SELECT alias FROM catalog_alias WHERE print_id=?1").bind(r.print_id).all();
    const images = await imagesFor(env, r.print_id, base, false);
    const primary = images.find((i) => i.is_primary) || images[0] || null;
    prints.push({
      print_id: r.print_id, name: r.title, category: r.category, exclusive: r.exclusive,
      retail: r.retail, available: !!r.in_print, packOf: r.pack_of, packFrom: r.pack_from,
      source: r.source, locked: !!r.locked, notes: r.notes,
      aliases: (aliasRes.results || []).map((a) => a.alias),
      image: primary ? primary.url : null, imageCount: images.length, images,
    });
  }
  return { version: nowISO(), source: "d1", count: prints.length, prints };
}

// POST /catalog { print_id?, name/title, category, exclusive, retail, in_print, pack_of, pack_from, aliases[], notes, source, locked }
async function upsertCatalog(env, body) {
  const title = body.title || body.name;
  if (!title) throw new Error("catalog upsert requires a title/name");
  const print_id = body.print_id || slug(title);
  const now = nowISO();
  const source = body.source || "manual";
  const locked = body.locked != null ? (body.locked ? 1 : 0) : (source === "manual" ? 1 : 0);
  await env.DB.prepare(
    "INSERT INTO catalog (print_id,title,category,exclusive,retail,in_print,pack_of,pack_from,source,locked,notes,created_at,updated_at) " +
    "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?12) " +
    "ON CONFLICT(print_id) DO UPDATE SET title=excluded.title, category=excluded.category, exclusive=excluded.exclusive, " +
    "retail=excluded.retail, in_print=excluded.in_print, pack_of=excluded.pack_of, pack_from=excluded.pack_from, " +
    "source=excluded.source, locked=excluded.locked, notes=excluded.notes, updated_at=excluded.updated_at"
  ).bind(print_id, title, body.category || null, body.exclusive || null, body.retail ?? null,
    body.in_print ? 1 : 0, body.pack_of ?? null, body.pack_from ?? null, source, locked, body.notes ?? null, now).run();
  if (Array.isArray(body.aliases)) {
    for (const a of body.aliases) {
      if (!a) continue;
      await env.DB.prepare("INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES (?1,?2,?3)").bind(print_id, a, norm(a)).run();
    }
  }
  return { ok: true, print_id };
}

/* ================= inventory (D1) ================= */
async function readInventory(env, base) {
  const res = await env.DB.prepare(
    "SELECT i.*, c.title AS catalog_title, c.category, c.exclusive, c.retail " +
    "FROM inventory i LEFT JOIN catalog c ON c.print_id=i.print_id ORDER BY i.updated_at DESC"
  ).all();
  const rows = [];
  for (const r of res.results || []) {
    let image = null;
    if (r.print_id) { const imgs = await imagesFor(env, r.print_id, base, false); const pr = imgs.find((i) => i.is_primary) || imgs[0]; image = pr ? pr.url : null; }
    rows.push({ ...r, framed: !!r.framed, name: r.catalog_title || r.provisional_label, image });
  }
  return { count: rows.length, inventory: rows };
}

// POST /inventory { op: upsert | delete, ...fields }
async function writeInventory(env, body) {
  const op = (body && body.op) || "upsert";
  const now = nowISO();
  if (op === "delete") {
    if (!body.inv_id) throw new Error("delete requires inv_id");
    await env.DB.prepare("DELETE FROM inventory WHERE inv_id=?1").bind(body.inv_id).run();
    return { ok: true, deleted: body.inv_id };
  }
  const f = {
    print_id: body.print_id ?? null, provisional_label: body.provisional_label ?? null,
    disposition: body.disposition || "own", condition: body.condition ?? null, framed: body.framed ? 1 : 0,
    qty: body.qty ?? 1, acquired_price: body.acquired_price ?? null, acquired_where: body.acquired_where ?? null,
    acquired_at: body.acquired_at ?? null, sold_price: body.sold_price ?? null, sold_at: body.sold_at ?? null, notes: body.notes ?? null,
  };
  if (body.inv_id) {
    await env.DB.prepare(
      "UPDATE inventory SET print_id=?1,provisional_label=?2,disposition=?3,condition=?4,framed=?5,qty=?6," +
      "acquired_price=?7,acquired_where=?8,acquired_at=?9,sold_price=?10,sold_at=?11,notes=?12,updated_at=?13 WHERE inv_id=?14"
    ).bind(f.print_id, f.provisional_label, f.disposition, f.condition, f.framed, f.qty, f.acquired_price, f.acquired_where, f.acquired_at, f.sold_price, f.sold_at, f.notes, now, body.inv_id).run();
    return { ok: true, updated: body.inv_id };
  }
  const inv_id = uuid();
  await env.DB.prepare(
    "INSERT INTO inventory (inv_id,print_id,provisional_label,disposition,condition,framed,qty,acquired_price,acquired_where,acquired_at,sold_price,sold_at,notes,created_at,updated_at) " +
    "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?14)"
  ).bind(inv_id, f.print_id, f.provisional_label, f.disposition, f.condition, f.framed, f.qty, f.acquired_price, f.acquired_where, f.acquired_at, f.sold_price, f.sold_at, f.notes, now).run();
  return { ok: true, inserted: inv_id };
}

/* ================= machines (D1 — location layer) ================= */
async function readMachines(env, url, base) {
  const printId = url.searchParams.get("print_id");
  if (printId) {
    const res = await env.DB.prepare(
      "SELECT m.*, mp.in_stock, mp.last_seen_at FROM machine_print mp " +
      "JOIN machine m ON m.machine_id=mp.machine_id WHERE mp.print_id=?1 ORDER BY m.state, m.city"
    ).bind(printId).all();
    return { print_id: printId, machines: res.results || [] };
  }
  const where = [], binds = [];
  for (const key of ["state", "city", "status", "collection"]) {
    const v = url.searchParams.get(key);
    if (v) { binds.push(v); where.push(`${key}=?${binds.length}`); }
  }
  const sql = "SELECT * FROM machine" + (where.length ? " WHERE " + where.join(" AND ") : "") + " ORDER BY state, city, name";
  const res = await env.DB.prepare(sql).bind(...binds).all();
  const machines = [];
  for (const m of res.results || []) {
    const pr = await env.DB.prepare(
      "SELECT mp.print_id, mp.in_stock, mp.last_seen_at, c.title, c.exclusive " +
      "FROM machine_print mp LEFT JOIN catalog c ON c.print_id=mp.print_id WHERE mp.machine_id=?1"
    ).bind(m.machine_id).all();
    machines.push({ ...m, prints: pr.results || [] });
  }
  return { count: machines.length, machines };
}

// POST /machines { op: upsert | delete, ...fields }
async function writeMachine(env, body) {
  const op = (body && body.op) || "upsert";
  const now = nowISO();
  if (op === "delete") {
    if (!body.machine_id) throw new Error("delete requires machine_id");
    await env.DB.prepare("DELETE FROM machine WHERE machine_id=?1").bind(body.machine_id).run();
    return { ok: true, deleted: body.machine_id };
  }
  if (!body.name) throw new Error("machine upsert requires a name");
  const machine_id = body.machine_id || slug(`${body.name}-${body.city || ""}`);
  const locked = body.locked != null ? (body.locked ? 1 : 0) : 0;
  await env.DB.prepare(
    "INSERT INTO machine (machine_id,name,address,city,state,country,lat,lng,collection,status,status_checked_at,source,locked,notes,created_at,updated_at) " +
    "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?15) " +
    "ON CONFLICT(machine_id) DO UPDATE SET name=excluded.name, address=excluded.address, city=excluded.city, " +
    "state=excluded.state, country=excluded.country, lat=excluded.lat, lng=excluded.lng, collection=excluded.collection, " +
    "status=excluded.status, status_checked_at=excluded.status_checked_at, source=excluded.source, locked=excluded.locked, " +
    "notes=excluded.notes, updated_at=excluded.updated_at"
  ).bind(machine_id, body.name, body.address ?? null, body.city ?? null, body.state ?? null, body.country || "US",
    body.lat ?? null, body.lng ?? null, body.collection ?? null, body.status || "unknown",
    body.status_checked_at ?? null, body.source || "manual", locked, body.notes ?? null, now).run();
  return { ok: true, machine_id };
}

// POST /machines/stock { machine_id, status, source, notes, collection } — flip status + log an event
async function machineStock(env, body) {
  if (!body || !body.machine_id || !body.status) throw new Error("stock requires machine_id and status");
  const now = nowISO();
  await env.DB.prepare("UPDATE machine SET status=?2, status_checked_at=?3, updated_at=?3 WHERE machine_id=?1")
    .bind(body.machine_id, body.status, now).run();
  const evMap = { empty: "emptied", "out-of-stock": "out-of-stock", restocked: "restocked", active: "seen", removed: "removed" };
  await env.DB.prepare("INSERT INTO machine_event (machine_id,event,collection,at,source,notes) VALUES (?1,?2,?3,?4,?5,?6)")
    .bind(body.machine_id, evMap[body.status] || "seen", body.collection ?? null, now, body.source ?? null, body.notes ?? null).run();
  return { ok: true, machine_id: body.machine_id, status: body.status };
}

// POST /machines/print { op: link | unlink, machine_id, print_id, in_stock, last_seen_at, notes }
async function machinePrint(env, body) {
  const op = (body && body.op) || "link";
  if (!body || !body.machine_id || !body.print_id) throw new Error("machine/print requires machine_id and print_id");
  if (op === "unlink") {
    await env.DB.prepare("DELETE FROM machine_print WHERE machine_id=?1 AND print_id=?2").bind(body.machine_id, body.print_id).run();
    return { ok: true, unlinked: [body.machine_id, body.print_id] };
  }
  const now = nowISO();
  await env.DB.prepare(
    "INSERT INTO machine_print (machine_id,print_id,in_stock,last_seen_at,notes) VALUES (?1,?2,?3,?4,?5) " +
    "ON CONFLICT(machine_id,print_id) DO UPDATE SET in_stock=excluded.in_stock, last_seen_at=excluded.last_seen_at, notes=excluded.notes"
  ).bind(body.machine_id, body.print_id, body.in_stock != null ? (body.in_stock ? 1 : 0) : 1, body.last_seen_at || now, body.notes ?? null).run();
  return { ok: true, linked: [body.machine_id, body.print_id] };
}

/* ================= history (D1) ================= */
async function readHistory(env, url) {
  const print_id = url.searchParams.get("print_id");
  if (print_id) {
    const pts = await env.DB.prepare("SELECT captured_at,active_count,min_landed,median_landed,max_landed FROM print_point WHERE print_id=?1 ORDER BY captured_at").bind(print_id).all();
    const gone = await env.DB.prepare("SELECT gone_at,last_landed FROM gone_event WHERE print_id=?1 ORDER BY gone_at").bind(print_id).all();
    return { print_id, points: pts.results || [], gone: gone.results || [] };
  }
  const mp = await env.DB.prepare("SELECT * FROM market_point ORDER BY captured_at DESC LIMIT 180").all();
  return { market: (mp.results || []).reverse() };
}

/* ================= eBay market feed (KV) ================= */
async function getToken(env) {
  const cached = await env.SNAPSHOTS.get("ebay_token");
  if (cached) return cached;
  const basic = btoa(`${env.EBAY_CLIENT_ID}:${env.EBAY_CLIENT_SECRET}`);
  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST", headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials&scope=" + encodeURIComponent("https://api.ebay.com/oauth/api_scope"),
  });
  if (!res.ok) throw new Error(`eBay token ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const ttl = Math.max(60, (data.expires_in || 7200) - 300);
  await env.SNAPSHOTS.put("ebay_token", data.access_token, { expirationTtl: ttl });
  return data.access_token;
}
async function fetchListings(env) {
  const token = await getToken(env);
  const endpoint = "https://api.ebay.com/buy/browse/v1/item_summary/search" +
    `?q=${encodeURIComponent(SEARCH_QUERY)}&limit=200&filter=${encodeURIComponent("buyingOptions:{FIXED_PRICE|AUCTION}")}`;
  const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}`, "X-EBAY-C-MARKETPLACE-ID": MARKETPLACE } });
  if (!res.ok) throw new Error(`eBay search ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data.itemSummaries || []).map(normalize);
}
function priceObjOf(it) { if (it.price && it.price.value != null) return it.price; if (it.currentBidPrice && it.currentBidPrice.value != null) return it.currentBidPrice; return null; }
function normalize(it) {
  const priceObj = priceObjOf(it); const price = num(priceObj && priceObj.value); const shipping = shipCost(it.shippingOptions); const title = it.title || "";
  return { itemId: it.itemId, title, price, currency: (priceObj && priceObj.currency) || "USD", shipping, landed: round2(price + shipping),
    condition: it.condition || "Unknown", buyingOptions: it.buyingOptions || [], url: it.itemWebUrl, image: (it.image && it.image.imageUrl) || null,
    seller: (it.seller && it.seller.username) || null, location: (it.itemLocation && it.itemLocation.country) || null, listedAt: it.itemCreationDate || null, print: parsePrint(title) };
}
function shipCost(opts) { if (!opts || !opts.length) return 0; const c = opts[0].shippingCost; return c ? num(c.value) : 0; }
function parsePrint(title) {
  const t = title.toLowerCase(); const exclusive = EXCLUSIVE_TOKENS.find((k) => t.includes(k)) || null;
  let name = null; const m = title.match(/mini print[\s:\u2013-]+([A-Za-z0-9'\"&\s]{2,40})/i); if (m) name = m[1].trim();
  return { name, exclusive, matched: Boolean(name) };
}
async function buildMarket(env) {
  const fresh = await fetchListings(env);
  const prevRaw = await env.SNAPSHOTS.get("snapshot", "json");
  const prev = (prevRaw && prevRaw.listings) || [];
  const prevById = new Map(prev.map((l) => [l.itemId, l]));
  const now = nowISO();
  const listings = fresh.map((l) => {
    const old = prevById.get(l.itemId);
    if (!old) return { ...l, status: "new", firstSeen: now, lastSeen: now, priceHistory: [{ t: now, landed: l.landed }], flags: flagsFor(l) };
    const changed = old.landed !== l.landed || (old.buyingOptions || []).join() !== (l.buyingOptions || []).join();
    const history = (old.priceHistory || []).slice(); if (changed) history.push({ t: now, landed: l.landed });
    return { ...l, status: changed ? "changed" : "live", firstSeen: old.firstSeen || now, lastSeen: now, priceHistory: history, flags: flagsFor(l) };
  });
  const freshIds = new Set(fresh.map((l) => l.itemId));
  const gone = prev.filter((l) => !freshIds.has(l.itemId) && l.status !== "gone").map((l) => ({ ...l, status: "gone", lastSeen: l.lastSeen || now }));
  const all = listings.concat(gone);
  const payload = { version: now, query: SEARCH_QUERY, source: "ebay-browse", baseline: { retailDefault: RETAIL_DEFAULT, currency: "USD" },
    summary: { total: listings.length, new: listings.filter((l) => l.status === "new").length, changed: listings.filter((l) => l.status === "changed").length, gone: gone.length, flagged: all.filter((l) => l.flags && l.flags.length).length }, listings: all };
  await env.SNAPSHOTS.put("snapshot", JSON.stringify(payload));
  return payload;
}
function flagsFor(l) {
  const flags = [];
  if (l.landed > 0 && l.landed <= RETAIL_DEFAULT * UNDERPRICED_PCT) flags.push("underpriced");
  if (l.print && l.print.exclusive) flags.push("exclusive");
  const t = l.title.toLowerCase(); if (PACK_TOKENS.some((k) => t.includes(k))) flags.push("pack-deal");
  return flags;
}
async function catalogResolver(env) {
  const cat = await env.DB.prepare("SELECT print_id, title FROM catalog").all();
  const aliases = await env.DB.prepare("SELECT print_id, norm FROM catalog_alias").all();
  const rows = (cat.results || []).map((r) => ({ printId: r.print_id, needle: norm(r.title) }));
  for (const a of aliases.results || []) rows.push({ printId: a.print_id, needle: a.norm });
  return (title) => { const t = norm(title); for (const r of rows) if (r.needle && r.needle.length >= 3 && t.includes(r.needle)) return r.printId; return null; };
}
async function runCron(env) {
  const payload = await buildMarket(env);
  const now = nowISO();
  const resolve = await catalogResolver(env);
  const live = payload.listings.filter((l) => l.status !== "gone");
  const goneNow = payload.listings.filter((l) => l.status === "gone");
  const landeds = live.map((l) => l.landed).filter((n) => n > 0);
  const packs = live.filter((l) => (l.flags || []).includes("pack-deal")).length;
  const excl = live.filter((l) => (l.flags || []).includes("exclusive")).length;
  await env.DB.prepare("INSERT INTO market_point (captured_at,total_listings,median_landed,avg_landed,min_landed,max_landed,singles_count,packs_count,exclusives_count) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)")
    .bind(now, live.length, median(landeds), avg(landeds), min(landeds), max(landeds), live.length - packs, packs, excl).run();
  const byPrint = new Map();
  for (const l of live) { const pid = resolve(l.title); if (!pid) continue; if (!byPrint.has(pid)) byPrint.set(pid, []); byPrint.get(pid).push(l.landed); }
  for (const [pid, arr] of byPrint) { const nums = arr.filter((n) => n > 0);
    await env.DB.prepare("INSERT INTO print_point (print_id,captured_at,active_count,min_landed,median_landed,max_landed) VALUES (?1,?2,?3,?4,?5,?6)").bind(pid, now, arr.length, min(nums), median(nums), max(nums)).run(); }
  for (const g of goneNow) await env.DB.prepare("INSERT INTO gone_event (print_id,item_id,last_landed,gone_at) VALUES (?1,?2,?3,?4)").bind(resolve(g.title), g.itemId || null, g.landed || null, now).run();
  return { ok: true, capturedAt: now, prints: byPrint.size, gone: goneNow.length };
}

/* ================= utils ================= */
function num(v) { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
function round2(n) { return Math.round(n * 100) / 100; }
function min(a) { return a.length ? round2(Math.min(...a)) : null; }
function max(a) { return a.length ? round2(Math.max(...a)) : null; }
function avg(a) { return a.length ? round2(a.reduce((s, n) => s + n, 0) / a.length) : null; }
function median(a) { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y); const m = Math.floor(s.length / 2); return round2(s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2); }
