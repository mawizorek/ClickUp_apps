# Open Thread — Archive

Single running archive of SHIPPED / RESOLVED work moved out of `open-thread.md`.

`open-thread.md` holds ACTIVE loops ONLY. When an item ships: its still-open bullets (if any) stay in `open-thread.md`, and its shipped narrative lands here. This file is **NOT dated per-pass** — it is one running file, newest at the top. Git history remains the authoritative changelog; this file is the fast cold-pickup context for closed work. Trivial/superseded lines are deleted outright (git holds them) and never reach this file.

---

## Global theme system + 20-object gallery — SHIPPED 2026-07-16 (largely superseded by the 4-vector matrix)

> Superseded by the 2026-07-17 4-vector theme matrix (`colors.tsv`/`typography.tsv`/`forms.tsv`/`spacing.tsv` + `_themes.json`). Residual open items not covered by the 4-vector work are tracked in the active `open-thread.md`. Narrative kept here for lineage.

Established a GLOBAL, token-driven theme system shared by ClickUp HTML apps AND FileMaker layout renders. Source of truth at the time: `shared/themes/README.md` + `shared/themes/OBJECT-COVERAGE.md`.

- **PR #264** — Promoted FileMaker-scoped `filemaker/z-themes/` up to **`shared/themes/`**, global. One **17-key semantic token contract** (`bg`, `surface-1/2/3`, `border`, `field`, `text`, `text-soft`, `text-faint`, `accent`, `accent-2`, `accent-soft`, `on-accent`, `good/warn/bad/info`), bare `--name` custom props. Old FileMaker `cv-*` 10-key vocab merged via `fmpRoleMap`. 12 themes (maw-dark-utility anchor + full 2026 F1 grid). Tooling: `resolve.js` (mode-aware fallback trail), `build-themes.mjs` (17-key schema check), generated `themes.css`. Gate at `brain-config/gates/theme-contract-gate.md`.
- **PR (themes-object-gallery)** — Rebuilt `preview.html` into the theme × object gallery over all **20 canonical FileMaker objects**, each with its state matrix + per-theme token-coverage readout. Added `shared/themes/OBJECT-COVERAGE.md`.

**Locked model:** color lives ONLY in `shared/themes/*.json`; consumers reference a slug (apps resolve live via `resolve.js`; FileMaker inlines resolved tokens at build time, never fetch). A theme is "done" only when it styles all 20 objects with no fallback (17/17). New tokens/objects bump `schemaVersion`.

**Headline rule (LOCKED):** everything under `filemaker/` is a design mockup / build tool ONLY, never a hosted asset. Renders articulate how a NATIVE FileMaker layout should look/behave (native build is Michael's, end-of-year).

---

## FileMaker object verification & audit trail (D-007) — SHIPPED 2026-07-16

> Still-open items (a/b/c) live in the active `open-thread.md`.

Every documented object (table, calc, script, relationship, function, value list, layout) got a uniform verification model. Read `filemaker/DOCUMENTATION-STANDARD.md` v1.5 → 'Object verification & audit trail' + `DECISIONS.md` D-007.

**Locked model:** four signals — status · index↔body agreement · blob identity · live-file verification. **Derive-don't-store:** only stored data is `status` + a self-invalidating `verified:{date,sha,by}` stamp in ONE per-app ledger `<app>/meta/verification.json`. Blob SHA IS the version; absence of a ledger entry = unverified (safe default). Badge: 🟢 consistent + verified.sha==current, 🟡 unverified/stale, 🔴 mismatch/unresolved. Rolls up to `VERSIONS.md`.

**Shipped (branch `filemaker-verification-audit-d007`):** standard → v1.5; DECISIONS D-007; `filemaker/hml-llc/meta/verification.json` ledger created (empty `objects` = honest unverified baseline); badge wired into `scripts.html` + `relationships.html`; viewer README documents it.

---

## FileMaker scripts + relationships doc model — DESIGN LOCKED + skeleton + renderers SHIPPED 2026-07-16

> Still-open items (a/b/c/d) live in the active `open-thread.md`.

Read `filemaker/DOCUMENTATION-STANDARD.md` (v1.5) + `DECISIONS.md` D-005/D-006.

**Locked model:**
- **Scripts ride the calc model.** Body = lean `scripts/<folder>/<ScriptName>.fmscript` (steps + narrative as native `#` comments). ONE master `scripts/_index.json` (flat `scripts[]`). Renderer builds tree from `folder` + CALLS/CALLED-BY graph; `calledBy` derived at render time. Listing ≠ loading (lazy drill-in).
- **The one honest limit:** a `.fmscript` is a DICTATION reference, NOT paste-round-trippable (FileMaker script clipboard is XML). Never claim script paste-round-trip.
- **Relationships are pure data.** `schema/relationships.json` = the SINGLE edge surface. README edge table retired.

**Shipped:** PR #270 (standard → v1.4; D-005/D-006; `commitRecord.fmscript` canonical reference; relationships README edge table retired). PR #272 (both baseline renderers `relationships.html` + `scripts.html` in `filemaker/_viewer/`, app-agnostic via `?app=<slug>`). D-007 badge later wired into both.

---

## FileMaker calc externalization (HML_LLC) — SHIPPED 2026-07-16

> Still-open items (a–f) live in the active `open-thread.md`.

Read `filemaker/DOCUMENTATION-STANDARD.md`.

- **PR #260** — Externalized every calc formula body to `filemaker/hml-llc/calculations/`, one `.fmcalc` per calc field (19 files). Each file = 2 `//` header lines + blank + verbatim formula, round-trippable. `schema/tables.json` → v1.2 (calc fields carry `calcRef` + `returns` + `stored`, bodies removed). Added `calculations/_index.json` manifest. GLOBAL calc names reconciled to camelCase.
- **PR #261** — Retired inline `Calculations` sections from the three table markdown files. Calc fields still appear as ROWS; each file keeps one prose line pointing at `../calculations/`. Standard → v1.3.

**Locked model:** formula body lives ONLY in `calculations/*.fmcalc`; structural metadata in `schema/tables.json`; dependency hints in `calculations/_index.json`. Convention: `<Table>__<FieldName>.fmcalc` (double-underscore namespace sep). Rendering/linter tooling built as ClickUp artifacts (not yet in repo — see active follow-ups).

---

## Inciardi Market — DONE 2026-07-12/13

- **index-as-router reconcile (PR #156):** `index.html` → thin router (1.8KB, `DEFAULT_LANDING = market.html` + JS redirect + noscript). Market terminal moved verbatim to `market.html`.
- **Worker v0.4 price fix (PR #157):** $0.00 / -100% Deal Radar bug was AUCTION listings — `normalize()` now falls back to `it.currentBidPrice`.
- **Ledger (PR #158):** inciardi-market row = shell v10 (index=router) · worker v0.4. Stale PR #155 closed.
- **wrangler.toml + git-connect (PRs #159, #166):** Worker connected to repo (root `inciardi-market`, prod branch main, cron `0 */6 * * *`). Workers Builds auto-deploy LIVE. KV `SNAPSHOTS`, D1 `DB`=`18f3459f-8273-44d6-8380-6971d6173b3e`.
- **Cron live** — `market_point` + `print_point` now accumulate every 6h.

---

## Report Schema + Reports Tab — RESOLVED 2026-07-04 (v3.4)

- Report JSON schema locked: `brain-config/report-schema.md` (envelope + audit/review/research bodies).
- Reports tab built: `source/reports.js` (list, per-type render, on-demand HTML export, empty state).
- `detail.js` tab shell: report-makers land on Reports first, Settings second; lenses land on Settings. `makesReports` gates it.

**Non-blocking follow-ups:** no `research`-type report exists yet (renderer + schema ready for Scout Sage's first); consider a deep-link sub-route if sharing a single report becomes useful.

---

## Routine Ricky — promoted to Super Agent 2026-07-04 (v3.4)

Ricky promoted to a live ClickUp Super Agent. Git profile PARKED at `agents/_archive/routine-ricky.md` with a banner: the Super Agent's preferences are the source of truth; the archived file is a stale pre-promotion snapshot. To revive as a standalone git tool, review the live Super Agent's prefs FIRST and reconcile before reusing the name. The `routines/` subsystem is his live runtime data — never delete it. Intentionally OUT of the viewer roster.
