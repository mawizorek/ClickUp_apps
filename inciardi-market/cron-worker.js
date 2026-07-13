/**
 * Inciardi Mini Print Market Tracker — CATALOG HARVEST CRON WORKER
 *
 * A SEPARATE Cloudflare Worker from the main `worker.js`. It shares the SAME
 * D1 database (binding DB) and R2 bucket (binding IMAGES) by ID, so it writes
 * into the exact same store the app reads — but it owns ONLY the unattended
 * catalog-harvest crons. It exposes no public API surface beyond a tiny health
 * route and never touches the eBay market feed.
 *
 * WHY A SEPARATE WORKER: worker.js is ~33KB, over the 30KB single-read cap, and
 * its tail (runCron, the eBay market bank) can't be reliably read back to safely
 * re-commit. The harvest lives here, isolated, sharing state through bindings.
 *
 * SUBREQUEST BUDGET (learned the hard way 2026-07-13): the Workers free tier caps
 * subrequests per invocation at ~50, and EVERY fetch / D1 query / R2 op counts.
 *   - Harvest: preload state in 2 reads, flush writes via env.DB.batch() (one
 *     round trip per 50-statement chunk). ~6 subrequests total.
 *   - Image backfill: 3 subrequests PER image (CDN fetch + R2 put + D1 update),
 *     so SCRUB_BATCH must stay low. 12*3=36 fits with headroom. Do NOT bump
 *     SCRUB_BATCH back toward 25 on the free tier — that's what caused the blank
 *     1101. On a paid plan (1000 cap) it can go much higher.
 *
 * SHOPIFY 403 (learned 2026-07-13): Shopify + its CDN reject the Worker's default
 * bare User-Agent. All outbound fetches send a browser-like UA via BROWSER_HEADERS.
 *
 * CRONS (see wrangler-cron.toml):
 *   "0 9 * * *"  daily 09:00 UTC  -> runCatalogScrub  (text harvest of the shop)
 *   "0 * * * *"  hourly           -> runImageBackfill (self-idling image scrub)
 *
 * Bindings: D1 'DB', R2 'IMAGES'. No secrets. NOT served by GitHub Pages.
 */

const SHOP = "https://inciardiprints.com";
const SCRUB_BATCH = 12;                 // images per hourly tick. 3 subrequests each
                                        // (fetch+R2+D1) => 36, safe under the 50 free cap.
const D1_BATCH = 50;                    // statements per env.DB.batch() round trip
const STORAGE_CAP_BYTES = 4.5 * 1024 * 1024 * 1024; // mirror worker.js v1.1 cap (4.5GB)
const IMG_HOST_ALLOW = ["cdn.shopify.com"];

// Shopify + its CDN 403 a bare Worker UA. Present as a real browser.
const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};

// Collections we walk for category/exclusive signal (curated subset of the full
// map in catalog-research-routine.md — kept small to stay well under the cap).
const SIGNAL_COLLECTIONS = {
  "bigger-risograph-prints": { category: "big-riso" },
  "holiday-print-drop":      { category: "linocut" },
  "mystery-packs":           { category: "pack" },
  "gct-holiday-market":      { exclusive: "grand-central" },
};

// Products that aren't prints (merch). Skipped so the catalog stays prints-only.
const MERCH_TOKENS = ["potholder", "hat", "shirt", "tee", "tote", "sticker", "pin",
  "patch", "keychain", "magnet", "frame", "clothing", "apron", "mug", "sweatshirt",
  "crewneck", "hoodie", "pouch", "bag", "card", "matches", "subscription", "club"];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(request.url);
    if (url.pathname === "/health" || url.pathname === "/") {
      return json({ ok: true, worker: "inciardi-market-cron", crons: ["0 9 * * * (harvest)", "0 * * * * (image backfill)"] });
    }
    if (url.pathname === "/run/harvest") {
      try { return json(await runCatalogScrub(env)); }
      catch (e) { return json({ ok: false, route: "harvest", error: String((e && e.message) || e), stack: (e && e.stack) || null }, 500); }
    }
    if (url.pathname === "/run/images") {
      try { return json(await runImageBackfill(env)); }
      catch (e) { return json({ ok: false, route: "images", error: String((e && e.message) || e), stack: (e && e.stack) || null }, 500); }
    }
    // Compact diagnostic peek: first 30 catalog rows + image counts. Small payload
    // (safe to fetch whole), read-only, so we can SEE what the harvest actually wrote.
    if (url.pathname === "/debug") {
      try { return json(await debugPeek(env)); }
      catch (e) { return json({ ok: false, route: "debug", error: String((e && e.message) || e), stack: (e && e.stack) || null }, 500); }
    }
    return json({ error: "not found" }, 404);
  },

  async scheduled(event, env, ctx) {
    if (event.cron === "0 * * * *") {
      ctx.waitUntil(runImageBackfill(env).catch((e) => console.error("img-backfill", e)));
    } else {
      ctx.waitUntil(runCatalogScrub(env).catch((e) => console.error("catalog-scrub", e)));
    }
  },
};

/* ============================ utils ============================ */
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), { status, headers: { "Content-Type": "application/json", ...CORS } });
}
function uuid() { return (crypto.randomUUID && crypto.randomUUID()) || (Date.now().toString(36) + Math.random().toString(36).slice(2)); }
function nowISO() { return new Date().toISOString(); }
function norm(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
function slug(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || ("print-" + uuid().slice(0, 8)); }
function extFor(ct) { return ct && ct.includes("png") ? "png" : ct && ct.includes("webp") ? "webp" : ct && ct.includes("gif") ? "gif" : "jpg"; }
function isMerch(t) { const s = String(t || "").toLowerCase(); return MERCH_TOKENS.some((k) => s.includes(k)); }

// Flush an array of prepared statements in chunks, one round trip per chunk.
async function flushBatch(env, stmts) {
  let ran = 0;
  for (let i = 0; i < stmts.length; i += D1_BATCH) {
    const chunk = stmts.slice(i, i + D1_BATCH);
    if (chunk.length) { await env.DB.batch(chunk); ran += chunk.length; }
  }
  return ran;
}

/* ============================ diagnostic peek ============================ */
async function debugPeek(env) {
  const total = await env.DB.prepare("SELECT COUNT(*) AS c FROM catalog").first();
  const withImg = await env.DB.prepare("SELECT COUNT(DISTINCT print_id) AS c FROM print_image WHERE status='active'").first();
  const stored = await env.DB.prepare("SELECT COUNT(*) AS c FROM print_image WHERE r2_key IS NOT NULL").first();
  const pendImg = await env.DB.prepare("SELECT COUNT(*) AS c FROM print_image WHERE r2_key IS NULL AND source_url IS NOT NULL AND status='active'").first();
  const rows = await env.DB.prepare("SELECT print_id, title, category, retail, in_print, source, locked FROM catalog ORDER BY updated_at DESC LIMIT 30").all();
  return {
    ok: true,
    counts: {
      catalog: (total && total.c) || 0,
      prints_with_image_row: (withImg && withImg.c) || 0,
      images_stored_in_r2: (stored && stored.c) || 0,
      images_pending_backfill: (pendImg && pendImg.c) || 0,
    },
    sample: rows.results || [],
  };
}

/* ============================ Shopify fetch ============================ */
async function fetchJSON(u) {
  const res = await fetch(u, { headers: { Accept: "application/json", ...BROWSER_HEADERS }, cf: { cacheTtl: 300 } });
  if (!res.ok) throw new Error(`fetch ${res.status} ${u}`);
  return res.json();
}
async function fetchAllProducts() {
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const data = await fetchJSON(`${SHOP}/products.json?limit=250&page=${page}`);
    const prods = (data && data.products) || [];
    if (!prods.length) break;
    all.push(...prods);
    if (prods.length < 250) break;
  }
  return all;
}
async function fetchCollectionSignals() {
  const byHandle = new Map();
  for (const [coll, sig] of Object.entries(SIGNAL_COLLECTIONS)) {
    let prods = [];
    try { const d = await fetchJSON(`${SHOP}/collections/${coll}/products.json?limit=250`); prods = (d && d.products) || []; }
    catch (e) { continue; } // a missing/renamed collection must not kill the run
    for (const p of prods) byHandle.set(p.handle, { ...(byHandle.get(p.handle) || {}), ...sig });
  }
  return byHandle;
}

/* ============================ classification ============================ */
function categoryFor(product, sig) {
  if (sig && sig.category) return sig.category;
  const t = `${product.title} ${product.handle} ${product.product_type || ""}`.toLowerCase();
  if (/mystery pack|mystery-pack|\bpack\b/.test(t)) return "pack";
  if (/risograph|riso/.test(t)) return "big-riso";
  if (/linocut/.test(t)) return "linocut";
  return "mini";
}
function exclusiveFor(title, handle, sig) {
  if (sig && sig.exclusive) return sig.exclusive;
  const t = `${title} ${handle}`.toLowerCase();
  if (/grand central/.test(t)) return "grand-central";
  if (/scarry|lowly|pickle car|busy world|busytown/.test(t)) return "richard-scarry";
  if (/lacma/.test(t)) return "lacma";
  if (/\bholiday\b/.test(t)) return "holiday";
  return null;
}
function retailFrom(priceStr) { const n = parseFloat(priceStr); return isNaN(n) ? null : Math.round(n) / 100; }
function parsePack(bodyHtml) {
  const b = String(bodyHtml || "").replace(/<[^>]+>/g, " ");
  const of = (b.match(/pack of (\d+)/i) || b.match(/assortment of (\d+)/i) || [])[1];
  const from = (b.match(/following (\d+)/i) || b.match(/from the following (\d+)/i) || [])[1];
  return { pack_of: of ? parseInt(of, 10) : null, pack_from: from ? parseInt(from, 10) : null };
}

/* ============================ statement builders (LOCKED-AWARE, no per-row reads) ============================ */
function upsertStmt(env, row, lockedMap) {
  const now = nowISO();
  const isLocked = lockedMap.get(row.print_id) === 1;
  if (isLocked) {
    return env.DB.prepare(
      "UPDATE catalog SET category=COALESCE(category,?2), exclusive=COALESCE(exclusive,?3), " +
      "retail=COALESCE(retail,?4), pack_of=COALESCE(pack_of,?5), pack_from=COALESCE(pack_from,?6), " +
      "in_print=?7, updated_at=?8 WHERE print_id=?1"
    ).bind(row.print_id, row.category ?? null, row.exclusive ?? null, row.retail ?? null,
      row.pack_of ?? null, row.pack_from ?? null, row.in_print ? 1 : 0, now);
  }
  return env.DB.prepare(
    "INSERT INTO catalog (print_id,title,category,exclusive,retail,in_print,pack_of,pack_from,source,locked,created_at,updated_at) " +
    "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,'shop-harvest',0,?9,?9) " +
    "ON CONFLICT(print_id) DO UPDATE SET title=excluded.title, category=excluded.category, exclusive=excluded.exclusive, " +
    "retail=excluded.retail, in_print=excluded.in_print, pack_of=excluded.pack_of, pack_from=excluded.pack_from, " +
    "source='shop-harvest', updated_at=excluded.updated_at"
  ).bind(row.print_id, row.title, row.category ?? null, row.exclusive ?? null, row.retail ?? null,
    row.in_print ? 1 : 0, row.pack_of ?? null, row.pack_from ?? null, now);
}

/* ============================ the daily harvest (preload -> build -> batch) ============================ */
async function runCatalogScrub(env) {
  const started = nowISO();
  const products = await fetchAllProducts();      // ~1-2 subrequests
  const signals = await fetchCollectionSignals(); // ~4 subrequests

  // PRELOAD state: 2 reads total, replacing all per-print SELECTs.
  const lockedMap = new Map();
  const lockRes = await env.DB.prepare("SELECT print_id, locked FROM catalog").all();
  for (const r of (lockRes.results || [])) lockedMap.set(r.print_id, r.locked);
  const hasImage = new Set();
  const imgRes = await env.DB.prepare("SELECT DISTINCT print_id FROM print_image WHERE status='active'").all();
  for (const r of (imgRes.results || [])) hasImage.add(r.print_id);

  const catalogStmts = [];  // upserts
  const aliasStmts = [];    // alias inserts
  const imageStmts = [];    // reference-image inserts
  const seen = new Set();    // dedupe print_ids within this run
  let prints = 0, skipped = 0;

  const addPrint = (row, imgUrl) => {
    if (seen.has(row.print_id)) return; // first occurrence wins within a run
    seen.add(row.print_id);
    catalogStmts.push(upsertStmt(env, row, lockedMap));
    if (Array.isArray(row.aliases)) {
      for (const a of row.aliases) {
        if (!a) continue;
        aliasStmts.push(env.DB.prepare("INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES (?1,?2,?3)").bind(row.print_id, a, norm(a)));
      }
    }
    if (imgUrl && !hasImage.has(row.print_id)) {
      hasImage.add(row.print_id); // guard against dupes within the run too
      imageStmts.push(env.DB.prepare(
        "INSERT INTO print_image (image_id,print_id,r2_key,source_url,kind,is_primary,status,sort,created_at) " +
        "VALUES (?1,?2,NULL,?3,'reference',1,'active',0,?4)"
      ).bind(uuid(), row.print_id, imgUrl, nowISO()));
    }
    prints++;
  };

  for (const product of products) {
    if (isMerch(`${product.title} ${product.handle} ${product.product_type || ""}`)) { skipped++; continue; }
    const sig = signals.get(product.handle) || {};
    const category = categoryFor(product, sig);
    const variants = product.variants || [];
    const firstVariant = variants[0] || {};
    const isDefault = variants.length <= 1 || (firstVariant.title || "").toLowerCase() === "default title";
    const prodImg = (product.images && product.images[0] && product.images[0].src) || null;

    if (category === "pack") {
      const { pack_of, pack_from } = parsePack(product.body_html);
      const title = product.title;
      addPrint({ print_id: slug(title), title, category: "pack", exclusive: exclusiveFor(title, product.handle, sig),
        retail: retailFrom(firstVariant.price), in_print: variants.some((v) => v.available), pack_of, pack_from }, prodImg);
    } else if (isDefault) {
      const title = product.title;
      addPrint({ print_id: slug(title), title, category, exclusive: exclusiveFor(title, product.handle, sig),
        retail: retailFrom(firstVariant.price), in_print: variants.some((v) => v.available) }, prodImg);
    } else {
      for (const v of variants) {
        let title = v.title;
        if (category === "big-riso" && !/risograph/i.test(title)) title = `${title} Risograph`;
        const img = (v.featured_image && v.featured_image.src) || prodImg;
        addPrint({ print_id: slug(title), title, category, exclusive: exclusiveFor(v.title, product.handle, sig),
          retail: retailFrom(v.price), in_print: !!v.available, aliases: [v.title] }, img);
      }
    }
  }

  const wroteCatalog = await flushBatch(env, catalogStmts);
  const wroteAliases = await flushBatch(env, aliasStmts);
  const wroteImages = await flushBatch(env, imageStmts);

  return { ok: true, started, finished: nowISO(), products: products.length, prints, skipped_merch: skipped,
    wrote: { catalog: wroteCatalog, aliases: wroteAliases, reference_images: wroteImages } };
}

/* ============================ hourly image backfill (self-idling) ============================ */
async function storedBytes(env) {
  const r = await env.DB.prepare("SELECT COALESCE(SUM(bytes),0) AS b FROM print_image WHERE r2_key IS NOT NULL").first();
  return (r && r.b) || 0;
}
async function runImageBackfill(env) {
  const pend = await env.DB.prepare(
    "SELECT image_id, print_id, source_url FROM print_image " +
    "WHERE r2_key IS NULL AND source_url IS NOT NULL AND status='active' " +
    "ORDER BY created_at ASC LIMIT ?1"
  ).bind(SCRUB_BATCH).all();
  const rows = pend.results || [];
  if (!rows.length) return { ok: true, idle: true, scrubbed: 0 }; // caught up -> no-op

  let used = await storedBytes(env);
  let scrubbed = 0, capped = false, failed = 0;
  for (const row of rows) {
    let up; try { up = new URL(row.source_url); } catch { failed++; continue; }
    if (up.protocol !== "https:" || !IMG_HOST_ALLOW.includes(up.hostname)) { failed++; continue; }
    let res; try { res = await fetch(up.toString(), { headers: { Accept: "image/*", ...BROWSER_HEADERS } }); } catch { failed++; continue; }
    if (!res.ok) { failed++; continue; }
    const ct = res.headers.get("Content-Type") || "image/jpeg";
    const buf = new Uint8Array(await res.arrayBuffer());
    if (used + buf.length > STORAGE_CAP_BYTES) { capped = true; break; }
    const r2_key = `prints/${row.print_id}/${row.image_id}.${extFor(ct)}`;
    await env.IMAGES.put(r2_key, buf, { httpMetadata: { contentType: ct } });
    await env.DB.prepare(
      "UPDATE print_image SET r2_key=?2, kind='scrub', content_type=?3, bytes=?4 WHERE image_id=?1"
    ).bind(row.image_id, r2_key, ct, buf.length).run();
    used += buf.length;
    scrubbed++;
  }
  return { ok: true, idle: false, scrubbed, failed, capped, batch: rows.length };
}
