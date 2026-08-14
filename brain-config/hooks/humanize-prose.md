# humanize-prose · AI Toolkit

**Purpose:** Strip AI-generated writing patterns ("slop") from any body of text, making it read like a human wrote it. Sentence-level detection + multi-scale rewrite pipeline.

**Steward:** TBD. Candidate: a dedicated Writing Agent (not yet built) who stewards prose quality across the workspace. Pending `/felix` routing on whether this folds into an existing lane or justifies a net-new teammate. ⚠️ **Still TBD as of 2026-08-14** — open since 2026-08-02, and the `de-slop-pass` build did NOT resolve it (that hook is deliberately ownerless).

**Mode:** On-demand, callable. Not always-on. Fires only when invoked or when an agent's output pipeline routes through it.

**Invocation:** `/humanize` · `/de-slop` · "humanize this" · "clean up the AI smell" · "score this for slop" · or applied to any text block passed to Brain.

**Trigger:** Text handed over for humanization · a draft about to ship · a doc page flagged as reading "AI-ish" · a writing agent's output buffer before delivery · explicitly requested on any selection.

**Established 2026-08-02** from Humalingo market research. Combines approaches from NousResearch ANTI-SLOP.md, avoid-ai-writing (MIT), Vortenza's 29-pattern engine, and Humalingo's 4-axis scoring.

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

What it catches:
- Banned vocabulary ("delve", "tapestry", "landscape", "utilize", "leverage", "robust", "holistic", "synergy", "paradigm", "furthermore", "moreover", "in conclusion", "it's worth noting", "it's important to note")
- Em/en dashes as connectors (replace with colons, commas, or restructure)
- Hedge stacking ("it might be possible that perhaps" → commit)
- Filler openers ("In today's fast-paced world", "When it comes to", "In the realm of", "At the end of the day")
- Passive voice where active is stronger
- Triple/quadruple adjective stacks
- Uniform sentence length (every sentence 15-20 words = AI cadence)
- Colon-list pattern ("There are three key aspects: X, Y, and Z") when not actually listing
- Transition word overuse ("however", "additionally", "consequently" every other sentence)
- Summarizing what was just said ("In other words", "To put it simply", "Essentially")

### Pass 2: Paragraph Loop

After all sentences in a paragraph are individually clean, evaluate as a unit:

1. **RHYTHM:** Varied sentence lengths? (Short. Medium. Longer build. Fragment.) If uniform, vary them.
2. **TRANSITIONS:** Did rewrites kill needed connective tissue? Restore organic connections where meaning-jumps are too abrupt.
3. **CADENCE:** Opens strong? Lands somewhere? Tighten if it meanders.
4. **LOCAL REPETITION:** Adjacent sentences reusing the same structure (SVO, SVO, SVO) after individual rewrites?

### Pass 3: Document Loop

After all paragraphs are individually clean, evaluate the full text:

1. **STRUCTURAL REPETITION:** Multiple paragraphs using the same shape? Vary the architecture.
2. **VOICE DRIFT:** Register shift mid-document after rewrites? Normalize to dominant voice.
3. **ARGUMENT FLOW:** Builds toward something, or disconnected paragraphs in a trench coat? Strengthen connective logic.
4. **OPENING/CLOSING:** AI "sets the stage" and "circles back." Kill both. Start with the point. End when done.
5. **DENSITY:** AI text runs 30-50% longer than needed. After all passes, cut remaining fat.

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
- Preserve the POINT of every sentence. Meaning is sacred. Style is what changes.
- When in doubt, shorter > longer. Cut > rephrase.
- Don't introduce forced casualness unless register calls for it. Goal is NATURAL, not CASUAL.
- Frequency > presence. One "however" is fine. Eight is slop.
- Invisible output: reader thinks "well-written," not "cleaned up."
- If input is already clean (CLEAN verdict), say so. Don't manufacture changes.
- The Score-Only Report is the HANDOFF ARTIFACT. Write it as if you will never speak to the next agent.

---

## The Pattern Library (sources)

Combined from:
- **NousResearch ANTI-SLOP.md:** tiered banned word lists (Tier 1 always-ban, Tier 2 flagged in density, Tier 3 suspicious in clusters)
- **avoid-ai-writing (GitHub, MIT):** voice profiles, structural patterns, detection rationale
- **Vortenza 29-pattern engine:** em dashes, transitions, passive, length uniformity, vocabulary density
- **Humalingo 4-axis scoring:** human score, AI score, sentence structure variety, readability

Each pattern entry carries: name · detection heuristic · severity (always-fix vs contextual) · replacement DIRECTION (not a fixed swap).

---

## Integration points

- **Document Destroyer:** score text pre-ship (if the workflow routes through humanize-prose, the report gates delivery)
- **Writing Agent (future):** the steward who runs this hook on every piece of prose before it leaves the workspace. ⚠️ **Not authorized by the de-slop-pass build** — that hook is ownerless by design and is not evidence a Writing Agent is warranted.
- **`hooks/de-slop-pass.md`:** the always-on reflex on Brain's own prose. **Registered in the AI Toolkit trigger table 2026-08-14.** Different axis, not a lighter mode of this. See the seam note under Coordinates.
- **Any agent's output buffer:** can be wired as a post-processing step before delivery

---

## Open design questions

1. Voice profiles: user-defined writing style (sentence length, vocabulary, formality) so the hook targets THAT instead of generic "human"?
2. Learning from manual edits: "Michael always changes X back to Y, stop suggesting X"?
3. Stewardship: does this live under a dedicated Writing Agent, or fold into an existing lane? → Route to Felix. **Still open 2026-08-14.**

---

## Composes with

`hooks/de-slop-pass.md` (the always-on reflex, different axis) · Document Destroyer workflow (pre-ship gate) · `hooks/source-size-budget-enforcer.md` (long rewrites that bloat) · `code-review-standard.md` (severity format reused in the report) · the future Writing Agent's output pipeline.

## Guardrails

Report before rewrite, always. Never rewrite without a confirmed report. Never touch meaning. Never fake a CLEAN verdict to skip work. Never introduce slang to "humanize." A formal doc stays formal; it just stops being uniform.

---

## Changelog

- **2026-08-14** - Resolved three dead references to `hooks/de-slop-pass`, which did not exist for the first twelve days this file cited it as existing. Reframed the seam as an AXIS (reader-knows-it vs reads-like-AI) rather than heavy/light modes. Restated that stewardship is still TBD and that the Writing Agent is not authorized by the de-slop build.
- **v2 (2026-08-02)** - Restructured into canonical hook format (Dex standard). Added: Score-Only Report template as the default output and cold-agent handoff artifact. Added: confirm-before-edit gate. Added: three-scale premise (words/music/architecture). Stewardship TBD, routed to Felix. Writing Agent concept documented as future integration.
- **v1 (2026-08-02)** - Bare spec from Humalingo market research session. Three-pass pipeline, pattern library sources, modes, behavior rules.
