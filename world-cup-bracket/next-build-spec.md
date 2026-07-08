# World Cup 2026 Bracket — Next Build Spec

> **☐ OPEN WORK ITEM — redesign `index.html` into a pointer, not content.**
> Any agent opening this app: treat this as ACTIVE WORK, not a passive rule. Refactor `index.html` into a thin pointer/router that references `source/*` modules instead of storing servable content. If it's already a pure shell, verify and check the box. **Check it off when done for this app** — then it clears.
>
> - [ ] `index.html` redesigned into a pointer/router (not a content store)

**Version target:** v5.0 (engine, bracket path system overhaul)
**Current shipped:** v4.3 (arrows) + data.json
**Live:** https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/

## Handoff prompt

> Read `world-cup-bracket/next-build-spec.md` from `mawizorek/ClickUp_apps` (branch main). Follow its instructions exactly.

---

## Scratch intake (Michael, 2026-07-04 eve, voice)

1. **[SHIPPED v-data]** Artifact: selecting the lower team lit BOTH R16 games in the USA/BEL–POR/ESP quarter. **Root cause found + fixed 2026-07-04:** R32→R16 `feedsTo` was cross-wired (Belgium→14 & Spain→13 while their names sat in 13 & 14), so `buildPathSet` found a team in two nodes and lit both. Fixed by flipping match 17 feedsTo→13 and match 19 feedsTo→14 (commit 7b8988a). **Guardrail for v5:** `buildPathSet` should ALSO be hardened so a future data mismatch can't resurface this — prefer walking the `feedsTo` graph over name-matching every node, or de-dupe start nodes to the earliest round a team appears. Add a dev-only consistency assert: every non-TBD R16+ home/away should equal a winner reachable via its feeders.
2. **[SHIPPED v4.3]** Arrows: schedule chevron now points DOWN (expand/open); bracket trace arrow now forward → (was ↗, read as share/send).
3. **[v5 CORE]** Multi-select paths: select 2+ teams at once to see how their paths line up / where they'd collide.
4. **[v5 CORE]** Color the paths. Michael floated round-based colors (R32 red, R16 blue, ...) making a line as they pass through. See recommendation below — I'm proposing a change to this.

---

## Brainstorm recommendation (Dev + Creative, for Michael's ruling)

**On coloring: recommend PER-TEAM colors, not per-round.** Round-based coloring is decorative but not functional for the stated goal ("see how paths line up"): every team traverses the same rounds, so two teams would share identical round-colors and you couldn't tell whose path is whose. The information Michael actually wants lives in **which team goes where** and **where two contenders' paths converge** (the round they'd knock each other out). So:

- **Each selected team gets its own accent color** from a small, colorblind-considerate palette (e.g. mint/current, amber, violet, cyan — 4 max). Its path glows that color through every round it can reach.
- **Convergence highlight (the payoff):** the match where two selected teams' paths first meet gets a special split/dual-color treatment + a small "collision" marker. THAT is the "how do they line up" answer — it shows the earliest round two teams could meet.
- **Round tint as optional secondary:** if Michael still wants round cues, apply a subtle left-border tint per round column (R32…Final) as ambient context, NOT as the path color. Keep it low-contrast so it never competes with team colors.

**On multi-select mechanics (Interaction-State standard applies in full):**
- Tap a team's → to ADD it to the compare set (assigns next palette color). Tap its → again to REMOVE. Cap at 4 (legibility on mobile); at cap, adding nudges "clear one first" rather than silently dropping.
- A small **legend chip row** (pinned under the bracket hint) shows each selected team in its color with an ✕ to remove; a **Clear all** affordance resets.
- **Exit/reset:** tap empty space clears ALL (extends current single-select reset); per-chip ✕ removes one; same-arrow-tap toggles one off.
- **Collision with card-tap:** unchanged — card body still opens the detail sheet, → still owns path trace. Multi-select just lets → accumulate.
- Dim non-path matches only when ≥1 team selected; with multiple, a match on ANY selected team's path stays lit in that team's color(s).

**Open question for Michael (the one decision needed):** per-team colors + convergence (my rec) vs his original round-colors, or both (team colors primary + round tint ambient)? Everything else above I'll take as default-yes unless he redirects.

---

## Known guardrails

- 30KB/12KB module budget: multi-select + color logic likely warrants a new `source/paths.js` (buildPathSet, multi-set state, color assignment) split out of `bracket.js`. Auto-split per the enforcer; keep each file <12KB.
- Palette locked for base UI (OKLCH); the multi-team palette is an ADDITION of accent hues, still OKLCH, colorblind-considerate, no gradient text / glassmorphism.
- Mobile-first: legend chips must wrap, ≥44px targets, no overflow at 320px. The bracket already h-scrolls — the off-screen-highlight sliver (a highlighted card scrolled partly off the right edge reads as a floating fragment) is a known cosmetic rough edge; consider a subtle scroll-to-fit or edge fade when a path is traced.
- Interaction-State standard (Dev+Research owned): every new control (chips, ✕, clear-all, multi-add) needs entry/exit/rest/collision answered.
- Data-schema unchanged; colors/convergence computed at runtime from `fedBy` + selection state.

## Futures (parked)

- Round tint ambient layer (if not shipped in v5).
- Flag emoji / SVG flags per country.
- Goal scorers / key moments in the road-to-here trail (needs data fields).

## ⏳ Ephemeral — tournament ends Sun Jul 19, 2026. Archive after the Final.
