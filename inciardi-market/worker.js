/**
 * Inciardi Mini Print Market Tracker — Cloudflare Worker (v0.2)
 *
 * Reads live eBay listings (Browse API), diffs vs the KV snapshot, and
 * serves market.json on GET /market. NEW in v0.2:
 *   - GET  /inventory        — read the collection (D1, joined to catalog)
 *   - POST /inventory         — upsert/delete an inventory row (GATED)
 *   - POST /catalog/confirm   — promote a spotted print into the catalog (GATED)
 *   - scheduled() cron        — distills trend points into D1 each run
 *
 * DATA HOMES:
 *   - Live eBay listings  -> Cloudflare KV (SNAPSHOTS), rebuilt every run.
 *   - History + catalog + inventory -> Cloudflare D1 (DB). Permanent.
 *
 * Bindings: KV 'SNAPSHOTS', D1 'DB'.
 * Secrets:  EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, WRITE_KEY (gate for POST routes).
 *
 * WRITE GATE: reads are open; every POST requires header 'x-write-key' to match
 * env.WRITE_KEY. This is an INTEGRITY gate (stop public vandalism), not privacy
 * — the data is non-sensitive by design.
 *
 * NOTE: deploy target. NOT served by GitHub Pages.
 */

const SEARCH_QUERY = "inciardi mini print";
const MARKETPLACE = "EBAY_US";
const RETAIL_DEFAULT = 14; // USD cold-start baseline until rolling market price exists
const UNDERPRICED_PCT = 0.85;
const EXCLUSIVE_TOKENS = ["nyc", "lacma", "grand central", "holiday", "exclusive"];
const PACK_TOKENS = ["pack", "set", "lot", "bundle"];

const CORS = {
 "Access-Control-Allow-Origin": "*",
 "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
 "Access-Control-Allow-Headers": "Content-Type, x-write-key",
};

export default {
 async fetch(request, env) {
 if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
 const url = new URL(request.url);
 const path = url.pathname;
 try {
 if ((path === "/market" || path === "/") && request.method === "GET") {
 return json(await buildMarket(env));
 }
 if (path === "/inventory" && request.method === "GET") {
 return json(await readInventory(env));
 }
 if (path === "/inventory" && request.method === "POST") {
 gate(request, env);
 return json(await writeInventory(env, await request.json()));
 }
 if (path === "/catalog/confirm" && request.method === "POST") {
 gate(request, env);
 return json(await confirmCatalog(env, await request.json()));
 }
 return json({ error: "not found" }, 404);
 } catch (err) {
 const code = (err && err.status) || 502;
 return json({ error: String((err && err.message) || err) }, code);
 }
 },

 // Cron: refresh the KV snapshot AND distill trend points into D1.
 async scheduled(_event, env, ctx) {
 ctx.waitUntil(runCron(env).catch((e) => console.error("cron", e)));
 },
};

function json(obj, status = 200) {
 return new Response(JSON.stringify(obj, null, 2), {
 status,
 headers: { "Content-Type": "application/json", ...CORS },
 });
}

// Integrity gate for write routes. Throws 401 unless the shared key matches.
function gate(request, env) {
 const supplied = request.headers.get("x-write-key");
 if (!env.WRITE_KEY || supplied !== env.WRITE_KEY) {
 const e = new Error("unauthorized: bad or missing x-write-key");
 e.status = 401;
 throw e;
 }
}

/* ---------- eBay auth (client-credentials, cached in KV) ---------- */

async function getToken(env) {
 const cached = await env.SNAPSHOTS.get("ebay_token");
 if (cached) return cached;
 const basic = btoa(`${env.EBAY_CLIENT_ID}:${env.EBAY_CLIENT_SECRET}`);
 const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
 method: "POST",
 headers: {
 Authorization: `Basic ${basic}`,
 "Content-Type": "application/x-www-form-urlencoded",
 },
 body: "grant_type=client_credentials&scope=" +
 encodeURIComponent("https://api.ebay.com/oauth/api_scope"),
 });
 if (!res.ok) throw new Error(`eBay token ${res.status}: ${await res.text()}`);
 const data = await res.json();
 const ttl = Math.max(60, (data.expires_in || 7200) - 300);
 await env.SNAPSHOTS.put("ebay_token", data.access_token, { expirationTtl: ttl });
 return data.access_token;
}

/* ---------- fetch + normalize ---------- */

async function fetchListings(env) {
 const token = await getToken(env);
 const endpoint = "https://api.ebay.com/buy/browse/v1/item_summary/search" +
 `?q=${encodeURIComponent(SEARCH_QUERY)}&limit=200` +
 `&filter=${encodeURIComponent("buyingOptions:{FIXED_PRICE|AUCTION}")}`;
 const res = await fetch(endpoint, {
 headers: {
 Authorization: `Bearer ${token}`,
 "X-EBAY-C-MARKETPLACE-ID": MARKETPLACE,
 },
 });
 if (!res.ok) throw new Error(`eBay search ${res.status}: ${await res.text()}`);
 const data = await res.json();
 return (data.itemSummaries || []).map(normalize);
}

function normalize(it) {
 const price = num(it.price && it.price.value);
 const shipping = shipCost(it.shippingOptions);
 const title = it.title || "";
 return {
 itemId: it.itemId,
 title,
 price,
 currency: (it.price && it.price.currency) || "USD",
 shipping,
 landed: round2(price + shipping),
 condition: it.condition || "Unknown",
 buyingOptions: it.buyingOptions || [],
 url: it.itemWebUrl,
 image: (it.image && it.image.imageUrl) || null,
 seller: (it.seller && it.seller.username) || null,
 location: (it.itemLocation && it.itemLocation.country) || null,
 listedAt: it.itemCreationDate || null,
 print: parsePrint(title),
 };
}

function shipCost(opts) {
 if (!opts || !opts.length) return 0;
 const c = opts[0].shippingCost;
 return c ? num(c.value) : 0;
}

// Fuzzy print identity from the title. matched:false when unresolved.
function parsePrint(title) {
 const t = title.toLowerCase();
 const exclusive = EXCLUSIVE_TOKENS.find((k) => t.includes(k)) || null;
 let name = null;
 const m = title.match(/mini print[\s:\u2013-]+([A-Za-z0-9'"&\s]{2,40})/i);
 if (m) name = m[1].trim();
 return { name, exclusive, matched: Boolean(name) };
}

/* ---------- diff against previous snapshot (KV) ---------- */

async function buildMarket(env) {
 const fresh = await fetchListings(env);
 const prevRaw = await env.SNAPSHOTS.get("snapshot", "json");
 const prev = (prevRaw && prevRaw.listings) || [];
 const prevById = new Map(prev.map((l) => [l.itemId, l]));
 const now = new Date().toISOString();

 const listings = fresh.map((l) => {
 const old = prevById.get(l.itemId);
 if (!old) {
 return { ...l, status: "new", firstSeen: now, lastSeen: now,
 priceHistory: [{ t: now, landed: l.landed }], flags: flagsFor(l) };
 }
 const changed = old.landed !== l.landed ||
 (old.buyingOptions || []).join() !== (l.buyingOptions || []).join();
 const history = (old.priceHistory || []).slice();
 if (changed) history.push({ t: now, landed: l.landed });
 return {
 ...l,
 status: changed ? "changed" : "live",
 firstSeen: old.firstSeen || now,
 lastSeen: now,
 priceHistory: history,
 flags: flagsFor(l),
 };
 });

 const freshIds = new Set(fresh.map((l) => l.itemId));
 const gone = prev
 .filter((l) => !freshIds.has(l.itemId) && l.status !== "gone")
 .map((l) => ({ ...l, status: "gone", lastSeen: l.lastSeen || now }));

 const all = listings.concat(gone);
 const payload = {
 version: now,
 query: SEARCH_QUERY,
 source: "ebay-browse",
 baseline: { retailDefault: RETAIL_DEFAULT, currency: "USD" },
 summary: {
 total: listings.length,
 new: listings.filter((l) => l.status === "new").length,
 changed: listings.filter((l) => l.status === "changed").length,
 gone: gone.length,
 flagged: all.filter((l) => l.flags && l.flags.length).length,
 },
 listings: all,
 };

 await env.SNAPSHOTS.put("snapshot", JSON.stringify(payload));
 return payload;
}

function flagsFor(l) {
 const flags = [];
 if (l.landed > 0 && l.landed <= RETAIL_DEFAULT * UNDERPRICED_PCT) flags.push("underpriced");
 if (l.print && l.print.exclusive) flags.push("exclusive");
 const t = l.title.toLowerCase();
 if (PACK_TOKENS.some((k) => t.includes(k))) flags.push("pack-deal");
 return flags;
}

/* ---------- D1: catalog matching ---------- */

// Load catalog + aliases once, return a resolver(title) -> print_id | null.
async function catalogResolver(env) {
 const cat = await env.DB.prepare(
 "SELECT print_id, title FROM catalog"
 ).all();
 const aliases = await env.DB.prepare(
 "SELECT print_id, alias FROM catalog_alias"
 ).all();
 const rows = (cat.results || []).map((r) => ({
 printId: r.print_id, needle: String(r.title || "").toLowerCase(),
 }));
 for (const a of aliases.results || []) {
 rows.push({ printId: a.print_id, needle: String(a.alias || "").toLowerCase() });
 }
 return (title) => {
 const t = String(title || "").toLowerCase();
 for (const r of rows) {
 if (r.needle && r.needle.length >= 3 && t.includes(r.needle)) return r.printId;
 }
 return null;
 };
}

/* ---------- cron: refresh snapshot + distill trend points into D1 ---------- */

async function runCron(env) {
 const payload = await buildMarket(env);
 const now = new Date().toISOString();
 const resolve = await catalogResolver(env);

 const live = payload.listings.filter((l) => l.status !== "gone");
 const goneNow = payload.listings.filter((l) => l.status === "gone");

 // 1) general market point
 const landeds = live.map((l) => l.landed).filter((n) => n > 0);
 const packs = live.filter((l) => (l.flags || []).includes("pack-deal")).length;
 const excl = live.filter((l) => (l.flags || []).includes("exclusive")).length;
 await env.DB.prepare(
 "INSERT INTO market_point (captured_at,total_listings,median_landed,avg_landed,min_landed,max_landed,singles_count,packs_count,exclusives_count) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)"
 ).bind(
 now, live.length, median(landeds), avg(landeds), min(landeds), max(landeds),
 live.length - packs, packs, excl
 ).run();

 // 2) per-print points (group live listings by resolved print_id)
 const byPrint = new Map();
 for (const l of live) {
 const pid = resolve(l.title);
 if (!pid) continue;
 if (!byPrint.has(pid)) byPrint.set(pid, []);
 byPrint.get(pid).push(l.landed);
 }
 for (const [pid, arr] of byPrint) {
 const nums = arr.filter((n) => n > 0);
 await env.DB.prepare(
 "INSERT INTO print_point (print_id,captured_at,active_count,min_landed,median_landed,max_landed) VALUES (?1,?2,?3,?4,?5,?6)"
 ).bind(pid, now, arr.length, min(nums), median(nums), max(nums)).run();
 }

 // 3) gone events (free sold-price proxy: last landed before it vanished)
 for (const g of goneNow) {
 await env.DB.prepare(
 "INSERT INTO gone_event (print_id,item_id,last_landed,gone_at) VALUES (?1,?2,?3,?4)"
 ).bind(resolve(g.title), g.itemId || null, g.landed || null, now).run();
 }

 return { ok: true, capturedAt: now, prints: byPrint.size, gone: goneNow.length };
}

/* ---------- D1: inventory read/write ---------- */

async function readInventory(env) {
 const res = await env.DB.prepare(
 "SELECT i.inv_id, i.print_id, i.provisional_label, i.disposition, i.qty, " +
 "i.condition, i.acquired_price, i.acquired_where, i.acquired_at, i.notes, " +
 "i.updated_at, c.title AS catalog_title, c.series, c.retail " +
 "FROM inventory i LEFT JOIN catalog c ON c.print_id = i.print_id " +
 "ORDER BY i.updated_at DESC"
 ).all();
 return { count: (res.results || []).length, inventory: res.results || [] };
}

// Body: { op:'upsert'|'delete', inv_id?, print_id?, provisional_label?,
//         disposition?, qty?, condition?, acquired_price?, acquired_where?,
//         acquired_at?, notes? }
async function writeInventory(env, body) {
 const op = (body && body.op) || "upsert";
 const now = new Date().toISOString();

 if (op === "delete") {
 if (!body.inv_id) throw new Error("delete requires inv_id");
 await env.DB.prepare("DELETE FROM inventory WHERE inv_id = ?1").bind(body.inv_id).run();
 return { ok: true, deleted: body.inv_id };
 }

 const f = {
 print_id: body.print_id ?? null,
 provisional_label: body.provisional_label ?? null,
 disposition: body.disposition || "own",
 qty: body.qty ?? 1,
 condition: body.condition ?? null,
 acquired_price: body.acquired_price ?? null,
 acquired_where: body.acquired_where ?? null,
 acquired_at: body.acquired_at ?? null,
 notes: body.notes ?? null,
 };

 if (body.inv_id) {
 await env.DB.prepare(
 "UPDATE inventory SET print_id=?1, provisional_label=?2, disposition=?3, qty=?4, " +
 "condition=?5, acquired_price=?6, acquired_where=?7, acquired_at=?8, notes=?9, " +
 "updated_at=?10 WHERE inv_id=?11"
 ).bind(
 f.print_id, f.provisional_label, f.disposition, f.qty, f.condition,
 f.acquired_price, f.acquired_where, f.acquired_at, f.notes, now, body.inv_id
 ).run();
 return { ok: true, updated: body.inv_id };
 }

 const ins = await env.DB.prepare(
 "INSERT INTO inventory (print_id, provisional_label, disposition, qty, condition, " +
 "acquired_price, acquired_where, acquired_at, notes, created_at, updated_at) " +
 "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?10)"
 ).bind(
 f.print_id, f.provisional_label, f.disposition, f.qty, f.condition,
 f.acquired_price, f.acquired_where, f.acquired_at, f.notes, now
 ).run();
 return { ok: true, inserted: ins.meta && ins.meta.last_row_id };
}

/* ---------- D1: catalog confirm (promote a spotted print) ---------- */

// Body: { print_id, title, series?, year?, exclusive?, retail?, status?,
//         image?, source_url?, source?, alias? }
async function confirmCatalog(env, body) {
 if (!body || !body.print_id || !body.title) {
 throw new Error("confirm requires print_id and title");
 }
 const now = new Date().toISOString();
 await env.DB.prepare(
 "INSERT INTO catalog (print_id,title,series,year,exclusive,retail,status,image,source_url,source,notes,created_at,updated_at) " +
 "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?12) " +
 "ON CONFLICT(print_id) DO UPDATE SET title=excluded.title, series=excluded.series, " +
 "year=excluded.year, exclusive=excluded.exclusive, retail=excluded.retail, " +
 "status=excluded.status, image=excluded.image, source_url=excluded.source_url, " +
 "source=excluded.source, updated_at=excluded.updated_at"
 ).bind(
 body.print_id, body.title, body.series ?? null, body.year ?? null,
 body.exclusive ? 1 : 0, body.retail ?? null, body.status || "unknown",
 body.image ?? null, body.source_url ?? null, body.source || "ebay-confirm",
 body.notes ?? null, now
 ).run();

 if (body.alias) {
 await env.DB.prepare(
 "INSERT OR IGNORE INTO catalog_alias (print_id, alias) VALUES (?1, ?2)"
 ).bind(body.print_id, String(body.alias).toLowerCase()).run();
 }
 return { ok: true, print_id: body.print_id };
}

/* ---------- stats + utils ---------- */
function num(v) { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
function round2(n) { return Math.round(n * 100) / 100; }
function min(a) { return a.length ? round2(Math.min(...a)) : null; }
function max(a) { return a.length ? round2(Math.max(...a)) : null; }
function avg(a) { return a.length ? round2(a.reduce((s, n) => s + n, 0) / a.length) : null; }
function median(a) {
 if (!a.length) return null;
 const s = a.slice().sort((x, y) => x - y);
 const m = Math.floor(s.length / 2);
 return round2(s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2);
}
