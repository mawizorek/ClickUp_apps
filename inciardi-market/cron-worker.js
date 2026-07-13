/**
 * Inciardi Mini Print Market Tracker — CATALOG HARVEST CRON WORKER
 *
 * A SEPARATE Cloudflare Worker from the main `worker.js`. It shares the SAME
 * D1 database (binding DB) and R2 bucket (binding IMAGES) by ID, so it writes
 * into the exact same store the app reads — but it owns ONLY the unattended
 * catalog-harvest crons. It exposes no public API surface beyond a tiny health
 * route and never touches the eBay market feed.
 *
 * WHY A SEPARATE WORKER (not a second cron branch inside worker.js):
 *   worker.js is ~33KB, over the 30KB single-read cap, and its tail (runCron,
 *   the eBay market bank) can't be reliably read back to safely re-commit the
 *   whole file. Rather than grow an over-cap monolith blind, the harvest lives
 *   here, isolated, and shares state through bindings. Clean separation of
 *   concerns: worker.js = live API + market bank; cron-worker.js = harvest.
 *
 * CRONS (see wrangler-cron.toml):
 *   "0 9 * * *"  daily 09:00 UTC  -> runCatalogScrub  (text harvest of the shop)
 *   "0 * * * *"  hourly           -> runImageBackfill (self-idling image scrub)
 *
 * Bindings: D1 'DB', R2 'IMAGES'. No secrets (products.json + cdn.shopify.com
 * are public; D1/R2 writes are in-binding, so no x-write-key dance).
 * NOTE: deploy target. NOT served by GitHub Pages.
 */

const SHOP = "https://inciardiprints.com";
const SCRUB_BATCH = 25;                 // images scrubbed into R2 per hourly tick
const STORAGE_CAP_BYTES = 4.5 * 1024 * 1024 * 1024; // mirror worker.js v1.1 cap (4.5GB)
const IMG_HOST_ALLOW = ["cdn.shopify.com"];

// Collections we walk for category/exclusive signal (curated subset of the full
// map in catalog-research-routine.md — kept small to stay well under the Worker
// subrequest cap; the full 28-collection walk is a future refinement).
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
  // Minimal HTTP surface: a health/manual-trigger route (handy for a one-off run).
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(request.url);
    if (url.pathname === "/health" || url.pathname === "/") {
      return json({ ok: true, worker: "inciardi-market-cron", crons: ["0 9 * * * (harvest)", "0 * * * * (image backfill)"] });
    }
    // Opt-in manual kick for testing (no secrets stored here; harmless — only reads the
    // public shop + writes the same rows the daily cron would).
    if (url.pathname === "/run/harvest") return json(await runCatalogScrub(env));
    if (url.pathname === "/run/images")  return json(await runImageBackfill(env));
    return json({ error: "not found" }, 404);
  },

  async scheduled(event, env, ctx) {
    if (event.cron === "0 * * * *") {
      ctx.waitUntil(runImageBackfill(env).catch((e) => console.error("img-backfill", e)));
    } else {
      // "0 9 * * *" (and any other) -> daily text harvest
      ctx.waitUntil(runCatalogScrub(env).catch((e) => console.error("catalog-scrub", e)));
    }
  },
};

/* ============================ utils (parity w/ worker.js) ============================ */
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), { status, headers: { "Content-Type": "application/json", ...CORS } });
}
function uuid() { return (crypto.randomUUID && crypto.randomUUID()) || (Date.now().toString(36) + Math.random().toString(36).slice(2)); }
function nowISO() { return new Date().toISOString(); }
function norm(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
function slug(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || ("print-" + uuid().slice(0, 8)); }
function extFor(ct) { return ct && ct.includes("png") ? "png" : ct && ct.includes("webp") ? "webp" : ct && ct.includes("gif") ? "gif" : "jpg"; }
function isMerch(t) { const s = String(t || "").toLowerCase(); return MERCH_TOKENS.some((k) => s.includes(k)); }

/* ============================ Shopify fetch ============================ */
async function fetchJSON(u) {
  const res = await fetch(u, { headers: { Accept: "application/json" }, cf: { cacheTtl: 300 } });
  if (!res.ok) throw new Error(`fetch ${res.status} ${u}`);
  return res.json();
}

// Page /products.json until empty. Bounded page cap as a safety rail.
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

// Build handle -> {category?, exclusive?} membership from the curated signal collections.
async function fetchCollectionSignals() {
  const byHandle = new Map();
  for (const [coll, sig] of Object.entries(SIGNAL_COLLECTIONS)) {
    let prods = [];
    try { const d = await fetchJSON(`${SHOP}/collections/${coll}/products.json?limit=250`); prods = (d && d.products) || []; }
    catch (e) { continue; } // a missing/renamed collection must not kill the run
    for (const p of prods) {
      const cur = byHandle.get(p.handle) || {};
      byHandle.set(p.handle, { ...cur, ...sig });
    }
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
// Shopify prices on this store are cents-as-string ("4800.00" => $48). Convert to dollars.
function retailFrom(priceStr) {
  const n = parseFloat(priceStr);
  if (isNaN(n)) return null;
  return Math.round(n) / 100;
}
function parsePack(bodyHtml) {
  const b = String(bodyHtml || "").replace(/<[^>]+>/g, " ");
  const of = (b.match(/pack of (\d+)/i) || b.match(/assortment of (\d+)/i) || [])[1];
  const from = (b.match(/following (\d+)/i) || b.match(/from the following (\d+)/i) || [])[1];
  return { pack_of: of ? parseInt(of, 10) : null, pack_from: from ? parseInt(from, 10) : null };
}

/* ============================ D1 upsert (LOCKED-AWARE) ============================ */
// New row -> insert (source shop-harvest, locked 0).
// Unlocked existing -> harvest owns it, refresh harvest fields.
// Locked existing -> COALESCE-fill blanks ONLY, EXCEPT in_print which ALWAYS refreshes
//   (availability is a live fact, not a hand-entered opinion — Michael's call 2026-07-13).
async function harvestUpsertCatalog(env, row) {
  const now = nowISO();
  const existing = await env.DB.prepare("SELECT print_id, locked FROM catalog WHERE print_id=?1").bind(row.print_id).first();
  if (!existing) {
    await env.DB.prepare(
      "INSERT INTO catalog (print_id,title,category,exclusive,retail,in_print,pack_of,pack_from,source,locked,created_at,updated_at) " +
      "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,'shop-harvest',0,?9,?9)"
    ).bind(row.print_id, row.title, row.category ?? null, row.exclusive ?? null, row.retail ?? null,
      row.in_print ? 1 : 0, row.pack_of ?? null, row.pack_from ?? null, now).run();
  } else if (!existing.locked) {
    await env.DB.prepare(
      "UPDATE catalog SET title=?2, category=?3, exclusive=?4, retail=?5, in_print=?6, " +
      "pack_of=?7, pack_from=?8, source='shop-harvest', updated_at=?9 WHERE print_id=?1"
    ).bind(row.print_id, row.title, row.category ?? null, row.exclusive ?? null, row.retail ?? null,
      row.in_print ? 1 : 0, row.pack_of ?? null, row.pack_from ?? null, now).run();
  } else {
    // locked: fill blanks only, but ALWAYS refresh in_print
    await env.DB.prepare(
      "UPDATE catalog SET category=COALESCE(category,?2), exclusive=COALESCE(exclusive,?3), " +
      "retail=COALESCE(retail,?4), pack_of=COALESCE(pack_of,?5), pack_from=COALESCE(pack_from,?6), " +
      "in_print=?7, updated_at=?8 WHERE print_id=?1"
    ).bind(row.print_id, row.category ?? null, row.exclusive ?? null, row.retail ?? null,
      row.pack_of ?? null, row.pack_from ?? null, row.in_print ? 1 : 0, now).run();
  }
  if (Array.isArray(row.aliases)) {
    for (const a of row.aliases) {
      if (!a) continue;
      await env.DB.prepare("INSERT OR IGNORE INTO catalog_alias (print_id,alias,norm) VALUES (?1,?2,?3)").bind(row.print_id, a, norm(a)).run();
    }
  }
}

// Ensure a print has at least one image row. If it has none and we have a CDN url,
// insert a kind='reference' row (r2_key NULL, source_url set). readCatalog renders it
// immediately via the /img?u= CDN passthrough; runImageBackfill later stores the bytes.
async function ensureReferenceImage(env, print_id, sourceUrl) {
  if (!sourceUrl) return;
  const existing = await env.DB.prepare("SELECT COUNT(*) AS c FROM print_image WHERE print_id=?1 AND status='active'").bind(print_id).first();
  if (existing && existing.c > 0) return; // already has an image (reference or scrubbed)
  const image_id = uuid();
  await env.DB.prepare(
    "INSERT INTO print_image (image_id,print_id,r2_key,source_url,kind,is_primary,status,sort,created_at) " +
    "VALUES (?1,?2,NULL,?3,'reference',1,'active',0,?4)"
  ).bind(image_id, print_id, sourceUrl, nowISO()).run();
}

/* ============================ the daily harvest ============================ */
async function runCatalogScrub(env) {
  const started = nowISO();
  const products = await fetchAllProducts();
  const signals = await fetchCollectionSignals();
  let prints = 0, skipped = 0;

  for (const product of products) {
    if (isMerch(`${product.title} ${product.handle} ${product.product_type || ""}`)) { skipped++; continue; }
    const sig = signals.get(product.handle) || {};
    const category = categoryFor(product, sig);
    const variants = product.variants || [];
    const firstVariant = variants[0] || {};
    const isDefault = variants.length <= 1 || (firstVariant.title || "").toLowerCase() === "default title";

    if (category === "pack") {
      // one row for the pack itself
      const { pack_of, pack_from } = parsePack(product.body_html);
      const title = product.title;
      const print_id = slug(title);
      await harvestUpsertCatalog(env, {
        print_id, title, category: "pack",
        exclusive: exclusiveFor(title, product.handle, sig),
        retail: retailFrom(firstVariant.price),
        in_print: variants.some((v) => v.available),
        pack_of, pack_from,
      });
      await ensureReferenceImage(env, print_id, (product.images && product.images[0] && product.images[0].src) || null);
      prints++;
    } else if (isDefault) {
      // single-print product
      const title = product.title;
      const print_id = slug(title);
      await harvestUpsertCatalog(env, {
        print_id, title, category,
        exclusive: exclusiveFor(title, product.handle, sig),
        retail: retailFrom(firstVariant.price),
        in_print: variants.some((v) => v.available),
      });
      await ensureReferenceImage(env, print_id, (product.images && product.images[0] && product.images[0].src) || null);
      prints++;
    } else {
      // multi-print product: each variant is its own print (e.g. the 8x10 Riso themes)
      for (const v of variants) {
        // big-riso themes are catalogued as "<Theme> Risograph" to match the existing seed
        // and avoid slug collisions with same-named minis/linocuts (e.g. Hot Dog).
        let title = v.title;
        if (category === "big-riso" && !/risograph/i.test(title)) title = `${title} Risograph`;
        const print_id = slug(title);
        await harvestUpsertCatalog(env, {
          print_id, title, category,
          exclusive: exclusiveFor(v.title, product.handle, sig),
          retail: retailFrom(v.price),
          in_print: !!v.available,
          aliases: [v.title], // fold the bare variant name in as an alias
        });
        const img = (v.featured_image && v.featured_image.src) || (product.images && product.images[0] && product.images[0].src) || null;
        await ensureReferenceImage(env, print_id, img);
        prints++;
      }
    }
  }
  return { ok: true, started, finished: nowISO(), products: products.length, prints, skipped_merch: skipped };
}

/* ============================ hourly image backfill (self-idling) ============================ */
async function storedBytes(env) {
  const r = await env.DB.prepare("SELECT COALESCE(SUM(bytes),0) AS b FROM print_image WHERE r2_key IS NOT NULL").first();
  return (r && r.b) || 0;
}
async function runImageBackfill(env) {
  // reference rows waiting to be stored: have a source_url, no bytes in R2 yet
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
    let res; try { res = await fetch(up.toString(), { headers: { Accept: "image/*" } }); } catch { failed++; continue; }
    if (!res.ok) { failed++; continue; }
    const ct = res.headers.get("Content-Type") || "image/jpeg";
    const buf = new Uint8Array(await res.arrayBuffer());
    if (used + buf.length > STORAGE_CAP_BYTES) { capped = true; break; } // honor the R2 cap
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
