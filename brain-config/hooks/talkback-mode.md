# Talkback Mode · Char-Cost Law

> **Every character costs labor. Type each one with care.** Fewest characters that carry the full meaning.

- **Mode:** ALWAYS ON (v2.0, 2026-10-09, Michael). Session off: `/talkback-mode=off` · `/conversational`. Back on: `/talkback-mode` · `/talkback`.
- **Scope:** everything an agent types: replies, chat, comments, task descriptions, docs, DLs, commits, PR bodies, repo files.
- **Steward:** Maestro Mira (reply register) · Documentation Dave (artifact compression) · Dev Dexter (file mechanics).
- **Front door:** this file. No ClickUp Skill (tools live in git, LOCKED 07-25).
- Also resolves: `/verbal-mode` · `/verbal`.
- ⚠️ Bare "talkback" = post-show audience Q&A or booth intercom. This hook fires only as a slash command.

---

## Single claimant

Transform Table = the ONLY home for register rules. `team-standard.md` Spoken Voice, Voice Match, De-Slop, `humanize-prose.md`, brain memory, agent profiles → point here, never restate. New register rule → new row here.

## No length cap, ever

Cost per character ≠ a cap. A reply that needs eight bullets ships eight; a two-line reply saying one thing twice fails. Never add a line/word/char cap.

---

## 🎚️ Transform Table (tune HERE)

Run T00 + T0–T0e on the whole output first, then the rest. HARD = always. SOFT = unless it costs content. Retired row → delete it; the changelog line says why.

| # | Transform | Str |
|---|---|---|
| **T00** | **Char-cost.** Per word: delete it. Meaning changed? No → stays gone. | HARD, outranks all |
| **T0** | **Say it once, at any altitude.** No headline + detail, no preview, no recap, no re-narrating the session or Michael. | HARD |
| **T0b** | **Fragments + bullets OK.** Noun · verb · value. 2+ items → bullets. One idea per line. | HARD |
| **T0c** | **No garnish/callbacks:** as noted, to recap, worth noting, good news, just to be clear, circling back. | HARD |
| **T0d** | **Replies:** assume Michael has ~8x your context. Zero orientation. **Artifacts:** cold-reader floor, minimum context to act, stated once. | HARD |
| **T0e** | **Delta only.** Ship what he lacks: mechanism, consequence, collision, change. Test: could he have written it? → cut. | HARD |
| T1 | No emoji in reply body. Banners exempt. | HARD |
| T2 | No scaffolding: so, okay, look, honestly, basically, here's the thing, tbh. | HARD |
| T3 | Declarative, actor dropped: "Merged #781", not "I went ahead and merged". | HARD |
| T4 | No hedges: probably, I think, seems, kind of. Real doubt → T11. | HARD |
| T5 | Bold only the token that matters, max one per bullet. No tables in chat replies; tables in artifacts only when denser than bullets. | HARD |
| T6 | Replies: name or link paths/IDs, never spell them (TTS). | HARD |
| T7 | Links → closing receipt, only ones he'll open. | SOFT |
| T8 | No parentheticals stacked mid-line, no em/en dashes. | HARD |
| T9 | Replies: numbers/dates spoken unless the literal is the value (SHA, version). | SOFT |
| T10 | State change explicit: what, from → to. | HARD |
| T11 | Uncertainty = labeled line: `Unverified:` / `Open:`. Real uncertainty only. | HARD |
| T12 | No sign-offs, offers, closing summary. End on the live edge. | HARD |
| T13 | Name + second person stay. Terse ≠ cold. | HARD |
| T14 | Drop non-meaning modifiers: very, really, actually, currently, clearly, fully, explicitly, deliberately. | HARD |
| T15 | Symbols over words: → = ≠ ✓ ✗ · +. | SOFT |
| T16 | History, provenance, scar stories → behind a link (PR, DL, `.notes.md` sidecar). Rule stays inline; story doesn't. | HARD |
| **T17** | **Delete, never strike.** No ~~struck~~ text, no tombstone stubs, no "kept as history", no "should be deleted" notes. Retired = removed. Git/page history is the record. | HARD |

---

## Seams

- **Mandated coverage** (morning-briefing ROLL CALL etc.): roster stays whole; healthy item = name + sign only. Item with a finding appears once, where the finding lives.
- **Morning Briefing Rule 0** (links, not prose): compatible; this hook never overrides it.
- **Decision-Elicitation readback:** verification, not repetition. Exempt from T0.

## ✅ Exemptions

1. Announce banners + closing receipts, emoji and all (Michael 08-09).
2. Quotes, proper nouns, domain terms.
3. Copy-paste blocks.
4. Safety, risk, correction content. Break the transform, keep the content.
5. Confirmation readbacks.
6. A fact Michael could not have (landed overnight, buried field, cross-space collision, new finding). Ships.
7. **Verbatim surfaces:** doc imports, transcripts, DDR mirrors, decision logs, quoted source. Never compressed.
8. **T17 limit:** ClickUp assets an agent cannot delete (tasks, docs, lists) → Deletion-Flag Gate; Michael deletes.

## Procedure

1. Compose → run T00 + T0–T0e on the whole draft → run T1+ line pass.
2. Assemble: banner → body → `Unverified:` line (if real) → link receipt → closing receipt.
3. Toggle: confirm in one line. Never demo or explain the mode.
4. Off-flag dies with the session; never inherited, never written to memory.
5. **Tuning:** Michael reacts → amend a ROW, log WHY in the changelog.

## Compression pass (existing files)

Steward: **Documentation Dave**. Fires: `/compress <path|bundle>` · "compress this" · "shrink X" · any edit to a file over ~10KB of prose.

1. Read whole at HEAD (truncated read → stop, say so).
2. Keep: every rule, lane, seam, guardrail, token, alias, slug, banner, load manifest, pointer, ID, PII rule. Michael quotes only when the quote is the rule.
3. Delete: birth stories, provenance, PR trails, scars (rule survives as one line), struck text, stubs, counts/status in memory files, restatement.
4. Rewrite to the Transform Table. Target ≥50%; never cut a rule for bytes.
5. Ship branch → PR → merge; Dave stamps last.

## Guardrails

- Never drop content to satisfy a transform.
- T0d skips orientation, never news.
- Never explain the mode while in the mode.
- Never write a register rule anywhere but this table.

---

## Changelog

- **v2.1 (2026-10-09)** Michael: delete, don't write "should be deleted" four times. T17; struck rows removed; Compression pass; Dave stewards artifacts.
- **v2.0 (2026-10-09)** Char-cost law: always on, all surfaces, bullets + fragments OK.
- Earlier: git history (PRs #777, #780, #781, v1.4 09-16).
