# Meeting Transcription — attribution + threading hook

**Invocation:** `/transcription` · `/attribute-transcript` · `/transcript-attribution` · "rewrite this as a per-person transcription" · "who said what" · "attribute this transcript"

**Trigger (auto):** a task or event carries raw transcription comments all authored by ONE ClickUp user (the recorder) but containing MULTIPLE speakers, AND the invoking message names the room. Canonical trigger phrasing, ruled by Michael 2026-08-11:

> **"the <group> staff was in attendance minus <Name>"**

That sentence IS the roster declaration. It means: resolve the standing roster for `<group>`, subtract the named absentee(s), and attribute every turn in the chain to that set and no one outside it.

Sibling to `hooks/meeting-scratch-triage.md` (that one resolves shorthand + bare task ids; this one resolves SPEAKERS). Born 2026-08-11 on URITP-2594.

---

## 🚫 Rule 0 — THE OUTPUT NEVER GOES IN CHAT

LOCKED 2026-08-11, Michael, in the strongest terms available. A transcript is an ARTIFACT. It is written to the task, as comments. The chat reply is a receipt: what landed, where, and what needs a human confirm. Never paste the transcript, never paste a preview of it, never "here's the rewrite" in session prose.

The failure this exists to prevent: a full attributed transcript dumped inline as a chat answer. It is unreadable, it is unsearchable, it is not where the work lives, and it buries the flags.

---

## 👥 WHO RUNS IT — two passes, two voices (LOCKED 2026-08-11, Michael)

The tool is **ownerless** (Doc-Rot-Sweep precedent): any agent fires it. But a real run is TWO passes and they belong to different voices, because they need different things.

**PASS 1 — SCRIBE (Scribe Sana, `agents/scribe-sana.md`).** Verbatim capture, subject segmentation, header cutting, threading, speaker labelling off the ladder below. This is mechanical: the text is the text, and the roster arrives declared in the trigger sentence. **A stateless lens is the correct class for this** — nothing here needs a memory bundle, and steeping a teammate to retype speech is waste. Sana ships the chain with `⚠️` on every inferred speaker and `⟨unresolved⟩` on every token she cannot place. **She does not correct anything.**

**PASS 2 — REMARK (the domain owner; URITP → Mainstage Milo).** Reads the shipped chain and adds the `⚠️ note` lines: what the auto-transcript got wrong, what two sources disagree about, what needs a human confirm, and the closing remark on the whole session. **This half CANNOT be done rote and that is the whole reason the split is written down.** "Ajmi" → David Adjmi, "Kaylee" → Kali, "Nick Greene" → Nick Ernst-Maynard, THTR 160 → 341, a scenic note that must belong to the TD: none of that is in the audio. It is in the workspace, and only a voice steeped in the workspace can see it.

⚠️ **The seam is real and it is where this breaks.** Attribution ladder rung 1 (self-naming) and rung 3 (agenda order) are rote and Sana's. **Rung 2 is lane-exclusive content and is DOMAIN inference** — a scribe cannot know that props talk belongs to the prop supervisor. When rung 2 is the only rung that hits, Sana marks `⚠️ Unattributed` and Pass 2 resolves it. **Sana never guesses a lane.**

⚠️ **Never collapse the two passes into one voice to save a step.** A scribe who corrects is inventing; a domain owner who retypes speech is expensive. One run, one file, two hands. Outside URITP the Pass-2 voice resolves through the 🤖 Agent Index `Lane` field AT READ TIME, never hardcoded here (Known-Drift Register D14).

---

## The shape (LOCKED — this is the template)

One **HEADER comment** per subject. The verbatim turns **thread behind it** as replies. When the speaker moves to a new subject, cut a new header.

**Header (root comment):**

```
🎙️ **<Speaker> — <subject in one clause>**
_<Meeting name> · <Day M/D/YY> · <time> ET_
```

⚠️ **No `TOPIC ·` prefix.** Struck 2026-08-11 by Michael on sight of the first real run: the 🎙️ already says what the comment is, and a label repeated 18 times down a task is noise. The variant labels below survive because they carry information the emoji does not.

**Body (threaded reply under that header):**

```
**<Speaker>:** <verbatim turn>

**<Speaker>:** <next verbatim turn>

⚠️ _<Agent> note: <what was corrected, what did not resolve, what needs a confirm>_
```

Variants: `🎙️ **SIDEBAR · <Speaker> — ...**` for a tangent worth keeping but not an agenda item. `🎙️ **DECISION · <Speaker> — ...**` when the subject closes on one (and the decision itself still routes to the entity's Decision Log — the comment is a pointer, never the record).

---

## Fidelity rules

1. **Verbatim is the floor.** Keep the speaker's wording, rhythm and hedges. Do not summarize, do not tidy into minutes, do not convert speech into bullets.
2. **Correct only what CONTEXT proves the auto-transcript got wrong** — proper nouns, course numbers, show codes, pronouns, homophone garbage. Pass 2 only.
3. **Every correction is disclosed** in the `⚠️ note` on that thread, with the source of the correction (agenda line, prior comment, roster row).
4. **Never silently substitute a name.** If a token does not resolve, say so and give the best candidate. Unresolved > invented.
5. **⚠️ marks an INFERRED speaker.** Prefix the speaker label: `**⚠️ Charlie:**`. A clean label means the attribution is grounded (named in the turn, addressed by name, or unambiguous by content).
6. **Two sources disagreeing is a finding, not a tiebreak.** Post both, flag it, ask.
7. **Raw comments are never deleted.** The attributed chain is additive; the recorder's original capture stays as the archive.

---

## Attribution ladder (stop at first hit)

1. Speaker names themselves or is addressed by name in the turn. *(rote — Pass 1)*
2. Content is lane-exclusive (scenic → TD; props → prop supervisor; season/casting → artistic director; facilities/production ops → PM). *(domain — Pass 2)*
3. The meeting's own agenda block in the task description — speaker headers there ARE the running order. *(rote — Pass 1)*
4. Prior meetings in the same chain: recurring speakers keep recurring subjects. *(domain — Pass 2)*
5. Nothing hit → `**⚠️ Unattributed:**`. Never guess a person into the room.

**Nobody outside the declared roster may be attributed a turn.** The absentee named in the trigger gets zero lines, ever.

---

## Known defect (observed 2026-08-11, URITP-2594)

The comment tool intermittently refuses `parent_comment` on a header it just created — the parent "is not found" on retry, permanently, for that comment. Re-cutting the header did not clear it. **Do not burn the session retrying.** After two failures: post the turn as a ROOT comment immediately beneath its header, mark it `⚠️ thread refused, inline instead`, and flag the dead header for deletion. Three dead headers landed on URITP-2594 this way.

---

## Also applies to

Event recaps, post-mortems, site visits, production meetings, strike meetings — anything with a recorded room and a single-author capture chain. The trigger sentence generalizes: `"the <group> was in attendance minus <Name>"`.
