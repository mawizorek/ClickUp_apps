/**
 * Inciardi Mini Print Market Tracker — Cloudflare Worker (v0.1)
 *
 * Fetches active eBay listings via the Browse API, normalizes them,
 * diffs against the previous snapshot (Cloudflare KV), and returns
 * a market.json payload. Runs on a cron and on-demand (GET /market).
 *
 * Secrets (wrangler secret put): EBAY_CLIENT_ID, EBAY_CLIENT_SECRET
 * KV binding: SNAPSHOTS
 *
 * NOTE: This is the deploy target. It is NOT served by GitHub Pages.
 */

const SEARCH_QUERY = "inciardi mini print";
const MARKETPLACE = "EBAY_US";
const RETAIL_DEFAULT = 14; // USD baseline until we compute median ask
const UNDERPRICED_PCT = 0.85; // landed <= 85% of baseline => underpriced flag
const EXCLUSIVE_TOKENS = ["nyc", "lacma", "grand central", "holiday", "exclusive"];
const PACK_TOKENS = ["pack", "set", "lot", "bundle"];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(request.url);
    if (url.pathname === "/market" || url.pathname === "/") {
      try {
        const payload = await buildMarket(env);
        return json(payload);
      } catch (err) {
        return json({ error: String((err && err.message) || err) }, 502);
      }
    }
    return json({ error: "not found" }, 404);
  },

  // Cron entrypoint — refresh the snapshot on schedule.
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(buildMarket(env).catch((e) => console.error("cron", e)));
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
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

// Derive print identity + exclusivity from the title. Fuzzy by design.
function parsePrint(title) {
  const t = title.toLowerCase();
  const exclusive = EXCLUSIVE_TOKENS.find((k) => t.includes(k)) || null;
  let name = null;
  const m = title.match(/mini print[\s:\u2013-]+([A-Za-z0-9'"&\s]{2,40})/i);
  if (m) name = m[1].trim();
  return { name, exclusive, matched: Boolean(name) };
}

/* ---------- diff against previous snapshot ---------- */

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

/* ---------- utils ---------- */
function num(v) { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
function round2(n) { return Math.round(n * 100) / 100; }
