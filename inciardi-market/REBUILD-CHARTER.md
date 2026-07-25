# Inciardi Market — Rebuild Charter

**Status: PLANNING. Nothing in this document is built. No code ships against it until the three blocking questions in §6 are answered.**

Written 2026-07-25, at Michael's call: *"start from the ground up defining the app — even taking time to dictate which pages we'll use and how to prioritize them — before we even build anything. That way when we go to build, we have all the objects in hand, and a structure and a future-proof plan to hold on to."*

This is the document that was never written. Everything that went wrong today traces back to its absence.

---

## 1. The diagnosis: we've been running Phase 5 on an app that never had Phases 1–4

The repo has a canonical sequence for this — **New ClickUp App Build — Brainstorm & Scoping Playbook** (AI Toolkit, Mira owns it):

| Phase | What it does | Did inciardi-market get it? |
| --- | --- | --- |
| 0 · Session open | Board task, transcript on | ✅ yes, always |
| 1 · Fold-in check | Should this be built at all | ⚠️ per-feature only, never for the app |
| 2 · Plan & scope | Boundaries, build order, **style seated at planning** | ❌ **never** |
| 3 · Workshop stress-test | 7 lenses → committed spec | ⚠️ per-feature (swipe got it) |
| 4 · Build conventions | Repo shape, **theme contract**, object vocabulary | ❌ **never** |
| 5 · Build / break / verify | Ship it | ✅ constantly. 22 versions. |
| 6 · Close | Ledger, handoff | ✅ yes |

**The app has only ever lived in Phase 5.** It grew feature-by-feature from a working eBay scraper, and each feature got a real review — but the *app* was never scoped, never got a style pass at planning, and never adopted the build conventions. That's not a process complaint; it's the direct cause of today's specific failures:

- No Phase 4 → hand-rolled `base.css` instead of the theme spine → five image outages in a stylesheet nobody thought to read.
- No Phase 2 → no page priority → `terminal.html` still in the nav with no defined job.
- No entity model → three tables named after their *sources* → slug collisions, phantom duplicates, silent discards.

Today cost roughly six hours. A Phase 2/4 pass costs one. **This charter is that pass.**

---

## 2. What the app is (one paragraph, and it changed today)

**Inciardi Market is a record of the Anastasia Inciardi prints Michael owns, with a market lens on top.** Not a market scraper with an inventory feature — that inversion is the whole point of this rebuild. You open it and see your binder: what you have, what's missing from each collection, what's unrepeatable and gone. The market layer answers a *second* question, on demand: *"and what's available right now?"*

Michael's framing, which is the charter's north star:

> *"It becomes catalog searching the market for existence and logging itself, rather than the market defining what's in the catalog."*

**Consequences that follow directly, and are not up for re-litigation:**

1. The **authored registry** is canon. The Shopify harvest *proposes*. eBay *observes*. Neither authors.
2. **eBay is shelved** until the registry can drive it. It's the only component needing external credentials, the only rate limit, the only third-party approval — and under the new ordering it is downstream by definition.
3. The binder's completion state (`SPRING · 11 / 15`) is the product. It's the reason to open the app on a day when there's nothing to buy.

---

## 3. The standards gap — "all the objects in hand" already exist

Michael's hunch that the app is behind on theming and standards is **correct, and worse than he framed it.** The repo has a full design system that inciardi-market uses none of:

| Asset | What it is | inciardi-market |
| --- | --- | --- |
| `shared/themes/` | 4-vector theme spine (colors × typography × forms × spacing), composed via `resolve.js` | ❌ not a consumer |
| `_objects.json` + `OBJECT-COVERAGE.md` | **42 canonical objects** with a documented token contract and state matrix | ❌ uses none |
| `preview.html` | Live studio: pick a theme, see all 42 objects reskin | ❌ never opened for this app |
| `template-app` v5 | Gold standard: hash-router shell + `chrome.js` + `pages/` partials, all on the spine. Carries `CONFORMANCE.md` as the audit checklist | ❌ not derived from it |
| Theme contract gate | `brain-config/gates/theme-contract-gate.md` | ❌ never fired |

**Precedent that this migration is routine:** `on-track` moved onto the spine at shell v2.3 (PR #468) and gained a live theme picker at v2.4 (PR #470) with zero new theme rows. `retrocast` was the first consumer. This is a paved road, walked twice.

### What the object vocabulary buys us specifically

The binder needs: a page shell, a filter bar, tiles with states, a meter (completion), badges, an empty state, a drawer, a toast. **All eight already exist as canonical objects** (`cnt_page_shell`, `cnt_filter_bar`, `row_tile_badge`, `viz_meter`, `tx_badge`, `fb_empty`, `panel_drawer`, `fb_toast`) with defined tokens and states.

That's the answer to *"have all the objects in hand."* We don't design a binder from scratch — we compose it from a vocabulary that's already documented and already theme-proof. And `fb_empty` matters more than it sounds: the binder is **mostly empty slots** by design, so the empty state isn't an edge case here, it's the primary content.

One genuinely new object is likely: a **binder pocket** (owned / missing / wanted / gone-forever). Per `OBJECT-COVERAGE.md` the set is a vocabulary, not a ceiling — adding is welcome, but it must land in `_objects.json` + `preview.data.js` + the coverage table **in the same pass**.

---

## 4. Page inventory and priority

Michael asked to dictate the pages. Proposal, with the reasoning attached so it can be argued with:

| P | Page | Job — the one question it answers | Status |
| --- | --- | --- | --- |
| **P0** | **Binder** | *What do I have, and what's missing?* Sheet per collection, fixed pockets, visible gaps, completion header. **The front door.** | new build |
| **P0** | **Capture** (swipe) | *Log what I have, fast.* Right = own, up = want, left = skip. | ✅ built, repoint at registry |
| **P1** | **Index** | *What exists at all?* The full registry incl. things Michael will never own. Today's Catalog, demoted from front door to reference. | refactor `catalog.html` |
| **P1** | **Adopt** | *What did the shop add that I haven't ruled on?* Harvest proposals → accept / merge / ignore. | new build |
| **P2** | **Print detail** | *Everything about this one artwork.* Editions, photos, provenance, market history. | ✅ exists as a drawer, extend |
| **P3** | **Market** | *What's available right now?* Registry-driven, per-artwork. | shelved |
| **—** | **Terminal** | *(undefined)* — the original landing page, superseded by Binder | **retirement candidate** |
| **—** | Settings / Backups | drawer, injected by `app-core` on every page | ✅ exists |

### Why this order

**Binder before Index** is the inversion made concrete. If Index stays the front door, the app still says "here is the market's idea of what exists" every time it opens.

**Adopt at P1, not P3** is Beckett's rot argument and it's load-bearing: an authored registry with no adoption path decays into an *abandoned* registry. Anastasia shipped a Spring collection and Feastland merch in one quarter. Without Adopt, the registry is stale in three weeks and Michael is back to trusting the harvest by default — which is the exact thing this rebuild exists to stop.

**Capture is not rebuilt.** It already works: drag physics, undo, serialized writes, edit-in-place. It needs a new data source, not a new implementation. Anything that proposes rewriting swipe is out of scope.

**Terminal needs a ruling.** It's in the nav on all five pages and I can't state what it's for. Either it becomes something (a dashboard? the true landing?) or it retires. An undefined page in the nav is how an app starts feeling untrustworthy — which is where this session started.

---

## 5. Architecture target

```
registry/artworks.json     AUTHORED   what exists, names, editions      git · versioned · diffable
        │  loader (idempotent + reconciling)
        ▼
D1  artwork · edition      RUNTIME    a flattened projection to query
D1  copy                   RUNTIME    what Michael owns — the binder
D1  sighting               OBSERVED   append-on-change price/status log
        ▲
Shopify harvest            PROPOSES   availability, price, new-product suggestions
eBay                       OBSERVES   queried PER ARTWORK from the registry
```

**Shape conventions (Phase 4, adopted from `template-app` v5 + the GitHub MCP Operating Standard):**

- Thin `index.html` router/shell; real pages are their own named files. The index never becomes the app.
- On the theme spine. Chrome from tokens, no hand-rolled palette. Dark default.
- Source-size budget: 12KB target / 15KB split / 30KB hard cap. `app-core.js` is currently **29KB** — already at the ceiling and needs splitting during this rebuild, not after.
- `?v=` cache-bust on **every** local asset, CSS included. Three pages currently have no token at all.
- Data store nests inside the app folder.
- Branch → PR → self-merge. Blob-API reads, re-fetched before every write.

**The laws earned today stay in force** and are already documented in `README.md`: the Image Rendering Law (7 rules, 5 incidents) and the Fetch Honesty Law. Both were paid for in hours.

---

## 6. 🔴 Blocking questions — the build does not start until these are answered

From Beckett's pre-commit attack. The first is genuinely architectural; the other two are cheap to answer and expensive to get wrong.

### Q1 · What does a `copy` point at when the artwork has no editions?
**54 of 68 seeded artworks are `open`-type with zero editions.** Swipe right on Luna Moth and `copy.edition_id` has no target. This is the main path, not an edge case.

Both obvious escapes are bad: minting phantom editions puts fake objects in the registry; letting `copy` point at artwork *or* edition is a polymorphic key — the exact ambiguity that caused this rebuild, reproduced one table down.

**Decides:** whether `edition` is required, optional, or synthesized. Expensive to reverse.

### Q2 · What happens to a row you stop authoring?
An idempotent loader has no opinion about rows that vanished from its source. Rename an id in the JSON, re-run, and D1 holds both — the harvest's never-DELETE behaviour, with your typos instead of Shopify's slugs. Flag / archive / delete are all defensible. **Silent-keep is the one that rebuilds the bug.**

### Q3 · Where does the loader execute?
Pages is static; writing to D1 needs the key. Client-side = a key in a public bundle + 105 POSTs. Worker route = opening a 39KB file that can't be read back whole. Local `wrangler` = works, but manual and Michael-only. **All three are currently blocked by something different.**

---

## 7. Build order once unblocked

0. **Answer Q1–Q3.** Log in the Decision Log.
1. **Chunk-walk `worker.js`.** One pass, not four. It's over the read cap and every remaining change wants a piece of it: `Cache-Control`, the loader route, the sighting endpoint, the flattened schema. *Dexter's call: piecemeal here is how `f1-racetracks` ended up with parked follow-ups nobody wanted to touch.*
2. **Schema + loader.** Then one rebuild off the authored file. Snapshot first; `source_url` per edition is a hard precondition or the binder is blank for ~15 hours.
3. **Theme spine migration** + object audit against `CONFORMANCE.md`. Split `app-core.js` in the same pass.
4. **Binder.** The new front door.
5. **Adopt queue.** Same milestone as Binder — see §4.
6. **Repoint Capture** at the registry.
7. **Index** refactor.
8. **Market**, registry-driven, when the rest is solid.

### Explicitly out of scope for this rebuild
Machines layer (14 seeded rows, no UI pull). Sold comps. Multi-source discovery (Poshmark, Stockist). Per-write actor attribution. All parked, all real, none blocking.

### Carried debt, named so it isn't rediscovered
- 🔴 **Write keys are guessable** (`"mikey"` / `"nickey"`) in a public bundle. Michael holds the secrets.
- `terminal.html` / `collection.html` / `market.html`: no `?v=` token, no stale-data banner.
- `app-core.js` reports `BUILD` and `PR` from a constant that drifts; `#f-assets` is the honest marker.
- 44 artworks known to exist and unnamed (Beach 13, Ice Cream 16, Whitney 15) — counts only, no names in the pack descriptions.
- 5 merch items miscategorised as `mini` (`cap` and `beanie` missing from `MERCH_TOKENS`, while a real print named *Hat* is filtered out).
- 177 R2 originals are pre-derivative full-res; a one-time re-scrub would drop ~268MB to ~30MB.

---

## Provenance

Phase 2 + Phase 4 of the New ClickUp App Build Playbook, run late. Reviewed by **Dev Dexter** (entity model, `worker.js` sequencing), **Breaker Beckett** (7 pre-commit findings), **Clever Cleo** (the three-entity insight), **Domain Dara** (`unique` vs `limited` vs `open`), **Style Stu** (binder-as-sheet), **Scope Skye** (boundaries), **Size Sally**, **Risk Rhys**, **Eco Enzo**, **Polish Polly**. Conducted by **Maestro Mira**.
