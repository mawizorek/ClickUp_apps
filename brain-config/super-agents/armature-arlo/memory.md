# Armature Arlo · Craft Ledger

Michael's directions, rejections, measured tools, pointers. No procedure (hooks hold it), no lesson progress (Agent Index LIVE STATE holds it). Seeded 2026-11-06 from the Vertex Vera bison session (Becoming Curious); entries are Michael's words or Vera's session facts, not Arlo's own runs.

## Ledger A Directions and shortcuts

- 2026-11-06 · direction · "I want to do it in Blender ... so I can really make it mine and show off my work." Arlo coaches; Michael performs the steps.
- 2026-11-06 · direction · 2D rig art imports as Grease Pencil; Michael sets line thickness himself. Art arrives as centerline stroke paths, no fills.
- 2026-11-06 · direction · Design the rig so joints and lines stay connected natively (one stroke per leg, weights), not by faking in animation.
- 2026-11-06 · direction · Playback is QLab; every animation must be cueable (walk on, hold, look, hold, walk off).
- 2026-11-06 · direction · Fewest keyframes that still read convincing: start, stop, stagger.
- 2026-11-06 · pace · "that was a lot ... I've never used Blender before." One small step per message. "those ending quick tips feel like the guidance I actually need."
- 2026-11-06 · comfort · Comfortable with Blender modes and Grease Pencil drawing; has built an armature and can enter Pose mode.
- 2026-11-06 · shortcuts given so far (Michael owns): Alt+G (clear location), Esc, Ctrl+Z, G/R/S, Ctrl+Tab (mode pie), Tab, Numpad 1, Space, I over a property, N (sidebar), Home (frame all).
- Method for shortcuts: drip 2 or 3 per lesson step, never a dump; add each batch here once given.

## Ledger B Rejections and failure modes

- 2026-11-06 · multi-section technique dump (noise, timing, NLA, drivers in one reply). "That was a lot." Rule: one step, wait for his screenshot.
- 2026-11-06 · Blender import of SVG with fills/CSS "went poorly"; filled shapes and outlined strokes refused. "you should give me paths, not real line." Rule: centerline paths only.
- 2026-11-06 · code-drawn walk mockups: "In Blender, I don't really care about your animation anymore, but how do I design the rig so that it does that natively." Rule: teach the rig, not a preview.
- 2026-11-06 · failure mode, tell: hooves drift or lines separate at joints. Cause class: line split across strokes or unbalanced per-point weights; fix class: one stroke per leg, weighted.
- 2026-11-06 · failure mode, tell: NLA strip wraps to frame 0 instead of the clip start. Cause class: reported Cyclic Strip Time behavior; fix class: key the cycle from frame 0.
- 2026-11-06 · failure mode: Shift+E Make Cyclic used instead of Cyclic Strip Time. Corrected during the session.

## Ledger C Delivered

Pointers only. All on the bison task https://app.clickup.com/t/17tuucqu1e7 (Becoming Curious), made by Vertex Vera in session; inherited, not Arlo's work.

- 2026-11-06 · one-stroke hind and fore leg SVG + weight map PNG + per-point weights JSON · verdict pending
- 2026-11-06 · written guides on that task: rig and weights, noise timing, render setup, QLab slices and Devamp, minimal-key walk, Blender mental model · not yet confirmed in Blender

## Ledger D Measured

Empty until Michael's first whole-window screenshot. Do not infer.

- Blender version: unknown. UI layout: unknown. Frame rate: unknown. Bone names and IK setup: unknown (armature exists, built by Michael).
- Scene: no camera present as of 2026-11-06 (his statement).
- Sandbox 2026-11-06: no `blender`, `inkscape`, `rsvg-convert`; has cairosvg, shapely, numpy, PIL, matplotlib, ffmpeg. No internet. Remeasure before relying.

## Ledger E Inherited / unverified

- Everything in `hooks/blender-2d-line-animation.md` is INHERITED from Vera's session and web-doc reading (Blender manual, QLab 5 docs). None run on Michael's Blender. Confirm each against his version before teaching it as fact.
- The minimal-key walk recipe is untested end to end.
- Noise modifier step field name and Grease Pencil modifier UI differ by Blender version; unconfirmed for his install.
