# f1-racetracks — Circuit-Page Reskin Brief (pit-wall)

**Cycle:** post-schema-shift → circuit-page aesthetic pass
**Theme:** Bring the OLD circuit pages (`circuits.html` + `live-tracker.html`) up to the new dark **pit-wall** look already shipped on the standings lens. This is the aesthetic reskin session, run **WITH Michael**, after the data/architecture work is done.

> **Reconcile note:** This file previously held the v4→v5 mobile-responsive spec, which targeted a 126KB monolith `index.html` that no longer exists (that file is now the router shell; the app was rebuilt segmented). That spec is obsolete and replaced here. The **mobile-first standing rule** from it is preserved verbatim at the bottom — it still applies to every app.

---

## Where things stand (already shipped, do NOT redo)

- **Schema shift done.** Full race data lives in per-round JSON under `f1-racetracks/f1-results/2026/` (`index.json` + 9 rounds), keyed by **location** (track slug = durable identity); `round` is a per-season ordering attribute. All 9 rounds verified against primary sources; 3 silent store errors corrected.
- **Standings lens shipped and is HOME.** `f1-racetracks/standings.html` (shell) + `source/standings/{base.css, panel.css, data.js, matrix.js, panel.js, trajectory.js, nav.js}`. WDC/WCC computed live from race + sprint, never stored. Trajectory feature (position default + teammate overlay) live.
- **Router in place.** `index.html` is a pure router shell: default → standings, `#/<slug>` → circuits.html, `#circuits` → circuits jump. Never stores a servable page.
- **Nav connector live.** Masthead switcher (Standings · Circuits), jump-to-round deep links, in-panel "Circuit guide →" connector.
- **ClickUp is slim.** Full finishing order LEFT ClickUp. History collapses to ONE year-labeled "Race History" text field per track (fill-if-blank, prior years immutable). *(Field creation + f1-refresh mirror rework still pending — separate track, not this build.)*

**This build = aesthetics only on the circuit pages.** No engine, no schema, no data-store changes.

---

## Aesthetic direction (match standings lens)

Dark **pit-wall**, not the OnTrack nav-app feel:

- **Sharp corners.** A purposeful circle or two is fine; default is square/tabular.
- **Tabular / mono numerics.** Numbers align, monospace figures, dense.
- **Dense tables over cards.** Information-rich, timing-screen density. Cards are the exception, not the default.
- **Color-as-data, never decoration:** team accent per driver, **purple** = fastest lap, **amber** = amended / story tint (loud signal), **bright gold number** = win.
- **Story-tint reads as a signal**, not a background wash.
- Circuit pages are **transitory drill-throughs**; standings is home. Streamline them toward a fast in/out state, not a destination.

Pull the actual tokens/spacing/type scale from `source/standings/base.css` + `panel.css` so the two lenses feel like one app.

---

## Architecture rules that are now LAW (do not violate)

1. **Segment BEFORE authoring — never flag-after.** Every file ≤ ~12KB soft / 30KB hard readback cap. Authoring a monolith and disclosing its size afterward is a GATE FAILURE; an over-cap file must be reverted and rebuilt segmented. No exceptions.
2. **Data nests UNDER its consuming app** (`<app-slug>/<data-dir>/`), never at repo root. Root = apps + infra only. Shared data → `shared/`.
3. **index.html = router/shell, never a servable page.** The instant an app has >1 page, index is a dispatcher; default landing is a one-line constant.
4. **Byte-fragile: REBUILD, do not blind-edit `circuits.html`.** Its footer IDs are wired to the live-weather / footer-export module (`source/11_weather_and_footer_exports.js` per the working map below). A careless string edit corrupts those hooks. Read source byte-exact via `get_commit` `detail=full_patch` (raw fetch flattens HTML). If a file body won't read back clean, do NOT overwrite it.
5. **DESIGN-UI hard bans still apply** (load the skill before building).

---

## Source map (WORKING MAP — confirm the real chunk set at pickup)

The circuit app is chunked into `f1-racetracks/source/` modules. The working understanding from the last session:

- `circuits.html` — shell (formerly `index.html`, renamed via GitHub UI)
- `live-tracker.html` — live circuit tracker page
- `source/05..18_*.js` — circuit page logic modules (weather, footer/exports at ~`11_weather_and_footer_exports.js`)
- `source/*.css.txt` — runtime styles injected with a `BUILD_STAMP`
- `source/standings/*` — standings lens (DONE; reference for tokens, don't restyle)

**Do not trust these filenames blind.** First step at pickup: list `f1-racetracks/source/` and confirm the actual module inventory + which module owns the footer/weather hooks BEFORE touching anything.

---

## Build procedure

1. Read this brief. Load the **DESIGN-UI** skill.
2. List `f1-racetracks/source/` and confirm the real chunk set + footer/weather owner module. Read the standings tokens (`base.css`, `panel.css`) so the reskin matches.
3. Read `circuits.html` + `live-tracker.html` byte-exact (`get_commit` full_patch). If either won't read clean, STOP and flag — do not blind-overwrite.
4. Reskin to pit-wall, **segmented from the first keystroke** (respect the cap; never author a monolith "to split later").
5. Keep desktop AND mobile first-class (see standing rule below).
6. Bump `BUILD_STAMP` / version. PR → self-merge. Post one board line before any git op; clear it on close.
7. **Do this WITH Michael** — it's an aesthetic pass; get his eyes on iterations before merge.

### Do NOT
- Touch engine, schema, or data store. Ricky never touches engine/source.
- Blind-edit `circuits.html` footer/weather hooks.
- Ship any over-cap file. Segment first.
- Restyle the standings lens — it's the reference, not a target.

---

## Acceptance criteria

- [ ] `circuits.html` + `live-tracker.html` read as pit-wall siblings of the standings lens (shared tokens, sharp corners, tabular numerics, color-as-data).
- [ ] Footer / weather / export hooks still function (IDs intact, not corrupted).
- [ ] Every touched file under the readback cap; nothing authored as a monolith.
- [ ] Mobile first-class: zero horizontal scroll at 320/375/390px, touch targets ≥44px.
- [ ] Router + nav switcher still route correctly to the reskinned pages.
- [ ] `BUILD_STAMP` / version bumped.

---

## Standing rule (applies to ALL apps) — PRESERVED

**Every app in `mawizorek/ClickUp_apps` must be explicitly designed for clean mobile viewing AND desktop — mobile is a first-class target, not an afterthought.** Every build and build spec includes a responsive pass: no horizontal overflow at 320px, footers/action bars that wrap or stack, touch targets ≥44px, fluid layout via `clamp()`/`min()`/`%`, safe-area insets. Test every ship at phone width before calling it done. Also recorded in the Brain Reference Library (Apps / HTML Artifacts → Architecture).
