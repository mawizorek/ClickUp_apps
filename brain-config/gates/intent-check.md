# Intent Check

**Purpose:** Detect likely talk-to-text errors, auto-capture glitches, or phrasing that doesn't match the conversation context. Catch misheard words and garbled prompts before acting on them.

**Mode:** Always-on (deterministic). Fires early in the roster scan, before substantive work begins.

**Trigger:** Every user message. Lightweight scan; only surfaces when something looks off.

---

## Pass

### 1. Context Coherence
- Does this message make sense given the last 2-3 exchanges?
- Is it introducing a term, name, or concept that appears out of nowhere?
- Is it contradicting something Michael JUST said without acknowledging the change?

### 2. Talk-to-Text Patterns
Common dictation errors to watch for:
- Homophones that change meaning ("their/there", "two/to/too", but also less obvious ones like "Wes/West", "Clio/Cleo")
- Proper nouns garbled into common words (tool names, agent names, app names)
- Run-on sentences where punctuation was missed (dictation doesn't always add periods)
- Sudden topic shifts that might be a new dictation starting mid-thought
- Phonetic near-misses ("repo" → "reppo", "handoff" → "hand off" → "and off")

### 3. Severity Assessment
- **Clear intent despite typo:** just interpret correctly, don't flag. (e.g., "Workshop West" when we just named it "Workshop Wes" = obvious dictation, just use the right name)
- **Ambiguous but guessable:** proceed with best interpretation, note the assumption in one line. (e.g., "can we make that a trigger" when multiple things could be "that")
- **Genuinely confusing:** ASK. One short question. (e.g., "run the thing on the other one" with no clear referent)

### 4. Never Do
- Don't flag every typo. Only flag when meaning is affected.
- Don't ask about obvious dictation artifacts that have clear intent.
- Don't slow down the conversation with "did you mean..." on every message.
- Don't correct Michael's speech patterns or style, only genuinely garbled content.

---

## Output

- **Clear intent:** proceed silently. Use the correct interpretation.
- **Ambiguous but guessable:** proceed, drop one line: "(reading 'X' as 'Y' based on context)"
- **Genuinely confusing:** ask ONE short question before proceeding.

---

## Composes with

- **Clarify First (existing hook):** Intent Check is the talk-to-text-specific version. Clarify First handles broader ambiguity. Intent Check fires first (catches dictation noise), Clarify First fires on remaining genuine ambiguity.
- **Roster Scan Planner:** Intent Check fires early in the plan, before other tools evaluate the message content.

---

## Examples

### Example 1: Obvious dictation, clear intent
Conversation about naming an agent. Michael says: "Let's do Workshop West."
**Action:** Proceed using "Workshop Wes" (we just discussed this name). Silent correction.

### Example 2: Ambiguous referent
Michael says: "Can you add that to the other one?"
**Action:** Best guess from context + note: "(adding [X] to [Y] based on what we were just discussing)"

### Example 3: Genuinely garbled
Michael says: "I want to take the repo and have it auto-capture the brain things into the session for the next one."
**Action:** Ask: "You want Hana's handoff to auto-include repo state, or something else?"

---

## Changelog

- 2026-07-04: Initial version. Motivated by real talk-to-text discrepancies causing unintended commits.
