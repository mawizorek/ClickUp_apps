# F1 Racetracks

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/f1-racetracks/)

![Launch](https://img.shields.io/badge/Launch-F1_Racetracks-red?style=for-the-badge)

**Status:** v5 live · externalized data payload + completed-race panels shipped

**Source of truth:** this repo folder  
**ClickUp task:** [F1 Racetracks — circuit breakdown app](https://app.clickup.com/t/86aj9wgx0)

---

## What it does

A single self-contained HTML app holding every 2026 F1 circuit breakdown in one place. The index is the home screen; each track is a hash-routed view inside the same app. One shared render engine plus one externalized data payload means layout changes stay in `index.html` while circuit and results updates stay in `data.json`.

**Per-circuit breakdown includes:**

- Official circuit map
- Lap profile chart with elevation, DRS zones, and sector splits
- Tyre allocation + strategy analysis
- Pit lane data
- Overtaking analysis
- Corner guide
- Live weather
- Completed-race podium panel
- Pole breakdown panel
- Winners history board

---

## How to use it

- Open the app → the index grid shows every tracked round
- Tap a circuit card → open the full breakdown view
- Completed rounds surface podium + qualifying context near the top
- Winners history sits lower on every circuit view and updates from `data.json`
- Footer actions let you copy source, prepare a download, open raw source, or export the resolved dataset

---

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Shipped runtime app (UI, routing, render logic, styling) | Version bumps + live polish passes |
| `data.json` | Externalized runtime payload (track manifest, race results, winners data) | Weekly / after each race via MCP |
| `source/01_runtime_head.html` | Runtime head / library / wrapper source | When runtime chrome changes |
| `source/02_styles_foundation_and_layout.css.txt` | Layout, tokens, cards, chart foundations | When layout or responsive behavior changes |
| `source/03_styles_panels_tables_footer.css.txt` | Panels, tables, footer toolbar, late UI rules | When panel/footer behavior changes |
| `source/04_runtime_shell.html` | Header / footer shell markup | When runtime shell changes |
| `source/05_track_data_rounds_01_03.js`–`08_track_data_rounds_14_24.js` | Grouped circuit data source files | When circuit content changes |
| `source/09_app_bootstrap_and_home.js` | App boot, router, home screen logic | When boot / home behavior changes |
| `source/10_track_views_and_profile.js` | Circuit-view rendering and lap profile logic | When track-view behavior changes |
| `source/11_weather_and_footer_exports.js` | Weather fetch + footer export actions | When integrations / footer behavior change |
| `source/source_index.md` | Canonical composition order + source guardrails | When source structure changes |
| `next-build-spec.md` | Forward-looking build brief for the next real scope | Overwritten as needed |

---

## Architecture (critical infrastructure notes)

- **Aesthetic:** dark telemetry dashboard. S1 cyan, S2 violet, S3 gold, DRS green, elevation amber, Ferrari-red accent. Fonts: Space Grotesk + IBM Plex Mono.
- **Routing:** `#/` = home, `#/slug` = a specific circuit view.
- **Runtime data load:** `index.html` fetches `data.json`, resolves the grouped track source files listed there, and caches the resolved payload in `localStorage` for offline fallback.
- **Completed-race panels:** podium / pole / winners render from the `raceResults` and `historicWinners` objects in `data.json`.
- **Source scaffold:** `source/` is the preferred human/agent edit surface. The live runtime is still `index.html`.
- **Runtime self-declaration:** the runtime now explicitly declares its live URL, source URL, and infrastructure mode in top-of-file comments.
- **Maps:** official Wikimedia outline via `Special:FilePath/`; `onerror` prints the missing filename for debugging.
- **Mobile behavior:** active effort is to keep the mobile first-open experience clean and prevent horizontal drift / right-scroll on race pages.

---

## Version history

- **v5** — externalized runtime data path, completed-race podium / pole / winners panels
- **v4.1** — semantic source scaffold added under `source/`
- **v4** — standalone offline-first build with footer source-export tools
- **v3** — +4 circuits (Hungary, Netherlands, Italy, Spain / Madrid); 14 of 24 built
- **v2** — fixed incorrect Wikimedia map filenames
- **v1** — initial single-file app: 10 circuit breakdowns, index + hash-routed track views

---

## Related

- **ClickUp task:** [F1 Racetracks — circuit breakdown app](https://app.clickup.com/t/86aj9wgx0)
- **Reference standard:** [Apps / HTML Artifacts](https://app.clickup.com/36074068/docs/12cwjm-54133/12cwjm-72233)
- **Repo operating guide:** [ClickUp Apps Repo — Operating Manual](https://app.clickup.com/36074068/docs/12cwjm-56313/12cwjm-74093)
- **Formula 1 ops guide:** [F1 Weekly Refresh — Brain Operations Guide](https://app.clickup.com/36074068/docs/12cwjm-54133/12cwjm-67313)

---

## Roadmap

- backfill deeper historic winners data into `data.json`
- build the remaining 8 circuit breakdowns (Baku → Abu Dhabi)
- persist last-viewed circuit + add keyboard left / right navigation
- split oversized grouped data source files back under the ~15 KB hard threshold
