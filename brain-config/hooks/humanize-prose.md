# humanize-prose

Bare spec. Dex structures this later.

---

## What it is

A callable hook that takes any body of text and strips it of AI-generated writing patterns ("slop"), making it read like a human wrote it. Inspired by Humalingo's sentence-level diagnostic approach but built as a local pipeline with no external API dependency.

Invocation: `/humanize`, `/de-slop`, "humanize this", "clean up the AI smell", or applied to any text selection/block passed to Brain.

---

## The Pipeline (3 passes)

### Pass 1: Sentence Loop (atomic slop removal)

Process every sentence individually. For each sentence:

1. DETECT: Score against the slop pattern library (see below). Flag which patterns triggered.
2. REWRITE: Fix only the flagged patterns. Preserve meaning, tone intent, and domain terminology. Don't over-correct (a sentence with zero flags passes through untouched).
3. VERIFY: Re-score the rewrite. If it still triggers, iterate once more. If it still fails after 2 attempts, flag it for manual review rather than mangling it.

What the sentence loop catches:
- Banned vocabulary ("delve", "tapestry", "landscape", "utilize", "leverage", "robust", "holistic", "synergy", "paradigm", "furthermore", "moreover", "in conclusion", "it's worth noting", "it's important to note")
- Em/en dashes used as connectors (replace with colons, commas, or restructure)
- Hedge stacking ("it might be possible that perhaps" -> commit to a take)
- Filler openers ("In today's fast-paced world", "When it comes to", "In the realm of", "At the end of the day")
- Passive voice where active is stronger
- Triple/quadruple adjective stacks
- Overly uniform sentence length (every sentence 15-20 words = AI cadence)
- Colon-list pattern ("There are three key aspects: X, Y, and Z") when not actually listing
- Transition word overuse ("however", "additionally", "consequently" every other sentence)
- Summarizing what was just said ("In other words", "To put it simply", "Essentially")

### Pass 2: Paragraph Loop (local coherence)

After all sentences in a paragraph are individually clean, evaluate the paragraph as a unit:

1. RHYTHM CHECK: Do the rewritten sentences have varied length? (Short. Then a medium one. Then a longer one that builds. Fragment.) If every sentence landed at similar word counts, vary them.
2. TRANSITION NATURALNESS: After individual rewrites, do sentences still connect? A rewrite might kill a transition word that was actually needed. Restore organic connective tissue where the meaning jump is too abrupt.
3. PARAGRAPH CADENCE: Does the paragraph open strong and land somewhere? Or does it meander with no point? Tighten.
4. LOCAL REPETITION: Did two adjacent sentences accidentally reuse the same structure (subject-verb-object, subject-verb-object) after individual rewrites?

### Pass 3: Document Loop (global coherence)

After all paragraphs are individually clean, evaluate the full text:

1. STRUCTURAL REPETITION: Are multiple paragraphs using the same shape? (Statement, three supporting points, conclusion. Statement, three supporting points, conclusion. Over and over.) Vary the architecture.
2. VOICE DRIFT: Did the rewrites accidentally shift register mid-document? (Casual in para 1, suddenly formal in para 4.) Normalize to the dominant voice.
3. ARGUMENT FLOW: Does the document build toward something, or does it feel like a list of disconnected paragraphs wearing a trench coat? If the connective logic between paragraphs is weak, strengthen it.
4. OPENING/CLOSING: AI loves to "set the stage" in the intro and "circle back" in the conclusion. Kill both patterns. Start with the point. End when you're done.
5. DENSITY: AI text is often 30-50% longer than it needs to be. After all three passes, is there fat left? Cut it.

---

## The Pattern Library (sources to combine)

Draw from:
- NousResearch ANTI-SLOP.md: tiered banned word lists (Tier 1 = always banned, Tier 2 = flagged in high density, Tier 3 = fine alone but suspicious in clusters)
- avoid-ai-writing (GitHub, 2,545 stars, MIT): voice profiles, structural patterns, the "why" behind each detection
- Vortenza's 29-pattern engine: em dashes, transitions, passive voice, sentence length uniformity, AI vocabulary density
- Humalingo's 4-axis scoring: human score, AI score, sentence structure variety, readability

The combined library should be a flat list of patterns, each with:
- Pattern name
- Detection regex or heuristic
- Severity (always-fix vs contextual)
- Replacement strategy (not a fixed replacement, but a DIRECTION: "restructure as two sentences" or "replace with a concrete verb")

---

## Modes

| Mode | What it does |
| --- | --- |
| `sentence` | Pass 1 only. Fast. Good for a single line or quick check. |
| `paragraph` | Pass 1 + Pass 2. Good for a block of text. |
| `full` | All 3 passes. Default when given a whole doc or multi-paragraph input. |
| `score-only` | Run detection without rewriting. Returns a report: which sentences flagged, which patterns triggered, overall slop density %. |

---

## Behavior rules

- Never rewrite domain terminology, proper nouns, or quoted speech.
- Preserve the POINT of every sentence. Meaning is sacred. Style is what changes.
- When in doubt, shorter > longer. Cut > rephrase.
- Don't introduce slang or forced casualness unless the source text's register calls for it. The goal is NATURAL, not CASUAL.
- A human who uses "however" once isn't sloppy. A document that uses it 8 times is. Frequency matters more than presence.
- The output should be invisible: a reader shouldn't think "this was cleaned up." They should just think "this is well-written."
- If the input is already clean (low slop score), say so and don't touch it. Don't manufacture changes.

---

## Integration

- Can be called on: any text block, a task description, a doc page, a comment draft, clipboard content, a file.
- Returns: the cleaned text + a brief diff summary (what changed and why).
- Optional: before/after slop score comparison.

---

## Open questions for build

- Do we want a "voice profile" system where the user can define their natural writing style (sentence length preference, vocabulary, formality level) and the hook targets THAT instead of generic "human"?
- Should it integrate with the Document Destroyer workflow (score text before shipping)?
- Memory: should it learn from Michael's manual edits over time? ("He always changes X back to Y, stop suggesting X.")
