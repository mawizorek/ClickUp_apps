# humanize-prose · AI Toolkit

**Purpose:** Strip AI-generated writing patterns ("slop") from any body of text, making it read like a human wrote it. Sentence-level detection + multi-scale rewrite pipeline.

**Steward: Documentation Dave** (ruled 2026-08-27 by Michael, routed through Felix; resolves the question open since 2026-08-02). He is "house style as a person," already owns the no-emoji line and the ship-time stamp, so a prose-quality lane sits squarely in his role — it is a lane he already has, not a new hat. This hook is an instrument he runs at ship, and its Score-Only Report feeds his stamp. ⚠️ **Two seams the ruling does NOT touch:** `de-slop-pass` stays deliberately ownerless (different axis — see below), and the Polly seam is unchanged (Polly argues what the standard should be on a draft; Dave records what it became and enforces it next time).

**Mode:** On-demand, callable. Not always-on. Fires only when invoked or when an agent's output pipeline routes through it.

**Invocation:** `/humanize` · `/de-slop` · "humanize this" · "clean up the AI smell" · "score this for slop" · or applied to any text block passed to Brain.

**Trigger:** Text handed over for humanization · a draft about to ship · a doc page flagged as reading "AI-ish" · a writing agent's output buffer before delivery · explicitly requested on any selection.

**Established 2026-08-02** from Humalingo market research. Combines approaches from NousResearch ANTI-SLOP.md, avoid-ai-writing (MIT), Vortenza's 29-pattern engine, and Humalingo's 4-axis scoring. **Research-refreshed 2026-08-27** against the two best-supported published rulesets: [blader/humanizer](https://github.com/blader/humanizer) (~30K stars, built on Wikipedia's "Signs of AI writing" taxonomy) and [conorbronsdon/avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing) (MIT). The refresh adds the taxonomy spine, the evidence-vs-clarity tier split, and the false-positive discipline below.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Scope** | Any text: task descriptions, doc pages, comment drafts, clipboard, files, agent output buffers |
| **Report home** | Inline (comment reply or chat), or appended to the source task/doc as a comment |
| **Lane seams** | `hooks/de-slop-pass.md` (the always-on reflex on Brain's OWN prose at write time — **built 2026-08-14**, ownerless) · This hook (the full diagnostic + rewrite pipeline, invoked on OTHERS' text or Brain's extended drafts) · Document Destroyer (ships prose; this scores it pre-ship) |

🔴 **THE SEAM IS AN AXIS, NOT A WEIGHT CLASS.** This file called de-slop-pass "the lightweight version" in three places for twelve days while the file did not exist. They ask different questions: **de-slop-pass asks *does the reader already know this*** (domain-expert reader, cut the explanation) — **this hook asks *does this read like AI*** (uniformity, vocabulary, rhythm). A document can pass one and fail the other. Never collapse them into heavy/light modes of one tool.

---

## ⭐ The premise

AI text is detectable because it is **uniform**. Uniform sentence length, uniform paragraph shape, uniform vocabulary, uniform transitions. A human's prose has texture: short punches next to sprawling clauses, silence where an AI would over-explain, specificity where an AI would hedge.

The pipeline does not make text "casual." It makes text **varied**. Variation is what reads as human. A formal document can be humanized without becoming informal: you vary its architecture, not its register.

**Three scales, three problems:**
- **Sentence** fixes the WORDS (banned vocabulary, hedge stacking, filler, passive bloat)
- **Paragraph** fixes the MUSIC (rhythm between rewritten sentences, connective tissue, local repetition)
- **Document** fixes the ARCHITECTURE (structural repetition across paragraphs, voice drift, density, opening/closing patterns)

Each pass catches things the prior one creates or cannot see at its scale. They are complementary, not redundant. A sentence-clean document can still read as AI if every paragraph is shaped identically.

---

## 🔴 Signals, not proof (false-positive discipline)

**Added 2026-08-27 from avoid-ai-writing, and it changes how the report is read.** These patterns are more common in AI output, but they are not a verdict on authorship. Humans writing under deadline, in an unfamiliar genre, or in a second language produce the same shapes. Independent audits found detector false-positive rates above 60% on non-native English writers (Liang et al., Stanford, *Patterns* 2023) and misclassification above 70% on open-source detectors (Jabarian & Imas, BFI 2025).

What that means for this hook:
- **This is a writing-quality tool, never an authorship judgment.** A high density score says the prose reads generically, not that a machine wrote it. Never use the report to accuse a person.
- **Two flags, two meanings.** A vocabulary tell (`delve`, `tapestry`) is a signal about how the text reads. A wordiness fix (`utilize` → `use`) is just good editing and is NOT evidence of anything. The report must not present a clarity edit as an AI tell. See the tier split below.
- **Weak signals stay weak.** Curly quotes and immaculate typography in a casual channel are corroborating at most, never conclusive; most human prose auto-curls quotes. Don't flag them alone.
- **Preserve a human fingerprint.** When editing a person's casual text, keep their typos, contractions, and odd capitalization. Smoothing the rough edges erases what marks it as theirs.

---

## The confirm-before-edit gate (HARD)

This hook **ALWAYS reports before rewriting.** The default output is the Score-Only Report (below). Edits proceed ONLY when the report is confirmed.

Flow:
1. Receive text → run detection at all applicable scales → produce the Score-Only Report
2. Present the report. STOP.
3. On confirmation ("fix it", "go ahead", "rewrite", or explicit approval): execute the rewrite passes
4. Return cleaned text + diff summary

Why: a cold writing agent receiving this report can decide what to fix, what to preserve, and what to escalate. The report IS the handoff artifact. A rewrite with no diagnostic is unjustifiable work.

---

## Score-Only Report (the default output)

This is the primary artifact. It must be self-contained: a fresh agent with zero prior context can read it and know exactly what needs fixing, where, why, and how severe.

### Template

```
## SLOP REPORT: [source title or "inline text"]

**Density:** X% (Y of Z sentences flagged)
**Verdict:** CLEAN / LIGHT TOUCH / NEEDS WORK / HEAVY REWRITE
**Dominant issues:** [top 2-3 pattern categories, ranked by frequency]

---

### Headline changes

1. [Category]: [one-line actionable summary with count]
2. [Category]: [one-line actionable summary with count]
3. [Category]: [one-line actionable summary with count]
...

(Example:
1. Banned vocabulary: 6 instances across 4 sentences ("delve" x2, "landscape" x2, "robust", "leverage")
2. Hedge stacking: 3 sentences open with double-hedge ("it might be worth noting that perhaps")
3. Structural repetition: 4 of 6 paragraphs follow statement→3 supports→conclusion shape)

---

### Worst offenders

[Folded per-sentence detail. Each entry is enough for a cold agent to rewrite without asking.]

| # | Sentence | Pattern(s) | Direction |
|---|---|---|---|
| 1 | "[quoted sentence]" | [pattern names] | [rewrite direction, not a fixed replacement] |
| 2 | ... | ... | ... |

### Reasoning

[Brief note on WHY these are the worst: highest pattern density, most jarring to a reader, or structurally load-bearing (a sloppy topic sentence poisons the paragraph below it).]

---

### Paragraph-scale notes (if applicable)

- [Rhythm flatness, transition kills, local repetition between adjacent sentences]

### Document-scale notes (if applicable)

- [Structural repetition across paragraphs, voice drift, density bloat, AI opening/closing patterns]
```

### Verdict thresholds

| Verdict | Density | Meaning |
| --- | --- | --- |
| CLEAN | 0-10% | Leave it. Don't manufacture changes. |
| LIGHT TOUCH | 11-25% | A few spot fixes. Sentence pass only. |
| NEEDS WORK | 26-50% | Sentence + paragraph passes warranted. |
| HEAVY REWRITE | 51%+ | All three passes. Consider whether the text should be rewritten from scratch. |

---

## The Pipeline (3 passes, executed only after report confirmation)

### Pass 1: Sentence Loop

Process every sentence individually:

1. **DETECT:** Score against the pattern library. Flag which patterns triggered.
2. **REWRITE:** Fix only flagged patterns. Preserve meaning, tone intent, domain terminology. Zero-flag sentences pass through untouched.
3. **VERIFY:** Re-score the rewrite. If still triggered, iterate once. After 2 attempts, flag for manual review rather than mangling.

**What it catches (words + grammar):**
- Banned vocabulary ("delve", "tapestry", "landscape", "realm", "paradigm", "utilize", "leverage", "robust", "holistic", "synergy", "seamless", "meticulous", "pivotal", "underscore", "furthermore", "moreover", "in conclusion", "it's worth noting", "it's important to note") — scored by the tier system below, not banned flat
- Em/en dashes as connectors (replace with colons, commas, parentheses, or restructure); catch the `--` double-hyphen substitute too
- Hedge stacking ("it might be possible that perhaps" → commit)
- Hollow intensifiers ("genuinely", "truly", "really", "to be honest", "actually" when it only adds emphasis) → usually just delete
- Filler openers ("In today's fast-paced world", "When it comes to", "In the realm of", "At the end of the day")
- Passive voice / dropped subject where active names the actor more clearly
- Triple/quadruple adjective stacks
- Uniform sentence length (every sentence 15-20 words = AI cadence)
- Colon-list pattern ("There are three key aspects: X, Y, and Z") when not actually listing
- Transition word overuse ("however", "additionally", "consequently" every other sentence)
- Summarizing what was just said ("In other words", "To put it simply", "Essentially")

**What it catches (Wikipedia taxonomy, added 2026-08-27):**
- **Inflated importance / legacy** — "marks a pivotal moment", "stands as a testament to", "a lasting legacy", "in the evolving landscape of". State what happened; drop the significance claim.
- **Name-dropping to prove importance** — listing outlets or follower counts with no context. Keep a citation that carries information; cut the rest.
- **Shallow -ing analysis** — a trailing "...highlighting/reflecting/symbolizing/ensuring..." clause that inflates a plain fact. Cut the clause.
- **Sales language** — "nestled", "in the heart of", "vibrant", "breathtaking", "boasts", "must-visit". Describe plainly.
- **Vague sources** — "experts argue", "observers have noted", "studies show" with nothing named. Name a real source or cut the claim; never invent one.
- **Formulaic challenges/outlook sections** — the stock "Despite challenges... continues to thrive" and "Future Outlook" paragraphs. Keep only dated, sourced facts.
- **"Not X but Y"** in all its forms: the joined splice, the **split-sentence** version across two declaratives, the **multi-negation countdown** ("Not the price. Not the features. The trust."), and the **tailing negation** fragment ("...no guessing."). Rewrite as a direct positive claim. Carve-out: spec-constraint lists ("no dependencies, no telemetry") are list content, not a reveal.
- **False "from X to Y" ranges** where X and Y don't form a real range.
- **Pretending to reveal a deeper truth** — "the real question is", "at its core", "what really matters". Just make the point.
- **Announcing the next point** — "let's dive in", "here's what you need to know", "without further ado". Cut and start.
- **Vague endorsement** — "worth reading", "worth a look", "worth checking out". Say why, or cut.

**What it catches (chatbot artifacts, added 2026-08-27):**
- Assistant scaffolding left in the text ("I hope this helps", "Certainly!", "Would you like me to...", "let me know").
- Knowledge-cutoff disclaimers and speculative gap-fill ("as of my last update", "while details are scarce... it likely..."). State what the source does not show; never present a guess as fact.
- Overly agreeable openers ("Great question!", "You're absolutely right").
- Generic positive endings ("the future looks bright", "exciting times ahead"). End on the last concrete fact.

### Pass 2: Paragraph Loop

After all sentences in a paragraph are individually clean, evaluate as a unit:

1. **RHYTHM:** Varied sentence lengths? (Short. Medium. Longer build. Fragment.) If uniform, vary them.
2. **TRANSITIONS:** Did rewrites kill needed connective tissue? Restore organic connections where meaning-jumps are too abrupt.
3. **CADENCE:** Opens strong? Lands somewhere? Tighten if it meanders.
4. **LOCAL REPETITION:** Adjacent sentences reusing the same structure (SVO, SVO, SVO) after individual rewrites? Also catch **synonym cycling** (renaming the same subject every sentence) and **repeated openings** (several sentences starting with the same subject). Fix the pattern, not the word.

### Pass 3: Document Loop

After all paragraphs are individually clean, evaluate the full text:

1. **STRUCTURAL REPETITION:** Multiple paragraphs using the same shape? Vary the architecture.
2. **VOICE DRIFT:** Register shift mid-document after rewrites? Normalize to dominant voice.
3. **ARGUMENT FLOW:** Builds toward something, or disconnected paragraphs in a trench coat? Strengthen connective logic.
4. **OPENING/CLOSING:** AI "sets the stage" and "circles back." Kill both. Start with the point. End when done.
5. **DENSITY:** AI text runs 30-50% longer than needed. After all passes, cut remaining fat.
6. **FORMATTING TELLS:** Bold overuse, bold mini-heading lists (`- **Label:** ...`), Title Case In Headings, emoji-as-decoration, curly quotes in plain-text targets. Convert to prose or plain markdown. ⚠️ **In `uritp-docs` rendered docs, emoji are a HARD no (Dave's A10)** — use callouts and marker spans, which carry their own art.

---

## Modes

| Mode | Passes | Use case |
| --- | --- | --- |
| `sentence` | Pass 1 only | Quick check on a single line or short block |
| `paragraph` | Pass 1 + 2 | A paragraph or short section |
| `full` | All 3 passes | Default for multi-paragraph input or whole docs |
| `score-only` | Detection only, no rewrite | DEFAULT. Returns the Score-Only Report. Always runs first regardless of mode. |

All modes produce the Score-Only Report first. The mode determines what happens AFTER confirmation.

---

## Behavior rules

- Never rewrite domain terminology, proper nouns, or quoted speech.
- **Never invent a fact, name, number, date, quote, or citation to fill a gap.** If a sentence needs a missing detail, ask or write a simpler sentence. Fiction is exempt.
- Preserve the POINT of every sentence. Meaning is sacred. Style is what changes.
- **Flag, don't rewrite, inside quotes, code blocks, tables, and text attributed to someone else.** A tell in a table cell is reported and left in place; the data the table carries outranks a wording fix.
- **A writing sample overrides the generic rules.** If the writer supplies their own prior writing, match its sentence length, vocabulary, punctuation, and quirks. If the sample uses em dashes, keep them at its rate — do not apply the dash ban.
- When in doubt, shorter > longer. Cut > rephrase.
- Don't introduce forced casualness unless register calls for it. Goal is NATURAL, not CASUAL.
- Frequency > presence. One "however" is fine. Eight is slop.
- Invisible output: reader thinks "well-written," not "cleaned up."
- If input is already clean (CLEAN verdict), say so. Don't manufacture changes.
- The Score-Only Report is the HANDOFF ARTIFACT. Write it as if you will never speak to the next agent.

---

## The Pattern Library (sources + tiering)

**Spine:** Wikipedia's ["Signs of AI writing"](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) taxonomy, maintained by WikiProject AI Cleanup, as adapted by [blader/humanizer](https://github.com/blader/humanizer). This is the most-maintained, most-cited public reference and is now the backbone of the catch lists above.

Also combined from:
- **[conorbronsdon/avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing) (MIT):** the tier system below, the false-positive discipline, voice profiles, flag-don't-fix exemptions.
- **NousResearch ANTI-SLOP.md:** tiered banned word lists.
- **Vortenza 29-pattern engine:** em dashes, transitions, passive, length uniformity, vocabulary density.
- **Humalingo 4-axis scoring:** human score, AI score, sentence-structure variety, readability.

### Vocabulary tiers (how a word gets flagged)

Do not ban words flat. Score them:

- **Tier 1A — AI frequency markers. Always replace, and a cluster IS a signal.** `delve`, `tapestry`, `landscape` (metaphor), `realm`, `paradigm`, `testament to`, `robust`, `pivotal`, `underscores`, `meticulous`, `seamless`, `nestled`, `showcasing`, `intricate`, `leverage` (verb), `game-changer`. These run far more often in machine text.
- **Tier 1B — clarity edits. Same fix, NO authorship claim.** `utilize`→use, `in order to`→to, `due to the fact that`→because, `serves as`→is, `boasts`→has, `commence`→start, `ascertain`→find out. Fixing these is good writing regardless of who wrote it. 🔴 **Report 1B separately and never count it toward the AI signal.** Presenting a wordiness fix as authorship evidence is the exact error the tier split exists to prevent.
- **Tier 2 — flag only when 2+ appear in one paragraph.** `harness`, `navigate`, `foster`, `elevate`, `streamline`, `empower`, `bolster`, `resonate`, `facilitate`, `crucial`, `nuanced`, `ecosystem` (metaphor), `myriad`, `plethora`. Fine alone; a cluster means rewrite.
- **Tier 3 — flag by density only.** Common words AI overuses; flag when they cross ~3% of total words.
- **Match inflected forms.** An entry covers its `-ly`, `-ing`, plural, and conjugated variants unless a variant carries a distinct honest meaning (`real` = factual is fine; `real` as an intensifier is not).

⚠️ **The 5-20x frequency claim behind Tier 1A is inherited from upstream, not measured here.** Treat it as a well-supported convention, not a verified statistic, until measured against a corpus locally.

Each pattern entry carries: name · detection heuristic · severity (always-fix vs contextual) · replacement DIRECTION (not a fixed swap).

---

## Integration points

- **Document Destroyer:** score text pre-ship (if the workflow routes through humanize-prose, the report gates delivery)
- **Documentation Dave (STEWARD):** he runs this hook at ship and its Score-Only Report feeds his stamp. He owns the hook's evolution — pattern-library updates, verdict tiers, the open "learn Michael's reverts" question. He does NOT rewrite meaning (his standing shape-not-substance rule holds here too).
- **`hooks/de-slop-pass.md`:** the always-on reflex on Brain's own prose. **Registered in the AI Toolkit trigger table 2026-08-14.** Different axis, not a lighter mode of this, and OWNERLESS by design — Dave's stewardship here does not extend to it. See the seam note under Coordinates.
- **Any agent's output buffer:** can be wired as a post-processing step before delivery

---

## Open design questions

1. Voice profiles: user-defined writing style (sentence length, vocabulary, formality) so the hook targets THAT instead of generic "human"? — partly addressed 2026-08-27 by the writing-sample-overrides rule; a stored per-user profile is still open.
2. Learning from manual edits: "Michael always changes X back to Y, stop suggesting X"? — now Dave's to carry as steward; a candidate for his house-style ledger.
3. ~~Stewardship: dedicated agent or fold into an existing lane?~~ **RESOLVED 2026-08-27: Documentation Dave, ruled by Michael, routed through Felix.** He did not exist as a built teammate when this question opened 2026-08-02.

---

## Composes with

`hooks/de-slop-pass.md` (the always-on reflex, different axis) · Document Destroyer workflow (pre-ship gate) · `hooks/source-size-budget-enforcer.md` (long rewrites that bloat) · `code-review-standard.md` (severity format reused in the report) · Documentation Dave's ship-time stamp (steward).

## Guardrails

Report before rewrite, always. Never rewrite without a confirmed report. Never touch meaning. Never invent a fact to fill a gap. Never fake a CLEAN verdict to skip work. Never introduce slang to "humanize." Never present the score as an authorship verdict. A formal doc stays formal; it just stops being uniform.

---

## Changelog

- **2026-08-27 (steward)** - Documentation Dave ruled steward by Michael, routed through Felix. Resolves the stewardship question open since 2026-08-02. de-slop-pass stays ownerless (different axis); Polly seam unchanged.
- **2026-08-27** - Research fold-in against [blader/humanizer](https://github.com/blader/humanizer) and [conorbronsdon/avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing). Added the Wikipedia "Signs of AI writing" taxonomy as the pattern spine; the Tier 1A/1B evidence-vs-clarity split; the "Signals, not proof" false-positive section; ~14 new catch categories (inflated legacy, name-dropping, shallow -ing, sales language, vague sources, formulaic outlook, the full "not X but Y" family, false ranges, chatbot artifacts, cutoff disclaimers, agreeable openers, generic endings, deeper-truth, next-point announcing); the writing-sample-override and never-invent-a-fact rules; and flag-don't-fix exemptions for quotes/code/tables. Named Documentation Dave as the now-live stewardship candidate (not ruled).
- **2026-08-14** - Resolved three dead references to `hooks/de-slop-pass`, which did not exist for the first twelve days this file cited it as existing. Reframed the seam as an AXIS (reader-knows-it vs reads-like-AI) rather than heavy/light modes. Restated that stewardship is still TBD and that the Writing Agent is not authorized by the de-slop build.
- **v2 (2026-08-02)** - Restructured into canonical hook format (Dex standard). Added: Score-Only Report template as the default output and cold-agent handoff artifact. Added: confirm-before-edit gate. Added: three-scale premise (words/music/architecture). Stewardship TBD, routed to Felix. Writing Agent concept documented as future integration.
- **v1 (2026-08-02)** - Bare spec from Humalingo market research session. Three-pass pipeline, pattern library sources, modes, behavior rules.
