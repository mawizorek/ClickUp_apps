# Meeting Transcription — attribution + threading hook

**Invocation:** `/transcription` · `/attribute-transcript` · `/transcript-attribution` · "rewrite this as a per-person transcription" · "who said what" · "attribute this transcript"

**Trigger (auto):** a task or event carries raw transcription comments all authored by ONE ClickUp user (the recorder) but containing MULTIPLE speakers, AND the invoking message names the room. Canonical trigger phrasing, ruled by Michael 2026-08-11:

> **"the <group> staff was in attendance minus <Name>"**

That sentence IS the roster declaration. It means: resolve the standing roster for `<group>`, subtract the named absentee(s), and attribute every turn in the chain to that set and no one outside it.

Sibling to `hooks/meeting-scratch-triage.md` (that one resolves shorthand + bare task ids; this one resolves SPEAKERS). Steward: **Mainstage Milo**. Born 2026-08-11 on URITP-2594.

---

## 🚫 Rule 0 — THE OUTPUT NEVER GOES IN CHAT

LOCKED 2026-08-11, Michael, in the strongest terms available. A transcript is an ARTIFACT. It is written to the task, as comments. The chat reply is a receipt: what landed, where, and what needs a human confirm. Never paste the transcript, never paste a preview of it, never "here's the rewrite" in session prose.

The failure this exists to prevent: a full attributed transcript dumped inline as a chat answer. It is unreadable, it is unsearchable, it is not where the work lives, and it buries the flags.

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

⚠️ _Milo note: <what was corrected, what did not resolve, what needs a confirm>_
```

Variants: `🎙️ **SIDEBAR · <Speaker> — ...**` for a tangent worth keeping but not an agenda item. `🎙️ **DECISION · <Speaker> — ...**` when the subject closes on one (and the decision itself still routes to the entity's Decision Log — the comment is a pointer, never the record).

---

## Fidelity rules

1. **Verbatim is the floor.** Keep the speaker's wording, rhythm and hedges. Do not summarize, do not tidy into minutes, do not convert speech into bullets.
2. **Correct only what CONTEXT proves the auto-transcript got wrong** — proper nouns, course numbers, show codes, pronouns, homophone garbage. The agent knows the workspace; the transcription engine does not.
3. **Every correction is disclosed** in the `⚠️ Milo note` on that thread, with the source of the correction (agenda line, prior comment, roster row).
4. **Never silently substitute a name.** If a token does not resolve, say so and give the best candidate. Unresolved > invented.
5. **⚠️ marks an INFERRED speaker.** Prefix the speaker label: `**⚠️ Charlie:**`. A clean label means the attribution is grounded (named in the turn, addressed by name, or unambiguous by content).
6. **Two sources disagreeing is a finding, not a tiebreak.** Post both, flag it, ask.
7. **Raw comments are never deleted.** The attributed chain is additive; the recorder's original capture stays as the archive.

---

## Attribution ladder (stop at first hit)

1. Speaker names themselves or is addressed by name in the turn.
2. Content is lane-exclusive (scenic → TD; props → prop supervisor; season/casting → artistic director; facilities/production ops → PM).
3. The meeting's own agenda block in the task description — speaker headers there ARE the running order.
4. Prior meetings in the same chain: recurring speakers keep recurring subjects.
5. Nothing hit → `**⚠️ Unattributed:**`. Never guess a person into the room.

**Nobody outside the declared roster may be attributed a turn.** The absentee named in the trigger gets zero lines, ever.

---

## Known defect (observed 2026-08-11, URITP-2594)

The comment tool intermittently refuses `parent_comment` on a header it just created — the parent "is not found" on retry, permanently, for that comment. Re-cutting the header did not clear it. **Do not burn the session retrying.** After two failures: post the turn as a ROOT comment immediately beneath its header, mark it `⚠️ thread refused, inline instead`, and flag the dead header for deletion. Three dead headers landed on URITP-2594 this way.

---

## Also applies to

Event recaps, post-mortems, site visits, production meetings, strike meetings — anything with a recorded room and a single-author capture chain. The trigger sentence generalizes: `"the <group> was in attendance minus <Name>"`.
