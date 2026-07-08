# F1 Refresh

goal: after each 2026 race weekend, the canonical JSON results store reflects the new round, and ClickUp's slim mirror is updated — WITHOUT putting finishing-order data into ClickUp.

targets:
- **DATA (canonical):** `f1-racetracks/f1-results/2026/` — one file per round + `index.json`. This is the source of truth for results.
- **MIRROR (slim):** the track task's **"Race History"** text field in ClickUp — ONE frozen year-line, resolved by `cuTaskId`.

report-to: #A.I. Prompts (thread: F1 refreshes)

## What changed (schema shift, Jul 2026)

Full race data now lives ONLY in the per-round JSON store. **ClickUp no longer stores finishing order.** The old per-year result dropdown/field is RETIRED — do not write to it. Ricky updates the JSON; the ClickUp write is now a single fill-if-blank year-line, nothing more.

> Prereq: the slim **"Race History"** text field must exist on the track tasks. If it isn't there yet, STOP and flag — do not recreate a per-year field or write order anywhere in ClickUp.

## Steps

1. Read the CURRENT `index.json` + the most recent round file in `f1-racetracks/f1-results/2026/` to learn the exact schema. Match it precisely — do NOT redesign. A schema change is a build session, not a refresh → STOP.
2. Research the weekend: full classification (P1 → last + DNFs), pole, fastest lap, and the sprint block if it was a sprint round.
3. **Verify EVERY finishing position against a primary source** (formula1.com / FIA). Do NOT trust any existing value. (Three silent errors were found pre-shift, all favoring one narrative — stay suspicious.)
4. Add the round to JSON:
   - Create `f1-racetracks/f1-results/2026/<slug>.json` in the existing round schema: `points` on every classification row; `sprint` as an optional block reusing the classification shape.
   - Add its entry to `index.json` (slug / round / name / date / cuTaskId / sprint / file).
   - Anchors: round `cuTaskId`, row `driverId` — resolve by ID, never by name.
5. ClickUp slim write, per track task resolved by its `cuTaskId`:
   - status-flip (e.g. Scheduled → Complete), date fields, and weekend notifications — as before.
   - **ONE data write only:** append this year's frozen line to the **"Race History"** text field. Format: `2026 · <Winner>, <P2>, <P3>` (podium summary, not full order).
   - **Fill-if-blank:** if a 2026 line already exists and matches, leave it; if it exists and differs, **STOP-and-flag** — never clobber. Prior years are immutable.
   - Do NOT write finishing order, per-position fields, or the retired dropdown. Full order stays in JSON only.
6. Commit the JSON to `main` — **data-only, do NOT touch engine / source / render.** Then apply the ClickUp writes.
7. Post the run report.

## Guardrails (STOP + flag if any is true)

- You'd have to invent a JSON field or change the schema → STOP, build session.
- A result/standing can't be primary-source verified → don't guess, flag it.
- A `cuTaskId` or `driverId` won't resolve → STOP, never guess or create a filling object.
- The "Race History" field already has a 2026 line that differs from yours → STOP-and-flag, never overwrite.
- Any urge to write finishing order into ClickUp → that's the retired pattern. JSON only.
- The engine/source/render is what needs changing → not a refresh. Ricky never touches engine/source.

## Report format

JSON commit link + live URL (https://mawizorek.github.io/ClickUp_apps/f1-racetracks/) + round added + ClickUp tracks touched (year-line appended / skipped-already-present) + anything unverifiable.
