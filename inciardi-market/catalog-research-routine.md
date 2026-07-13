# Inciardi Market — Catalog Research Routine (Deep Rebuild SOP, v2 D1-aligned)

**Purpose:** systematically rebuild the print universe (500+ prints) into **Cloudflare D1** from legitimate primary sources, scrubbed and normalized, with provenance and a stored reference image on every row — AND map the **vending-machine location layer** so prints are filterable by machine/location. This is the **deep excavation** routine. Any agent should be able to pick this up cold and make real progress.

> **⚠️ Store of truth = D1, written via the Worker API.** This routine does NOT write `catalog.json` as the product. It upserts into D1 (`catalog`, `catalog_alias`, `print_image`, `machine`, `machine_print`, `machine_event`) through the worker's gated `POST` endpoints. `catalog.json` is a human-readable mirror/export only. Schema truth: `db/schema.sql`. Light top-up version: `catalog-refresh.md`.

> **This is NOT `catalog-refresh.md`.** That's the light periodic top-up. THIS is the systematic dig-and-scrub campaign that grows a ~37-row seed into the real universe.

---

## Prime directives (read before touching anything)

1. **We recreate the universe ourselves. We do NOT reference Vault (miniprint.io)** except as an *answer key* for coverage ("they claim 500, we have N"). Never lift their catalog, naming, or data.
2. **Anastasia's own footprint is canonical.** Her Shopify store, social drop history, the official machine map, and press. The live eBay market is a discovery signal, never a naming authority.
3. **Provenance on every row** (`source`). Can't source it → provisional lane, not canonical.
4. **Naming is Anastasia's.** eBay/seller titles fold in as `catalog_alias`, never new prints.
5. **Writes go through the worker.** `POST /catalog`, `/catalog/image/scrub`, `/machines`, `/machines/stock`, `/machines/print`, all gated with `x-write-key`. Committing a file is not a write to the app.

---

## The unlock: Shopify `/products.json` (primary harvest source)

inciardiprints.com is Shopify, so the live catalog is clean paginated JSON, zero scraping.

**Endpoints:**
- Full store: `https://inciardiprints.com/products.json?limit=250&page=1` (increment `page` until `products` is empty).
- Per collection: `https://inciardiprints.com/collections/<handle>/products.json?limit=250&page=1`.

**Three layers of prints live in that JSON, mine ALL of them:**

| Layer | Where | Example (verified 2026-07-10) |
| --- | --- | --- |
| **Product** | `products[].title` | "Spring Mini Print Mystery Pack", "Pocket Potholder" |
| **Variant** | `products[].variants[].title` / `options[].values` | "8x10\" Risograph Prints" holds 9 themes: Swiss Chard, Cake, Jello, Lowly, Pickle Car, Martini, Negroni, Hot Dog, Blueberries |
| **Mystery-pack contents** | `products[].body_html` prose | Spring pack lists 15; Winter lists 10; Valentine's lists 13. Parse the prose. |

**Fields worth capturing:** `title`, `handle`, variant `title`, `price` (cents), `available` (→ `in_print`), `images[].src` (canonical art), `variants[].featured_image.src` (per-print art), `created_at`/`published_at` (drop date), `tags`, `product_type`. Storefront HTML lazy-loads and returns nothing; always use `/products.json`.

### Collection map (harvest each `/collections/<handle>/products.json`)

`oysters` (guest), `all-food`, `all`, `bigger-risograph-prints`, `catalog`, `drink`, `food-brands`, `food-tools`, `framed-minis`, `frames`, `side-dishes` (guest), `inciardi-hats`, `gct-holiday-market` (Grand Central), `not-food`, `kitchen`, `holiday-print-drop` (linocuts), `mini-print-collectors-club-subscriptions`, `clothing`, `mystery-packs`, `pins-patches-keychains-etc`, `produce`, `savory`, `snacks`, `spring-drop-other-stuff`, `stickers-matches`, `sweets`, `t-shirts`, `the-classics`, `tomato-series`. Collection membership → `category` + exclusive/series detection.

---

## Reference images — DECISION B (LOCKED, Michael 2026-07-13): SCRUB INTO R2

**Supersedes the old 2026-07-10 "reference the CDN URL in an `image` field" decision.** That decision was written against a retired schema that had an `image` column; the current D1 schema has none. Images now live in the **`print_image`** table, bytes in **R2**.

- For each print, take the canonical Shopify CDN URL (`images[0].src`, or per-variant `featured_image.src` for multi-print products) and **scrub it into R2** via `POST /catalog/image/scrub { print_id, source_url, make_primary:true }`. The worker fetches the allowlisted `cdn.shopify.com` bytes server-side and stores them; the row lands in `print_image` (kind=`scrub`).
- **Why B over referencing:** kills the CDN-URL drift risk (Anastasia re-uploads → stale link). R2 is cheap; 500 thumbnails ≈ ~100MB against the worker's 4.5GB cap. The old "no blobs in git" rationale is satisfied — R2 is not git.
- **Multi-print products:** walk `variants[]`, pair each `featured_image.src` to its print via `variant_ids`, scrub one per print. This is how the 9 8x10 Riso themes each get their own art.
- **No legit image?** Leave the print imageless + flag provisional. **Never** borrow a Vault or seller-listing image as canonical.

---

## Machines — the location layer (first-class)

Machines are a **filter dimension for prints**: filter prints by location (which machine/city/state carries them) and by machine stock status. They go empty / out-of-stock constantly, so status is tracked live and historically.

- `machine` — one physical vending machine at a host shop (`name, city, state, lat/lng, collection, status, source, notes`). `status` ∈ `active | empty | out-of-stock | restocked | removed | unknown`.
- `machine_print` — M:N join: which prints are/were stocked at which machine (`in_stock`, `last_seen_at`). Powers "filter prints by location."
- `machine_event` — status timeline (`restocked | emptied | out-of-stock | installed | removed | seen`). Restock rhythm = buy-side signal.

### Machine harvest

1. **Locations:** `inciardiprints.com/pages/store-locator` is canonical. Upsert each via `POST /machines { op:"upsert", name, city, state, collection, source:"store-locator", lat, lng }`.
2. **Background/count:** `inciardiprints.com/pages/mini-print-vending-machine-1` for machine count + program context.
3. **Sightings + exclusives:** press (People, local news; "Inciardi vending machine") and host-shop posts (McCoy Kids, Tidal Pages, etc.) for which machine carries which exclusive collection, and empty/restock reports.
4. **Stock status:** when a source reports a machine empty/restocked, `POST /machines/stock { machine_id, status, source, notes }` (logs a `machine_event`).
5. **Link prints to machines:** `POST /machines/print { op:"link", machine_id, print_id, in_stock, last_seen_at }` as sources reveal which prints sit in which machine. This is the join that lets the app filter prints by location.

---

## Secondary sources (fill gaps the store doesn't show)

| Source | Pulls | Notes |
| --- | --- | --- |
| Anastasia's Instagram drop history | Retired/seasonal prints, drop dates, art for images | Primary for prints no longer for sale |
| Official store locator | **Canonical machine locations** | Machine truth; link out |
| Vending info page | Machine count, program background | Refresh count from here |
| Press (People, local news) | New machines, exclusive collections (Richard Scarry, LACMA, Grand Central) | Exclusives often break in press first |
| Host-shop posts | Machine-to-exclusive mapping, empty/restock reports | |
| Live eBay `market.json` scan | **Discovery signal only** | `unmatched` there but absent = a real gap to research + add under Anastasia's name |

---

## Scrub & normalize discipline

1. **One canonical row per real print, keyed by a permanent `print_id` slug.** "Framed Olive" + "Olive" + a seller's "olive mini print" = ONE print. Framed-ness is an attribute, not a new print.
2. **Every real-world name variant becomes a `catalog_alias`, never a new print.** Feed it every resolved eBay title, seller spelling, "Cheese #1 / slice of cheese / cheddar" variant. Pass `aliases:[...]` in the `POST /catalog` body.
3. **Unverified entries NEVER write straight into canonical.** Uncertain → leave `locked=0`, low-confidence `source`, and flag for human confirm before promoting. `locked=1` protects hand-entered rows from harvest clobber.
4. **Correcting a bad entry = MERGE, not delete.** Same print twice → merge: wrong name becomes an alias of the right `print_id`; inventory/market/machine rows re-point via FK. Nothing orphans. Same for machines: a hand-entered machine stays provisional until reconciled against the official map.
5. **Framed vs unframed, seasonal re-releases:** same image = same print. No duplicate.

---

## How to run the routine cold (step by step)

1. **Pull the whole store.** Page `/products.json?limit=250` until empty. Capture title + variants + body_html + images + dates + availability.
2. **Explode the three layers.** Product-level, variant-level, AND parse mystery-pack `body_html` for embedded print lists.
3. **Classify via collections.** Hit each `/collections/<handle>/products.json`; membership → `category` + exclusive detection.
4. **Reconcile against live D1** (`GET /catalog`). Match → add new name as alias, refresh retail/in_print. No match → new canonical row (sourced) or provisional.
5. **Upsert prints** via `POST /catalog` (D1 field names: `title`, `category`, `exclusive`, `retail`, `in_print`, `pack_of`, `pack_from`, `source`, `aliases[]`).
6. **Scrub images** into R2 via `POST /catalog/image/scrub` (Decision B), per-variant where applicable.
7. **Harvest machines** (see Machines section): upsert locations, set stock status, link prints to machines.
8. **Sweep secondary sources** for retired/seasonal/exclusive prints; add with honest `source`; recover images where possible.
9. **Cross-check eBay `unmatched`**; resolve to Anastasia's real name; feed `catalog_alias`.
10. **Coverage gauge** (Vault as answer key only). Note the delta vs 500+.
11. **Mirror + log.** Optionally regenerate `catalog.json` as a readable export; append a Progress Log entry (date, sources, counts before/after, image + machine coverage, gaps).
12. **Commit** file mirrors via branch → PR → self-merge (data-only, no app version bump). The `POST`s are the real update; the commit is the mirror.

---

## Worker wiring (machine endpoints — drop-in for `worker.js`)

The catalog/inventory/image endpoints already exist in `worker.js` (v1.1). The machine layer needs these additions. **Add to the router in `fetch()`** (alongside the other routes):

```js
if (p === "/machines" && request.method === "GET") return json(await readMachines(env, url, base));
if (p === "/machines" && request.method === "POST") { gate(request, env); return json(await writeMachine(env, await request.json())); }
if (p === "/machines/stock" && request.method === "POST") { gate(request, env); return json(await machineStock(env, await request.json())); }
if (p === "/machines/print" && request.method === "POST") { gate(request, env); return json(await machinePrint(env, await request.json())); }
```

**Add these functions** (they reuse the existing `json`/`gate`/`uuid`/`nowISO`/`slug` helpers):

```js
/* ================= machines (D1) ================= */
async function readMachines(env, url, base) {
  const printId = url.searchParams.get("print_id");
  if (printId) { // machines carrying a given print (reverse filter)
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
  const sql = "SELECT * FROM machine" + (where.length ? " WHERE " + where.join(" AND ") : "") +
    " ORDER BY state, city, name";
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

// POST /machines/stock { machine_id, status, source, notes } — flip status + log an event
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

// POST /machines/print { op: link | unlink, machine_id, print_id, in_stock, last_seen_at }
async function machinePrint(env, body) {
  const op = (body && body.op) || "link";
  if (!body || !body.machine_id || !body.print_id) throw new Error("machine/print requires machine_id and print_id");
  if (op === "unlink") {
    await env.DB.prepare("DELETE FROM machine_print WHERE machine_id=?1 AND print_id=?2")
      .bind(body.machine_id, body.print_id).run();
    return { ok: true, unlinked: [body.machine_id, body.print_id] };
  }
  const now = nowISO();
  await env.DB.prepare(
    "INSERT INTO machine_print (machine_id,print_id,in_stock,last_seen_at,notes) VALUES (?1,?2,?3,?4,?5) " +
    "ON CONFLICT(machine_id,print_id) DO UPDATE SET in_stock=excluded.in_stock, last_seen_at=excluded.last_seen_at, notes=excluded.notes"
  ).bind(body.machine_id, body.print_id, body.in_stock != null ? (body.in_stock ? 1 : 0) : 1,
    body.last_seen_at || now, body.notes ?? null).run();
  return { ok: true, linked: [body.machine_id, body.print_id] };
}
```

CORS already allows `GET, POST, OPTIONS` + the `x-write-key` header in v1.1, so no header change needed. After merging, redeploy the worker (Workers Builds on push to main) and the `/machines*` routes go live.

---

## Guardrails

- **D1 via the worker is the store of truth.** `catalog.json` is a mirror/export.
- **Never reference/copy Vault.** Answer key only.
- **Official names win.** Seller titles → aliases.
- **Provenance or provisional.** Unsourced never enters canonical; `locked=1` protects hand-entered values.
- **Images scrubbed to R2 (Decision B).** No blobs in git; imageless + provisional when no legit image.
- **Merge, don't delete.** Corrections preserve `print_id` / `machine_id` FK links and history.
- **Retail != market.** Retail (Anastasia's fixed price) is catalog; market (eBay rolling) is the trend store.
- **Catalog is owner-agnostic.** Universe, not collection. Ownership → `inventory`. Locations → `machine`.

---

## Progress Log

_Append one entry per research pass. Newest on top._

### 2026-07-13 — D1 alignment + machine layer added

- Routine rewritten to target **D1 via the worker API**, not `catalog.json`. Fixed field names (`title`/`in_print`/`print_id`/`pack_of`), removed the dead `image`/`series`/`status` assumptions.
- **Image decision flipped to B:** scrub Shopify CDN art into R2 via `POST /catalog/image/scrub` (was: reference URL in a now-nonexistent `image` column).
- **Machine layer added** (`machine` + `machine_print` + `machine_event` in `db/schema.sql`; worker endpoints specified above). Prints are now filterable by location; machine empty/out-of-stock is tracked live + historically. Four known Richard Scarry host-shop machines seeded in `db/seed-catalog.sql`.
- **State:** schema + seed + docs aligned. Next: merge the machine endpoints into `worker.js`, run the full paginated harvest, and do the big reconcile-write into D1.

### 2026-07-10 — Image sourcing + first harvest pass (historical)

- Established the Shopify `/products.json` 3-layer harvest as the excavation backbone. Surfaced 8x10 Riso themes, Spring/Winter/Valentine's pack sets, Classics pack, linocut additions. `catalog.json` was the ~37-row seed at this point. (Note: the image decision from this date was superseded by Decision B on 2026-07-13.)

---

_Home: `inciardi-market/`. Sister doc: `catalog-refresh.md` (light top-up). Spine: `db/schema.sql`. Consumers: the market tracker + the ownership/inventory side + the machine/location filter._
