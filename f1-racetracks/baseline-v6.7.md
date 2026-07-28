# F1 Racetracks — v6.7 Structural Baseline

**Build Order step 2. This is the pre-port contract.** Every field, control, binding, null path and link that exists on v6.7. After each port step, diff the ported route against its section here. Anything missing is either a regression or a deliberate removal named in the PR — there is no third option.

**Pinned at commit `ba656e9134eb57d4d2fdeaeadef77afb017c2ad3`.** Read from source via the blob API, not from a running page.

> **What this does NOT cover:** anything visual. Spacing, alignment, color, overflow, z-order. That is Michael's manual check (screenshots before step 3, eyeball after step 8) and is deliberately not an agent criterion. See `next-build-spec.md` ▸ Baseline parity capture.

## Capture status

| Route | Source | Captured |
|---|---|---|
| 1 · Home grid | `09_app_bootstrap_and_home.js` | ✅ complete |
| 2 · Circuit breakdown | `10`, `11` | ⬜ pending |
| 2a · Weekend Center | `14`-`17` | ⬜ pending |
| 2b · Driver Popup | `10` | ⬜ pending |
| 3 · Weekend race detail | `source/weekend/`, `15` | ⬜ pending |
| 4 · Standings | `source/standings/` | ⬜ pending |
| Store | `12_results_store.js` | ⬜ pending |

**Step 3 does not start until every row reads ✅.** A partial baseline is worse than none: it invites a port to claim parity on the routes nobody wrote down.

---

## Route 1 · Home grid (`#/`)

Source: `source/09_app_bootstrap_and_home.js` (26,175 B), header `v9 / 2026-07-13`.

### Data flow (the boot chain)

```
fetch circuits/index_circuits.json      (cache: no-cache)
  └── idx.circuits[]  →  {slug, file, round, date, status, sessions}
        └── fetch circuits/<file>       (Promise.all, per-file soft-fail)
              └── Object.assign(circuit, {round, date, status, sessions})
                    └── TRACKS[]  →  applyData()  →  bySlug{}  →  router()
```

⚠️ **Two derived fields are computed in `applyData` and exist nowhere in the store.** A port that rebuilds the pipeline must recreate both or the Continent and Era filters silently return nothing:

- `t._cont` = `CONTINENT[t.cc]`, fallback `"—"`
- `t._era` = `MODERN.has(t.slug) ? "Modern" : "Classic"`

⚠️ **Three editorial datasets are hardcoded in this module, not in the data layer.** They are content, and they will be lost in a naive port:

1. `CONTINENT` — 18 country codes → 6 continent labels, plus `CONTINENT_ORDER` for chip order.
2. `MODERN` — an 8-slug Set (`miami`, `las-vegas`, `losail`, `yas-marina`, `cota`, `baku`, `madring`, `marina-bay`) that defines the entire Era axis.
3. `TEAM_COLORS` — 10 teams → **literal hex**. See the theme note at the bottom.

### Fields rendered

| Element | Field | Notes |
|---|---|---|
| `.rc-rn` | `t.round` | `R` + zero-padded to 2 |
| `.rc-status` | `t.status` | `done` → "Completed", `active` → "Live", **anything else** → "Upcoming" |
| `.rc-gp` | `t.gp` | escaped |
| `.rc-circ` | `t.title` | escaped |
| `.rc-date` | `t.flag` + `t.date` + `SEASON` | `SEASON` is the const `"2026"` |
| `.rc-tag` | `t.report` | truthy → "Breakdown", falsy → "Soon" |
| card enabled | `t.report` | **falsy = `button.disabled`**, no click handler bound |
| href target | `t.slug` | `location.hash = "#/" + slug` |
| carousel `.cx-circ` | `t.loc` | ⚠️ **only place `t.loc` renders on this route** |
| footer `#foot-meta` | `TRACKS.length`, `reportTracks.length` | see Footer contract |

### Controls

**Filter bar** (`#filters`, injected by `filterBarHTML`, wired by `wireFilters`). Logic: **AND across dimensions, OR within one.**

| Dimension | Values | Source |
|---|---|---|
| Continent | dynamic — `CONTINENT_ORDER` filtered to continents actually present in `TRACKS` | derived from `cc` |
| Era | `Classic` · `Modern` | derived from the `MODERN` set |
| Status | `done` "Completed" · `active` "Live" · `pending` "Upcoming" | store `status` |
| Breakdown | single toggle, "Ready only" | `t.report` |

- Chips carry `aria-pressed`; status chips carry a colored `.cdot` (this **is** the status legend — the standalone legend row was culled in v9, so removing the dots removes the legend).
- `#flt-count` — `"N circuits"` when unfiltered, `"N of M circuits"` when filtered.
- `#flt-reset` — **`hidden` unless at least one filter is active.**
- State lives in the module-level `flt` object (three `Set`s + one boolean). **Not in the URL** — filters do not survive a reload or a shared link.

**Jump drawer** (`setupJump`, `buildJump`). ⚠️ **It replaces a pre-existing `<select id="jump">` in the DOM via `parentNode.replaceChild`.** If the new shell does not render that select, the drawer never builds and there is no error — `setupJump` returns silently on `if (!sel) return`. **This is the single most likely silent break in the port.**

- Trigger button, scrim, right-side drawer appended to `document.body`.
- Search input filters rows by `textContent` substring, case-insensitive.
- Rows: `R<NN>` · status dot · `t.gp` · `t.flag`; `data-soon` on rows without `t.report`.
- Empty state: `"No circuit matches that."`
- Closes on: scrim click, × button, **Escape** (bound to `document`).
- `aria-current="true"` on the row matching the current hash.

**Carousel** (`#cx-host`, `carouselMarkup`, `window.f1Carousel`). Two tiles, prev/next.

- Start index from `currentIndex()`: `appDataMeta.current_round_slug` → else first `active` → else first `pending` → else `0`.
- ⚠️ **`appDataMeta` is populated by module 12 mutating `window.appDataMeta` in place.** The binding is the shared window object, not an import. Modularizing 12 without preserving that mutation silently changes which round the carousel opens on.
- Nav buttons `disabled` at each end; `carouselStart` clamps to `[0, TRACKS.length - 2]`.
- Tiles without `t.report` render `disabled` with class `cx-dis`.

### Null / empty paths

| Condition | Renders |
|---|---|
| Filters match nothing | `.grid-empty` → "No circuits match these filters." |
| Jump search matches nothing | `.jd-empty` → "No circuit matches that." |
| One circuit file fails | **soft-fail** — `console.error`, that circuit is dropped, the rest render |
| Index fetch fails, or zero circuits load | `renderDataUnavailable()` → full-page card naming `circuits/index_circuits.json` + a same-origin hint |
| `TRACKS.length < 1` | `carouselMarkup()` returns `""` |
| Unknown `t.status` | falls through to "Upcoming" / `pending` |
| `t.cc` not in `CONTINENT` | `_cont` = `"—"`, so the card is **unreachable by any Continent filter** |

### Footer contract

`#foot-meta`, set by `updateFooterMeta` on every route change:

- On a circuit: `F1 Racetracks v9 · Round <n> · <title>`
- On home: `F1 Racetracks v9 · <reportTracks.length> breakdowns · <TRACKS.length> rounds`
- On data failure: `F1 Racetracks v9 · data unavailable`

⚠️ `APP_VERSION` is the string `"v9"` hardcoded here, while the README calls the shell **v6.7**. Two version numbers for one app, and the one users see is `v9`.

### Router (moves to the shell at step 4)

```
hashchange → router()
  slug = location.hash.replace(/^#\/?/, "").trim()
  bySlug[slug] ? renderTrack(bySlug[slug]) : renderHome()
  → highlightJump · window.scrollTo(0,0) · updateFooterMeta
  → setTimeout(syncWeekendSurfaces, 0)   [if defined]
  → lucide.createIcons()                 [if present]
```

⚠️ **Four cross-module couplings the new router MUST reproduce:**

1. `renderTrack` is defined in module **10** and called from **09**. Global-scope dependency, no import.
2. `syncWeekendSurfaces` is called **only** through a `typeof === "function"` guard. If the new router drops it, the Weekend Center silently stops refreshing on navigation — **no error, ever.**
3. `lucide.createIcons()` re-runs after every render. Miss it and icons vanish on navigation but look fine on first paint.
4. `window.scrollTo(0, 0)` on every route change.

### Injected CSS

`#v9-circuits-css` is a `<style>` block injected by an IIFE, idempotent via an id check. It defines `#grid`, `.rcard`/`.rc-*`, `.filters`/`.chip`/`.flt-*`, `.jump-*`/`.jd-*`. It consumes tokens from the 02css `:root` band (`--surface`, `--line`, `--bg2`, `--text`, `--muted`, `--faint`, `--grid`, `--done`, `--active`, `--red`, `--ease`, `--s1`-`--s3`).

🚨 **Hardcoded color literals in this module, against the app's own zero-literals rule:**

- `TEAM_COLORS` — 10 hex values, plus the `"#D7DCE4"` fallback in `teamTone()`.
- `oklch(0.42 0.02 268)` / `oklch(0.5 0.02 268)` — hover and pressed borders, **hue 268 baked into the CSS string**, appearing 4 times.
- `oklch(0.10 0.01 268/0.6)` — the jump scrim.
- `oklch(0 0 0/0.8)` — the drawer shadow.

Every one of these survives a theme swap unchanged. **The hue-268 literals are the actual work of the theme port on this route**, and they are inside an injected CSS string rather than a stylesheet, so a token sweep that only reads `.css` files will miss them.

---

## Routes 2, 2a, 2b, 3, 4, Store

⬜ **Not yet captured.** Next pass reads `10`, `11`, `12`, `14`-`17`, `source/weekend/`, `source/standings/`.

---

## Cross-cutting notes

### Read-cap measurement (third data point)

`09` is **26,175 bytes** and **read back whole** through the blob API on 2026-07-27. Prior measurements: 21.7KB whole (07-26), ~25KB truncated (07-25).

The practical read cap is therefore **at least 26.2KB**, not the ~22KB asserted across the size docs. That number has now been wrong in the conservative direction twice. Anyone reasoning about file budgets should use the measured figure and the Enforcer's shape test, not the arithmetic. Logged so the correction is attached to evidence rather than repeated from memory.

### 🚨 `THEMES.applyTheme('f1')` does not resolve

The spec, the README, and the acceptance criteria all say the v7 shell boots with `THEMES.applyTheme('f1')`. **There is no theme with slug `f1`.**

`shared/themes/_themes.json` is the join table, and a THEME is a named binding of four vectors (color × typography × forms × spacing). `shared/themes/f1/` is **not a theme** — it is a directory of **11 team COLOR entities** (`ferrari.json`, `mclaren.json`, …), each a palette of `bg`/`surface-*`/`border`/`text-*`/`accent-*`/`good`/`warn`/`bad`/`info` tokens. One vector, eleven options.

The spec's diagnosis — *"that directory is started, not complete"* — is wrong. It is complete **as a color vector**. It will never be a theme, because it is the wrong kind of object.

The join table already contains F1 themes: **`sharp-mclaren`** (status locked, `intendedUse: "Reference build for F1 apps."`), `mclaren-mobile`, and `on-track`. None is named `f1`.

**This blocks step 3 and it is Michael's call, not a fix.** The live app is hue-268 purple, which is not any team's palette, so picking a theme changes the app's identity color. Question logged to the F1 Racetracks Decision Log.
