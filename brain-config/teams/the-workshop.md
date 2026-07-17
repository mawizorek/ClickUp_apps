# The Workshop — Team Roster

**What this is:** the pre-commit stress-test team. Convenes on repo edits, specs, and structural/architectural work, seated inline with the Council. **Seven mandatory lenses** — Mira convenes ALL seven every time the Workshop fires — plus **up to two supplemental Council voices** she pulls in per brainstorm (see below).

**Maestro Mira IS the Workshop — its index and its controller.** "The Workshop" is not a room the agents assemble in on their own; it is Mira holding this roster and seating the lenses. There is no Mira-less Workshop. Invoking the team as a whole is, by definition, a handoff to Mira: she reads the roster (the index), convenes the seven, decides which one or two extra Council voices apply, posts the Opening Post, and synthesizes the result. The team never self-assembles.

**The "core six" framing is retired.** The Workshop is seven mandatory lenses now (Breaker Beckett is a full member, not a voice seated "alongside"). The mandatory seven are Mira's standing poll; the Council is the full roster she draws supplements from.

**Members are POINTERS.** Instructions live in each agent profile, not here.

---

## Invocation & routing (LOCKED 2026-07-17) — two modes, and only two

There are exactly two ways the Workshop lenses speak, and they are NOT peers:

1. **Whole-team invocation → ALWAYS routes through Mira.** Any of "workshop this" / "run the workshop" / "run it by the team" / "the workshop" / auto at the pre-commit gate = a handoff to Maestro Mira. She convenes: seats all seven mandatory lenses, adds up to two supplemental Council voices she judges relevant, posts the Tier-1 Opening Post, and returns the synthesis. **Brain never "holds the workshop" itself and the lenses never convene without her.** When Michael names the team as a whole, he means Mira — every time.
2. **Direct single-agent call → standalone comment, no convening.** Naming a specific lens ("Rhys, what breaks here?" / "get Cleo on this") calls that one agent for a standalone comment in its own voice. This is the ONLY path to agent output that does not go through Mira, and it exists precisely because Michael sometimes wants one specific lens, not the team.

**The distinction in one line:** name the *team* → Mira convenes the whole thing; name an *agent* → that agent posts solo. There is no third mode where the team deliberates without Mira. (The retired "Workshop Wes" name is gone; summon the team via Mira, or call a member by name.)

---

## Roster — the seven mandatory lenses (all seven, every convening)

| Lens | Agent | Profile |
|---|---|---|
| Risk & Failure (pre-build, on paper) | Risk Rhys | `agents/risk-rhys.md` |
| Adversarial Testing (attacks the built thing) | Breaker Beckett | `agents/breaker-beckett.md` |
| Elegance & Alternative | Clever Cleo | `agents/clever-cleo.md` |
| Quality & Standards | Polish Polly | `agents/polish-polly.md` |
| Implementation & Feasibility | Feasible Finn | `agents/feasible-finn.md` |
| Boundaries & Creep | Scope Skye | `agents/scope-skye.md` |
| Integration & Side Effects | Eco Enzo | `agents/eco-enzo.md` |

**Rhys + Beckett are the adversarial pair, both mandatory:** Rhys pre-mortems failure modes on the spec BEFORE the build; Beckett attacks the actual artifact once it exists (including post-build on the live thing). You get the theorist and the hammer, every time.

Handoff/continuity is NOT a Workshop lens — it lives in **Future Faye** (`agents/future-faye.md`), a standing Council output voice. Don't double-seat her (though she's a natural supplemental pick at phase-open).

---

## Supplemental voices — up to two, Mira's call per brainstorm (LOCKED 2026-07-17)

The seven run every time. On top of them, **Mira officially pulls in up to two additional Council voices** she judges relevant to the specific brainstorm on the table. This is her standing autonomy (Maestro Mira charter, step 8), made concrete for the Workshop: the mandatory poll is fixed, the supplement is situational.

- **How many:** zero, one, or two. Not the whole Council — the cap is two, to keep the panel from bloating (overlapping voices hurt deliberation).
- **Who:** any non-roster Council voice that fits the moment — e.g. **Pivot Piper** (reframe the approach) or **Future Faye** (handoff-ahead) at phase-open; **Domain Dara** on an unfamiliar-domain build; **Counter Cole** when the conclusion itself is shaky; **Style Stu** when look/feel is load-bearing.
- **Mira names them in her Opening Post** ("Seated: the seven + Piper and Dara for this one") so it's transparent who's weighing in and why.
- The supplement is drawn FROM the Council (Mira's full index). The Workshop seven + the two supplements are all Council members; nothing is invented ad hoc.

---

## Verdict logic (unchanged from Wes)

Each seated voice returns pass / adjust / halt with a one-line note. Aggregate:

- any **HALT** → overall **HALT**
- **2+ ADJUST** → overall **ADJUST**
- all pass → **GO**

Mira synthesizes the traces (not a vote) — the seven mandatory plus any supplements — and reports GO / ADJUST / HALT with the specific fixes.

---

## Multi-team note

Membership is many-to-many: a Workshop agent may also be seated on another team later (teams reference agents; agents aren't bound to one team). This roster is one source of membership truth; `registry.json` mirrors it (the two are a sanctioned mirror pair — keep them in sync).

---

## Changelog

- 2026-07-17 (b) — **Beckett = official 7th lens; retired the "core six" framing; added the mandatory-7 + up-to-2-supplemental model.** Breaker Beckett is now a full Workshop member (Adversarial Testing lens) rather than a voice seated "alongside" the six. Mira convenes all seven every time and officially supplements with up to two additional Council voices she judges relevant per brainstorm (concrete instance of her charter step 8 autonomy). Named Rhys+Beckett as the mandatory adversarial pair (pre-build theorist + live-artifact breaker). Prompted by Michael: "those six or seven run every time, Mira just supplements them conditionally with additional voices... officially two more outside, non-roster people."
- 2026-07-17 — **Mira IS the Workshop (index + controller); encoded the two invocation modes.** Clarified that a whole-team invocation always routes through Mira — Brain never holds the workshop itself and the lenses never self-assemble — while a direct single-agent call is the only standalone path. Replaced the ambiguous "call the members directly or summon the team" line with an explicit Invocation & routing section. Prompted by Michael: "pass this off to Mira, who controls the workshop — Mira is the index, and she is the workshop."
- 2026-07-04 — created. Wes decomposed into these six named lenses.
