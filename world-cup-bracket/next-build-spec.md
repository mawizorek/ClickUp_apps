# World Cup 2026 Bracket — Next Build Spec

**Version target:** v2.0 (engine change, `index.html` version bump)
**Current shipped:** v1.3 (engine) + data.json (data-separated)
**Live:** https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/

## Handoff prompt (one line for the render agent)

> Read `world-cup-bracket/next-build-spec.md` from `mawizorek/ClickUp_apps` (branch main). Follow its instructions exactly.

## Source pins (HEAD commit `df4a3034` at spec time)

- `index.html` blob SHA: `96e94927c009a8eaad76813375edfc752873d0a2` (21,986 bytes — UNDER 30KB, reads whole via raw URL, no chunk set needed)
- `data.json` blob SHA: `b047379bd1483e92e2d9d20ce17e1fde1dfe0b6e`
- `README.md` blob SHA: `83edd511ec5c3cf7cd2726dc7cca65154cf85216`
- Read source at: https://raw.githubusercontent.com/mawizorek/ClickUp_apps/main/world-cup-bracket/index.html

**⚠️ Re-fetch the LIVE index.html SHA immediately before committing** (Commit Pre-Flight): only data.json has changed since this pin, but confirm the blob SHA at write time or the overwrite bounces.

---

## Context: current engine shape (what you're editing)

- `const APP_VERSION = 'v1.3';` — top-of-script constant. **Bump to `'v2.0'`.**
- `let allMatches = [];` — flat array of match objects loaded from data.json.
- Each match: `{ id, round, day, dayLabel, home, away, hs, as, status, winner, venue, time, tbd, feedsTo, psoNote }`. `feedsTo` = the match id this winner advances into. Rounds: R32 → R16 → QF → SF → Final.
- `const cc = (n) => {...}` — name→3-letter code map; returns em dash for `'TBD'`.
- `const isComplete = (m) => ['ft','aet','pso'].includes(m.status);`
- `function renderMatchCard(m)` — schedule-view card markup (NOT currently tappable).
- `function renderBracketMatch(m)` — bracket-view match markup (NOT currently tappable).
- Bracket connectors are cosmetic only (`.bracket-connectors`).
- OKLCH dark theme, token vars in `:root`. Reuse existing tokens; the palette is locked.

No reverse (`fedBy`) lookup exists yet. That's the foundation for everything below.

---

## Next build (v2.0)

### 🟢 CORE — Potential matchups (the committed ask, ship this no matter what)

Future-round slots currently render `TBD` (em dash). Replace with the live contenders computed from the bracket wiring.

**Foundation (Dev-approved):** after `allMatches` loads, build a reverse map once:
```js
// invert feedsTo → which two matches feed each downstream match
const fedBy = {};
allMatches.forEach(m => { if (m.feedsTo) (fedBy[m.feedsTo] ||= []).push(m.id); });
```

**Resolver (DEPTH-1 ONLY in v1 — hard guardrail):** for a match whose `home` or `away` is `'TBD'`, look up its feeder matches via `fedBy[thisMatch.id]`. For the relevant feeder:
- Feeder is complete → the real winner name should already be in the data on refresh; render normally.
- Feeder is `upcoming` with two REAL teams → render a potential label: `"MAR/CAN winner"` (use `cc()` codes, not full names, to stay short).
- Feeder is ITSELF unresolved (both its slots TBD) → **fall back to plain `TBD`. DO NOT recurse.** Rendering `"((A/B)/(C/D)) winner"` soup is an explicit non-goal for v1.

**Styling:** potential labels get a distinct, muted treatment so they never read as broken placeholder text. Add a `.potential` class (use `--text-muted` / `--text-dim`, a subtle `vs winner of` affordance, italic is fine). Must be visually distinct from BOTH confirmed matchups and the old blank TBD. This is the Professionalism gate — if it looks like unfinished dev output, it failed.

**Live-over-hardcoded:** resolution is computed at runtime from `fedBy` + `status`. Never hardcode a slot's contenders.

---

### 🧪 CREATIVE TEST SET (Michael greenlit extra features to TRY — build them, flag them experimental; we keep what lands, cut what doesn't)

Build all three. Keep each self-contained enough to cut cleanly if it doesn't earn its place. Label them in the version comment as experimental so we evaluate on-device.

**T1 — Tap-to-expand match card (schedule view).** Tapping any card toggles a detail drawer beneath it (accordion; one open at a time is fine). Contents by state:
- Upcoming: full venue + city, kickoff time, and a **live countdown** to kickoff (compute from `day` + `time` at runtime; if `time` is TBD, show date only). Plus a **"Path in"** line naming the two feeder matchups.
- Completed: `psoNote` if present, plus **"Advances to face → X"** computed by resolving `feedsTo` (the downstream match's other slot). If the next opponent isn't set yet, show the potential label from the CORE resolver.
- Interaction: whole card is the tap target (min 44px), chevron affordance, smooth height transition. Respect `prefers-reduced-motion`.

**T2 — Bracket path highlight (bracket view).** Tap a team in any bracket match → walk its `feedsTo` chain forward and highlight every downstream slot that team could still reach; dim the rest of the bracket. Tap the same team again, tap empty space, or tap a different team to reset/reassign. This is the "whoa" feature — make the highlight satisfying (accent glow on the path, reduced opacity elsewhere). Completed-team paths that are already eliminated: don't highlight past their exit.

**T3 — Countdown chip on today's upcoming cards.** A small live "kicks off in 2h 14m" chip on upcoming cards whose `day === today` (reuse the T1 countdown math; this is the at-a-glance version). Ticks via a single `setInterval`, cleaned up sanely. If it feels noisy next to T1, this is the first cut candidate.

---

## Known guardrails (read before writing a line)

- **Recursion cap:** CORE resolver is depth-1. No nested contender soup. Non-negotiable for v1.
- **Mobile-first is a HARD requirement.** Test at 320–390px. `"Switzerland/Colombia winner"` is long — verify labels wrap/truncate cleanly, no horizontal overflow, touch targets ≥44px. The v1 F1 footer-clip lesson applies.
- **Palette locked.** Reuse existing OKLCH `--` tokens. No new color system, no gradient text, no glassmorphism (Skill-Ban Guard territory).
- **Data schema unchanged.** These are pure engine/render features computed from existing fields. Do NOT add fields to data.json. Do NOT touch data.json.
- **Export-structure/filename constants** rule doesn't apply here (no export), but keep any new magic strings (class names, labels) as top consts near `APP_VERSION`.
- **Offline-first preserved.** Don't break the existing fetch → localStorage cache → inline fallback chain. Countdown/timers must no-op gracefully if data is stale/cached.
- **Don't clobber the README** with the app; update its status line + version history + roadmap (move T1–T3 out of Roadmap into Version history once shipped).

---

## Agent instructions (what to do / what NOT to do)

**DO:**
1. Read the live `index.html` whole via the raw URL above (it's under 30KB).
2. Apply CORE + T1–T3. Bump `APP_VERSION` to `'v2.0'`.
3. Re-fetch the live `index.html` blob SHA, then commit the full modified file to `world-cup-bracket/index.html` on `main` via `githubmcp_create_or_update_file` (MCP is live; file stays under 30KB so direct commit is correct, no chunk set).
4. Update `README.md`: status line → v2, add v2.0 to Version history, move the shipped items out of Roadmap. (README SHA pinned above; re-fetch before write.)
5. Post-Build Verify: wait the Pages lag (~30–60s), fetch the live URL, confirm v2.0 is serving.
6. Report back the standard trio: committed file link, commit link, live Pages URL — plus a one-line note on each experimental feature (T1/T2/T3) for the on-device evaluation.

**DO NOT:**
- Recurse the potential resolver past depth-1.
- Touch `data.json` or add schema fields.
- Introduce new color tokens or banned UI patterns.
- Ship without a 320px mobile pass.
- Leave any label that reads as broken placeholder text.

---

## Futures (parked, not this build)

- Full contender-POOL rendering (SF shows 4 possible, Final shows 8) — the depth-N version. Revisit only if depth-1 proves too thin.
- Flag emoji / SVG flags per country.
- Goal scorers / key moments in the tap drawer (needs new data fields).

## ⏳ Ephemeral

Tournament ends Sun Jul 19, 2026. This spec + app + refresh guide archive/retire after the Final.
