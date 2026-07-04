# World Cup 2026 Bracket — Next Build Spec

**Version target:** v3.0 (engine change, `index.html` version bump)
**Current shipped:** v2.1 (engine) + data.json (data-separated, includes `rankings` map)
**Live:** https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/

## Handoff prompt (one line for the render agent)

> Read `world-cup-bracket/next-build-spec.md` from `mawizorek/ClickUp_apps` (branch main). Follow its instructions exactly.

## Source pins (HEAD commit `6c6c5f22` at spec time)

- `index.html` blob SHA: `13c4bb55bcfbf8a1bdb3d00b4ceb7ac778a9bcca` (**30,453 bytes — OVER the ~30KB read cap**)
- `data.json` blob SHA: `3095ba1456e642757d9611e3458cb6af57751ee3`
- `README.md` blob SHA: `668260cec8feb3241374d638db3608b986739368`
- Read source at: https://raw.githubusercontent.com/mawizorek/ClickUp_apps/main/world-cup-bracket/index.html

**⚠️ 30KB READ-CAP TRIGGER (Source-Size Budget Enforcer):** the engine now exceeds the ~30KB single-fetch cap. A raw fetch may clip before the end. **This build should be the modular split** (thin `index.html` shell + `./source/*.js` modules per Apps/Artifacts multi-file standard) OR, at minimum, commit a `/source` chunk set so the engine stays readable. Do NOT keep growing the monolith. Confirm the split approach with Michael before writing if unsure.

**⚠️ Re-fetch live blob SHAs immediately before committing** (Commit Pre-Flight).

---

## Context: current engine shape (what you're editing)

Shipped through v2.1. Relevant existing machinery you'll reuse (do NOT rebuild):

- `const APP_VERSION = 'v2.1';` — **bump to `'v3.0'`.**
- `allMatches` + `rankings` loaded from data.json. Match shape: `{ id, round, day, dayLabel, home, away, hs, as, status, winner, venue, time, tbd, feedsTo, psoNote }`. `rankings` = `{ "Team": FIFArank }`.
- `fedBy` reverse map (feedsTo inverted) — already built at load.
- `slotLabel(match, side)` — depth-1 potential resolver ("winner of MAR/CAN").
- `pathIn(m)` — the two feeder matchups into a match.
- `advancesToFace(m)` — who a winner goes on to face.
- `kickoffDate(m)` / `fmtCountdown()` — ET-string → Date, live countdown. Reuse verbatim.
- `rankOf(name)` — team → FIFA rank.
- **Schedule view** already has the tap-to-expand drawer (venue, kickoff, countdown, path-in, advances-to-face).
- **Bracket view** already has the path-highlight on team tap (`applyPathHighlight`). Michael confirmed he loves this — PRESERVE it.
- `renderBracketMatch(m)` / `bmTeam(m, side)` — bracket markup. Currently a team tap triggers path-highlight; there is NO match-level detail panel in the bracket yet.

---

## Next build (v3.0)

### 🟢 CORE — Bracket-tap detail panel (Michael's committed ask)

When a bracket match is tapped, surface a detail panel/sheet for THAT match. Michael's explicit list, every bracket slot (including future/TBD ones like the Final) must answer:

1. **When** the game is played — date + kickoff time (e.g. "Sun Jul 19, 3:00 PM ET"). For future rounds this is already in data.json (dates/times/venues are FIFA-fixed). If the time is still TBD, show the date. Include the live **countdown** (reuse `kickoffDate`/`fmtCountdown`).
2. **Where** — venue + city.
3. **Possible matchups** — the contenders feeding this slot. Reuse `pathIn()` / `slotLabel()`. For a slot two+ rounds out this is the depth question (see guardrail): v3 may go **depth-N here** (a small contender pool) since the bracket is the natural place for it, BUT keep it legible. Decide in brainstorm: full pool vs "winner of (X/Y) vs winner of (W/Z)".

**Interaction:** must NOT clobber the beloved path-highlight. Two tap behaviors now coexist on a bracket match:
   - Tapping a **team row** → path-highlight (existing, keep).
   - Tapping the **match** (the card body / a dedicated affordance) → detail panel.
   Resolve the gesture collision cleanly: options to weigh in brainstorm — (a) team-row tap = highlight, match-frame/chevron tap = detail; (b) a small info affordance per match; (c) long-press vs tap. Pick the one that stays obvious on mobile and doesn't make the highlight harder to trigger. Whatever the choice, both must remain one-tap-discoverable.

**Example acceptance:** tap the Final → panel shows "Sun Jul 19, 3:00 PM ET · MetLife, NJ · winner of [SF1 contenders] vs winner of [SF2 contenders]" + countdown ("in 15d").

### 🟡 OPTIONAL — Potential odds (nice-to-have, Michael said not necessary)

If it earns its place: a lightweight win-likelihood hint per contender in the detail panel. **No live odds API** (offline-first + no keys). Derive a cheap heuristic from the existing `rankings` map (e.g. rank-gap → rough favorite tag, or a simple Elo-ish % from rank). Label it clearly as an **estimate/for-fun**, never as real sportsbook odds (Professionalism + honesty gate). Cut without hesitation if it feels gimmicky or clutters the panel. Ship CORE with or without this.

---

## Known guardrails (read before writing a line)

- **30KB cap is the headline constraint.** Engine is already over. This build splits or adds `/source`. See the trigger box up top.
- **Preserve the path-highlight.** It's the confirmed favorite. Do not regress its one-tap feel.
- **Depth for the bracket panel:** allowed to exceed depth-1 for "possible matchups" HERE (bracket is the right surface), but cap it so it stays readable — no unbounded "((A/B)/(C/D))" soup. Propose the exact depth in brainstorm.
- **Mobile-first HARD requirement.** Detail panel must work at 320–390px: no overflow, ≥44px targets, sheet/panel scrolls if long. The bracket view is horizontally scrollable — make sure the panel doesn't fight the scroll.
- **Palette locked.** Reuse OKLCH `--` tokens. No gradient text, side-stripe borders, glassmorphism, pure #000/#fff (Skill-Ban Guard).
- **Odds must be labeled an estimate.** Never present a hand-rolled heuristic as real odds.
- **Data schema:** dates/times/venues already exist. Odds heuristic uses existing `rankings` — do NOT add per-match odds fields unless the brainstorm decides to, and if so document them.
- **Offline-first preserved.** fetch → localStorage → inline fallback intact. Countdown no-ops on stale data.
- **Don't clobber the README.** Update status line + version history + roadmap.

---

## Pre-build gate

This touches committed engine source, so it runs the **Brainstorm Gate (7 lenses)** before the spec is finalized into `Next build` proper — with three specific open questions to resolve:
1. Modular split vs `/source` chunk set (30KB trigger).
2. Gesture model for team-tap (highlight) vs match-tap (detail) coexistence.
3. Contender-pool depth in the panel + whether odds ship in v3 or park to Futures.

---

## Futures (parked, not this build)

- Full contender-POOL rendering everywhere (depth-N in schedule too), if the bracket panel proves it's worth it.
- Flag emoji / SVG flags per country.
- Goal scorers / key moments in the tap drawer (needs new data fields).
- Real odds feed (would need an API + key; out of scope for an offline-first static app).

## ⏳ Ephemeral

Tournament ends Sun Jul 19, 2026. This spec + app + refresh guide archive/retire after the Final.
