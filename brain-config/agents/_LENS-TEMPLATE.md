# Lens Profile Template (canonical)

> Formalized 2026-08-02 from the emergent pattern across all active lens profiles.
> Standard: NONE existed before this file. This IS the standard now.

Every lens profile in `brain-config/agents/` carries **YAML front-matter + five mandatory sections**. This is the minimum viable profile. A profile missing any of the five is incomplete; a profile carrying prose beyond them is bloated and should be trimmed.

---

## The five sections

```
---
slug:            # PERMANENT. filename = <slug>.md. Never changes.
display_name:    # Mutable. A rename touches ONLY this field.
nicknames: []    # invocation + search aliases
role:            # one line: "<Name> - <singular thing>"
type: subagent   # subagent | gate | hook | trigger
status: active   # active | building | dormant | retired
seat:            # core | depth | output | workshop | close | audit | research | gate | build
accent: "oklch(...)"  # shelf hue
---

> [BLOCKQUOTE OPENER: one to two sentences. The voice, the angle, the unique
> value, distilled so a cold reader knows who this is WITHOUT reading further.
> Personality IS the opener. If two openers sound alike, one agent is redundant.]

## Lane

[What this agent uniquely does. The SINGULAR role, in one paragraph max.
Include the specific question(s) or pass this voice runs, folded in.
If you need two paragraphs, you are describing two agents.]

## Fires when

[Trigger conditions. When Mira seats this voice, or when it fires
autonomously. EXPLICIT conditions, never interpretation. Format:
- "Auto: every turn (Core Panel; suppressed only on bare acks, single-emoji reactions, or status updates with no question or directive)" OR
- "Auto: when the Workshop convenes" OR
- "Auto: <specific condition with explicit suppress list>" OR
- "On-demand: invoked by name"
One line for simple triggers; a short list for multi-trigger workers.
NEVER use 'substantive' or any other word that requires agent judgment
to determine firing. Spell out what fires it and what suppresses it.]

## Bounded against

[What this agent does NOT do. Name the specific neighbor agents whose
lanes border this one, and state WHERE THE LINE IS. This section is
the singularity enforcement mechanism: if you cannot name who you are
NOT, you do not know what you ARE.

Format: "Not X (that is <Agent>'s lane)." per boundary.]

## Output

[What it returns. Shape, length, destination. If it is a one-line
verdict, say so. If a ranked list, say so. If a full report skeleton,
show it. The shape constrains the behavior: an agent whose output
says "one line" does not get to post three paragraphs.]
```

---

## Shared infrastructure (POINTERS, not repeated per-profile)

The following apply to ALL lenses equally and are NOT restated inside individual profiles:

- **Standing-agent conduct** (4 directives): `council.md` + `gates/session-transcript-gate.md`
- **Workshop Post Protocol** (threading): `gates/session-transcript-gate.md`
- **Changelog**: optional metadata appendix; not part of the five. Keep it to dated one-liners.

---

## Design principles (Fleet Felix, fleet-steward notes)

1. **The opener IS the agent.** Read only the blockquote: can you tell who this is and nobody else? If not, it fails. Voice + angle + scope in one breath. Two openers that sound alike means one agent is redundant, and Felix will flag it.

2. **Lane = singular, always.** A lane that takes two paragraphs is two lanes. Split it or fold one into an existing neighbor. The test: can you state the role in ONE sentence with at most one "and"? If not, it is hat-piling.

3. **Bounded-against is the anti-sprawl mechanism.** Every profile names its neighbors BY NAME and draws a HARD line. Soft phrasing ("overlaps with", "pairs with") is insufficient; the section must say "does NOT do X (that is Y's job)." This is how scope creep is caught before it ships.

4. **Fires-when determines class.** A lens that fires every turn (suppressed only on bare acks/status updates) is Core. One that fires when the Workshop convenes is Workshop. One that fires on-demand is a worker. The trigger IS the classification; it must match the `seat` in front-matter.

5. **Output keeps the voice tight.** The declared output shape is a CONTRACT. An agent whose Output section says "one line" does not get to post three paragraphs. The shape constrains the behavior at runtime.

6. **Graduation signal (the §6 test).** If a lens keeps needing to REMEMBER things across sessions (reliability precedent, health trends, a running ledger), it is a teammate candidate. The template does not change for that; a graduated lens deletes its profile here and moves to `super-agents/<slug>/`.

7. **Front-matter is the resolution layer.** Names, nicknames, slug, seat: all live ONCE in front-matter. The body never restates them in a redundant header block. Front-matter is machine-readable; the body is human-readable.

8. **Firing conditions must be explicit, never interpretive (LOCKED 2026-08-02, Michael).** The word 'substantive' is banned from firing conditions. Every trigger must spell out exactly what fires it and exactly what suppresses it. An agent must never be left to JUDGE whether a condition is met; it reads the condition and the answer is deterministic.

---

## What this template RETIRES from the old `_template.md`

| Old section | Disposition |
|---|---|
| H1 + Primary name / Nicknames / Role / Invocation block | **Removed.** Redundant with front-matter. |
| `## Purpose` | **Renamed** `## Lane`. |
| `## When seated` / `## Trigger` | **Renamed** `## Fires when`. |
| `## The lens / the question` | **Folded into** `## Lane` (the questions ARE the lane). |
| `## Output shape` / `## Output Format` | **Renamed** `## Output`. |
| `## Standing-agent conduct` | **Removed from profiles.** Universal; lives in `council.md`. |
| `## Composes with / suppressed by` | **Renamed** `## Bounded against` (harder framing). |
| `## Personality` | **Folded into** the blockquote opener. |
| `## Changelog` | **Preserved** as optional appendix. |
| Archetype A/B split | **Collapsed.** One structure fits both; workers just have a richer Fires-when. |

---

## Conformance check (for auditing)

A profile PASSES if:
1. Front-matter has all required fields (slug, display_name, nicknames, role, type, status, seat, accent).
2. A blockquote opener exists immediately after front-matter, is 1-2 sentences, and is voice-distinctive.
3. Exactly the headings `## Lane`, `## Fires when`, `## Bounded against`, `## Output` appear in that order.
4. Lane is one paragraph or less.
5. Bounded-against names at least one neighbor by display name and draws a hard line.
6. Output specifies shape + length.
7. No redundant prose sections (no repeated name block, no standing-conduct copy, no personality paragraph separate from the opener).
8. Fires-when uses explicit conditions with a defined suppress list. No interpretive words ('substantive', 'significant', 'meaningful', 'important').

A profile FAILS on: missing sections, wrong heading names, bloat beyond the five, soft "overlaps with" phrasing in bounded-against, an opener that could describe two agents interchangeably, or a Fires-when that requires the agent to JUDGE whether the condition is met.

---

## Provenance

- Formalized: 2026-08-02, session task #86ajuqznw
- Pattern source: emergent across 22 active lens profiles (all carry Purpose/When-seated/Output/Composes in some form)
- Fleet-steward input: Fleet Felix (singularity, anti-sprawl, voice-bleed detection)
- Relationship to `_template.md`: this is the LEAN successor. `_template.md` remains as historical reference until profiles are migrated.
- Updated: 2026-08-02, kill-substantive pass. Added design principle 8 (explicit firing conditions, interpretive words banned). Updated conformance check.
