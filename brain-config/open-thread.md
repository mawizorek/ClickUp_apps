# Open Thread

Scratch pad for **active loops only**. Brain checks this at session opens via the Session Open trigger. When an item ships: delete the line outright (trivial/superseded — git history holds it) OR, if the writeup has cold-pickup value, move its shipped narrative to `open-thread-archive.md` (one running file, NOT dated) and keep only its still-open bullets here. If this file is empty, that's fine — that's the goal.

---

## 📋 Entry template (COPY THIS — do not improvise a format)

Every new open-thread entry uses the exact shape below. Copy the block, fill every field, append it to the bottom (newest at the bottom, under the existing entries). Never overwrite an existing entry. This is the same note that gets posted as a comment on the session's Agent Activity Board task at close — one note, two surfaces (the task comment is the in-session record; this file is the durable cross-session queue read at Session Open).

```
## [OPEN] <short title of the open item>

- **ID:** OT-YYYY-MM-DD-<n>              (stable handle; increment <n> if multiple land same day)
- **Logged:** YYYY-MM-DD HH:MM ET
- **Session:** <link to the Agent Activity Board session task OR the session-close chat thread>
- **Urgency:** 🔴 High | 🟡 Medium | 🟢 Low     (keep one, delete the rest)
- **Item:** <what is open, in enough detail that a cold agent understands it without loading prior chat>
- **Next action:** <the single first thing the next agent should do>
- **Refs:** <repo paths, PR #s, doc/task links, or "none">
```

**Field rules:**
- **Status flag** in the heading: `[OPEN]` while pending; flip to `[RESOLVED]` (with a date) when done rather than silently deleting, so the trail survives one cycle before cleanup.
- **ID** is a stable handle so the item can be referenced in chat, commits, and other entries. Format `OT-<date>-<n>`. Never reuse an ID.
- **Logged** is a real timestamp (date + time + ET), not just a date. (Older entries below use `**Added:** YYYY-MM-DD` — that's the legacy shape; new entries use this template.)
- **Session** must be a link, not a description — it's how a cold agent gets back to the full context.
- **Urgency** is one of the three flags; delete the two you don't pick.
- **Next action** is mandatory: one concrete first step, so the entry is actionable, not just informational.
- **Refs** carries anything load-first (repo paths, PR numbers, doc/task links). Write `none` if genuinely nothing.

---

## [OPEN] Agent folder upgrade — promote flat `<slug>.md` profiles to slug-keyed folders (spec ready, not built)

- **ID:** OT-2026-07-17-5
- **Logged:** 2026-07-17 18:06 ET
- **Session:** https://app.clickup.com/t/86ajkbr63 (Agent Activity Board task — full transcript)
- **Urgency:** 🟡 Medium
- **Item:** Audit Anna's profile ballooned to ~35KB in one session and became unloadable, exposing that single-file agent profiles don't survive iteration. Proposal (spec'd + Workshop-vetted + Frank-ruled): promote each agent from a flat `<slug>.md` to a **folder keyed by slug** holding `preferences.md` (the lean profile — the ONE load-to-embody file) + `change-log.md` + `decision-log.md` (created on first use) + `memory.md` (Super Agent memory-file style, created on first use) + `metadata.json` (moved in). Fold-in Frank: this is FOLD-IN / PARTIALLY-EXISTS — six agents ALREADY have slug folders (closing-clio, handoff-hana, memory-maggie, recon-renata, scout-sage, workshop-wes) and closing-clio already has a `reports/` subdir; formalize the half-adopted pattern, don't reinvent. Storage reorg ONLY — no agent's behavior changes.
- **Next action:** Answer the 5 open questions at the bottom of the spec WITH Michael (entry filename, agent-memory vs brain-memory boundary, empty-stubs vs create-on-use, big-bang vs dual-resolver, whether tiny lens agents earn folders), THEN author `_template-agent/` and migrate Audit Anna FIRST as the reference. The full cold-agent handoff prompt was delivered in the Anna session chat (2026-07-17 ~6:06 ET).
- **Refs:** spec `brain-config/specs/agent-folder-upgrade.md` (PR #360); blast-radius surfaces = `registry.json` (generated, repoint `profile` fields), `council.md`, AI Toolkit index trigger table, viewer read paths (`index.html`/`tool-index.html`/`custom-tools.html`); `brain-config/agents/_template.md` + `_template-tool/` as skeleton precedent; session log https://app.clickup.com/36074068/chat/r/6-901327646617-8

---

## [OPEN] Audit Anna profile size — ~17.6KB, still over the 15KB target (Michael-tabled)

- **ID:** OT-2026-07-17-6
- **Logged:** 2026-07-17 18:06 ET
- **Session:** https://app.clickup.com/t/86ajkbr63
- **Urgency:** 🟢 Low
- **Item:** Audit Anna (`brain-config/agents/audit-anna.md`) is LOCKED at v11 after a condense pass took her ~35KB → ~17.6KB with zero behavior lost. Still ~2.6KB over the 15KB split-line target. Michael explicitly TABLED this — leave the profile alone for now, revisit deliberately with another agent. A natural condense got most of the way; the remaining slim likely comes from the agent-folder upgrade (OT-2026-07-17-5) moving her changelog/history OUT to a sibling `change-log.md`, rather than cutting any rule. Do NOT cut behavioral rules to hit the number.
- **Next action:** Fold this into the agent-folder migration — when Anna is migrated (she's the pilot), move her change-log + refinement history to `change-log.md` and confirm `preferences.md` lands under 15KB. Only pursue a standalone trim if the folder move doesn't get there.
- **Refs:** `brain-config/agents/audit-anna.md` (v11, PR #353); ties to OT-2026-07-17-5; session task https://app.clickup.com/t/86ajkbr63

---

## [OPEN] Theme system — 4-vector matrix: preview expansion handoff + carried follow-ups

- **ID:** OT-2026-07-17-1
- **Logged:** 2026-07-17 17:20 ET
- **Session:** https://app.clickup.com/t/86ajk74jd (Agent Activity Board task — full transcript)
- **Urgency:** 🟡 Medium
- **Item:** The theme system was extracted into a **4-vector matrix** this session, all merged to main and verified present: `colors.tsv` (paint), `typography.tsv` (voice), `forms.tsv` (radii/borders/shadows), `spacing.tsv` (density). `feelings.tsv` was DROPPED as a vague catch-all; `_themes.json` is now the join table connecting one of each vector into a Theme, with fallback defaults. `preview.html` (the Theme Studio, ~42KB) rebuilt with independent dropdowns mixing all four vectors live over the 20 canonical objects + Full App view. `THEME-SYSTEM.md` rewritten to document the 4-vector architecture. **A NEW agent is taking over to expand the preview to roughly twice its current size** — this Brain session is closed and should NOT touch the theme system further.
- **Next action:** Incoming agent: read `shared/themes/THEME-SYSTEM.md` (4-vector architecture) + `shared/themes/decision-log.md` before touching anything. Before expanding `preview.html`, note the PR #349 lesson: the committed Studio must NOT hard-depend on runtime fetch — it embeds a first-paint snapshot of the grids, then best-effort fetches the live TSVs to override. Doubling the preview means that embedded snapshot now has to stay in sync with FOUR TSVs, not two; keep the embed + override pattern or first paint breaks on mobile Safari again.
- **Refs:** `shared/themes/` (colors.tsv, typography.tsv, forms.tsv, spacing.tsv, _themes.json, preview.html, THEME-SYSTEM.md, decision-log.md, FILEMAKER-CAPABILITIES.md, OBJECT-COVERAGE.md); session task https://app.clickup.com/t/86ajk74jd; session log https://app.clickup.com/36074068/chat/r/6-901327646617-8

---

## [OPEN] Theme system — color values + font substitution need a human spot-check

- **ID:** OT-2026-07-17-2
- **Logged:** 2026-07-17 17:20 ET
- **Session:** https://app.clickup.com/t/86ajk74jd
- **Urgency:** 🟡 Medium
- **Item:** Two tuning loops rode along all session and were never closed. (1) The 15 hex values in `colors.tsv` are hand-converted from the old OKLCH palette and need a spot-check; only `mclaren` (the reference) was done carefully, and the `accent-deep` gradient stops are first-pass guesses across all 15 colors. (2) `sharp-racing` typography still uses Chakra Petch as a placeholder — Michael wants to pick the actual FileMaker-installed font so the hand-rebuild matches exactly; he has been deferring this pick.
- **Next action:** When Michael is ready, spot-check/tune the 14 non-reference color rows + their `accent-deep` stops in `colors.tsv` (one-cell edits), and swap the `sharp-racing` font in `typography.tsv` to his chosen FMP-installed face. All are single-cell TSV edits, no code.
- **Refs:** `shared/themes/colors.tsv`, `shared/themes/typography.tsv`

---

## [OPEN] Theme system — legacy color-layer naming + superseded files not yet retired

- **ID:** OT-2026-07-17-3
- **Logged:** 2026-07-17 17:20 ET
- **Session:** https://app.clickup.com/t/86ajk74jd
- **Urgency:** 🟢 Low
- **Item:** Two deliberate cleanups were flagged-not-fixed to avoid breaking consumers mid-flight. (1) The palette layer still calls a COLOR a "theme" in the legacy path (`resolve.js` back-compat `THEMES.apply(colorSlug)`, `themes.css`, `data-theme` attribute) even though vocabulary is now Color · Typography · Forms · Spacing · (join =) Theme. A deliberate rename pass is owed. (2) Superseded artifacts left in place so nothing breaks: per-color JSONs (`americana.json`, `maw-dark-utility.json`, etc.), `themes.css`, `build-themes.mjs`, and the `feelings/` dir (holds `sharp-racing.json`, now replaced by the 4 vector TSVs). Retire in a later cleanup pass once the 4-vector path is proven with a consumer.
- **Next action:** On a dedicated cleanup pass (NOT mid-build): rename the legacy color-layer "theme" usages to "color," then delete the superseded per-color JSONs + `themes.css` + `build-themes.mjs` + `feelings/` once confirmed no consumer references them.
- **Refs:** `shared/themes/resolve.js`, `shared/themes/themes.css`, `shared/themes/build-themes.mjs`, `shared/themes/feelings/`, per-color `*.json`

---

## [OPEN] Golden Shell app — standalone layout reference (net-new, not started)

- **ID:** OT-2026-07-17-4
- **Logged:** 2026-07-17 17:20 ET
- **Session:** https://app.clickup.com/t/86ajk74jd
- **Urgency:** 🟡 Medium
- **Item:** A standalone "golden" shell app was scoped this session as a layout **audit reference** (conformance-by-audit, not global-link): standalone left nav bar + right settings pop-up + canonical grid geometry. Golden template and layout shell are tracked as two separate entities; participation marked by a `standard layout` metadata tag; explicitly a single test, NOT applied globally. Unresolved sub-question (Novice Nia's crack): FileMaker can't import a shared web file, so downstream FileMaker rebuilds are always a copy-at-build-time — the audit-against-golden framing side-steps needing live linkage. Direction agreed; no build started.
- **Next action:** Pick up the dedicated task and build/designate the standalone golden shell app, then draft the Recon-Renata-style reconciliation audit checklist ("does this app match the golden shell? if not, what reconciles them?").
- **Refs:** task https://app.clickup.com/t/86ajkg7wc (Build Golden Shell app); direction logged https://app.clickup.com/t/86ajk74jd (comment 2026-07-17 4:38 ET)

---

## [OPEN] Non-mirror projection surfaces can still drift silently (4 surfaces)

- **ID:** OT-2026-07-17-7
- **Logged:** 2026-07-17 20:53 ET
- **Session:** https://app.clickup.com/t/86ajkdw17 (Agent Activity Board task — full transcript)
- **Urgency:** 🟢 Low
- **Item:** This session locked the `registry.json` ↔ ClickUp AI Toolkit index as a sanctioned MIRROR PAIR with a same-session sync mandate, and added the Agent & Tool Surface Map to `README.md` classifying every surface canonical/generated/projection. But only that ONE pair is formally sync-bound. The other four projection surfaces — `council.md`, `teams/the-workshop.md`, `team-standard.md`, and the viewer — can still fall out of step with the canonical profiles/registry without any gate catching it. Twice this session a stale projection was found by hand (the phantom list id `901328269587` lingering in council.md + Mira's charter after the gate fixed it; the retired-Wes 7-lens process still live in team-standard.md). The consolidation principle now says "author once, projections point," but nothing verifies it holds over time.
- **Next action:** Decide whether a lightweight drift-check belongs at session close (Closing Clio scans the projection surfaces against the canonical registry/profiles for stale names/statuses/ids and flags mismatches) OR whether the Surface Map's written rule is enough. If building it, scope it as a read-only flag, not an auto-fixer.
- **Refs:** `brain-config/README.md` (Agent & Tool Surface Map); `registry.json` `sync_mandate`; PRs #361/#366 this session; session task https://app.clickup.com/t/86ajkdw17

---

## [OPEN] Per-profile conduct blocks — standing invitation to personalize (not debt)

- **ID:** OT-2026-07-17-8
- **Logged:** 2026-07-17 20:53 ET
- **Session:** https://app.clickup.com/t/86ajkdw17
- **Urgency:** 🟢 Low
- **Item:** The 4-line Standing-agent conduct block is carried verbatim in ~20 agent profiles. This session it was RULED (Michael) a deliberate personalization seam, NOT trickle-down duplication, and explicitly protected from consolidation via a README exception. The verbatim copies are the FLOOR, not the goal — each agent is meant to rewrite the four directives' examples/emphasis into its own voice over time (Rhys cites failure modes, Beckett aims his hammer, Mira names voices in synthesis). Not a bug to fix; an open invitation to act on.
- **Next action:** No dedicated task. When any agent profile is next touched for other reasons, personalize its conduct block in passing rather than leaving the seed verbatim. Purely opportunistic.
- **Refs:** `brain-config/README.md` (Personalization-seam exception); `council.md` (canonical roster-wide statement); PR #368 this session

---

## ➡️ NEXT SESSION: Migrate HML script docs from ClickUp into the Git .fmscript model
**Added:** 2026-07-16

**Full brief:** `brain-config/handoffs/2026-07-16-hml-scripts-migration.md` (cold-agent ready — read it first).

The scripts doc MODEL is locked (v1.4) and the renderer is live, but the Git side has only ONE script (`commitRecord`, the reference example). ClickUp holds the real, extensive HML script library that was never migrated. Next session = convert it, not design it.

- **Source of truth in ClickUp:** `Hard Money Loan LLC FMP → DOCUMENTATION → Scripts and Automations` (doc `12cwjm-63993`) — the script-system index (real folder tree, v1 build order, per-script pages, 2026-06-18 audit).
- **Convert per script:** a `.fmscript` body (`#`-comment narrative + dictation step text) + a minimal row in the master `scripts/_index.json`. Mirror `commitRecord`.
- **⚠️ Two traps (in the handoff):** (1) folder-name mismatch — Git skeleton has `imports/navigation/triggers/utilities`, but the REAL FileMaker tree is numbered (`00_APP`…`90_ADMIN`, `zz_DEV_ARCHIVE`); reconcile to the numbered set FIRST, with Michael. (2) The 2026-06-18 audit marks several script pages stale (property-centered / pre-Payoffs-table) — 5 red "needs rewrite," 2 yellow; migrate faithfully but stamp each file's CHANGELOG with its audit status, don't launder old logic clean. Confirm with Michael whether red-status scripts migrate as-is-with-warning or wait.
- **Also:** pseudo-code pages migrate as dictation refs (mark them, live file is tiebreaker); narrative pages (`HML Scripting Practices`, `Script Organization Review`) → `meta/`, not `.fmscript`.
- **When populating, set verification honestly (D-007):** migrated-from-ClickUp ≠ verified-against-live-file. Leave objects unverified (no ledger entry) unless actually confirmed against the FMP file.

---

## FileMaker object verification & audit trail (D-007) — still-open items
**Shipped 2026-07-16** (narrative → `open-thread-archive.md`). Model locked: four signals (status · index↔body · blob identity · live-file), derive-don't-store, per-app ledger `<app>/meta/verification.json`. Badge wired into `scripts.html` + `relationships.html`.

**STILL OPEN:**
- **(a)** Add the same badge to `schema.html` (calc/table lens) — deferred to avoid rewriting the 23KB renderer.
- **(b)** Fold the AUTHORITATIVE SHA/verification check into `linter.html` so a red verdict blocks a PR. Ties to the calc-linter promotion.
- **(c)** First real verification pass once the live FMP file is available — confirm objects, write real `verified` entries into `meta/verification.json` (everything honestly yellow/unverified today). Pairs with the calc live-file name confirmation + the scripts migration.

---

## FileMaker scripts + relationships doc model — still-open items
**Design locked v1.4/v1.5, skeleton + both baseline renderers shipped 2026-07-16** (PRs #270/#272, narrative → `open-thread-archive.md`). Read `filemaker/DOCUMENTATION-STANDARD.md` + `DECISIONS.md` D-005/D-006 first.

**STILL OPEN:**
- **(a)** Populate the real script inventory — see the HML scripts migration brief above (scripts lens shows only `commitRecord` until done).
- **(b)** Renderers are baseline v1 — follow-up: script linter (`calls[]` targets resolve against `scripts/_index.json` then `functions/_index.json`; `folder` matches path; `name` unique; `scriptRef` exists), authoritative D-007 SHA check folded into `linter.html`, richer graph layout/zoom, cross-lens deep-links, `schema.html` badge. Relationships linter: endpoints resolve in `schema/tables.json`, `to.field` is a PK, cardinality/status enums.
- **(c)** PREREQ still open: calc renderer + linter still live as ClickUp artifacts, not yet promoted into `_viewer/`. Full viewer convergence wants that promotion.
- **(d)** Custom functions + value lists + layouts NOT designed. Functions likely ride the CALC model (`.fmfn` + a manifest); value lists = thin JSON + README; layouts = `layout.json` object/part inventory, needs a DDR pass. Per `filemaker/HANDOFF-object-doc-schemas.md`.

---

## FileMaker calc externalization (HML_LLC) — still-open items
**Shipped 2026-07-16** (PRs #260/#261, narrative → `open-thread-archive.md`). Formula bodies externalized to `filemaker/hml-llc/calculations/*.fmcalc`; `schema/tables.json` v1.3; standard is source of truth. Read `filemaker/DOCUMENTATION-STANDARD.md` first.

**STILL OPEN:**
- **(a)** Promote the renderer + linter into the repo as shared `filemaker/_viewer/` (app-agnostic, param-driven by app slug). Prereq for viewer convergence AND for folding the D-007 SHA check into `linter.html`.
- **(b)** `reads` dependency hints are HAND-AUTHORED in `_index.json` — consider a parser that derives them from each formula so the hint can't drift. Advisory until then.
- **(c)** Fold the calc linter into the Schema Linter tool (AI Toolkit) so it fires on the normal FileMaker doc-edit path.
- **(d)** Generate table markdown Fields tables from `schema/tables.json` so there's nothing to hand-sync. Separate pass.
- **(e)** Live-file name confirmation: schema names (`OriginalPrincipal`/`InterestRateAnnual`/`ClosingDate`/`GraceDays`/`fkCurrentPayoff`) reconciled in docs but NOT confirmed against the live FMP file (this is the D-007 live-file pass).
- **(f)** Apply the model to `filemaker/maw-budget` once the viewer is promoted. HML_LLC is the reference implementation.
- Convention: `<Table>__<FieldName>.fmcalc` (double-underscore namespace sep), ext = plain text.

---

## Global theme system (7/16) — residual open items not covered by the 4-vector work
The 2026-07-16 global theme system + 20-object gallery is **largely superseded** by the 2026-07-17 4-vector matrix (see OT-2026-07-17-1/2/3); shipped narrative → `open-thread-archive.md`. A few items are NOT covered by the 4-vector entries and survive here:
- **maw-budget renders** still point at the old `../../../../z-themes/resolve.js` path (moved to `shared/themes/`) — they break until re-pointed or re-tokenized (inline the 17 tokens). Michael OK'd breaking them temporarily. Fix on the next FileMaker render pass.
- **`filemaker/LAYOUT-RENDER-STANDARD.md` DD-R06** still describes the old per-render token block — reconcile it to the global contract on the next FileMaker pass.
- **FileMaker object hover-inspector** (Michael's ask): renders should get a hover object inspector surfacing each object's theme role + intended field definition (build documentation, not app behavior). Not built yet — spec into the next FileMaker render.

---

## Inciardi Market — full catalog HARVEST PASS (do first next session)
**Added:** 2026-07-13

The catalog-research-routine is written and good; execution is the gap. Catalog is ~37 of ~542 known prints after one partial pass. **Next session: run a full deep-excavation harvest per `inciardi-market/catalog-research-routine.md`.** Do NOT reinvent the routine — it already has the Shopify unlock, the 3-layer explode, classification, image sourcing, scrub rules, and a resumable Progress Log. Just run it cold from step 1.

- **Primary source (the unlock):** `inciardiprints.com/products.json?limit=250&page=N` (page until empty). Clean structured JSON, zero scraping. Three layers of prints: products, variants, and print-name lists buried in mystery-pack `body_html`.
- **Classify** via `/collections/<handle>/products.json` membership (category + exclusive/series).
- **Images:** variant-level `featured_image.src` -> per-print art; write the canonical Shopify CDN URL into each row's `image` field (LOCKED: reference the CDN URL, do NOT self-host blobs). `image: null` + provisional when none.
- **Reconcile** against existing `catalog.json`: match -> add alias + refresh; no match -> new canonical (sourced) OR provisional if uncertain. Merge, don't delete. Official names win; seller/eBay titles become aliases.
- **Secondary sweeps:** Instagram drop history, press, host shops, store-locator (machines) for retired/seasonal/exclusive prints the store no longer lists.
- **NEVER** copy miniprint.io (competitor) — answer-key only ("they claim 500, we have N"). Never fabricate names.
- **On finish:** log the pass in the routine's Progress Log (before/after count, sources hit, image coverage, gaps), then commit `catalog.json` data-only (no app shell/version bump) via branch->PR->self-merge.
- Fresh-read the current `catalog.json` first (its blob failed to load 2026-07-13 late-night; re-pull clean).

## Inciardi Market — NEW print viewer (after the harvest)
**Added:** 2026-07-13

After the catalog is fat with real prints, Michael wants **the best app to view / sort / filter / find / interact with the available prints.** This is a rebuild of the lens, not a patch.

- **Michael's direction (verbatim intent):** the prior version was buggy and "kind of cheesy." Wants **sharp corners** and a **database / search-field feel** for this lens (think fast queryable table/registry, not a soft card toy). Sharp, dense, precise.
- **Workshop team INVOLVED** — explicit ask. Run The Workshop (7 mandatory lenses + up to 2 supplemental) on the design before committing source; this is committed-source work so it gates through the pre-build stress-test.
- **NO monolith files** — explicit ask, and it matches the locked modular standard. Thin HTML shell + `source/` modules (the app is already modular post-v10: `base.css` + per-page css/js). Extend that pattern, don't regress it.
- Lives in the existing three-page app (Catalog / Market / Collection). Decide whether this sharp "database" viewer replaces/reskins `catalog.html` (the gallery) or is a distinct lens. Open design question for the Workshop.
- Reads the harvested `catalog.json`; cross-refs live market status the way the current catalog does. Per-print detail view (history + details about a specific available print) is part of the ask.

## Inciardi Market — scoring backbone (PAUSED by Michael, revisit after harvest+viewer)
**Added:** 2026-07-13

Move scoring off the flat `14` retail constant. Two layers:
1. **Per-print retail** (cheap, no new data): `verdict`/`deltaFor` read `catalog.retail` for the print, fall back to `14` only when unknown. Kills most of the noise (a $6 Negroni judged against $14).
2. **Market-anchored baseline** (needs accumulated `print_point` history): fair value = the print's own median landed over time, not a retail guess.
- **Undecided fork (Michael must call):** is "fair value" retail-anchored ("cheaper than she sold it") or market-anchored ("cheaper than it trades")? Diverges hard on exclusives (retail $6, trades $80). Defines what BUY means. Spec both into `next-build-spec.md` before building.

---

## F1 Racetracks — data layer refactor still-open items
**Added:** 2026-07-09

Canonical results store shipped (PRs #105/#108/#109); rounds 2-7 quali+grid backfilled (PRs #116/#117/#118). Narrative → `open-thread-archive.md`. **Canonicality rule (LOCKED 2026-07-09):** repo store = canonical for RESULTS (numbers); ClickUp race task = canonical for NARRATIVE (stories); store wins on conflict. NO more timing tables in ClickUp.

**STILL OPEN:**
- **(a)** Qualifying dig, rounds 8-9 (Austria + Silverstone) — NO quali table in ClickUp; needs a genuine external source dig matching this season's canon. Left ABSENT on purpose; do NOT fill from real-world 2026 data (it diverges from this season).
- **(b)** Per-driver race `fastLap` — not in the CU tasks (only the one official FL). Backfills empty; degrades gracefully; going-forward dig from a lap-time source.
- **(c)** v5.1 quali popup layout restructure (captured 2026-07-09): quali time (Q1/Q2/Q3) lives ONLY under the qualifying block; race start (grid) + race finish blocks go deeper on fastest-lap detail + tire strategy. DATA DEP: needs per-driver `fastLap` (b, still null) + per-driver tire strategy (NET-NEW field, needs a Fold-in/Size pass + Michael's go). UI can ship the relocate now and degrade the race-detail section. Data diff and UI diff = separate PRs.
- **(d)** Lens integration (drivers matrix + circuit guide) — open design question, deliberately not forced.
- **(e)** 2024/2025 historical backfill (future, Michael-flagged). Structure is built (per-season `f1-results/<year>/` folders + a cross-season `index_seasons.json`). Needs a NEW viewing level (ties to (d)); build nothing until Michael calls it.
- **(f)** Cosmetic: circuit guide TRACKS round numbering (Silverstone R11) differs from the store's (R9). Join by slug so nothing breaks; reconcile if it bugs you.

---

## Three-Shelf Reconciliation
**Added:** 2026-07-03

AI Toolkit index (ClickUp doc) has stale two-shelf scaffolding that doesn't match the three-shelf model (Hooks / Triggers / Subagents):

- Subpages still named "Every-Run Tools" + "Triggered Tools" (rename to match)
- "Activation state" section still uses two-shelf language (rewrite)

Reconcile naming + content on the next Toolkit-doc pass.

---

## Agent-Name Single-Source-of-Truth Migration
**Added:** 2026-07-04 · **Updated:** 2026-07-04 (v3.3)

Goal: profile header + metadata sidecar = the one source of truth for an agent's name; every surface reads from it, nothing hand-copies it.

**RESOLVED in v3.3:**
- ~~Three fighting identity files.~~ Sidecar wins; `agent.json` folded in + deleted.
- ~~Report folders keyed by legacy slugs.~~ Renamed to current slugs (`scout-sage`, `workshop-wes`).

**STILL OPEN:**
- **(a) ClickUp AI Toolkit doc** — Subagent roster + Quick-Scan trigger table hard-code display names + nicknames. Fix on the next Toolkit-doc pass.
- **(b) Viewer NICKNAMES map** — `source/data.js` still carries a hard-coded `NICKNAMES` map. Ideal fix: drop it and read `nicknames` from each sidecar at load time (the viewer already fetches them). Now easy since all 22 sidecars carry identity.
