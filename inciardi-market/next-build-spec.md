# Inciardi Mini Print Market Tracker — Build Spec

**App slug:** `inciardi-market` · **Repo:** `mawizorek/ClickUp_apps`
**Version target:** front-end **v16** + cron worker **v1.4** (catalog cleanup pass)
**Status:** SHIPPED. Follows v15 (backups + soft login). This build is the first-review cleanup: the three bugs behind Michael's mobile screenshot, plus the process guards so they don't recur.

> It's **Anastasia Inciardi / Inciardi Prints** (Portland, ME).

---

## Why (Michael, 2026-07-25)

Michael is turning this into a daily driver. First full code review + a mobile screenshot of the Catalog surfaced three defects at once: every card image flashed and vanished, every price read "$0", and every title was a bare variant number ("#1", "#10"). He also asked the architectural question — is Catalog sourced from eBay or from research? — which the README now answers directly.

---

## Shipped in this build

### 1. Images: derivative thumbnails + a real fallback ladder

**Root cause (not the 2026-07-13 hotlink bug — a new one with the same symptom).** `/usage` reported 268 MB across 177 images, individual files up to 3.2 MB, all full-resolution originals. `cardHTML` asked for `proxied(p.image, 360)`, but `proxied()` returns a Worker `/img?key=` URL untouched, and that R2 branch reads `w` and cannot act on it (no free resize of a stored blob). So the "thumbnail" was always the original, and the grid asked a phone for ~260 MB in one `innerHTML` pass. The old error handler then made a transient failure permanent by cache-busting the *same* URL and hiding the element on the second miss.

- New in `app-core.js`: `primaryImage()`, `imgLadder()`, `thumbSrc()`, `heroLadder()`, `heroSrc()`, `imageLadder()`, `imageThumb()`, `wireImg()` — plus the **Image Rendering Law** comment block that explains why.
- Thumbs resolve against `images[].source_url` (Shopify CDN, where `width=` really resizes, edge-cached 7 days). R2 originals stay the archival copy and the detail hero.
- `wireImg()` walks the ladder on error: derivative → R2 copy → raw CDN → initials tile. **Never** a cache-busted retry of the URL that just failed.
- Applied to the catalog grid, the catalog detail hero, the image-manager chips, and the swipe deck.
- Harvest side: the backfill now stores `width=1600&format=jpg` derivatives instead of camera originals, which also fixes the three HEIC uploads that rendered in Safari and nowhere else.

### 2. Prices: `retailFrom()` `/100` removed

Storefront `products.json` returns dollars, not cents. Every one of the 177 rows was 1/100th of reality (`Blue Cake Risograph: 0.25` = $25). Not cosmetic: `underpriced` fires at `landed <= 85% of baseline`, so a $0.25 baseline made Deal Radar structurally incapable of flagging anything. The stray `Math.round` was a second bug hiding behind the first (floored $12.50 → $12 before dividing).

**Repair path:** all rows are `locked:0 / source:'shop-harvest'`, so the unlocked upsert overwrites `retail` wholesale. **One `/run/harvest` fixes all 177.** No migration.

### 3. Titles: composed variant names, stable ids

`variantTitle()` composes `Product Title #N` when a variant title is purely numeric. `variantPrintId()` deliberately keeps deriving the id from the RAW variant title — because the harvest never DELETEs, changing id derivation would mint a parallel row set and strand every `inventory` / `print_image` / `machine_print` row pointing at the old ids. Stable id + new title = the upsert renames in place. The bare variant title is kept as an alias so eBay matching survives.

Real artwork names still don't exist in the shop's data; the rename+lock tooling remains the answer for those.

### 4. Minis as the default filter (catalog + swipe)

177 catalogued = 105 mini · 42 linocut · 20 big-riso · 10 pack. Michael collects minis. Deliberately a **default filter, not a harvest exclusion** — packs contain minis, category tagging is heuristic and will misfile things, and a row deleted at harvest can't come back without a full re-run. Reversible beats tidy. Falls back to All if the category is empty.

### 5. Swipe write queue serialized

Bulk-swiping fired one concurrent POST *and* one full `/inventory` refetch per card. Now a single `writeChain` promise tail with a debounced refetch, and undo's delete rides the same queue so it can never overtake its own insert.

### 6. Natural sort + `?v=` cache-bust

`localeCompare(..., {numeric:true})` so "#2" precedes "#10". `?v=16` on catalog + swipe asset tags, because those two pages now depend on functions that live in `app-core.js` — a half-stale pair is a ReferenceError, not a cosmetic lag.

---

## Michael's manual steps

1. **Run `/run/harvest`** on the cron worker once this is deployed. Nothing else repairs the 177 prices.
2. **🔴 Rotate the write keys.** `wrangler secret put WRITE_KEY` + `WRITE_KEY_NICK` with long random strings, paste into `LOGINS` in `app-core.js`, commit. The current values are short dictionary words in a public bundle — the accepted tradeoff covered *readable*, not *guessable*.

---

## Guardrails honored

- No schema change, no new endpoints, no new dependencies. Pure front-end + harvest logic.
- `print_id` derivation untouched (see §3) — the collection ledger is safe.
- Locked rows still protected; `in_print` still the one carve-out that always refreshes.
- `SCRUB_BATCH` left at 12 (free-tier subrequest cap).
- Mobile-safe, dark default.

---

## Futures (deferred)

- **Daily auto-snapshot cron** → `/snapshot`, plus retention/pruning. Backups currently only exist if someone taps the button.
- **D1 skip-state for swipe** — localStorage skips evaporate on a browser clear, which is the exact behaviour the login feature was built around. Biggest remaining daily-driver hole.
- **Multi-source catalog discovery** — the catalog is sourced from one Shopify store, so vending-machine-only and never-listed prints can never enter it. Poshmark + the Stockist ~120-machine geo list + an eBay `unmatched` → auto-research → alias feedback loop.
- One-time re-scrub of the existing 177 R2 originals into 1600px derivatives (~268MB → ~30MB).
- Per-write actor column ("added by Nick") — the worker already knows the actor; needs a schema add.
- `first_seen` on catalog rows so "recently released" ordering becomes real.
- Restrict the worker's `Access-Control-Allow-Origin` to the Pages host.
- Real auth if the app ever grows beyond the two of them / gains personal data.
