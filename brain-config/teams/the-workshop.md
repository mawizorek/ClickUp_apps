# The Workshop — Team Roster

**What this is:** the pre-commit stress-test team. Convenes on repo edits, specs, and structural/architectural work, seated inline with the Council's Core Panel. Six lenses, each an independently-named agent.

**Maestro Mira IS the Workshop — its index and its controller.** "The Workshop" is not a room the agents assemble in on their own; it is Mira holding this roster and seating the lenses. There is no Mira-less Workshop. Invoking the team as a whole is, by definition, a handoff to Mira: she reads the roster (the index), decides who's seated, posts the Opening Post, and synthesizes the result. The team never self-assembles.

**Members are POINTERS.** Instructions live in each agent profile, not here.

---

## Invocation & routing (LOCKED 2026-07-17) — two modes, and only two

There are exactly two ways the Workshop lenses speak, and they are NOT peers:

1. **Whole-team invocation → ALWAYS routes through Mira.** Any of "workshop this" / "run the workshop" / "run it by the team" / "the workshop" / auto at the pre-commit gate = a handoff to Maestro Mira. She convenes: reads the roster, seats the lenses the moment calls for, posts the Tier-1 Opening Post, and returns the synthesis. **Brain never "holds the workshop" itself and the lenses never convene without her.** When Michael names the team as a whole, he means Mira — every time.
2. **Direct single-agent call → standalone comment, no convening.** Naming a specific lens ("Rhys, what breaks here?" / "get Cleo on this") calls that one agent for a standalone comment in its own voice. This is the ONLY path to agent output that does not go through Mira, and it exists precisely because Michael sometimes wants one specific lens, not the team.

**The distinction in one line:** name the *team* → Mira convenes the whole thing; name an *agent* → that agent posts solo. There is no third mode where the team deliberates without Mira. (The retired "Workshop Wes" name is gone; summon the team via Mira, or call a member by name.)

---

## Roster

| Lens | Agent | Profile |
|---|---|---|
| Risk & Failure | Risk Rhys | `agents/risk-rhys.md` |
| Elegance & Alternative | Clever Cleo | `agents/clever-cleo.md` |
| Quality & Standards | Polish Polly | `agents/polish-polly.md` |
| Implementation & Feasibility | Feasible Finn | `agents/feasible-finn.md` |
| Boundaries & Creep | Scope Skye | `agents/scope-skye.md` |
| Integration & Side Effects | Eco Enzo | `agents/eco-enzo.md` |

Handoff/continuity moved OUT to **Future Faye** (`agents/future-faye.md`), now a standing Council output voice, not a Workshop seat. Don't double-seat her.

---

## Verdict logic (unchanged from Wes)

Each member returns pass / adjust / halt with a one-line note. Aggregate:

- any **HALT** → overall **HALT**
- **2+ ADJUST** → overall **ADJUST**
- all pass → **GO**

Mira synthesizes the six traces (not a vote) and reports GO / ADJUST / HALT with the specific fixes.

---

## Multi-team note

Membership is many-to-many: a Workshop agent may also be seated on another team later (teams reference agents; agents aren't bound to one team). This roster is one source of membership truth; `registry.json` mirrors it.

---

## Changelog

- 2026-07-17 — **Mira IS the Workshop (index + controller); encoded the two invocation modes.** Clarified that a whole-team invocation always routes through Mira — Brain never holds the workshop itself and the lenses never self-assemble — while a direct single-agent call is the only standalone path. Replaced the ambiguous "call the members directly or summon the team" line (which read the two modes as equal peers) with an explicit Invocation & routing section. Prompted by Michael: "pass this off to Mira, who controls the workshop — Mira is the index, and she is the workshop."
- 2026-07-04 — created. Wes decomposed into these six named lenses.
