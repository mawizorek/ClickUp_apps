# Inciardi Mini Print Market Tracker — Build Spec

**App slug:** `inciardi-market` · **Repo:** `mawizorek/ClickUp_apps`
**Version target:** front-end **v13** (adds the swipe-to-sort bulk-input page)
**Status:** front-end v12 live (PR #247 — multi-page: terminal / catalog / collection / market, shared `source/app-core.js`). Worker v1.3 live (D1 catalog/inventory/market + daily harvest crons). The previous next-build (the unattended catalog-scrub cron) SHIPPED; this spec supersedes it.

> It's **Anastasia Inciardi / Inciardi Prints** (Portland, ME).

---

## Goal (one line)

A mobile-first, Tinder-style **swipe page** (`swipe.html`) that turns the ~200-print catalog into a fast bulk-input funnel for the owned Collection: hero = the print image, **right = "I have this,"** **left = "I don't,"** with a long-press market panel and a want path. Default feed hides what's already sorted so you're never hit with a raw dump.

---

## Decoded decisions (Decision Log, inverted polarity — checked = rejected)

**Q1 — what a right-swipe writes:** **thin owned flag only.** `POST /inventory {op:'upsert', print_id, disposition:'own', qty:1, acquired_where:'swipe'}`. No inline cost/condition form (that stays in the Collection tab). Note: *"be open for expansion later"* — keep the write path easy to enrich, don't build the enrichment now. Keeps the page fast and keeps this a clean fold-in.

**Q2 — left-swipe behavior:** **persist as a real not-owned/skipped state (suppressed from the default feed next time) AND split "don't have" vs "want."** Note: *"long press market info, other settings."* So:
- **Left swipe = "don't have"** → persists to a skip set, suppressed from the default feed going forward.
- **Want path** (the split) → swipe-up (or the long-press panel's "Want it" button) writes `disposition:'want'` to D1.
- **Long-press = flip to a market-info panel** (live eBay via `marketFor()`), with Want / Skip actions.

**Q3 — default filter:** delegated to the team (*"whatever the team thinks"*). **Conductor call: default = in-print + not-owned + not-skipped for v1** (no schema change). True "recently released" ordering needs a release signal the catalog doesn't store → add `first_seen` on harvest as a fast-follow (see Futures). Filterable by category / exclusive series / in-print.

---

## ⚠️ Architecture fork — skip persistence (Mira's call, pending Michael veto)

Rhys flagged this make-or-break: if "don't have" is client-only, the same ~180 prints re-serve every session. Two options:
- **A (v1, chosen): localStorage skip set** (`inciardi_skip` = array of print_ids). Persists between sessions on the device, ZERO worker/schema change, keeps `swipe.html` a pure front-end fold-in. Right-swipe (own) and want still write to D1, so the durable ledger is real; only the *skip* memory is device-local.
- **B (fast-follow): a D1 `seen`/`skip` disposition** (or a small `skip` table) so skips sync cross-device. Requires a worker endpoint + read filter. Deferred unless Michael wants cross-device skips now.

Easily reversible (A → B is additive). Building A.

---

## Feed source

`GET /catalog` (D1, seed fallback `catalog.json`) **minus** owned/want print_ids from `GET /inventory` **minus** the localStorage skip set. Default filter: `available === true` (in-print). Multi-variant prints are already exploded to one row per variant → one card each (Domain Dara). Feed order for v1: catalog order (category, title); smart-order is v1.1 (Cleo).

---

## Build order (Finn) — v1 = steps 1–4, layer 5–6

1. **Filtered card feed** reading `/catalog` minus collection minus skip set; write-key prompt up front (the page is useless read-only — nudge to Settings if `!canWrite()`).
2. **Drag mechanics** — one live card + two peeking behind; pointer/touch drag with `transform: rotate()`; commit threshold; snap-back spring; fly-off on commit.
3. **Commit-right write** → `POST /inventory` (own, source-tagged) with **optimistic UI + reconcile** (not just hide the card) + an **undo stack** (undo in v1, not polish — Rhys/Finn).
4. **Left = skip persist** (localStorage), **swipe-up = want** (D1 write), **long-press = market panel** (flip card; Want/Skip actions).
5. **Filter sheet** — category / exclusive series / in-print toggle.
6. **End-of-stack summary** — "You added 12 prints 🎉 · skipped 8" with a reset-skips affordance.

---

## Style (Stu — "glow it up")

Dark `#0a0e13` ground, full-bleed hero print image edge-to-edge; name + series badge + retail floating bottom-left over a gradient scrim. Space Grotesk display, JetBrains Mono metadata chips (matches the terminal identity). Physical-print feel: subtle paper-grain shadow, slight tilt on the stack behind. **HAVE** stamp in warm terracotta `#c65a3a`, **SKIP** in cool slate. `navigator.vibrate()` on mobile commit. Running progress line "12 sorted · 188 to go."

**Non-negotiable (Polly):** big ✓ / ✗ buttons under the card for thumb-tapping (not everyone swipes) + the undo button are baseline, not polish.

---

## Guardrails

- **Reuse `source/app-core.js`** — `apiGet` / `apiPost` (adds `x-write-key`), `canWrite()`, `proxied()` (route CDN images through the Worker `/img` proxy — never hotlink), `marketFor()`, `toast()`, `initChrome()`. Do NOT re-implement the API client or chrome.
- **Write key stays in localStorage only** (Enzo) — never in a URL. The page respects the existing `.can-write` gating.
- **Optimistic writes must reconcile**, not just hide the card (Rhys/Beckett) — on write failure, restore the card + toast the error.
- **Provenance:** `acquired_where:'swipe'` tags swipe-created holdings so a later considered Collection edit is distinguishable (thin version of Enzo's `source=swipe`; a real `source` column on inventory is a worker fast-follow).
- **Mobile-safe**, dark default. Add "Swipe" to the nav on all pages.
- **Edge cases to define before v1 done (Beckett):** right-then-left before the write returns (race → reconcile); rotate mid-drag; two-finger swipe; network kill mid-commit; empty filter result (clean "all caught up," not a dead card); undo after N commits.

---

## Files

**Create:** `swipe.html` (page shell + nav + settings drawer + card-stack container) · `source/swipe.css` · `source/swipe.js`.
**Edit:** add a `Swipe` nav link to `terminal.html`, `catalog.html`, `collection.html`, `market.html`. Bump `app-core.js` BUILD/PR on ship.

---

## Futures (deferred)

- **B: D1 skip state** for cross-device skip sync (see fork above).
- **`first_seen` on harvest** → real "recently released" default sort (Q3 proper answer).
- **Smart-order feed** (Cleo v1.1): surface exclusives + in-print-now first, or cluster by series.
- **Card-back market value** always-on ("you own this, asking $45"); right-swipe on an exclusive pre-tags a Sell Signal.
- **Inline enrichment** (cost/condition on swipe) if the thin flag proves too thin (Q1 "open for expansion").
