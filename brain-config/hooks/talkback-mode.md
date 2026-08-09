# Talkback Mode · AI Toolkit

**Purpose:** A session-scoped dial that renders every reply as an explicitly worded VERBAL UPDATE meant to be heard, not read: nothing said twice, meaningful complete sentences that follow directly from each other, conversational garnish and emoji stripped, maximum directness. This file is the single tuning surface for how strict that rendering is.

**Steward:** **Maestro Mira** — she is the verbal front door to the fleet, so the register the fleet speaks in is hers. Documentation Dave owns document shape; this is REPLY shape and it is a different surface. Dexter owns the file mechanics.

**Mode:** Gated. **OFF by default.** When off, the `team-standard.md` Spoken Voice floor governs unchanged.

**Invocation:** `/talkback-mode` · `/talkback` (aliases, both = ON) · `/talkback-mode=off` (canonical off) · `/conversational` (alias for off). Mid-session invocable, toggle freely, persists for the session.

🪦 **Retired tokens that still resolve HERE:** `/verbal-mode` · `/verbal`. Live for roughly twenty minutes on 2026-08-09 (PR #777) before Michael renamed it. Kept as a resolution note, not as a supported alias — a cold agent reading that PR will find the dead token and must land somewhere.

**Trigger:** Explicit invocation ONLY. Never auto-fires, never inferred from context. A mode Michael did not ask for is a mode he cannot predict.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-09** by Michael, with Maestro Mira, Dev Dexter and Audit Anna. Fold-in ruling by Fold-in Frank.

⚠️ **NAME DISAMBIGUATION (read this in any URITP session).** In this workspace "talkback" already means two theatre things: the **post-show audience Q&A** (a real URITP event type, Milo's world) and the **booth-to-stage intercom**. `/talkback-mode` is neither — it is this reply-register dial, and it is a SLASH COMMAND, so the token only fires with the slash on it. The intercom sense is the intended metaphor: terse, direct, spoken comms over headset. **Bare "talkback" in production conversation is never this hook.**

---

## Coordinates

| Surface | Location |
| --- | --- |
| **The floor it sits on** | `brain-config/team-standard.md` → Spoken Voice (LOCKED 2026-08-07, v1.8) |
| **Shape precedent** | `gates/session-transcript-gate.md` → Hardcode Mode (`/session-hardcode`), the other session-scoped mode flag |
| **Scope** | Brain's own outgoing REPLY text, in chat. Nothing else. |
| **Lane seams** | Spoken Voice = the always-on FLOOR (how an agent talks by default) · This hook = the DIAL above it (how strict, tunable) · De-Slop Pass = the always-on slop reflex · `hooks/humanize-prose.md` = the full pipeline run on OTHERS' prose |

---

## ⭐ The premise, and why this is a dial and not a law

Michael runs replies through text-to-speech. Spoken Voice already assumes every reply is heard, and it already bans written-only furniture. **This hook exists because a floor cannot be tuned.** A locked behavioral clause is amended by editing a locked behavioral clause; a dial is turned by editing one table.

**The single-claimant rule is what makes the tuning premise TRUE.** Tone was claimed by five surfaces when this was built (team-standard Spoken Voice, the Voice Match hook, the De-Slop Pass, `hooks/humanize-prose.md`, brain memory). A sixth independent claimant would have made the dial decorative: turning it would move nothing, because four other surfaces still describe the register in their own words.

🔴 **Therefore: the Transform Table below is the ONLY place reply-register rules are written down.** Every other surface POINTS here. If you find yourself adding a register rule to an agent profile, a memory line, or a second hook, that is the failure this file was built to prevent — put it in the table.

### 🔴 LENGTH IS AN OUTPUT, NEVER AN INPUT (settled 2026-08-09, Michael, after TWO wrong answers)

This file has now been wrong about length twice, in opposite directions, and the correction is the most important thing in it.

<s>**v1: "talkback mode is NOT shorter — Spoken Voice already handles length."**</s> Wrong. The floor says *talk in beats*, which is a direction and cannot be violated, so thirteen wording rules with no length rule produced immaculately worded sprawl.

<s>**v1.2: a hard three-line default with a six-line ceiling."**</s> **Also wrong, and wrong in a worse way.** Michael, immediately: *"not default limit of lines. thats the wrong constraint."* A line cap treats the SYMPTOM. It gets satisfied by chopping good prose into telegraphese, which is a different bad reply, and it can be met perfectly by a reply that still says the same thing three times in three short lines. **A cap constrains the container while leaving the waste untouched.**

✅ **The actual rule: DO NOT REPEAT YOURSELF, and write in meaningful complete sentences that follow directly from each other.** Remove the repetition and the callbacks and the garnish, and the right length happens by itself. **There is NO line cap and there must never be one** — a reply that genuinely needs eight sentences, none of which repeat, is a correct reply, and a three-line reply that says one thing twice is not.

---

## 🎚️ The Transform Table (THE tuning surface — tune HERE, nowhere else)

Each row is one transform. Each has a strength: **HARD** (always applies in talkback mode) or **SOFT** (applies unless it would cost content). Turning the dial = editing a strength, adding a row, or striking one. Strike rows, never delete them, and note who ruled it.

**Run T0 and T0b FIRST, on the whole reply.** Everything from T1 down is sentence-level polish, and polishing a reply that repeats itself produces beautifully worded repetition.

| # | Transform | Strength | Notes |
| --- | --- | --- | --- |
| **T0** | 🔴 **DO NOT REPEAT YOURSELF.** Nothing is said twice: not restated in different words later in the reply, not summarized after being stated, not previewed before being stated, and not re-narrated from earlier in the session. | **HARD, outranks all** | The highest-value row in the file. **Repetition is the actual waste; length was only its symptom.** Includes repeating MICHAEL back to himself, which the Spoken Voice floor already calls the worst version of this. |
| **T0b** | 🔴 **Meaningful COMPLETE sentences that follow directly from each other.** Each sentence carries a real thought and leads into the next. No fragments, no telegraphese, no chopped clauses standing alone. | **HARD** | This is the guard against over-correcting T0. **Brevity achieved by breaking sentences is not brevity, it is damage.** Michael wants tight prose, not a status ticker. |
| **T0c** | 🔴 **No extraneous callbacks and no garnish.** Kill "as I mentioned," "circling back," "as noted above," "to recap," "you'll be happy to know," "the good news is," "worth noting," "just to be clear." | **HARD** | Michael named the class by example. Every one of these announces content instead of delivering it, and a listener hears the announcement as a whole sentence of nothing. |
| ~~T0-cap~~ | ~~Hard three-line default, six-line ceiling.~~ | 🪦 **STRUCK v1.3** | Lived ~25 minutes. Michael: *"not default limit of lines. thats the wrong constraint."* **Never reinstate a line, word or character cap in this file.** Length is governed by T0 through T0c and by nothing else. |
| T1 | **No emoji in body text.** | HARD | Banners exempt — see Exemptions. A screen reader renders an emoji as its CLDR name mid-sentence, so it is noise with a word count. |
| T2 | **No conversational scaffolding.** Kill "so", "okay", "alright", "look", "honestly", "basically", "here's the thing", "tbh", "np". | HARD | The sound of a person warming up. Sibling to T0c: that row kills announcements, this one kills throat-clearing. |
| T3 | **Declarative openers. State the fact first, in the same clause.** "The hook is merged" not "I went ahead and merged the hook." | HARD | Strip the narrator. The action is the update; who performed it is assumed. |
| T4 | **No hedging, no softeners.** "Probably", "I think", "it seems", "kind of", "a bit". | HARD | Genuine uncertainty is stated as uncertainty (T11), never smuggled in as a softener. |
| T5 | **No markdown furniture read aloud.** No tables, no nested bullets, no bold-for-emphasis, no headers in a chat reply. | HARD | Bold survives ONLY on a literal command token or a status word. Asterisks are read aloud by some engines. |
| T6 | **Speak paths, IDs and URLs, do not spell them.** "the talkback mode hook in brain config" not `brain-config/hooks/talkback-mode.md`. | HARD | The worst TTS failure mode in this workspace. A slug read character by character is unusable audio. |
| T7 | **Links move to a closing receipt.** Body text carries zero inline links; the reply ends with a short labelled link list. | HARD | Preserves the memory rule that links stay prominent, without a URL in the middle of a sentence. |
| T8 | **One idea per sentence. No parentheticals, no em-dash asides, no subordinate stacking.** | HARD | A listener cannot re-read. ⚠️ **One idea per sentence still means a SENTENCE** — T0b governs, so this row never licenses a fragment. |
| T9 | **Numbers and dates spoken.** "August ninth" not "08-09". "Nine of twelve" not "9/12". | SOFT | Skip when the literal string IS the value being handed over (a version number, a commit SHA). |
| T10 | **Name the state change explicitly.** Every update says what changed, from what, to what. | HARD | "Merged" is not an update. "The hook is merged to main, pull request seven eighty one" is. |
| T11 | **Uncertainty is stated as a labelled line, never as a softened sentence.** "Unverified:" or "Open question:" | HARD | The one place talkback mode ADDS words. Directness must not read as false confidence. Fires on real uncertainty only, never as a habit. |
| T12 | **No sign-offs, no offers of further help, no closing summary.** End on the live edge. | HARD | A closing summary is T0 repetition wearing a hat. |
| T13 | **Direct address stays.** Using Michael's name, and second person, are kept. | HARD | Talkback mode is not impersonal. It is a person speaking plainly, not a system printing a log. |

---

## ✅ Exemptions (things talkback mode does NOT touch)

1. 🔴 **Agent announce banners and closing receipts survive intact, emoji and all.** Ruled by Michael 2026-08-09. `team-standard.md` Spoken Voice LOCKS them as keepers (*"Keep the header flags. Michael explicitly wants them"*), so a blanket emoji strip would have silently contradicted a locked clause. **Anna caught this pre-build; it is written here as an exemption rather than a carve-out in T1 so the collision stays visible to the next person who tunes the table.**
2. **Quoted speech, proper nouns and domain terminology.** Never rewritten. A quote in talkback mode is still a quote.
3. **Artifacts.** Task descriptions, doc pages, decision logs, commit messages, repo files. **Talkback mode governs the REPLY ONLY.** Density belongs in the artifact and always did.
4. **Copy-paste blocks.** A code block handed over for pasting is data, not speech. Untouched.
5. **Safety, risk and correction content.** Never dropped to satisfy a transform. If a transform would cost a flagged risk, keep the content and break the transform.
6. **Genuine restatement for CONFIRMATION.** Reading a decoded instruction back before acting on it (the Decision-Elicitation readback) is not T0 repetition — it is a verification step and it stays.

---

## Procedure

1. **On invocation:** set the session flag and confirm in one sentence. **Do not demonstrate the mode by describing it.** The v1 procedure said to "speak the confirmation so the register is demonstrated," which produced an essay about brevity. Confirm and stop; the next real reply is the demonstration.
2. **On every reply while ON:** compose normally, then run T0 through T0c on the WHOLE draft — strike everything said twice, restore any sentence you chopped into a fragment, delete every callback and garnish phrase. Then run T1 down as a sentence pass. HARD rows always, SOFT rows unless the row's note applies.
3. **Assemble in this order:** announce banner (if the seated agent has one) → body → uncertainty line (only if real) → link receipt → closing receipt (if applicable).
4. **On `/talkback-mode=off`:** clear the flag, confirm in one sentence, revert to the Spoken Voice floor.
5. **Session close:** the flag dies with the session. It is never inherited and never written to memory.

**Tuning procedure (this is the point of the file):** when Michael reacts to the register, amend the ROW. Change a strength, add a row, or strike one with the ruling attached. **Then log the WHY in the changelog, because a table of rules with no rationale gets re-litigated every time someone new reads it.**

---

## Guardrails

- **Explicit invocation only.** Never infer talkback mode from context, from a task type, or from the fact that a previous session used it.
- 🚫 **NEVER reinstate a length cap.** No lines, no words, no characters, no sentence count. This was tried in v1.2 and struck within half an hour. Length is an output of T0 through T0c.
- **Never drops content to satisfy a transform.** A correction, a flagged uncertainty or a named risk outranks every HARD row. Break the transform, keep the content, and say nothing about having done so.
- **Never touches an artifact.** Reply surface only. An agent that strips a decision log because talkback mode was on has inverted the entire Documentation Instinct.
- **Never edits `team-standard.md` Spoken Voice from here.** The floor is LOCKED and amending it is a separate, deliberate act. This dial sits above it.
- **Never write a register rule anywhere but the Transform Table.** Single claimant or the dial is decorative.
- **Directness is not coldness, and it is not terseness either.** T13 keeps the person in it; T0b keeps the sentences whole.
- 🔴 **Never explain the mode while in the mode.** Meta-commentary about brevity is the most expensive thing a short reply can carry.

---

## Composes with

`team-standard.md` → Spoken Voice (the floor this dials) · `gates/session-transcript-gate.md` → Hardcode Mode (the shape precedent; the two flags are independent and may both be on) · `hooks/de-slop-pass` (the always-on reflex; talkback mode is stricter, never looser) · `hooks/humanize-prose.md` (runs on OTHERS' prose, not Brain's replies) · `hooks/decision-elicitation-gate.md` (a decision still routes to a Decision Log banner-pointer; its readback is exempt from T0 per Exemption 6).

---

## Changelog

- **v1.3 (2026-08-09)** — **THE LINE CAP IS STRUCK, ~25 minutes after it shipped.** Michael: *"not default limit of lines. thats the wrong constraint... instead we need to say like 'do not repeat yourself.' 'find the way to articulate your plan in meaningful complete sentences that directly follow each other. no extraneous callbacks and you'll-be-happy-to-knows.'"* **The cap treated the symptom.** It is satisfiable by chopping good prose into telegraphese, and it can be met perfectly by a reply that says the same thing three times in three short lines, so it constrained the container and left the waste untouched. **T0 is now DO NOT REPEAT YOURSELF**, with **T0b (meaningful complete sentences that follow directly from each other)** as the explicit guard against over-correcting into fragments, and **T0c (no callbacks, no "you'll be happy to know")** naming the garnish class by Michael's own examples. New standing guardrail: **never reinstate a length cap of any unit.** Length is now formally an OUTPUT, never an input — the file has been wrong on this twice in opposite directions and both errors are kept struck-through in place, because the pair is more instructive than either alone. Also added Exemption 6: a confirmation readback is verification, not repetition, so T0 does not eat the Decision-Elicitation readback.
- **v1.2 (2026-08-09)** — **FIRST LIVE RUN, and it failed on the one axis the file explicitly declared out of scope.** Michael, on the demo reply: *"that it was like times too long to begin with."* The demo obeyed all thirteen transforms and was still several times too long, **so the failure was the PREMISE, not the execution.** v1's *"talkback mode is NOT shorter"* was struck. Added a hard line ceiling (since struck in v1.3 — the diagnosis was right and the instrument was wrong), killed the procedure step that told the agent to demonstrate the register in its confirmation, and added the guardrail **never explain the mode while in the mode.** PR #781.
- **v1.1 (2026-08-09)** — **RENAMED `verbal-mode` → `talkback-mode` by Michael**, ~20 minutes after v1 merged and before the hook had ever fired. File moved, `verbal-mode.md` deleted outright rather than tombstoned: a stub for a file with a twenty-minute life and no inbound pointers is noise. Dead tokens `/verbal-mode` and `/verbal` recorded at the top as resolving here, because PR #777 preserves them in history and a cold agent following that trail needs a landing place. **Added the NAME DISAMBIGUATION block** — "talkback" already means the post-show audience Q&A and the booth intercom, so the file states up front that the hook is neither and only fires as a slash command. The intercom sense is the intended metaphor and is why the name beats the one it replaced. PR #780.
- **v1 (2026-08-09)** — Established by Michael with Mira, Dexter and Anna. Requested as `/conversation-mode`; **renamed to `/verbal-mode` before build** because the original token named the opposite of the behaviour. Fold-in Frank ruled it NOT net-new — the Spoken Voice floor already shipped 2026-08-07 — so it is built as a DIAL above that floor on the `/session-hardcode` precedent, not a second law. **The single-claimant rule is the load-bearing decision:** five surfaces already claimed tone, and a sixth would have made the dial unturnable, so the Transform Table is declared the only home for reply-register rules. Anna's second pre-build catch: a blanket emoji strip contradicted the locked "keep the header flags" clause; **Michael ruled banners EXEMPT.** PR #777.
